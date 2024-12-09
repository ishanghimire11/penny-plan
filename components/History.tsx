"use client";

import { GetFormatterForCurrency } from "@/lib/helpers";
import { Period, TimeFrame } from "@/lib/types";
import { UserSettings } from "@prisma/client";
import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import HistoryPeriodSelector from "./HistoryPeriodSelector";
import { useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "./SkeletonWrapper";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import CountUp from "react-countup";

const History = ({ userSettings }: { userSettings: UserSettings }) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("month");
  const [period, setPeriod] = useState<Period>({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const getHistory = async () => {
    const response = await fetch(
      `/api/history-data?timeframe=${timeFrame}&year=${period.year}&month=${period.month}`
    );
    const data = await response.json();
    return data;
  };

  const historyDataQuery = useQuery({
    queryKey: ["overview", "history", timeFrame, period],
    queryFn: getHistory,
  });

  const historyData = historyDataQuery.data && historyDataQuery.data.length > 0;

  return (
    <div className="container px-4 mx-auto py-6">
      <h2 className="text-2xl font-bold">History</h2>
      <Card className="col-span-12 w-full mt-12">
        <CardHeader className="gap-2">
          <CardTitle className="grid grid-flow-row justify-between gap-2 md:grid-flow-col">
            <HistoryPeriodSelector
              period={period}
              setPeriod={setPeriod}
              timeFrame={timeFrame}
              setTimeFrame={setTimeFrame}
            />
            <div className="flex h-10 gap-2">
              <Badge
                variant={"outline"}
                className="flex items-center gap-2 text-sm"
              >
                <div className="h-4 w-4 rounded-full bg-emerald-500"></div>
                Income
              </Badge>
              <Badge
                variant={"outline"}
                className="flex items-center gap-2 text-sm"
              >
                <div className="h-4 w-4 rounded-full bg-red-500"></div>
                Expense
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <SkeletonWrapper isLoading={historyDataQuery.isFetching}>
            {historyData && (
              <div>
                <ResponsiveContainer width={"100%"} height={300}>
                  <BarChart
                    height={300}
                    data={historyDataQuery.data}
                    barCategoryGap={5}
                  >
                    <defs>
                      <linearGradient
                        id="incomeBar"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0" stopColor="#10b981" stopOpacity={1} />
                        <stop offset="1" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>

                      <linearGradient
                        id="expenseBar"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0" stopColor="#ef4444" stopOpacity={1} />
                        <stop offset="1" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray={"5 5"}
                      strokeOpacity={0.2}
                      vertical={false}
                    />
                    <XAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      padding={{ left: 5, right: 5 }}
                      dataKey={(data) => {
                        const { year, month, day } = data;
                        const date = new Date(year, month, day || 1);
                        if (timeFrame === "year") {
                          return date.toLocaleDateString("default", {
                            month: "long",
                          });
                        }
                        return date.toLocaleDateString("default", {
                          day: "2-digit",
                        });
                      }}
                    />

                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />

                    <Bar
                      dataKey={"income"}
                      label="Income"
                      fill={"url(#incomeBar)"}
                      radius={4}
                      className="cursor-pointer"
                    />

                    <Bar
                      dataKey={"expense"}
                      label="Expense"
                      fill={"url(#expenseBar)"}
                      radius={4}
                      className="cursor-pointer"
                    />

                    <Tooltip
                      cursor={{ opacity: 0.1 }}
                      content={(props) => (
                        <CustomToolTip formatter={formatter} {...props} />
                      )}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            {!historyData && (
              <Card className="h-[300px] flex flex-col items-center justify-center bg-background">
                No data for the selected period.
                <p className="text-sm text-muted-foreground">
                  Try selecting different period or create new transaction.
                </p>
              </Card>
            )}
          </SkeletonWrapper>
        </CardContent>
      </Card>
    </div>
  );
};

export default History;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomToolTip({ active, formatter, payload }: any) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0].payload;

  const { expense, income } = data;

  return (
    <div className="min-w-[300px] rounded border bg-background p-4">
      <TooltipRow
        formatter={formatter}
        label={"Income"}
        value={income}
        bgColor={"bg-emerald-500"}
        textColor={"text-emerald-500"}
      />

      <TooltipRow
        formatter={formatter}
        label={"Expense"}
        value={expense}
        bgColor={"bg-red-500"}
        textColor={"text-red-500"}
      />

      <TooltipRow
        formatter={formatter}
        label="Balance"
        value={income - expense}
        bgColor={"bg-foreground"}
        textColor={"text-foreground"}
      />
    </div>
  );
}

function TooltipRow({
  formatter,
  label,
  value,
  bgColor,
  textColor,
}: {
  label: string;
  textColor: string;
  value: number;
  bgColor: string;
  formatter: Intl.NumberFormat;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-3 rounded-full w-3", bgColor)}></div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className={cn("text-sm font-bold", textColor)}>
        <CountUp
          duration={0}
          preserveValue
          decimals={0}
          end={value}
          formattingFn={(value) => formatter.format(value)}
          className="text-sm"
        />
      </div>
    </div>
  );
}
