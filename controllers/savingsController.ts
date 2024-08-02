import dbConnect from "@/app/lib/dbConnect";
import budgetModel, { Budget } from "@/models/budgetModel";
import savingsAccount, { SavingsAccount, SavingsTransaction } from "@/models/savingsAccount";
import savingsAccountBucket, { SavingsBuckets } from "@/models/savingsAccountBucket";
import savingsModel, { Savings } from "@/models/savingsModel";
import mongoose from "mongoose";

export async function getAllSavingsDetails (userId: mongoose.Types.ObjectId): Promise<Savings> {
    try {
        await dbConnect();
        const userBudget = await findBudget(userId);

        const savingsDoc = await savingsModel.findById(userBudget.savings)
        .populate({
            path: "savingsAccounts",
            model: savingsAccount,
            populate: { path: 'buckets', model: savingsAccountBucket}
        })

        if (!savingsDoc) {
            // If there is no savingsDoc, lets create it
            const newSavingsDoc = await savingsModel.create({
                budget: userBudget._id
            })

            if (!newSavingsDoc) {
                throw Error("Unable to create Savings document for budgetID: " + userBudget._id);
            }

            userBudget.savings = newSavingsDoc._id;

            await userBudget.save();

            return newSavingsDoc;
        }
        const totalSavings = savingsDoc._doc.savingsAccounts.reduce((agg: number, curr: SavingsAccount) => agg += curr.currentTotal, 0)

        return { ...savingsDoc._doc, totalSavings};
    } catch (e) {
        throw e;
    }
}

export async function createSavingsAccount (userId: mongoose.Types.ObjectId, accountName: string): Promise<SavingsAccount> {
    try {
        await dbConnect();
        const userBudget = await findBudget(userId);

        const savingsDoc = await savingsModel.findById(userBudget.savings) as Savings;

        if (!savingsDoc) {
            throw Error("No savings found with the following ID: " + userBudget.savings);
        }

        const newSavingsAccount = await savingsAccount.create({
            savings: savingsDoc._id,
            name: accountName,
            addedBy: userId,
            updatedBy: userId
        }) as SavingsAccount;

        if (!newSavingsAccount) {
            throw Error("Unable to create new savings account");
        }

        const newDefaultBucket = await savingsAccountBucket.create({
            savingsAccount: newSavingsAccount._id,
            name: "Core"
        })

        newSavingsAccount.buckets.push(newDefaultBucket);

        await newSavingsAccount.save();

        savingsDoc.savingsAccounts.push(newSavingsAccount._id);

        await savingsDoc.save()

        return newSavingsAccount;
    } catch (e) {
        throw e;
    }
}

type transactionRequest = {
    accountId: string,
    name: string,
    amount: number,
    date: Date,
    transactionType: "deposit" | "withdraw",
    bucket: string
}

export async function createSavingsTransaction (userId: mongoose.Types.ObjectId, request: transactionRequest) {
    try {
        if (!request || Object.keys(request).length === 0) {
            throw Error("Invalid request object")
        }

        await dbConnect();
        const userBudget = await findBudget(userId);

        const currSavingsAccount = await savingsAccount.findOne()
            .and([{_id: request.accountId}, {savings: userBudget.savings}]) as SavingsAccount

        if (!currSavingsAccount) {
            throw Error("No savings account found with ID " + request.accountId);
        }

        const newTransaction = {
            _id: new mongoose.Types.ObjectId(),
            amount: request.amount || 0,
            name: request.name || "Transaction",
            date: request.date || new Date(),
            transactionType: request.transactionType || "deposit",
            bucket: request.bucket || currSavingsAccount.buckets[0],
            addedBy: userId,
            updatedBy: userId
        }

        currSavingsAccount.ledger.push(newTransaction)

        if (newTransaction.transactionType === "deposit") {
            currSavingsAccount.currentTotal += request.amount || 0;
        } else {
            currSavingsAccount.currentTotal -= request.amount || 0;
        }

        // Update Assigned Bucket
        const bucket = await savingsAccountBucket.findById(newTransaction.bucket);
        if (newTransaction.transactionType === "deposit") {
            bucket.currentTotal += request.amount || 0;
        } else {
            bucket.currentTotal -= request.amount || 0;
        }
        await bucket.save();

        await currSavingsAccount.save();

        return newTransaction;
    } catch (e) {
        throw e
    }
}

