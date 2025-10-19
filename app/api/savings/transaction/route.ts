import { createSavingsTransaction } from "@/controllers/savingsController";
import { NextRequest, NextResponse } from "next/server";
import { getUserSessionId } from "@/app/lib/sessionHelpers";

export async function POST (req: NextRequest) {
    const userId = await getUserSessionId(req);
    if (userId instanceof NextResponse) {
        return userId;
    }
    
    try {
        const request = await req.json();
        const validationErrors = validatePOSTFields(request);
        if (validationErrors.length > 0) {
            return NextResponse.json({success: false, error: `${validationErrors.join(", ")} field${validationErrors.length > 1 ? 's' : ''} missing from body request`}, {status: 400});
        }
        const transaction = await createSavingsTransaction(userId, request);

        if (!transaction) {
            return NextResponse.json({success: false, error: "Unable to create transaction!"});
        }

        return NextResponse.json({success: true, data: transaction}, {status: 201});
    } catch (error) {
        console.log(error);
        return NextResponse.json({success: false, error}, {status: 500})
    }
}

function validatePOSTFields (request: any): string[] {
    const expectedFields = ["accountId", "name", "amount", "date", "transactionType"];
    const missingFields = [];

    // Is the field missing?
    for (let field of expectedFields) {
        if (request[field] === undefined || request[field] === null) {
            missingFields.push(field);
        }
    }

    return missingFields;
}