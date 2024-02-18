import dbConnect from "@/app/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import budgetModel from "@/models/budgetModel";
import incomeModel from "@/models/incomeModel";

export async function POST(req: NextRequest) {
    const headerUserId = req.headers.get("userId");
    if (!headerUserId) {
        return NextResponse.json({success: false, error: "User ID missing from header." }, {status: 412})
    }
    await dbConnect();
    const request = await req.json();
    const error = validatePOSTFields(request);
    if (error) {
        return NextResponse.json({success: false, error: error.message }, {status: 412})
    }
    try {
        const userId = new mongoose.Types.ObjectId(headerUserId);
        const income = await incomeModel.create({
            createdBy: userId,
            updatedBy: userId,
            amount: request.amount,
            source: request.source,
            date: request.date,
            budgetId: new mongoose.Types.ObjectId(request.budgetId)
        })

        await budgetModel.findByIdAndUpdate(new mongoose.Types.ObjectId(request.budgetId), {
            $push: {income: income._id}
        })

        return NextResponse.json({success: true, data: income}, {status: 200});
    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, error }, {status: 400})
    }
}

export async function DELETE(req: NextRequest) {
    await dbConnect();
    const userId = req.headers.get("userId");
    const request = await req.json();

    if(!request.incomeId) {
        return NextResponse.json({success: false, error: "No income ID provided for delete"})
    }

    try {
        const userIdAsObjectId = new mongoose.Types.ObjectId(userId || "");
        const budget = await budgetModel.findOne({owner: userIdAsObjectId})
        if (!budget) {
            return NextResponse.json({success: false, error: "No budget found for user"})
        }

        const incomeId = new mongoose.Types.ObjectId(request.incomeId)
        const income = await incomeModel.findOneAndDelete({_id: incomeId, budgetId: budget._id})
        if (!income) {
            return NextResponse.json({success: false, error: "No income found for delete"})
        }

        await budget.updateOne({
            $pull: {income: income._id}
        })

        await budget.save()

        return NextResponse.json({success: true, data: "Successfuly deleted income"}, {status: 200});
    } catch (error) {
        return NextResponse.json({success: false, error }, {status: 400})
    }
}

const validatePOSTFields = (body: any) => {
    const missingFields = [];

    if (!body.amount) {
        missingFields.push("amount");
    }

    if (!body.source?.length) {
        missingFields.push("source");
    }

    if (!body.date?.length) {
        missingFields.push("date");
    }

    if(!body.budgetId?.length) {
        missingFields.push("budgetId");
    }

    if (missingFields.length) {
        return new Error(`The following fields are missing from the request body: ${missingFields.join(", ")}`)
    }

    return null
}