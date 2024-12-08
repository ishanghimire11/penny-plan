import prisma from "@/lib/prisma";
import { Period, TimeFrame } from "@/lib/types";
import { HistoryDataSchema } from "@/schema/history-data";

import { currentUser } from "@clerk/nextjs/server";

import { getDaysInMonth } from "date-fns";

import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get("timeframe");
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  const queryParams = HistoryDataSchema.safeParse({
    timeframe,
    month,
    year,
  });

  if (!queryParams.success) {
    return NextResponse.json(queryParams.error.message, {
      status: 400,
    });
  }

  const data = await getHistoryData(user.id, queryParams.data.timeframe, {
    year: queryParams.data.year,
    month: queryParams.data.month,
  });

  return NextResponse.json(data, {
    status: 200,
  });
}

export type GetHistoryPeriodReturnType = Awaited<
  ReturnType<typeof getHistoryData>
>;

const getHistoryData = async (
  userId: string,
  timeframe: TimeFrame,
  period: Period
) => {
  switch (timeframe) {
    case "month":
      return await getMonthHistoryData(userId, period.year, period.month);
    case "year":
      return await getYearHistoryData(userId, period.year);
    default:
      throw new Error("Invalid timeframe");
  }
};

type HistoryData = {
  year: number;
  income: number;
  expense: number;
  month: number;
  day?: number;
};

async function getYearHistoryData(userId: string, year: number) {
  const result = await prisma.yearHistory.groupBy({
    by: ["month"],
    where: {
      userId,
      year,
    },
    _sum: {
      income: true,
      expense: true,
    },
    orderBy: {
      month: "asc",
    },
  });

  console.log(result, "result result month");

  if (!result || result.length === 0) {
    return [];
  }

  const history: HistoryData[] = [];

  for (let i = 0; i < 12; i++) {
    let income = 0;
    let expense = 0;

    const month = result.find((row) => row.month === i);
    if (month) {
      expense = month._sum.expense || 0;
      income = month._sum.income || 0;
    }
    history.push({
      year,
      month: i,
      expense,
      income,
    });
  }
  return history;
}

async function getMonthHistoryData(
  userId: string,
  year: number,
  month: number
) {
  const result = await prisma.monthHistory.groupBy({
    by: ["day"],
    where: {
      userId,
      year,
      month,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: {
      day: "asc",
    },
  });

  const history: HistoryData[] = [];

  const daysInMonth = getDaysInMonth(new Date(year, month));

  for (let i = 1; i <= daysInMonth; i++) {
    let expense = 0;
    let income = 0;

    const day = result.find((row) => row.day === i);

    if (day) {
      expense = day._sum.expense || 0;
      income = day._sum.income || 0;
    }

    history.push({
      year,
      month,
      day: i,
      expense,
      income,
    });
  }

  return history;
}
