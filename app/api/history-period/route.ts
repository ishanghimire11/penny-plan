import prisma from "@/lib/prisma";

import { currentUser } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const period = await getHistoryPeriod(user.id);
  return NextResponse.json(period);
}

export type GetHistoryPeriodReturnType = Awaited<
  ReturnType<typeof getHistoryPeriod>
>;

async function getHistoryPeriod(userId: string) {
  const result = await prisma.monthHistory.findMany({
    where: { userId: userId },
    select: {
      year: true,
    },
    distinct: ["year"],
    orderBy: { year: "asc" },
  });
  const years = result.map((item) => item.year);
  if (years.length === 0) {
    return [new Date().getFullYear()];
  }
  return years;
}
