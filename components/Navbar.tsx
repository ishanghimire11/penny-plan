import React from "react";
import Logo from "./Logo";
import Link from "next/link";
import { Button } from "./ui/button";
import { UserButton } from "@clerk/nextjs";
import { ThemeSwitcherButton } from "./ThemeSwitcher";
import MobileNavbar from "./MobileNavbar";

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
  return (
    <div className="hidden border-b border-separate bg-background md:block">
      <nav className="flex items-center justify-between px-8 w-full">
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-8 w-full">
          <Logo hasLogo={true} />
          <div className="h-full flex items-center gap-x-2">
            <GetNavItems />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <ThemeSwitcherButton />
            <UserButton />
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
              className="font-medium w-full inline-flex justify-start md:items-center md:justify-center"
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
