import {
  TransferDTO,
  transferSchema,
} from "@/app/components/Dashboard/TransferEditorSchema";
import { getUserSessionId } from "@/app/lib/sessionHelpers";
import {
  deleteTransfer,
  updateTransfer,
} from "@/controllers/transferController";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import z from "zod";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserSessionId(req);

  if (userId instanceof NextResponse) {
    return userId;
  }

  const transferId = new mongoose.Types.ObjectId((await params).id);

  try {
    const transferData: Partial<TransferDTO> = transferSchema
      .partial()
      .parse(await req.json());

    const updatedTransfer = await updateTransfer(
      transferData,
      transferId,
      userId
    );

    return NextResponse.json(
      { success: true, data: updatedTransfer },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
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

  const transferId = new mongoose.Types.ObjectId((await params).id);

  try {
    const deletedTransfer = await deleteTransfer(transferId, userId);

    return NextResponse.json(
      { success: true, data: deletedTransfer },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
