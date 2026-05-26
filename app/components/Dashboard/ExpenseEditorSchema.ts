import z from "zod";

export const expenseSchema = z.object({
  amount: z.string().regex(/^[0-9.]*$/),
  account: z.string(),
  category: z.string(),
  description: z.string(),
  date: z.iso.date(),
  borrowFromNextMonth: z.boolean().optional(),
  receiptImage: z.string().optional(),
  receiptImageSrc: z.string().optional(),
  giftTransaction: z.boolean().optional(),
  revealGiftDate: z.iso.date().optional(),
  splitPayments: z.boolean().optional(),
  numberOfPayments: z.number().optional(),
});

export type ExpenseDTO = z.infer<typeof expenseSchema>;
