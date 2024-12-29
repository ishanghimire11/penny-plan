import prisma from "@/lib/prisma";

import { currentUser } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

const validator = z.enum(["expense", "income"]).nullable();

export async function GET(request: NextRequest) {
  const user = await currentUser();
  if (!user) {
    NextResponse.json({ message: "Unauthorized", status: 403 });
    return redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const paramType = searchParams.get("type");
  const queryParams = validator.safeParse(paramType);
  if (!queryParams.success) {
    return NextResponse.json(queryParams.error, {
      status: 400,
    });
  }
  const type = queryParams.data;
  const categories = await prisma.category.findMany({
    where: { userId: user.id, ...(type && { type }) },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(categories);
}
