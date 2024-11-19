"use client";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";
import { GetNavItems } from "./Navbar";
import Logo from "./Logo";
import { ThemeSwitcherButton } from "./ThemeSwitcher";
import { UserButton } from "@clerk/nextjs";

export default function MobileNavbar() {
  return (
    <div className="flex border-r border-separate bg-background md:hidden py-4 px-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant={"link"}>
            <MenuIcon className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"}>
          <SheetTitle className="hidden">Navitem</SheetTitle>
          <Logo hasLogo={true} />
          <nav className="mt-6">
            <GetNavItems />
          </nav>
        </SheetContent>
      </Sheet>
      <div>
        <Logo hasLogo={false} />
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <ThemeSwitcherButton />
        <UserButton />
      </div>
    </div>
  );
}
