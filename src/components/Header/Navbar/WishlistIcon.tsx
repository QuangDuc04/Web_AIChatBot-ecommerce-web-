"use client";

import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";

const WishlistIcon = () => {
  const { count } = useWishlist();

  return (
    <Link href="/yeu-thich" id="header-wishlist-icon" className="relative cursor-pointer mr-3" aria-label="Yêu thích">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
      {count > 0 && (
        <span className="absolute -top-2 left-4 button-gradient text-white text-[12px] font-[700] w-5 h-5 rounded-full flex items-center justify-center">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
};

export default WishlistIcon;
