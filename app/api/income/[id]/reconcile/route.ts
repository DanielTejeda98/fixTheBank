import { getUserSessionId } from "@/app/lib/sessionHelpers";
import { reconcileIncome } from "@/controllers/incomeController";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserSessionId(req);
  if (userId instanceof NextResponse) {
    return userId;
  }

  const incomeId = new mongoose.Types.ObjectId((await params).id);
  try {
    const requestBody = await req.json();
    const updatedIncome = await reconcileIncome(
      requestBody.reconciled,
      incomeId,
      userId
    );
    return NextResponse.json(
      {
        message: "Sucessfully reconciled income",
        data: updatedIncome,
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
