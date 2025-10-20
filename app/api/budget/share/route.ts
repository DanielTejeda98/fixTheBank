import { toggleShareableBudget } from "@/controllers/budgetController";
import { NextRequest, NextResponse } from "next/server";
import { getUserSessionId } from "@/app/lib/sessionHelpers";

export async function POST(req: NextRequest) {
    const userId = await getUserSessionId(req);
    if (userId instanceof NextResponse) {
        return userId;
    }

    try {
        const shareableBudget = await toggleShareableBudget(userId);
        if (shareableBudget) {
            return NextResponse.json({success: true, data: shareableBudget});
        }
        return NextResponse.json({success: true, data: "Budget successfuly unshared."})
    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, error}, {status: 400})
    }
}