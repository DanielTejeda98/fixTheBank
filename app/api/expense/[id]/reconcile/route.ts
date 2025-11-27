import { getUserSessionId } from "@/app/lib/sessionHelpers";
import { reconcileExpense } from "@/controllers/expenseController";
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

  const expenseId = new mongoose.Types.ObjectId((await params).id);
  try {
    const requestBody = await req.json();
    const updatedExpense = await reconcileExpense(
      requestBody.reconciled,
      expenseId,
      userId
    );
    return NextResponse.json(
      {
        message: "Sucessfully reconciled expense",
        data: updatedExpense,
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
