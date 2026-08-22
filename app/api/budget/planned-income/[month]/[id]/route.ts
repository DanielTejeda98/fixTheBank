import { getUserSessionId } from "@/app/lib/sessionHelpers";
import { removePlannedIncome } from "@/controllers/budgetController";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; month: string }> },
) {
  const userId = await getUserSessionId(req);
  if (userId instanceof NextResponse) {
    return userId;
  }

  const { month, id } = await params;
  try {
    await removePlannedIncome(
      new mongoose.Types.ObjectId(userId),
      decodeURIComponent(month),
      id,
    );
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const typedError = error as Error;

    if (typedError.message === "No income with ID matches month incomes.") {
      return NextResponse.json({ status: 404 });
    }

    return NextResponse.json({ error: typedError.message }, { status: 500 });
  }
}
