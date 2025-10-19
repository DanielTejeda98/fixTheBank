import budgetModel, { Budget } from "@/models/budgetModel";
import mongoose from "mongoose";

export async function findBudget (userId: mongoose.Types.ObjectId): Promise<Budget> {
    const budget = await budgetModel.findOne().or([{owner: userId }, {allowed: userId}]);

    if (!budget) {
        throw Error("No budget found for user!");
    }

    return budget;
}