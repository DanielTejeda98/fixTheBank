import dbConnect from "@/app/lib/dbConnect";
import userModel, { User } from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { verify } from "@/app/lib/passwordHasher";

export async function POST(req: NextRequest) {

    await dbConnect();
    const request = await req.json();
    const error = validatePOSTFields(request);
    if (error) {
        return NextResponse.json({sucess: false, error: error.message }, {status: 412})
    }
    try {
        const user = await userModel.findOne({
            username: request.username
        })
        const isEqual = await verify(request.password, user.password);
        if (isEqual) {
            return NextResponse.json({sucess: true, data: {_id: user._id ,username: user.username, email: user.email}}, {status: 200});
        }
        return NextResponse.json({sucess: false, error: "Not authorized" }, {status: 401})
    } catch (error) {
        return NextResponse.json({sucess: false, error }, {status: 400})
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

    if (missingFields.length) {
        return new Error(`The following fields are missing from the request body: ${missingFields.join(", ")}`)
    }

    return null
}