import { currentUser } from "@clerk/nextjs/server";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "@/components/Logo";
import { CurrencyComboBox } from "@/components/CurrencyComboBox";

const page = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  return (
    <div className="container flex flex-col items-center justify-between max-w-2xl">
      <h1 className="text-3xl text-center">
        Welcome,
        <span className="ml-2 font-bold">{user.firstName}!</span>
      </h1>

      <h2 className="mt-2 text-center text-muted-foreground">
        Let&apos;s get started. Select your currency for your transactions.
      </h2>
      <Separator className="my-6" />
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Currency</CardTitle>
          <CardDescription>
            Set your currency for default transactions. You may later change
            these settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CurrencyComboBox />
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
      <Separator className="my-6" />
      <Button type="button" asChild className="w-full font-semibold">
        <Link href="/">I&apos;m finished setting up!</Link>
      </Button>
      <div className="mt-6">
        <Logo hasLogo />
      </div>
    </div>
  );
};

export default page;
