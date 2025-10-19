import { NextRequest, NextResponse } from "next/server";
import { createUserBudget, getUserFullBudgetDocument } from "@/controllers/budgetController";
import { getUserSessionId } from "@/app/lib/sessionHelpers";

export async function GET(req: NextRequest) {
    const userId = await getUserSessionId(req);
    if (userId instanceof NextResponse) {
        return userId;
    }

    const requestBudgetDate = req.nextUrl.searchParams.get("budgetDate")
    const budgetMonth = requestBudgetDate ? new Date(requestBudgetDate) : new Date();

    try {
        const budget = await getUserFullBudgetDocument(userId, budgetMonth)

        if (!budget) {
            return NextResponse.json({success: false, error: "No budget found for user"}, {status: 404});
        }

        return NextResponse.json({success: true, data: budget}, {status: 200});
    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, error }, {status: 500})
    }
}

export async function POST(req: NextRequest) {
    const userId = await getUserSessionId(req);
    if (userId instanceof NextResponse) {
        return userId;
    }
    
    try {
        const budget = await createUserBudget(userId)
        return NextResponse.json({success: true, data: budget}, {status: 200});
    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, error }, {status: 400})
    }
}