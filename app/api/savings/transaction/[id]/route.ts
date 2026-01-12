import {
  deleteSavingsTransaction,
  updateSavingsTransaction,
} from "@/controllers/savingsController";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getUserSessionId } from "@/app/lib/sessionHelpers";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserSessionId(req);
  if (userId instanceof NextResponse) {
    return userId;
  }

  try {
    const request = await req.json();
    const transaction = await updateSavingsTransaction(
      userId,
      (
        await params
      ).id,
      request
    );

    if (!transaction) {
      return NextResponse.json({
        success: false,
        error: "Unable to update transaction!",
      });
    }

    return NextResponse.json(
      { success: true, data: transaction },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserSessionId(req);
  if (userId instanceof NextResponse) {
    return userId;
  }

  try {
    const request = await req.json();
    if (!request.savingsAccountId) {
      return NextResponse.json(
        {
          success: false,
          error: `'savingsAccountId' field missing from body request`,
        },
        { status: 400 }
      );
    }
    const transaction = await deleteSavingsTransaction(
      userId,
      new mongoose.Types.ObjectId(request.savingsAccountId),
      (
        await params
      ).id
    );

    if (!transaction) {
      return NextResponse.json({
        success: false,
        error: "Unable to delete transaction!",
      });
    }

    return NextResponse.json(
      { success: true, data: transaction },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
