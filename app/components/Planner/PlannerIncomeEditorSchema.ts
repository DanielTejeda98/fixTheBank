import z from "zod";

export const plannerIncomeEditorSchema = z.object({
  source: z.string(),
  amount: z.string().regex(/^[0-9.]*$/),
});

export type plannerIncomeEditorDTO = z.infer<typeof plannerIncomeEditorSchema>;
