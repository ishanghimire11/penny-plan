"use client";

import TransactionTable from "@/components/TransactionTable";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { differenceInDays, startOfMonth } from "date-fns";
import React, { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <>
      <div className="border-b bg-card flex justify-between flex-wrap items-center gap-2">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-6 px-4 mx-auto">
          <div className="w-full flex gap-4 items-center justify-between flex-wrap">
            <p className="text-3xl font-bold">Transactions</p>
            <div className="flex items-center gap-3">
              <DateRangePicker
                initialDateFrom={dateRange.from}
                initialDateTo={dateRange.to}
                showCompare={false}
                onUpdate={(values) => {
                  const { from, to } = values.range;
                  if (!from || !to) return;
                  if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                    toast.error(
                      `The selected date range is too large. Adjust within ${MAX_DATE_RANGE_DAYS} days.`
                    );
                    return;
                  }
                  setDateRange({ from, to });
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto py-4">
        <TransactionTable from={dateRange.from} to={dateRange.to} />
      </div>
    </>
  );
};

export default Page;
