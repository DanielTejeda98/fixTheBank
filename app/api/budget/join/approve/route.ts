import mongoose from "mongoose";
import { approveRequesterToJoinBudget } from "@/controllers/budgetController";
import { NextRequest, NextResponse } from "next/server";
import { getUserSessionId } from "@/app/lib/sessionHelpers";

type ApproveJoinRequest = {
    budgetId: string,
    requesterId: string
}

export async function POST (req: NextRequest) {
    const userId = await getUserSessionId(req);
    if (userId instanceof NextResponse) {
        return userId;
    }
    const body = await req.json() as ApproveJoinRequest;
    const error = validatePOSTFields(body);
    if (error) {
        return NextResponse.json({success: false, error: error.message }, {status: 412})
    }

    const budgetIdAsObjectId = new mongoose.Types.ObjectId(body.budgetId || "");
    const requesterIdAsObjectId = new mongoose.Types.ObjectId(body.requesterId || "");
    try {
        await approveRequesterToJoinBudget(userId, budgetIdAsObjectId, requesterIdAsObjectId)
    
        return NextResponse.json({success: true, data: "User approved"});
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