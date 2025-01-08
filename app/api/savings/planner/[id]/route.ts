import { authOptions } from "@/config/authOptions";
import { removeSavingsPlan, updateSavingsPlan } from "@/controllers/savingsController";
import { PlannedSaving } from "@/types/savings";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function PUT (req: NextRequest, { params }: { params: { id: string }}) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ message: "Must be logged in"}, {status: 401})
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);

    let requestMonth = req.nextUrl.searchParams.get("month") || `${new Date().getMonth() + 1}/${new Date().getFullYear()}`

    try {
        const request = await req.json();
        request._id = params.id;
        const error = validatePUTFields(request);
        if (error) {
            return NextResponse.json({success: false, error: error.message }, {status: 412})
        }

        await updateSavingsPlan(userId, requestMonth, request);

        return NextResponse.json(null, { status: 204 });
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({success: false, error}, {status: 500})
    }
}

export async function DELETE (req: NextRequest, { params }: { params: { id: string }}) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ message: "Must be logged in"}, {status: 401})
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);

    let requestMonth = req.nextUrl.searchParams.get("month") || `${new Date().getMonth() + 1}/${new Date().getFullYear()}`

    try {
        const request = await req.json();
        const error = validatePUTFields(request);
        if (error) {
            return NextResponse.json({success: false, error: error.message }, {status: 412})
        }

        await removeSavingsPlan(userId, requestMonth, new mongoose.Types.ObjectId(params.id));

        return NextResponse.json(null, { status: 200 });
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({success: false, error}, {status: 500})
    }
}

const validatePUTFields = (body: PlannedSaving) => {
    const missingFields = [];

    if (body.amount === null || body.amount === undefined) {
        missingFields.push("amount");
    }

    if (!body.account.length) {
        missingFields.push("account");
    }

    if (!body.bucket.length) {
        missingFields.push("bucket");
    }

    if (missingFields.length) {
        return new Error(`The following fields are missing from the request body: ${missingFields.join(", ")}`)
    }

    return null
}