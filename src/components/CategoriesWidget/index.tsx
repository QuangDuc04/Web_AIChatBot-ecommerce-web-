"use client";

import type { Category } from "@/types/category";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, LayoutGrid } from "lucide-react";

interface CategoriesWidgetProps {
  activeCategory?: string;
  categories?: Category[];
}

export default function CategoriesWidget({
  activeCategory,
  categories = [],
}: CategoriesWidgetProps) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a7a74] to-[#25998f] px-5 py-3.5 flex items-center gap-2.5">
        <LayoutGrid size={17} className="text-white/80" />
        <h3 className="text-white font-[600] text-[14px] tracking-wide uppercase">
          Danh mục sản phẩm
        </h3>
      </div>

      {/* Items */}
      <div className="py-1">
        {categories.map((item, i) => {
          const isActive = activeCategory === item.slug;
          return (
            <Link
              key={item.id}
              href={`/danh-muc/${item.slug}`}
              className={`flex items-center justify-between px-5 py-3 transition-colors duration-200 group ${
                isActive
                  ? "bg-[#edf9f8] border-l-[3px] border-[#1a7a74]"
                  : "hover:bg-[#edf9f8] border-l-[3px] border-transparent"
              } ${i < categories.length - 1 ? "border-b border-gray-100/60" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isActive ? "bg-[#d6f1ef]" : "bg-[#edf9f8]"
                  }`}
                >
                  {item.icon ? (
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={30}
                      height={30}
                      className="object-contain"
                    />
                  ) : (
                    <span className="text-sm">📦</span>
                  )}
                </div>
                <span
                  className={`text-[14px] font-[500] transition-colors duration-200 ${
                    isActive
                      ? "text-[#1a7a74] font-[600]"
                      : "text-gray-700 group-hover:text-[#1a7a74]"
                  }`}
                >
                  {item.name}
                </span>
              </div>
              <ChevronRight
                size={14}
                className={`transition-colors duration-200 ${
                  isActive
                    ? "text-[#1a7a74]"
                    : "text-gray-300 group-hover:text-[#1a7a74]"
                }`}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
