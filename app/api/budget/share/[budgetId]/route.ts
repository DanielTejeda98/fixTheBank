import mongoose from "mongoose";
import { getBudgetRequesters } from "@/controllers/budgetController";
import { NextRequest, NextResponse } from "next/server";

export async function GET (
    req: NextRequest,
    { params }: { params: { budgetId: string } }
) {
    const userId = req.headers.get("userId");
    if (!userId) {
        return NextResponse.json({success: false, error: "No user ID" }, {status: 412})
    }

    const userIdAsObjectId = new mongoose.Types.ObjectId(userId || "");
    const budgetIdAsObjectId = new mongoose.Types.ObjectId(params.budgetId || "");

    try {
        const joinRequests = await getBudgetRequesters(userIdAsObjectId, budgetIdAsObjectId)

        return NextResponse.json({success: true, data: joinRequests})
    } catch (error: any) {
        console.log(error)
        return NextResponse.json({success: false, error: error.message})
    }
}