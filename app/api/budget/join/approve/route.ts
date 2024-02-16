import mongoose from "mongoose";
import { approveRequesterToJoinBudget } from "@/controllers/budgetController";
import { NextRequest, NextResponse } from "next/server";

type ApproveJoinRequest = {
    budgetId: string,
    requesterId: string
}

export async function POST (req: NextRequest) {
    const userId = req.headers.get("userId");
    if (!userId) {
        return NextResponse.json({sucess: false, error: "No user ID" }, {status: 412})
    }
    const userIdAsObjectId = new mongoose.Types.ObjectId(userId || "");
    
    const body = await req.json() as ApproveJoinRequest;
    const error = validatePOSTFields(body);
    if (error) {
        return NextResponse.json({sucess: false, error: error.message }, {status: 412})
    }

    const budgetIdAsObjectId = new mongoose.Types.ObjectId(body.budgetId || "");
    const requesterIdAsObjectId = new mongoose.Types.ObjectId(body.requesterId || "");
    try {
        await approveRequesterToJoinBudget(userIdAsObjectId, budgetIdAsObjectId, requesterIdAsObjectId)
    
        return NextResponse.json({sucess: true, data: "User approved"});
    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, error})
    }
}

function validatePOSTFields(body: ApproveJoinRequest) {
    const missingFields = [];
    if (!body.budgetId?.length) {
        missingFields.push("budgetId");
    }

    if (!body.requesterId?.length) {
        missingFields.push("requesterId");
    }

    if (missingFields.length) {
        return new Error(`The following fields are missing from the request body: ${missingFields.join(", ")}`)
    }

    return null
}