"use client";

import { useWishlist } from "@/context/WishlistContext";
import { flyToElement } from "@/utils/flyToElement";

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

const WishlistButton = ({ productId, className = "" }: WishlistButtonProps) => {
  const { isInWishlist, toggle } = useWishlist();
  const inWishlist = isInWishlist(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Fly animation only when adding (not removing)
    if (!inWishlist) {
      flyToElement(
        e.currentTarget as HTMLElement,
        "header-wishlist-icon",
      );
    }

    toggle(productId);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={inWishlist ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
      className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110 ${
        inWishlist
          ? "text-red-500 hover:text-red-400"
          : "text-gray-400 hover:text-red-500"
      } ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={inWishlist ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
};

export default WishlistButton;
