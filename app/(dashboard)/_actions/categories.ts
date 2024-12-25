"use server";

import prisma from "@/lib/prisma";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
  DeleteCategorySchema,
  DeleteCategorySchemaType,
} from "@/schema/categories";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function createCategory(form: CreateCategorySchemaType) {
  const parsedBody = CreateCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("bad request");
  }

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { name, icon, type } = parsedBody.data;

  const existingCategory = await prisma.category.findFirst({
    where: {
      name,
      type,
      userId: user.id,
    },
  });

  if (existingCategory) {
    throw new Error("Category with this name already exists under this type.");
  }

  const category = await prisma.category.create({
    data: { userId: user.id, name, icon, type },
  });

  return category;
}

export async function DeleteCategory(form: DeleteCategorySchemaType) {
  const parsedBody = DeleteCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("bad request");
  }

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return await prisma.category.delete({
    where: {
      name_type_userId: {
        userId: user.id,
        name: parsedBody.data.name,
        type: parsedBody.data.type,
      },
    },
  });
}
