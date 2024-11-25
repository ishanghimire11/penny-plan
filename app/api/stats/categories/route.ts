import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";

import { currentUser } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const to = searchParams.get("to");
  const from = searchParams.get("from");

  const queryParams = OverviewQuerySchema.safeParse({ from, to });
  if (!queryParams.success) {
    throw new Error(queryParams.error.message);
  }

  const stats = await getCategotyStats(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  );
  return NextResponse.json(stats);
}

export type GetCategoryStatsResponseType = Awaited<
  ReturnType<typeof getCategotyStats>
>;

const getCategotyStats = async (userId: string, from: Date, to: Date) => {
  const stats = await prisma.transaction.groupBy({
    by: ["type", "category", "categoryIcon"],
    where: {
      userId,
      transactionDate: { gte: from, lte: to },
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });
  console.log(stats, "server stats");
  return stats;
};
