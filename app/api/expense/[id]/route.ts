import mongoose from "mongoose";
import { authOptions } from "@/config/authOptions";
import { updateExpense } from "@/controllers/expenseController";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT (req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ message: "Must be logged in"}, {status: 401})
    }
    const rawUserId = session.user.id;
    if (!rawUserId) {
        return NextResponse.json({ message: "No user ID provided"}, {status: 412})
    }
    const userId = new mongoose.Types.ObjectId(rawUserId);
    const expenseId = new mongoose.Types.ObjectId(params.id);
    try {
        const requestBody = await req.json();
        const updatedExpense = await updateExpense(requestBody, expenseId, userId)
        return NextResponse.json({message: "Sucessfully updated expense", data: updatedExpense}, {status: 201});
    } catch (error: any) {
        return NextResponse.json({success: false, error: error.message}, {status: 500})
    }
} 