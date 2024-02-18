import dbConnect from "@/app/lib/dbConnect";
import userModel, { User } from "@/models/userModel";
import { hash } from "@/app/lib/passwordHasher";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    await dbConnect();
    
    try {
        const users = await userModel.find({})
        return NextResponse.json({success: true, data: users}, {status: 200});
    } catch (error) {
        return NextResponse.json({success: false, error }, {status: 400})
    }
}

export async function POST(req: NextRequest) {

    await dbConnect();
    const request = await req.json();
    const error = validatePOSTFields(request);
    if (error) {
        return NextResponse.json({success: false, error: error.message }, {status: 412})
    }
    try {
        const password = await hash(request.password);
        const user = await userModel.create({
            ...request,
            password
        })
        return NextResponse.json({success: true, data: user}, {status: 200});
    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, error }, {status: 400})
    }
}

const validatePOSTFields = (body: User) => {
    const missingFields = [];
    if (!body.username?.length) {
        missingFields.push("username");
    }

    if (!body.password?.length) {
        missingFields.push("password");
    }

    if (!body.email?.length) {
        missingFields.push("email");
    }

    if (missingFields.length) {
        return new Error(`The following fields are missing from the request body: ${missingFields.join(", ")}`)
    }

    return null
}