import { authOptions } from "@/config/authOptions"
import { getBudgetRequesters, getUserFullBudgetDocument } from "@/controllers/budgetController"
import mongoose from "mongoose"
import { getServerSession } from "next-auth"
import normalizeMongooseObjects from "./normalizeMongooseObjects"
import { BudgetView, InitialData } from "@/types/budget"
import { cookies } from "next/headers"

export const ERRORS = {
    NO_BUDGET_FOUND: "No budget found",
    NO_USER_ID_PROVIDED: "No userId provided"
}

export async function getInitialData (): Promise<InitialData> {
    const cookieStore = await cookies();
    const session = await getServerSession(authOptions)
    const cookieSelectedDate = cookieStore.get("selectedBudgetDate")?.value
    let selectedBudgetDate;
    const userId = !!session?.user?.id ? new mongoose.Types.ObjectId(session?.user?.id) : undefined;
    if (!userId)
    {
        throw new Error(ERRORS.NO_USER_ID_PROVIDED);
    }
    try {
        selectedBudgetDate = cookieSelectedDate ? new Date(cookieSelectedDate) : new Date();
    } catch {
        selectedBudgetDate = new Date();
    }
    try {
        const data = await getUserFullBudgetDocument(userId, selectedBudgetDate)
        if (!data) {
            throw new Error(ERRORS.NO_BUDGET_FOUND);
        }

        let requesters: mongoose.Types.Array<mongoose.Types.ObjectId> | never[] = [];
        if(data.isShared && data.isOwner) {
            try {
                // Need to parse and stringify to bypass issues with NextJS passing non standard objects
                requesters = normalizeMongooseObjects(await getBudgetRequesters(userId, new mongoose.Types.ObjectId(data._id)));
            } catch (error) {
                console.log(error)
            }
        }

        const mappedBudget = {
            _id: data._id.toString(),
            categories: normalizeMongooseObjects(data.categories),
            accounts: normalizeMongooseObjects(data.accounts),
            income: normalizeMongooseObjects(data.income),
            expenses: normalizeMongooseObjects(data.expenses),
            plannedIncome: normalizeMongooseObjects(data.plannedIncome),
            minDate: data.minDate,
            maxDate: data.maxDate,
            isShared: data.isShared,
            shareCode: data.shareCode,
            isOwner: data.isOwner,
            joinRequests: requesters,
            lastFetched: new Date().getTime()
        } as BudgetView;

        return { mappedBudget };
    } catch (error: any) {
        throw error;
    }
}