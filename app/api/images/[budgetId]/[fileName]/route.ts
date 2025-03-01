import { authOptions } from "@/config/authOptions";
import { getImageFromBudget, uploadImageToBudget } from "@/controllers/imagesController";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ budgetId: string, fileName: string }>}) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ message: "Must be logged in"}, {status: 401})
    }

    try {
        const paramObj = await params;
        const imageResult = await getImageFromBudget(paramObj.fileName, paramObj.budgetId, session.user.id);
        if (imageResult) {
            return new NextResponse(imageResult.decryptedResult, {
                headers: {
                    "Content-Type": imageResult.fileType
                }
            });
        } else {
            return NextResponse.json({message: "There was an error requesting the file"}, { status: 500 });
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