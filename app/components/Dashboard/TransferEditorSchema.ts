import z from "zod";

export const transferSchema = z.object({
  type: z.enum(["withdraw", "deposit"]),
  amount: z.string().regex(/^[0-9.]*$/),
  savingsAccount: z.string(),
  savingsBucket: z.string(),
  name: z.string(),
  date: z.iso.date(),
});

export type TransferDTO = z.infer<typeof transferSchema>;
