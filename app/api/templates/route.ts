import { templateFormSchema } from "@/app/components/Settings/Templates/TemplateSchema";
import { getUserSessionId } from "@/app/lib/sessionHelpers";
import {
  createTemplate,
  getAllBudgetTemplates,
} from "@/controllers/templateController";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const userId = await getUserSessionId(req);

  if (userId instanceof NextResponse) {
    return userId;
  }

  try {
    const templates = await getAllBudgetTemplates(userId);

    return NextResponse.json(
      { success: true, data: templates },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const userId = await getUserSessionId(req);

  if (userId instanceof NextResponse) {
    return userId;
  }

  const requestBody = await req.json();

  try {
    templateFormSchema.parse(requestBody);
    const createdTemplate = await createTemplate(requestBody, userId);

    return NextResponse.json(
      { success: true, data: createdTemplate },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: z.treeifyError(error).errors },
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
