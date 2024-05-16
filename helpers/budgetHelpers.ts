import budgetModel, { Budget } from "@/models/budgetModel";

export async function findBudget (userId: string): Promise<Budget> {
    const budget = await budgetModel.findOne().or([{owner: userId }, {allowed: userId}]);

    if (!budget) {
        throw Error("No budget found for user!");
    }

    return budget;
}