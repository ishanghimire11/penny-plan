import { PiggyBankIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const Logo = ({ hasLogo }: { hasLogo: boolean }) => {
  return (
    <Link href="/" className="flex items-center gap-x-2">
      {hasLogo && (
        <PiggyBankIcon className="w-8 h-8 stroke stroke stroke-red-500" />
      )}
      <p className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent font-bold text-2xl">
        Penny Plan
      </p>
    </Link>
  );
};

export default Logo;
