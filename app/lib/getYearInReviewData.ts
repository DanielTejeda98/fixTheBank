import { authOptions } from "@/config/authOptions";
import {
  getBudgetForYear,
  YearBudgetReviewData,
} from "@/controllers/budgetController";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

export const ERRORS = {
  NO_BUDGET_FOUND: "No budget found",
  NO_USER_ID_PROVIDED: "No userId provided",
};

export async function getYearInReviewData(year: string): YearBudgetReviewData {
  const session = await getServerSession(authOptions);
  const userId = !!session?.user?.id
    ? new mongoose.Types.ObjectId(session?.user?.id)
    : undefined;
  if (!userId) {
    throw new Error(ERRORS.NO_USER_ID_PROVIDED);
  }
  try {
    const data = await getBudgetForYear(userId, year);
    if (!data) {
      throw new Error(ERRORS.NO_BUDGET_FOUND);
    }

    return data;
  } catch (error: any) {
    throw error;
  }
}
