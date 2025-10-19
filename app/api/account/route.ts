import { getUserSessionId } from "@/app/lib/sessionHelpers";
import { createAccount } from "@/controllers/accountController";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const userId = await getUserSessionId(req);
    if (userId instanceof NextResponse) {
        return userId;
    }
    
    try {
        const requestBody = await req.json();
        const errors = validateFields(requestBody);
        if (errors.length) {
            return NextResponse.json({success: false, error: `The following fields are missing from the request body: ${errors.join(", ")}` }, {status: 400});
        }
        const createdAccount = await createAccount(userId, requestBody.name);

        return NextResponse.json({data: createdAccount}, {status: 201});
    } catch (error) {
        return NextResponse.json({error}, {status: 500});
    }
}

function validateFields (body: any): String[] {
    const missingFields: String[] = [];
    if(!body.name) {
        missingFields.push("name")
    }
    return missingFields;
}