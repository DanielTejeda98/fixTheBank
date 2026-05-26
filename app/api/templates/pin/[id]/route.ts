import { getUserSessionId } from "@/app/lib/sessionHelpers";
import {
  userPinTemplate,
  userUnpinTemplate,
} from "@/controllers/templateController";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getUserSessionId(req);

  if (userId instanceof NextResponse) {
    return userId;
  }

  const templateId = (await params).id as unknown as mongoose.Types.ObjectId;

  try {
    const pinnedTemplate = await userPinTemplate(templateId, userId);

    return NextResponse.json(
      { success: true, data: pinnedTemplate },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An error occurred",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getUserSessionId(req);

  if (userId instanceof NextResponse) {
    return userId;
  }

  const templateId = (await params).id as unknown as mongoose.Types.ObjectId;

  try {
    const pinnedTemplates = await userUnpinTemplate(templateId, userId);
    return NextResponse.json(
      { success: true, data: pinnedTemplates },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An error occurred",
      },
      { status: 500 },
    );
  }
}
