import { authOptions } from "@/config/authOptions";
import { addSavingsPlan, getSavingsPlannerByMonth } from "@/controllers/savingsController";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { PlannedSaving } from "@/types/savings";

export async function GET (req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ message: "Must be logged in"}, {status: 401})
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);

    const requestMonth = req.nextUrl.searchParams.get("month") || `${new Date().getMonth() + 1}/1/${new Date().getFullYear().toString().slice(2)}`

    try {
        const plannedSavings = await getSavingsPlannerByMonth(userId, requestMonth);

        if (!plannedSavings) {
            return NextResponse.json({success: false, error: "No savings found!"}, { status: 404 });
        }

        return NextResponse.json(plannedSavings, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({success: false, error}, {status: 500})
    }
}

export async function POST (req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ message: "Must be logged in"}, {status: 401})
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);

    let requestMonth = req.nextUrl.searchParams.get("month") || `${new Date().getMonth() + 1}/1/${new Date().getFullYear().toString().slice(2)}`

    try {
        const request = await req.json();
        const error = validatePOSTFields(request);
        if (error) {
            return NextResponse.json({success: false, error: error.message }, {status: 412})
        }

        await addSavingsPlan(userId, requestMonth, request);

        return NextResponse.json(null, { status: 201 });
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({success: false, error}, {status: 500})
    }
}

const validatePOSTFields = (body: PlannedSaving) => {
    const missingFields = [];

    if (body.amount === null || body.amount === undefined) {
        missingFields.push("amount");
    }

    if (!body.account.length) {
        missingFields.push("account");
    }

    if (!body.bucket.length) {
        missingFields.push("bucket")
    }

    if (!body.description.length) {
        missingFields.push("description")
    }

    if (missingFields.length) {
        return new Error(`The following fields are missing from the request body: ${missingFields.join(", ")}`)
    }

    return null
}