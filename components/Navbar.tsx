"use client";

import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import Link from "next/link";
import { Button } from "./ui/button";
import { UserButton } from "@clerk/nextjs";
import { ThemeSwitcherButton } from "./ThemeSwitcher";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";

export const navItems = [
  {
    label: "Dashboard",
    href: "/",
  },
  {
    label: "Transactions",
    href: "/transactions",
  },
  {
    label: "Manage",
    href: "/manage",
  },
];

const Navbar = () => {
  return (
    <div>
      <MobileNavbar />
      <DesktopNavbar />
    </div>
  );
};

function DesktopNavbar() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="hidden border-b border-separate bg-background md:block">
      <nav className="flex items-center justify-between w-full container mx-auto px-4">
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-8 w-full">
          <Logo hasLogo={true} />
          <div className="h-full flex items-center gap-x-2">
            <GetNavItems />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <ThemeSwitcherButton />
            {isClient && <UserButton />}
          </div>
        </div>
      </nav>
    </div>
  );
}

export function GetNavItems() {
  return (
    <div className="flex flex-col md:flex-row  items-center gap-2 w-full">
      {navItems.map((navItem, idx) => {
        return (
          <Link key={idx} href={navItem.href} className="w-full">
            <Button
              variant={"ghost"}
              className="w-full inline-flex justify-start md:items-center md:justify-center font-semibold"
            >
              {navItem.label}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}

export default Navbar;

function MobileNavbar() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex border-r border-separate bg-background md:hidden py-4 px-4">
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
        {isClient && <UserButton />}
      </div>
    </div>
  );
}
