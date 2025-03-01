import { deleteCategory, updateCategory } from "@/controllers/categoriesController";
import { NextRequest, NextResponse } from "next/server"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const userId = req.headers.get("userId");
    if (!userId) {
        return NextResponse.json({success: false, error: "No user ID" }, {status: 412})
    }
    try {
        const requestBody = await req.json();
        const errors = validateFields(requestBody);
        if (errors.length > 0) {
            return NextResponse.json({success: false, error: `The following fields are missing from the request body: ${errors.join(", ")}` }, {status: 400});
        }
        const updatedCategory = await updateCategory((await params).id, userId, requestBody.name, requestBody.sortRank, requestBody.date, requestBody.amount);
        if (!updatedCategory) {
            return NextResponse.json({success: false}, {status: 404});
        }

        return NextResponse.json({success: true, data: updatedCategory}, {status: 200})
    } catch (error:any) {
        return NextResponse.json({success: false, error: error.message}, {status: 500})
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const userId = req.headers.get("userId");
    if (!userId) {
        return NextResponse.json({success: false, error: "No user ID" }, {status: 412})
    }

    try { 
        await deleteCategory((await params).id, userId)

        return NextResponse.json({success: true}, {status: 200})
    } catch (error: any) {
        return NextResponse.json({success: false, error: error.message}, {status: 500})
    }
}

function validateFields (body: any): String[] {
    const missingFields: String[] = [];
    if(!body.name) {
        missingFields.push("name")
    }

    if(typeof body.sortRank === "undefined") {
        missingFields.push("sortRank")
    }
    return missingFields;
}