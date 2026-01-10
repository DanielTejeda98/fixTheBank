import dbConnect from "@/app/lib/dbConnect";
import mongoose from "mongoose";
import categoriesModel, { Category } from "@/models/categoriesModel";
import { Budget } from "@/models/budgetModel";
import { findBudget } from "@/helpers/budgetHelpers";
import { isNotNullOrUndefined } from "@/lib/utils";

export async function createCategory(
  budgetId: string,
  userId: mongoose.Types.ObjectId,
  name: string
): Promise<Category> {
  try {
    await dbConnect();
    const budget = (await findBudget(userId)) as Budget;

    const category = await categoriesModel.create({
      budgetId: new mongoose.Types.ObjectId(budgetId),
      name,
    });

    if (!category) {
      throw new Error("Failed to create category!");
    }

    budget.categories.push(category._id);
    await budget.save();

    return category;
  } catch (error) {
    throw error;
  }
}

export async function updateCategory(
  categoryId: string,
  userId: mongoose.Types.ObjectId,
  name: string,
  sortRank: number,
  date?: string,
  amount?: Number,
  note?: string
): Promise<Category | null> {
  try {
    await dbConnect();
    const budget = (await findBudget(userId)) as Budget;

    if (!canAccessCategoryCheck(categoryId, budget)) {
      throw new Error("Category not found in budget!");
    }

    const category = (await categoriesModel.findById(categoryId)) as Category;

    if (!category) {
      return null;
    }

    category.name = name;
    category.sortRank = sortRank;
    if (date) {
      if (isNotNullOrUndefined(amount) && !Number.isNaN(amount)) {
        const existingMax = category.maxMonthExpectedAmount.find(
          (cat) => cat.month === date
        );
        if (!existingMax) {
          category.maxMonthExpectedAmount.push({
            month: date,
            amount,
          });
        } else {
          // Using non null operator, as isNotNullOrUndefined will check null and undefined for us
          existingMax.amount = amount!;
        }
      }

      if (isNotNullOrUndefined(note)) {
        const existingNote = category.notes.find((cat) => cat.month === date);
        if (!existingNote) {
          category.notes.push({
            month: date,
            note,
          });
        } else {
          // Using non null operator, as isNotNullOrUndefined will check null and undefined for us
          existingNote.note = note!;
        }
      }
    }

    category.save();

    return category;
  } catch (error) {
    throw error;
  }
}

export async function deleteCategory(
  categoryId: string,
  userId: mongoose.Types.ObjectId
): Promise<Category> {
  try {
    await dbConnect();
    const budget = (await findBudget(userId)) as Budget;

    if (!canAccessCategoryCheck(categoryId, budget)) {
      throw new Error("Category not found in budget!");
    }
    const deletedCategory = await categoriesModel.findByIdAndDelete(categoryId);

    return deletedCategory;
  } catch (error) {
    throw error;
  }
}

function canAccessCategoryCheck(categoryId: string, budget: Budget): Boolean {
  return budget.categories.includes(new mongoose.Types.ObjectId(categoryId));
}
