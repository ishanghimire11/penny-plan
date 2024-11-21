import { z } from "zod";

export const CreateTransactionSchema = z.object({
  amount: z.coerce
    .number({ message: "Enter a valid positive number" })
    .positive()
    .multipleOf(0.1),
  description: z.string().optional(),
  date: z.coerce.date(),
  category: z.string(),
  type: z.union([z.literal("income"), z.literal("expense")]),
});

export type CreateTransactionSchemaType = z.infer<
  typeof CreateTransactionSchema
>;
