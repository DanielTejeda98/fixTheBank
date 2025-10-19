import mongoose from "mongoose";
import { updateExpense } from "@/controllers/expenseController";
import { NextRequest, NextResponse } from "next/server";
import { getUserSessionId } from "@/app/lib/sessionHelpers";

export async function PUT (req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const userId = await getUserSessionId(req);
    if (userId instanceof NextResponse) {
        return userId;
    }
    
    const expenseId = new mongoose.Types.ObjectId((await params).id);
    try {
        const requestBody = await req.json();
        const updatedExpense = await updateExpense(requestBody, expenseId, userId)
        return NextResponse.json({message: "Sucessfully updated expense", data: updatedExpense}, {status: 201});
    } catch (error: any) {
        return NextResponse.json({success: false, error: error.message}, {status: 500})
    }
} 