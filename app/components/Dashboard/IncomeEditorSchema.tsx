import z from "zod";

export const incomeSchema = z.object({
  amount: z.string().regex(/^[0-9.]*$/),
  source: z.string(),
  date: z.iso.date(),
});

export type IncomeDTO = z.infer<typeof incomeSchema>;
