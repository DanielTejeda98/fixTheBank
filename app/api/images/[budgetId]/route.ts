import { authOptions } from "@/config/authOptions";
import { uploadImageToBudget } from "@/controllers/imagesController";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ budgetId: string }>}) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ message: "Must be logged in"}, {status: 401})
    }

    const contentType = req.headers.get("Content-Type");
    if (!contentType) {
        return NextResponse.json({ message: "No Content-Type header found on the request"}, {status: 400})
    }
    const buffer = Buffer.from(await req.arrayBuffer());
    try {
        const { filename, result } = await uploadImageToBudget(buffer, contentType, (await params).budgetId, session.user.id);
        if (result) {
            return NextResponse.json({message: filename}, { status: 201 });
        } else {
            return NextResponse.json({message: "There was an error uploading the file"}, { status: 500 });
        }
    } catch (error) {
        if ((error as Error).message === "Not authorized") {
            return NextResponse.json({message: "User not authorized to perform this action"}, { status: 401 });
        } else if ((error as Error).message === "No budget found for user!") {
            return NextResponse.json({message: "No budget found for user"}, { status: 404 });
        }
        return NextResponse.json({message: (error as Error).message}, { status: 500 });
    }
}