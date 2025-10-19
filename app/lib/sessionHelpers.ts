import { authOptions } from "@/config/authOptions";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

async function getUserSessionId (req: NextRequest): Promise<mongoose.Types.ObjectId | NextResponse> {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ message: "Must be logged in"}, {status: 401})
    }
    const sessionUserId = session.user.id;
    if (!sessionUserId) {
        return NextResponse.json({ message: "No user ID provided"}, {status: 412})
    }
    const userId = new mongoose.Types.ObjectId(sessionUserId);
    return userId;
}

export { getUserSessionId }