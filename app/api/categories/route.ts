import { createCategory } from "@/controllers/categoriesController";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const userId = req.headers.get("userId");
    if (!userId) {
        return NextResponse.json({success: false, error: "No userId found in header" }, {status: 400}); 
    }
    try {
        const requestBody = await req.json();
        const errors = validateFields(requestBody);
        if (errors.length) {
            return NextResponse.json({success: false, error: `The following fields are missing from the request body: ${errors.join(", ")}` }, {status: 400});
        }
        const createdCategory = await createCategory(requestBody.budgetId, userId, requestBody.name);
        
        return NextResponse.json({success: true, data: createdCategory}, {status: 201})
    } catch (error) {
        return NextResponse.json({success: false, error }, {status: 500});
    }
}

function validateFields (body: any): String[] {
    const missingFields: String[] = [];
    if(!body.budgetId) {
        missingFields.push("budgetId")
    }
    if(!body.name) {
        missingFields.push("name")
    }
    return missingFields;
}