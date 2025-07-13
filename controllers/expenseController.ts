import dbConnect from "@/app/lib/dbConnect";
import budgetModel, { Budget } from "@/models/budgetModel";
import expenseModel, { Expense } from "@/models/expenseModel";
import splitPaymentMasterModel, { SplitPaymentMaster } from "@/models/splitPaymentMasterModel";
import mongoose from "mongoose";

async function createExpense (request: any, userId: mongoose.Types.ObjectId) {
    try {
        await dbConnect();

        const budget = await findBudget(userId) as Budget;

        if(request.borrowFromNextMonth) {
            request.transactionDate = request.date;
            const expenseNextMonth = new Date(request.date);
            expenseNextMonth.setMonth(expenseNextMonth.getMonth() + 1, 1);
            request.date = expenseNextMonth;
        }

        if (request.giftTransaction && !request.revealGiftDate) {
            request.revealGiftDate = new Date(request.date);
            request.revealGiftDate.setMonth(request.revealGiftDate.getMonth() + 1, 1);
        }

        const expense = await expenseModel.create({
            createdBy: userId,
            updatedBy: userId,
            amount: request.amount,
            category: new mongoose.Types.ObjectId(request.category),
            date: request.date,
            transactionDate: request.transactionDate || request.date,
            description: request.description,
            account: request.account,
            budgetId: new mongoose.Types.ObjectId(request.budgetId),
            receiptImage: request.receiptImage,
            borrowFromNextMonth: request.borrowFromNextMonth || false,
            giftTransaction: request.giftTransaction || false,
            revealGiftDate: request.giftTransaction ? request.revealGiftDate : null
        })

        await budget.updateOne({
         $push: {
            expenses: expense._id
         }
        })
        await budget.save();

        return expense;
    } catch (error) {
        throw error
    }
}

async function updateExpense (request: any, expenseId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) {
    try {
        await dbConnect();
        // Will handle validation for if user can access the budget
        await findBudget(userId) as Budget;

        if(request.borrowFromNextMonth) {
            request.transactionDate = request.date;
            const expenseNextMonth = new Date(request.date);
            expenseNextMonth.setMonth(expenseNextMonth.getMonth() + 1, 1);
            request.date = expenseNextMonth;
        }

        if (request.giftTransaction && !request.revealGiftDate) {
            request.revealGiftDate = new Date(request.date);
            request.revealGiftDate.setMonth(request.revealGiftDate.getMonth() + 1, 1);
        } else if (!request.giftTransaction) {
            request.revealGiftDate = null;
        }

        const updateRequest = {
            amount: request.amount,
            account: request.account ? new mongoose.Types.ObjectId(request.account) : null,
            category: request.category ? new mongoose.Types.ObjectId(request.category) : null,
            transactionDate: request.transactionDate || request.date || null,
            date: request.date || null,
            description: request.description,
            receiptImage: request.receiptImage,
            borrowFromNextMonth: request.borrowFromNextMonth || false,
            giftTransaction: request.giftTransaction || false,
            revealGiftDate: request.revealGiftDate
        } as Expense;
    
        for (const key of Object.keys(updateRequest)) {
            // Specifically not null/undefined as not all falsey values won't be valid updates
            if(request[key] === null || request[key] === undefined) {
                delete updateRequest[key as keyof Expense]
            }
        }
        // Update updatedBy field
        updateRequest.updatedBy = new mongoose.Types.ObjectId(userId);

        const updatedExpense = await expenseModel.findOneAndUpdate({ _id: expenseId}, {
            $set: updateRequest
        }, { new: true })
        
        return updatedExpense;
    } catch (error) {
        throw error;
    }
}

async function deleteExpense (expenseId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) {
    try {
        await dbConnect();
        const budget = await findBudget(userId) as Budget;

        const expense = await expenseModel.findOneAndDelete({_id: expenseId, budgetId: budget._id})
        if (!expense) {
            throw "No expense found for delete";
        }

        await budget.updateOne({
            $pull: {expenses: expense._id}
        })

        await budget.save()

        return expense;
    } catch (error) {
        throw error;
    }
}

async function findBudget (userId: mongoose.Types.ObjectId): Promise<Budget> {
    const budget = await budgetModel.findOne().or([{owner: userId }, {allowed: userId}]);

    if (!budget) {
        throw Error("No budget found for user!");
    }

    return budget;
}

async function createSplitExpense (request: any, userId: mongoose.Types.ObjectId) {
    try {
        await dbConnect();

        const budget = await findBudget(userId) as Budget;

        const splitPaymentMaster = await splitPaymentMasterModel.create({
            budgetId: budget._id,
            totalAmount: request.amount,
            numberOfPayments: request.numberOfPayments,
            createdBy: userId,
            updatedBy: userId
        } as SplitPaymentMaster);

        let totalAmountCheck = 0;
        let individualAmount = Math.round((request.amount / request.numberOfPayments) * 100) / 100;
        const expenses = [];

        for (let i = 0; i < request.numberOfPayments; i++) {
            totalAmountCheck += individualAmount;
            // Handle rounding errors on last payment
            if (i === request.numberOfPayments - 1 && totalAmountCheck !== request.amount) {
                const difference = Math.round((request.amount - totalAmountCheck) * 100) / 100;
                if (Math.abs(difference) >= 0.01) {
                    // Only adjust if difference is significant
                    individualAmount = individualAmount + difference;
                }
            }

            if(request.borrowFromNextMonth) {
                request.transactionDate = request.date;
                const expenseNextMonth = new Date(request.date);
                expenseNextMonth.setMonth(expenseNextMonth.getMonth() + 1, 1);
                request.date = expenseNextMonth;
            }

            const expenseDate = new Date(request.date);
            expenseDate.setMonth(expenseDate.getMonth() + i);
            const expense = await expenseModel.create({
                createdBy: userId,
                updatedBy: userId,
                amount: individualAmount,
                category: new mongoose.Types.ObjectId(request.category),
                date: expenseDate,
                transactionDate: request.transactionDate || expenseDate,
                description: request.description ? `${request.description} (Part ${i + 1} of ${request.numberOfPayments})` : undefined,
                account: request.account,
                budgetId: budget._id,
                receiptImage: request.receiptImage,
                borrowFromNextMonth: request.borrowFromNextMonth || false,
                giftTransaction: request.giftTransaction || false,
                revealGiftDate: request.giftTransaction ? request.revealGiftDate : null,
                splitPaymentMasterId: splitPaymentMaster._id
            });
            expenses.push(expense);
            splitPaymentMaster.payments.push(expense._id);
        }

        await budget.updateOne({
         $push: {
            expenses: expenses.map(e => e._id)
         }
        });

        await budget.save();
        await splitPaymentMaster.save();
    }
    catch (error) {
        throw error;
    }
}

export {
    createExpense,
    updateExpense,
    deleteExpense,
    createSplitExpense
}