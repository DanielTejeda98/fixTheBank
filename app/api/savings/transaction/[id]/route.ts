import { authOptions } from "@/config/authOptions";
import { deleteSavingsTransaction, updateSavingsTransaction } from "@/controllers/savingsController";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function PUT (req: NextRequest, { params }: { params: { id: string }}) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ message: "Must be logged in"}, {status: 401})
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);

    try {
        const request = await req.json();
        const transaction = await updateSavingsTransaction(userId, new mongoose.Types.ObjectId(params.id), request);

        if (!transaction) {
            return NextResponse.json({success: false, error: "Unable to update transaction!"});
        }

        return NextResponse.json({success: true, data: transaction}, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({success: false, error}, {status: 500})
    }
}

export async function DELETE (req: NextRequest, { params }: { params: { id: string }}) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ message: "Must be logged in"}, {status: 401})
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);

    try {
        const request = await req.json();
        if (!request.savingsAccountId) {
            return NextResponse.json({success: false, error: `'savingsAccountId' field missing from body request`}, {status: 400});
        }
        const transaction = await deleteSavingsTransaction(userId, new mongoose.Types.ObjectId(request.savingsAccountId), new mongoose.Types.ObjectId(params.id));

        if (!transaction) {
            return NextResponse.json({success: false, error: "Unable to delete transaction!"});
        }

        return NextResponse.json({success: true, data: transaction}, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({success: false, error}, {status: 500})
    }
}