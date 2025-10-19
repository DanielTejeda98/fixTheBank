import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { createIncome, deleteIncome } from "@/controllers/incomeController";
import { getUserSessionId } from "@/app/lib/sessionHelpers";

export async function POST(req: NextRequest) {
    const userId = await getUserSessionId(req);
    if (userId instanceof NextResponse) {
        return userId;
    }
    const request = await req.json();
    const error = validatePOSTFields(request);
    if (error) {
        return NextResponse.json({success: false, error: error.message }, {status: 412})
    }
    try {
        const newIncome = await createIncome(request, userId);

        return NextResponse.json({success: true, data: newIncome}, {status: 200});
    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, error }, {status: 400})
    }
}

export async function DELETE(req: NextRequest) {
    const userId = await getUserSessionId(req);
    if (userId instanceof NextResponse) {
        return userId;
    }
    
    const request = await req.json();

    if(!request.incomeId) {
        return NextResponse.json({success: false, error: "No income ID provided for delete"}, {status: 412})
    }

    if(!userId) {
        return NextResponse.json({error: "No user ID provided"}, {status: 412})
    }
    const incomeIdAsObjectId = new mongoose.Types.ObjectId(request.incomeId)
    try {
        const deletedIncome = await deleteIncome(incomeIdAsObjectId, userId)

        return NextResponse.json({success: true, data: deletedIncome}, {status: 200});
    } catch (error) {
        return NextResponse.json({success: false, error }, {status: 400})
    }
}

const validatePOSTFields = (body: any) => {
    const missingFields = [];

    if (!body.amount) {
        missingFields.push("amount");
    }

    if (!body.source?.length) {
        missingFields.push("source");
    }

    if (!body.date?.length) {
        missingFields.push("date");
    }

    if(!body.budgetId?.length) {
        missingFields.push("budgetId");
    }

    if (missingFields.length) {
        return new Error(`The following fields are missing from the request body: ${missingFields.join(", ")}`)
    }

    return null
}