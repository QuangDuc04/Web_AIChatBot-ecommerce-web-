"use client";

import { useWindowScrollPositions } from "@/hooks/useWindowScrollPositions";
import { ChevronUp } from "lucide-react";

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const ButtonScrollOnTop = () => {
  const { scrollY } = useWindowScrollPositions();
  const show = scrollY > 40;

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-[132px] right-[18px] z-[100] w-11 h-11 rounded-full
        bg-white border border-gray-200 flex items-center justify-center
        text-[#1a7a74] shadow-[0_2px_12px_rgba(0,0,0,0.08)]
        hover:bg-[#1a7a74] hover:text-white hover:border-[#1a7a74] hover:shadow-[0_4px_20px_rgba(26,122,116,0.3)]
        hover:scale-110 active:scale-95
        transition-all duration-300
        ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
      aria-label="Scroll to top"
    >
      <ChevronUp size={20} />
    </button>
  );
};

export default ButtonScrollOnTop;
