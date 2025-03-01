import { deleteAccount, updateAccount } from "@/controllers/accountController";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const userId = req.headers.get("userId");
    if (!userId) {
        return NextResponse.json({error: "No user ID" }, {status: 412})
    }
    try {
        const requestBody = await req.json();
        const errors = validateFields(requestBody);
        if (errors.length > 0) {
            return NextResponse.json({error: `The following fields are missing from the request body: ${errors.join(", ")}` }, {status: 400});
        }
        const updatedAccount = await updateAccount((await params).id, userId, requestBody.name);
        if (!updatedAccount) {
            return NextResponse.json({success: false}, {status: 404});
        }

        return NextResponse.json({data: updatedAccount}, {status: 200})
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const userId = req.headers.get("userId");
    if (!userId) {
        return NextResponse.json({error: "No user ID" }, {status: 412})
    }

    try { 
        await deleteAccount((await params).id, userId)

        return NextResponse.json({status: 200})
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

function validateFields (body: any): String[] {
    const missingFields: String[] = [];
    if(!body.name) {
        missingFields.push("name")
    }
    return missingFields;
}