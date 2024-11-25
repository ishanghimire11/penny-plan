"use client";

// import { GetFormatterForCurrency } from "@/lib/helpers";
import { Period, TimeFrame } from "@/lib/types";
import { UserSettings } from "@prisma/client";
import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import HistoryPeriodSelector from "./HistoryPeriodSelector";

const History = ({ userSettings }: { userSettings: UserSettings }) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("month");
  const [period, setPeriod] = useState<Period>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  const b = userSettings;

  // const formatter = useMemo(() => {
  //   return GetFormatterForCurrency(userSettings.currency);
  // }, [userSettings.currency]);

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
      </Card>
    </div>
  );
};

export default History;
