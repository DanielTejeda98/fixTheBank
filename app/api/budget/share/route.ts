import mongoose from "mongoose";
import { toggleShareableBudget } from "@/controllers/budgetController";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const userId = req.headers.get("userId");
    if (!userId) {
        return NextResponse.json({success: false, error: "No user ID" }, {status: 412})
    }

    const userIdAsObjectId = new mongoose.Types.ObjectId(userId || "");

    try {
        const shareableBudget = await toggleShareableBudget(userIdAsObjectId);
        if (shareableBudget) {
            return NextResponse.json({success: true, data: shareableBudget});
        }
        return NextResponse.json({success: true, data: "Budget successfuly unshared."})
    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, error})
    }
}