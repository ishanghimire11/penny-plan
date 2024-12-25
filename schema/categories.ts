import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be atleast 3 letters" })
    .max(25, { message: "Name cannot exceed 25 characters" }),
  icon: z.string().max(15),
  type: z.enum(["income", "expense"]),
});

export type CreateCategorySchemaType = z.infer<typeof CreateCategorySchema>;

export const DeleteCategorySchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be atleast 3 letters" })
    .max(25, { message: "Name cannot exceed 25 characters" }),
  type: z.enum(["income", "expense"]),
});

export type DeleteCategorySchemaType = z.infer<typeof DeleteCategorySchema>;