export async function updateSavingsTransaction (userId: mongoose.Types.ObjectId, transactionId: mongoose.Types.ObjectId, request: transactionRequest) {
    try {
        if (!request || Object.keys(request).length === 0) {
            throw Error("Invalid request object")
        }

        await dbConnect();
        const userBudget = await findBudget(userId);

        const currSavingsAccount = await savingsAccount.findOne()
            .and([{_id: request.accountId}, {savings: userBudget.savings}]) as SavingsAccount

        if (!currSavingsAccount) {
            throw Error("No savings account found with ID " + request.accountId);
        }

        const transaction = currSavingsAccount.ledger.find(trans => trans._id === transactionId) as SavingsTransaction;

        if (!transaction) {
            throw Error("No transaction found under account " + currSavingsAccount._id + " for transaction ID: " + transactionId);
        }
        // Keep old amount in memory to recalculate currentTotal in account and bucket
        const oldAmount = transaction.amount;
        // Update fields - fallback to current value if request prop is undefined
        transaction.name = request.name || transaction.name;
        transaction.date = request.date || transaction.date;
        transaction.amount = request.amount || transaction.amount;
        transaction.transactionType = request.transactionType || transaction.transactionType;
        
        // Remove the previous value, add the new value
        currSavingsAccount.currentTotal -= oldAmount || 0;
        currSavingsAccount.currentTotal += request.amount || 0;

        await currSavingsAccount.save();

        if (transaction.bucket) {
            const bucket = await savingsAccountBucket.findById(transaction.bucket);
            if (!bucket) {
                // continue?
            }
            bucket.currentTotal -= oldAmount || 0;
            bucket.currentTotal += request.amount || 0;

            await bucket.save();
        }

        return transaction;
    } catch (e) {
        throw e
    }
}

export async function deleteSavingsTransaction(userId: mongoose.Types.ObjectId, savingsAccountId: mongoose.Types.ObjectId, transactionId: mongoose.Types.ObjectId) {
    try {
        await dbConnect();
        const userBudget = await findBudget(userId);

        const currSavingsAccount = await savingsAccount.findOne()
            .and([{_id: savingsAccountId}, {savings: userBudget.savings}]) as SavingsAccount

        if (!currSavingsAccount) {
            throw Error("No savings account found with ID " + savingsAccountId);
        }

        const transaction = currSavingsAccount.ledger.find(trans => trans._id === transactionId);

        if (!transaction) {
            throw Error("No transaction with ID " + transactionId);
        }

        currSavingsAccount.ledger.pull(transaction);

        currSavingsAccount.currentTotal -= transaction.amount;

        await currSavingsAccount.save();

        if (transaction.bucket) {
            const bucket = await savingsAccountBucket.findById(transaction.bucket);
            if (!bucket) {
                // continue?
            }
            bucket.currentTotal -= transaction.amount;

            await bucket.save();
        }

        return transaction;

    } catch (e) {
        throw e;
    }
}

type createSavingsAccountBucketRequest = {
    accountId: string,
    name: string,
    goal: number,
    goalBy: Date
}
export async function createSavingsAccountBucket (userId: mongoose.Types.ObjectId, request: createSavingsAccountBucketRequest) {
    try {
        await dbConnect();
        const userBudget = await findBudget(userId);

        const currSavingsAccount = await savingsAccount.findOne()
            .and([{_id: request.accountId}, {savings: userBudget.savings}])

        if (!currSavingsAccount) {
            throw Error("No savings account found with ID " + request.accountId);
        }

        const newBucket = await savingsAccountBucket.create({
            savingsAccount: request.accountId,
            name: request.name,
            goal: request.goal,
            goalBy: request.goalBy
        }) as SavingsBuckets;

        if (!newBucket) {
            throw Error("Unable to create new bucket");
        }

        currSavingsAccount.buckets.push(newBucket._id);

        await currSavingsAccount.save();

        return newBucket;
    } catch (e) {
        throw e;
    }
}

async function findBudget (userId: mongoose.Types.ObjectId): Promise<Budget> {
    const budget = await budgetModel.findOne().or([{owner: userId }, {allowed: userId}]);

    if (!budget) {
        throw Error("No budget found for user!");
    }

    return budget;
}