"use server";

import prisma from "@/lib/prisma";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
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
      userId: user.id,
    },
  });

  if (existingCategory) {
    throw new Error("Category with this name already exists.");
  }

  const category = await prisma.category.create({
    data: { userId: user.id, name, icon, type },
  });

  return category;
}
