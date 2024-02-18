// Defines budget logic
import dbConnect from "@/app/lib/dbConnect";
import mongoose from "mongoose";
import budgetModel, { Budget } from "@/models/budgetModel";
import shareableBudgetModel, { ShareableBudget } from "@/models/shareableBudgets";
import incomeModel from "@/models/incomeModel";
import expenseModel from "@/models/expenseModel";
import userModel from "@/models/userModel";

export async function getUserFullBudgetDocument (userId: mongoose.Types.ObjectId, budgetMonth: Date) {
    try {
        // Declare to have schema available for populate (in case this is the first time the schemas are referenced)
        incomeModel;
        expenseModel;
        await dbConnect()

        const budget = await budgetModel.findOne().or([{owner: userId }, {allowed: userId}])
        .populate({
            path: "expenses",
            match: {date: {$gte: new Date(budgetMonth.getFullYear(), budgetMonth.getMonth(), 1), $lte: new Date(budgetMonth.getFullYear(), budgetMonth.getMonth() + 1, 0)}}
        })
        .populate({
            path: "income",
            match: {date: {$gte: new Date(budgetMonth.getFullYear(), budgetMonth.getMonth(), 1), $lte: new Date(budgetMonth.getFullYear(), budgetMonth.getMonth() + 1, 0)}}
        })
        .exec();

        if (!budget) {
            return null;
        }

        return {
            ...budget._doc,
            ...getBudgetMinMaxDates(budgetMonth),
            isOwner: budget._doc.owner.toString() === userId.toString()
        };
    } catch (error) {
        throw error
    }
}

export async function createUserBudget (userId: string) {
    try {
        await dbConnect();
        const [categories, accounts] = getDefaultAccountsAndCategories();
        const budget = await budgetModel.create({
            owner: new mongoose.Types.ObjectId(userId),
            accounts,
            categories
        })

        if (!budget) {
            return null;
        } 

        return budget;
    } catch (error) {
        throw error
    }
}

export async function toggleShareableBudget (userId: mongoose.Types.ObjectId) {
    try {
        await dbConnect();
        // Is the budget being shared?
        const sharedBudgetInfo = await shareableBudgetModel.findOne({owner: userId});
        // if budget is not being shared, add it to the sharable budget table and sync budget
        if (!sharedBudgetInfo) {
            return await createSharedBudgetInformation(userId);
        }
        // if budget is being shared, disable share by removing from sharableBudget table and sync budget
        await deleteSharedBudgetInformation(userId, sharedBudgetInfo);
        return false;
    } catch (error) {
        throw error
    }
}

export async function joinSharedBudget (userId: mongoose.Types.ObjectId, joinCode: string) {
    try {
        await dbConnect();

        const sharedBudget = await shareableBudgetModel.findOne({joinCode}) as ShareableBudget;
        if (!sharedBudget) {
            throw new Error("No shared budget with the provided join code: " + joinCode);
        }

        sharedBudget.requestedAccounts.push(userId)
        await sharedBudget.save();
    } catch (error) {
        throw error;
    }
}

export async function getBudgetRequesters (userId: mongoose.Types.ObjectId, budgetId: mongoose.Types.ObjectId) {
    try {
        await dbConnect();
        const sharedBudget = await shareableBudgetModel.findOne({owner: userId, budgetId}).populate("requestedAccounts", "_id username", userModel).exec() as ShareableBudget;
        if (!sharedBudget) {
            throw new Error(`No shared budget found for budget ID ${budgetId}`);
        }

        return sharedBudget.requestedAccounts || [];

    } catch (error) {
        throw error;
    }
}

