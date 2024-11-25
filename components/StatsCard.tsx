"use client";

import { GetBalanceStatsResponseType } from "@/app/api/stats/balance/route";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useMemo } from "react";
import SkeletonWrapper from "./SkeletonWrapper";
import { TrendingDownIcon, TrendingUpIcon, Wallet2Icon } from "lucide-react";
import { Card } from "./ui/card";
import CountUp from "react-countup";

interface StatsCardsProps {
  userSettings: UserSettings;
  to: Date;
  from: Date;
}

interface StatCardProps {
  formatter: Intl.NumberFormat;
  value: number;
  title: string;
  icon: React.ReactElement;
}

const StatsCard = ({ userSettings, to, from }: StatsCardsProps) => {
  const getStats = async () => {
    const res = await fetch(
      `/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(
        to
      )}&t=${Date.now()}`
    );
    return res.json();
  };

  const statsQuery = useQuery<GetBalanceStatsResponseType>({
    queryKey: ["overview", "stats", to, from],
    queryFn: getStats,
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;
  const balance = income - expense;

  return (
    <div className="relative gap-3 flex w-full flex-wrap md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={income}
          title={"income"}
          icon={
            <TrendingUpIcon className="h-12 w-12 items-center text-emerald-500 bg-emerald-400/10 rounded-md p-1" />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={expense}
          title={"expense"}
          icon={
            <TrendingDownIcon className="h-12 w-12 items-center text-red-500 bg-red-400/10 rounded-md p-1" />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={balance}
          title={"balance"}
          icon={
            <Wallet2Icon className="h-12 w-12 items-center text-indigo-500 bg-indigo-400/10 rounded-md p-1" />
          }
        />
      </SkeletonWrapper>
    </div>
  );
};

export default StatsCard;

function StatCard({ formatter, value, title, icon }: StatCardProps) {
  const formatFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  return (
    <Card className="flex h-24 w-full items-center gap-2 p-4">
      {icon}
      <div className="flex flex-col items-start justify-center gap-0">
        <p className="text-muted-foreground capitalize">{title}</p>
        <CountUp
          preserveValue
          end={value}
          decimals={2}
          redraw={false}
          formattingFn={formatFn}
          className="text-2xl"
        />
      </div>
    </Card>
  );
}
