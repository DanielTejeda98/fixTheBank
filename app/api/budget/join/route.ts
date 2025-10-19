import { joinSharedBudget } from "@/controllers/budgetController";
import { NextRequest, NextResponse } from "next/server";
import { getUserSessionId } from "@/app/lib/sessionHelpers";

type JoinRequest = {
    joinCode: string,
}

export async function POST (req: NextRequest) {
    const userId = await getUserSessionId(req);
    if (userId instanceof NextResponse) {
        return userId;
    }
    
    const body = await req.json() as JoinRequest;
    const error = validatePOSTFields(body);
    if (error) {
        return NextResponse.json({success: false, error: error.message }, {status: 412})
    }
    try {
        await joinSharedBudget(userId, body.joinCode)
    
        return NextResponse.json({success: true, data: "Join request sent"});
    } catch (error: any) {
        console.log(error)
        return NextResponse.json({success: false, error: error.message})
    }

}

function validatePOSTFields(body: JoinRequest) {
    const missingFields = [];
    if (!body.joinCode?.length) {
        missingFields.push("joinCode");
    }

    if (missingFields.length) {
        return new Error(`The following fields are missing from the request body: ${missingFields.join(", ")}`)
    }

    return null
}

