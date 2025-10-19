import { getAllSavingsDetails } from "@/controllers/savingsController";
import { NextRequest, NextResponse } from "next/server";
import { getUserSessionId } from "@/app/lib/sessionHelpers";

export async function GET (req: NextRequest) {
    const userId = await getUserSessionId(req);
    if (userId instanceof NextResponse) {
        return userId;
    }

    try {
        const savings = await getAllSavingsDetails(userId);

        if (!savings) {
            return NextResponse.json({success: false, error: "No savings found!"});
        }

        return NextResponse.json({success: true, data: savings}, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({success: false, error}, {status: 500})
    }
}