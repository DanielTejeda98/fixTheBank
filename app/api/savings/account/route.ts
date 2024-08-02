import { authOptions } from "@/config/authOptions";
import { createSavingsAccount } from "@/controllers/savingsController";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST (req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ message: "Must be logged in"}, {status: 401})
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);

    try {
        const request = await req.json();
        if (!request.name) {
            return NextResponse.json({success: false, error: "'name' field missing from body request"}, {status: 400});
        }
        const savings = await createSavingsAccount(userId, request.name);

        if (!savings) {
            return NextResponse.json({success: false, error: "No savings found!"});
        }

        return NextResponse.json({success: true, data: savings}, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({success: false, error}, {status: 500})
    }
}