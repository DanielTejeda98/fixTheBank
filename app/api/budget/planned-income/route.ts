import { addPlannedIncome, removePlannedIncome } from "@/controllers/budgetController";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST (req: NextRequest) {
    const userId = req.headers.get("userId");
    if (!userId) {
        return NextResponse.json({success: false, error: "No user ID" }, {status: 412})
    }
    const requestBody = await req.json();
    const errors = validatePOSTFields(requestBody)
    if (errors.length) {
        return NextResponse.json({success: false, error: `The following fields are missing from the request body: ${errors.join(", ")}` }, {status: 400});
    }

    await addPlannedIncome(new mongoose.Types.ObjectId(userId), requestBody.monthIndex, requestBody.newIncomeSource);
    return NextResponse.json({success: true}, {status: 201})
}

export async function DELETE (req: NextRequest) {
    const userId = req.headers.get("userId");
    if (!userId) {
        return NextResponse.json({success: false, error: "No user ID" }, {status: 412})
    }
    const requestBody = await req.json();
    const errors = validateDELETEFields(requestBody)
    if (errors.length) {
        return NextResponse.json({success: false, error: `The following fields are missing from the request body: ${errors.join(", ")}` }, {status: 400});
    }

    await removePlannedIncome(new mongoose.Types.ObjectId(userId), requestBody.monthIndex, new mongoose.Types.ObjectId(requestBody.incomeSourceId));
    return NextResponse.json({success: true}, {status: 200})
}

function validatePOSTFields (body: any): String[] {
    const missingFields: String[] = [];
    if(!body.monthIndex) {
        missingFields.push("monthIndex")
    }
    if(!body.newIncomeSource) {
        missingFields.push("newIncomeSource")
    }
    return missingFields;
}

function validateDELETEFields (body: any): String[] {
    const missingFields: String[] = [];
    if(!body.monthIndex) {
        missingFields.push("monthIndex")
    }
    if(!body.incomeSourceId) {
        missingFields.push("incomeSourceId")
    }
    return missingFields;
}