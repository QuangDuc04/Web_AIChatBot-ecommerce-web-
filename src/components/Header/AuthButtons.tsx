"use client";

import Link from "next/link";
import { Search } from "lucide-react";

const AuthButtons = () => {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/tra-cuu-don-hang"
        className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-[600] text-white border border-white/40 rounded-full hover:bg-white hover:text-[#1a7a74] transition-all duration-300"
      >
        <Search size={15} />
        Tra cứu đơn hàng
      </Link>
    </div>
  );
};

export default AuthButtons;
