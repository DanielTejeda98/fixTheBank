import { getUserSessionId } from "@/app/lib/sessionHelpers";
import { getImageFromBudget } from "@/controllers/imagesController";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ budgetId: string, fileName: string }>}) {
    const userId = await getUserSessionId(req);
    if (userId instanceof NextResponse) {
        return userId;
    }

    try {
        const paramObj = await params;
        const imageResult = await getImageFromBudget(paramObj.fileName, paramObj.budgetId, userId);
        if (imageResult) {
            return new NextResponse(imageResult.decryptedResult as BodyInit, {
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