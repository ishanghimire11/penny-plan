import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await currentUser();
  console.log(user);
  if (!user) {
    NextResponse.json({ message: "Unauthorized", status: 403 });
    return redirect("/sign-in");
  }

  let userSettings = await prisma.userSettings.findUnique({
    where: { userId: user.id },
  });

  if (!userSettings) {
    userSettings = await prisma.userSettings.create({
      data: { userId: user.id, currency: "USD" },
    });
  }

  console.log(userSettings, "server user settings");

  revalidatePath("/");
  return NextResponse.json(userSettings);
}
