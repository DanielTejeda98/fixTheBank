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

export async function updateCategory (categoryId: string, userId: string, name: string, sortRank: Number, date?: Date, amount?: Number): Promise<Category|null> {
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
            category.maxMonthExpectedAmount.push({
                [getCategoryIndexDate(date)]: amount
            })
        }

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

function getCategoryIndexDate (date: Date): string {
    return date.toLocaleDateString("en-US", {
        month: "2-digit",
        year: "numeric"
    })
}

async function findBudget (userId: string): Promise<Budget> {
    const budget = await budgetModel.findOne().or([{owner: userId }, {allowed: userId}]);

    if (!budget) {
        throw Error("No budget found for user!");
    }

    return budget;
}

function canAccessCategoryCheck (categoryId: string, budget: Budget): Boolean {
    return budget.categories.includes(categoryId);
}