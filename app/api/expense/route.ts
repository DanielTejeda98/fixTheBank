import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/authOptions";
import { createExpense, deleteExpense } from "@/controllers/expenseController";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ message: "Must be logged in"}, {status: 401})
    }
    const headerUserId = req.headers.get("userId");
    if (!headerUserId) {
        return NextResponse.json({ message: "No user ID provided"}, {status: 412})
    }
    const userId = new mongoose.Types.ObjectId(headerUserId);
    
    const request = await req.json();
    const error = validatePOSTFields(request);
    if (error) {
        return NextResponse.json({success: false, error: error.message }, {status: 412})
    }

    try {
        const newExpense = await createExpense(request, userId);

        return NextResponse.json({success: true, data: newExpense}, {status: 200});
    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, error }, {status: 400})
    }
}

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ message: "Must be logged in"}, {status: 401})
    }
    const userId = req.headers.get("userId");
    if (!userId) {
        return NextResponse.json({ message: "No user ID provided"}, {status: 412})
    }
    const request = await req.json();
    if(!request.expenseId) {
        return NextResponse.json({success: false, error: "No expense ID provided for delete"})
    }
    const userIdAsObjectId = new mongoose.Types.ObjectId(userId);
    const expenseIdasObjectId = new mongoose.Types.ObjectId(request.expenseId);
    try {
        const deletedExpense = await deleteExpense(expenseIdasObjectId, userIdAsObjectId)

        return NextResponse.json({success: true, message: deletedExpense}, {status: 200});
    } catch (error) {
        return NextResponse.json({success: false, error }, {status: 400})
    }
}

const validatePOSTFields = (body: any) => {
    const missingFields = [];

    if (!body.amount) {
        missingFields.push("amount");
    }

    if (!body.category?.length) {
        missingFields.push("category");
    }

    if (!body.account?.length) {
        missingFields.push("account");
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