import z from "zod";
import { expenseSchema } from "../../Dashboard/ExpenseEditorSchema";
import { incomeSchema } from "../../Dashboard/IncomeEditorSchema";
import { transferSchema } from "../../Dashboard/TransferEditorSchema";

export const templateFormSchema = z
  .object({
    // Template metadata
    name: z.string().min(1, "Template name is required"),
    description: z.string().optional(),

    // Template content
    type: z.enum(["expense", "income", "transfer"]),
    transferSchema: transferSchema.partial().optional(),
    expenseSchema: expenseSchema.partial().optional(),
    incomeSchema: incomeSchema.partial().optional(),
    recurringSettings: z
      .object({
        frequency: z.enum(["daily", "weekly", "biweekly", "monthly", "yearly"]),
        endCondition: z.enum(["never", "afterOccurrences", "onDate"]),
        occurrences: z.number().optional(),
        endDate: z.date().optional(),
      })
      .optional(),
  })
  .refine((data) => {
    switch (data.type) {
      case "expense":
        return (
          !!data.expenseSchema && !data.incomeSchema && !data.transferSchema
        );
      case "income":
        return (
          !!data.incomeSchema && !data.expenseSchema && !data.transferSchema
        );
      case "transfer":
        return (
          !!data.transferSchema && !data.expenseSchema && !data.incomeSchema
        );
      default:
        return false;
    }
  });

export type TemplateSchema = z.infer<typeof templateFormSchema>;
