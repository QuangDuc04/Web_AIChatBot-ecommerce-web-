import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  const separator = baseUrl.includes("?") ? "&" : "?";
  const getUrl = (p: number) => `${baseUrl}${separator}page=${p}`;

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <Link
        href={currentPage > 1 ? getUrl(currentPage - 1) : "#"}
        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${
          currentPage > 1
            ? "bg-white border border-gray-200 text-gray-500 hover:border-[#1a7a74] hover:text-[#1a7a74] hover:shadow-[0_2px_12px_rgba(26,122,116,0.1)]"
            : "bg-gray-50 text-gray-300 pointer-events-none"
        }`}
      >
        <ChevronLeft size={18} />
      </Link>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
        <Link
          key={num}
          href={getUrl(num)}
          className={`w-10 h-10 flex items-center justify-center rounded-xl text-[14px] font-[600] transition-all duration-300 ${
            num === currentPage
              ? "bg-gradient-to-br from-[#1a7a74] to-[#25998f] text-white shadow-[0_4px_15px_rgba(26,122,116,0.25)]"
              : "bg-white border border-gray-200 text-gray-600 hover:border-[#1a7a74] hover:text-[#1a7a74] hover:shadow-[0_2px_12px_rgba(26,122,116,0.1)]"
          }`}
        >
          {num}
        </Link>
      ))}

      <Link
        href={currentPage < totalPages ? getUrl(currentPage + 1) : "#"}
        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${
          currentPage < totalPages
            ? "bg-white border border-gray-200 text-gray-500 hover:border-[#1a7a74] hover:text-[#1a7a74] hover:shadow-[0_2px_12px_rgba(26,122,116,0.1)]"
            : "bg-gray-50 text-gray-300 pointer-events-none"
        }`}
      >
        <ChevronRight size={18} />
      </Link>
    </div>
  );
}
