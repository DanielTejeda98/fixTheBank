import { templateFormSchema } from "@/app/components/Settings/Templates/TemplateSchema";
import { getUserSessionId } from "@/app/lib/sessionHelpers";
import {
  deleteTemplate,
  updateTemplate,
} from "@/controllers/templateController";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getUserSessionId(req);

  if (userId instanceof NextResponse) {
    return userId;
  }

  const templateId = (await params).id as unknown as mongoose.Types.ObjectId;

  const requestBody = await req.json();

  try {
    templateFormSchema.parseAsync(requestBody);

    const updatedTemplate = await updateTemplate(
      requestBody,
      templateId,
      userId,
    );

    return NextResponse.json(
      { success: true, data: updatedTemplate },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues },
        { status: 400 },
      );
    }
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
    await deleteTemplate(templateId, userId);
    return NextResponse.json(
      { success: true, message: "Template deleted successfully" },
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
