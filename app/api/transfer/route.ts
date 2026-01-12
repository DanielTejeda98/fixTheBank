import {
  TransferDTO,
  transferSchema,
} from "@/app/components/Dashboard/TransferEditorSchema";
import { getUserSessionId } from "@/app/lib/sessionHelpers";
import { createTransfer } from "@/controllers/transferController";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
  const userId = await getUserSessionId(req);
  if (userId instanceof NextResponse) {
    return userId;
  }

  try {
    const transferData: TransferDTO = transferSchema.parse(await req.json());

    const newTransfer = await createTransfer(transferData, userId);

    return NextResponse.json(
      { success: true, data: newTransfer },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error }, { status: 400 });
    }

    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
