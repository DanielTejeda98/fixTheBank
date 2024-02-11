import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { createUserBudget, getUserFullBudgetDocument } from "@/controllers/budgetController";

export async function GET(req: NextRequest) {
    
    const userId = req.headers.get("userId");
    if (!userId) {
        return NextResponse.json({sucess: false, error: "No user ID" }, {status: 412})
    }

    const userIdAsObjectId = new mongoose.Types.ObjectId(userId || "");
    const requestBudgetDate = req.nextUrl.searchParams.get("budgetDate")
    const budgetMonth = requestBudgetDate ? new Date(requestBudgetDate) : new Date();

    try {
        const budget = await getUserFullBudgetDocument(userIdAsObjectId, budgetMonth)

        if (!budget) {
            return NextResponse.json({sucess: false, error: "No budget found for user"}, {status: 404});
        }

        return NextResponse.json({sucess: true, data: budget}, {status: 200});
    } catch (error) {
        console.log(error)
        return NextResponse.json({sucess: false, error }, {status: 400})
    }
}

export async function POST(req: NextRequest) {
    const userId = req.headers.get("userId");
    if (!userId) {
        return NextResponse.json({sucess: false, error: "No user ID" }, {status: 412})
    }
    try {
        const budget = await createUserBudget(userId)
        return NextResponse.json({sucess: true, data: budget}, {status: 200});
    } catch (error) {
        console.log(error)
        return NextResponse.json({sucess: false, error }, {status: 400})
    }
}