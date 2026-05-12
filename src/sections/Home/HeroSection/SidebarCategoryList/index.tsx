import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, LayoutGrid } from "lucide-react";
import type { Category } from "@/types/category";

interface ISidebarCategoryList {
  categories: Category[];
}

const SidebarCategoryList = ({ categories }: ISidebarCategoryList) => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3.5 flex items-center gap-2.5 border-b border-gray-100/80">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1a7a74] to-[#25998f] flex items-center justify-center shadow-sm">
          <LayoutGrid size={13} className="text-white" />
        </div>
        <h3 className="text-[#1a7a74] font-semibold text-[14px] tracking-wide uppercase">
          Danh mục sản phẩm
        </h3>
      </div>

      {/* Items */}
      <div className="flex-1 py-1 overflow-y-auto">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/danh-muc/${category.slug}`}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-[#edf9f8] transition-all duration-200 group relative"
          >
            {/* Animated left indicator on hover */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 group-hover:h-[55%] bg-[#1a7a74] rounded-r-full transition-all duration-300 ease-out" />

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#edf9f8] group-hover:bg-[#d6f1ef] flex items-center justify-center shrink-0 transition-colors duration-200 relative overflow-hidden">
                {category.icon ? (
                  <Image
                    src={category.icon}
                    alt={category.name}
                    width={30}
                    height={30}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-base">📦</span>
                )}
              </div>
              <span className="text-[14px] font-medium text-gray-600 group-hover:text-[#1a7a74] transition-colors duration-200">
                {category.name}
              </span>
            </div>
            <ChevronRight
              size={14}
              className="text-gray-300 group-hover:text-[#1a7a74] group-hover:translate-x-0.5 transition-all duration-200"
            />
          </Link>
        ))}
      </div>

      {/* Footer */}
      <Link
        href="/san-pham"
        className="flex items-center justify-center gap-1 py-3 text-[14px] font-semibold text-[#1a7a74] bg-[#edf9f8]/50 hover:bg-[#edf9f8] transition-colors duration-200 border-t border-gray-100/80"
      >
        Xem tất cả sản phẩm
        <ChevronRight size={13} />
      </Link>
    </div>
  );
};

export default SidebarCategoryList;
