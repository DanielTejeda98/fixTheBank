import dbConnect from "@/app/lib/dbConnect";
import mongoose from "mongoose";
import categoriesModel, { Category } from "@/models/categoriesModel";
import budgetModel, { Budget } from "@/models/budgetModel";

export async function createCategory (budgetId: string, userId: string, name: string): Promise<Category> {
    try {
        await dbConnect();
        const budget = await findBudget(userId) as Budget;

        const category = await categoriesModel.create({
            budgetId: new mongoose.Types.ObjectId(budgetId),
            name
        })

        if (!category) {
            throw new Error("Failed to create category!")
        }

        budget.categories.push(category._id);
        await budget.save();

        return category;
    } catch (error) {
        throw error;
    }
}

export async function updateCategory (categoryId: string, userId: string, name: string, sortRank: Number, date?: string, amount?: Number): Promise<Category|null> {
    try {
        await dbConnect();
        const budget = await findBudget(userId) as Budget;

        if(!canAccessCategoryCheck(categoryId, budget)) {
            throw new Error("Category not found in budget!")
        }

        const category = await categoriesModel.findById(categoryId) as Category;

        if(!category) {
            return null;
        }

        category.name = name;
        category.sortRank = sortRank;
        if (date && amount) {
            const existingMax = category.maxMonthExpectedAmount.find(cat => cat.month === date)
            if (!existingMax) {
                category.maxMonthExpectedAmount.push({
                    month: date,
                    amount
                })
            } else {
                existingMax.amount = amount;
            }
        }

        category.save();

        return category;
    } catch (error) {
        throw error;
    }
}

export async function deleteCategory (categoryId: string, userId: string): Promise<Category> {
    try {
        await dbConnect();
        const budget = await findBudget(userId) as Budget;

        if(!canAccessCategoryCheck(categoryId, budget)) {
            throw new Error("Category not found in budget!")
        }
        const deletedCategory = await categoriesModel.findByIdAndDelete(categoryId);

        return deletedCategory;
    } catch (error) {
        throw error;
    }
}

async function findBudget (userId: string): Promise<Budget> {
    const budget = await budgetModel.findOne().or([{owner: userId }, {allowed: userId}]);

    if (!budget) {
        throw Error("No budget found for user!");
    }

    return budget;
}

function canAccessCategoryCheck (categoryId: string, budget: Budget): Boolean {
    return budget.categories.includes(new mongoose.Types.ObjectId(categoryId));
}