export async function approveRequesterToJoinBudget (userId: mongoose.Types.ObjectId, budgetId: mongoose.Types.ObjectId, requesterId: mongoose.Types.ObjectId) {
    if (userId === requesterId) {
        throw new Error(`Requester ID ${requesterId} is the same as budget owner ID ${userId}`);
    }
    
    try {
        await dbConnect();

        const budget = await budgetModel.findOne({_id: budgetId, owner: userId}) as Budget
        if (!budget) {
            throw new Error(`No budget found for user ${userId} with the provided budget Id ${budgetId}`)
        }

        const sharedBudget = await shareableBudgetModel.findOne({budgetId}) as ShareableBudget;
        if (!sharedBudget) {
            throw new Error(`No shared budget found for budget ID ${budgetId}`);
        }

        sharedBudget.requestedAccounts.pull(requesterId);
        budget.allowed.push(requesterId);

        await sharedBudget.save();
        await budget.save();

    } catch (error) {
        throw error;
    }
}

function getBudgetMinMaxDates (budgetMonth: Date) {
    return {
        minDate: new Date(budgetMonth.getFullYear(), budgetMonth.getMonth(), 1).toLocaleDateString(),
            maxDate: new Date(budgetMonth.getFullYear(), budgetMonth.getMonth() + 1, 0).toLocaleDateString()
    }
}

function getDefaultAccountsAndCategories () {
    const categories = ["Mortgage", "Car Payment", "Car Insurance", "Electricity", "Phones", "House Internet", "Groceries/Household", "Gifts", "Restaurants", "Therapy", "Medical", "Toby", "Toby Medical", "Debts", "Savings", "Investing", "Grooming", "Subscriptions", "Misc"]
    const accounts = ["Chase Debit", "Chase Savings", "Discover IT", "Discover MILES", "Target Redcard", "Chase Disney Credit"];
    return [categories, accounts]
}

async function createSharedBudgetInformation (userId: mongoose.Types.ObjectId) {
    // get budget model assigned to user
    try {
        const budget = await budgetModel.findOne({owner: userId}, "owner isShared shareId")
        if (!budget) {
            throw new Error("No budget found for specified user");
        }

        const joinCode = generateJoinCode();

        const possibleSharedBudget = await shareableBudgetModel.findOne( { joinCode: joinCode })
        if (possibleSharedBudget) {
            throw new Error("Unable to process, joinCode was in use.")
        }

        // create sharablebudget document
        const sharableBudgetInfo = await shareableBudgetModel.create({
            owner: userId,
            budgetId: budget._id,
            joinCode: joinCode
        })

        // sync budget model
        await syncBudgetWithShareableBudgetInfo(budget, sharableBudgetInfo);

        return sharableBudgetInfo
    } catch (error) {
        throw error
    }
}

async function deleteSharedBudgetInformation (userId: mongoose.Types.ObjectId, sharedBudgetInfo: ShareableBudget) {
    try {
        const budget = await budgetModel.findOne({owner: userId}, "owner isShared shareId")
        if (!budget) {
            throw new Error("No budget found for specified user");
        }

        await sharedBudgetInfo.deleteOne();
        await syncBudgetWithShareableBudgetInfo(budget, null);
    } catch (error) {
        throw error
    }
}

async function syncBudgetWithShareableBudgetInfo (budgetDocument: Budget, sharedBudgetInfo: ShareableBudget | null) {
    try {
        if (sharedBudgetInfo) {
            budgetDocument.shareCode = sharedBudgetInfo.joinCode;
            budgetDocument.isShared = true;
            budgetDocument.shareId = sharedBudgetInfo._id;
        } else {
            budgetDocument.shareCode = null;
            budgetDocument.isShared = false;
            budgetDocument.set("shareId", null)
        }
        return await budgetDocument.save()
    } catch (error) {
        throw error
    }
} 

function generateJoinCode () {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    const characterLength = characters.length;
    const CODE_CHARACTER_LENGTH = 4;
    let result = ""
    for (let i = 0; i < CODE_CHARACTER_LENGTH; i++) {
        result += characters.charAt(Math.floor(Math.random() * characterLength));
    }

    return result;
}