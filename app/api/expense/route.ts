import dbConnect from "@/app/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import expenseModel from "@/models/expenseModel";
import mongoose from "mongoose";
import budgetModel from "@/models/budgetModel";

export async function POST(req: NextRequest) {
    const headerUserId = req.headers.get("userId");
    await dbConnect();
    const request = await req.json();
    const error = validatePOSTFields(request);
    if (error) {
        return NextResponse.json({success: false, error: error.message }, {status: 412})
    }
    try {
        const userId = new mongoose.Types.ObjectId(headerUserId || "");
        const expense = await expenseModel.create({
            createdBy: userId,
            updatedBy: userId,
            amount: request.amount,
            category: new mongoose.Types.ObjectId(request.category),
            date: request.date,
            description: request.description,
            account: request.account,
            budgetId: new mongoose.Types.ObjectId(request.budgetId)
        })

        await budgetModel.findByIdAndUpdate(new mongoose.Types.ObjectId(request.budgetId), {
            $push: {expenses: expense._id}
        })

        return NextResponse.json({success: true, data: expense}, {status: 200});
    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, error }, {status: 400})
    }
}

export async function DELETE(req: NextRequest) {
    await dbConnect();
    const userId = req.headers.get("userId");
    const request = await req.json();

    if(!request.expenseId) {
        return NextResponse.json({success: false, error: "No expense ID provided for delete"})
    }

    try {
        const userIdAsObjectId = new mongoose.Types.ObjectId(userId || "");
        const budget = await budgetModel.findOne({owner: userIdAsObjectId})
        if (!budget) {
            return NextResponse.json({success: false, error: "No budget found for user"})
        }

        const expenseId = new mongoose.Types.ObjectId(request.expenseId)
        const expense = await expenseModel.findOneAndDelete({_id: expenseId, budgetId: budget._id})
        if (!expense) {
            return NextResponse.json({success: false, error: "No expense found for delete"})
        }

        await budget.updateOne({
            $pull: {expenses: expense._id}
        })

        await budget.save()

        return NextResponse.json({success: true, data: "Successfuly deleted expense"}, {status: 200});
    } catch (error) {
        return NextResponse.json({success: false, error }, {status: 400})
    }
}

const validatePOSTFields = (body: any) => {
    const missingFields = [];

    if (!body.amount) {
        missingFields.push("amount");
    }

    if (!body.category?.length) {
        missingFields.push("category");
    }

    if (!body.account?.length) {
        missingFields.push("account");
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