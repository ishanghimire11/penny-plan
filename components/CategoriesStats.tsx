"use client";

import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
import SkeletonWrapper from "./SkeletonWrapper";
import { TransactionType } from "@/lib/types";
import { GetCategoryStatsResponseType } from "@/app/api/stats/categories/route";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Progress } from "./ui/progress";

interface CategoriesCardsProps {
  userSettings: UserSettings;
  to: Date;
  from: Date;
}

const CategoriesStats = ({ userSettings, to, from }: CategoriesCardsProps) => {
  const getCategories = async () => {
    const res = await fetch(
      `/api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(
        to
      )}`
    );
    const data = await res.json();
    return data;
  };

  const statsQuery = useQuery<GetCategoryStatsResponseType>({
    queryKey: ["overview", "stats", "categories", to, from],
    queryFn: getCategories,
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  return (
    <div className="flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type="income"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type="expense"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
    </div>
  );
};

export default CategoriesStats;

const CategoriesCard = ({
  formatter,
  type,
  data,
}: {
  type: TransactionType;
  formatter: Intl.NumberFormat;
  data: GetCategoryStatsResponseType;
}) => {
  const filteredData = data.filter((c) => c.type === type);
  const total = filteredData.reduce(
    (acc, curr) => acc + (curr._sum?.amount || 0),
    0
  );

  return (
    <Card className="h-80 col-span-6 w-full">
      <CardHeader>
        <CardTitle className="grid grid-flow-row justify-between gap-2 text-xl text-muted-foreground md:grid-flow-col">
          {type === "expense" ? "Expense" : "Income"} by category
        </CardTitle>
      </CardHeader>

      <div className="flex items-center justify-between gap-2">
        {filteredData.length === 0 && (
          <div className="h-60 w-full flex flex-col items-center justify-center">
            No Data for the selected period
            <p className="text-sm text-muted-foreground">
              Try selecting a different persiod or adding a new{" "}
              {type === "income" ? "incomes" : "expenses"}
            </p>
          </div>
        )}

        {filteredData.length > 0 && (
          <ScrollArea className="h-60 w-full px-4">
            <div className="flex w-full flex-col gap-6 p-4">
              {filteredData.map((item) => {
                const amount = item._sum.amount || 0;
                const percentage = (amount / total || amount) * 100;
                return (
                  <div className="flex flex-col" key={item.category}>
                    <div className="flex items-center pb-1">
                      <span className="flex items-center text-gray-400">
                        {item.categoryIcon} {item.category}
                      </span>

                      <span className="font-semibold pl-2 text-muted-foreground">
                        ({percentage.toFixed(0)}%)
                      </span>
                      <span className="ml-auto">
                        {formatter.format(amount)}
                      </span>
                    </div>
                    <Progress
                      value={percentage}
                      className={
                        type === "income"
                          ? "[&>*]:bg-emerald-600"
                          : "[&>*]:bg-red-600"
                      }
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
};
