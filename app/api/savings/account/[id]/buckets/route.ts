import { authOptions } from "@/config/authOptions";
import { createSavingsAccountBucket } from "@/controllers/savingsController";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST (req: NextRequest, { params }: { params: Promise<{ id: string }>}) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ message: "Must be logged in"}, {status: 401})
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);

    try {
        const request = await req.json();
        request.accountId = (await params).id;
        const validationErrors = validatePOSTFields(request);
        if (validationErrors.length > 0) {
            return NextResponse.json({success: false, error: `${validationErrors.join(", ")} field${validationErrors.length > 1 ? 's' : ''} missing from body request`}, {status: 400});
        }
        const bucket = await createSavingsAccountBucket(userId, request);

        if (!bucket) {
            return NextResponse.json({success: false, error: "Unable to create bucket!"});
        }

        return NextResponse.json({success: true, data: bucket}, {status: 201});
    } catch (error) {
        console.log(error);
        return NextResponse.json({success: false, error}, {status: 500})
    }
}

function validatePOSTFields (request: any): string[] {
    const expectedFields = ["accountId", "name", "goal", "goalBy"];
    const missingFields = [];

    // Is the field missing?
    for (let field of expectedFields) {
        if (request[field] === undefined || request[field] === null) {
            missingFields.push(field);
        }
    }

    return missingFields;
}