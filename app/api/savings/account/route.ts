import { createSavingsAccount } from "@/controllers/savingsController";
import { NextRequest, NextResponse } from "next/server";
import { getUserSessionId } from "@/app/lib/sessionHelpers";

export async function POST (req: NextRequest) {
    const userId = await getUserSessionId(req);
    if (userId instanceof NextResponse) {
        return userId;
    }
    
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