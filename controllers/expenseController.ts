import dbConnect from "@/app/lib/dbConnect";
import budgetModel, { Budget } from "@/models/budgetModel";
import expenseModel, { Expense } from "@/models/expenseModel";
import mongoose from "mongoose";

async function createExpense (request: any, userId: mongoose.Types.ObjectId) {
    try {
        await dbConnect();

        const budget = await findBudget(userId) as Budget;

        const expense = await expenseModel.create({
            createdBy: userId,
            updatedBy: userId,
            amount: request.amount,
            category: new mongoose.Types.ObjectId(request.category),
            date: request.date,
            description: request.description,
            account: request.account,
            budgetId: new mongoose.Types.ObjectId(request.budgetId)
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

        const updateRequest = {
            amount: request.amount,
            account: request.account ? new mongoose.Types.ObjectId(request.account) : null,
            category: request.category ? new mongoose.Types.ObjectId(request.category) : null,
            date: request.date ? new Date(request.date) : null,
            description: request.description
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

export {
    createExpense,
    updateExpense,
    deleteExpense
}