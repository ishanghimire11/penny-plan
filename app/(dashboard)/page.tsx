import CreateTranscationDialog from "@/components/CreateTranscationDialog";
import DashboardOverview from "@/components/DashboardOverview";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { MinusIcon, PlusIcon } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userSettings = await prisma.userSettings.findUnique({
    where: { userId: user.id },
  });

  if (!userSettings) {
    redirect("/wizard");
  }

  return (
    <div className="h-full bg-background/10">
      <div className="border-b bg-card">
        <div className="flex flex-wrap items-center justify-between gap-6 py-8 px-4 container mx-auto">
          <p className="text-3xl font-bold">Welcome, {user.firstName}</p>
          <div className="flex items-center gap-4">
            <CreateTranscationDialog
              trigger={
                <Button
                  type="button"
                  variant={"outline"}
                  className="border-emerald-500 bg-emerald-900 hover:bg-emerald-700 font-semibold hover:text-white text-white"
                >
                  New Income <PlusIcon />
                </Button>
              }
              type="income"
            />
            <CreateTranscationDialog
              trigger={
                <Button
                  type="button"
                  variant={"outline"}
                  className="border-red-500 bg-red-900 hover:text-white text-white hover:bg-red-700 font-semibold"
                >
                  New Expense <MinusIcon />
                </Button>
              }
              type="expense"
            />
          </div>
        </div>
      </div>
      <DashboardOverview userSettings={userSettings} />
    </div>
  );
};

export default page;
