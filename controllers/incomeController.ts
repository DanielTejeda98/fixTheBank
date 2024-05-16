import dbConnect from "@/app/lib/dbConnect";
import budgetModel from "@/models/budgetModel";
import incomeModel from "@/models/incomeModel";
import mongoose from "mongoose";

async function createIncome (request: any, userId: mongoose.Types.ObjectId) {
    await dbConnect();
    try {
        const income = await incomeModel.create({
            createdBy: userId,
            updatedBy: userId,
            amount: request.amount,
            source: request.source,
            date: request.date,
            budgetId: new mongoose.Types.ObjectId(request.budgetId)
        })

        await budgetModel.findByIdAndUpdate(new mongoose.Types.ObjectId(request.budgetId), {
            $push: {income: income._id}
        })

        return income;
    } catch (error) {
        throw error;
    }
}

async function deleteIncome (incomeId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) {
    await dbConnect();
    try {
        const budget = await budgetModel.findOne({owner: userId})
        if (!budget) {
            throw "No budget found for user";
        }

        const income = await incomeModel.findOneAndDelete({_id: incomeId, budgetId: budget._id})
        if (!income) {
            throw "No income found for delete"
        }

        await budget.updateOne({
            $pull: {income: income._id}
        })

        await budget.save()

        return income
    } catch (error) {
        throw error
    }
}

export {
    createIncome,
    deleteIncome
}