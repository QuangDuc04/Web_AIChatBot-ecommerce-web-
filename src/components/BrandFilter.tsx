"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { Brand } from "@/types/brand";
import { Tag, Check } from "lucide-react";

interface IBrandFilter {
  brands: Brand[];
  selectedBrandId?: string;
}

const BrandFilter = ({ brands, selectedBrandId }: IBrandFilter) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const toggle = useCallback(
    (brandId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");

      if (selectedBrandId === brandId) {
        params.delete("brand");
      } else {
        params.set("brand", brandId);
      }

      const qs = params.toString();
      router.push(`${pathname}${qs ? `?${qs}` : ""}`);
    },
    [router, pathname, searchParams, selectedBrandId]
  );

  if (brands.length === 0) return null;

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{ boxShadow: '0 2px 8px rgba(26,122,116,0.06)' }}
    >
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100">
        <Tag size={15} className="text-[#1a7a74]" />
        <h3 className="font-[700] text-[14px] text-gray-800 uppercase tracking-wide">Thương hiệu</h3>
      </div>
      <div className="p-3 space-y-1">
        {brands.map((brand) => {
          const isSelected = selectedBrandId === brand.id;
          return (
            <button
              key={brand.id}
              onClick={() => toggle(brand.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                isSelected
                  ? "bg-[#edf9f8] text-[#1a7a74]"
                  : "hover:bg-gray-50 text-gray-600"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                  isSelected
                    ? "bg-[#1a7a74] text-white"
                    : "border-2 border-gray-300"
                }`}
              >
                {isSelected && <Check size={12} strokeWidth={3} />}
              </div>
              <span className={`text-[14px] ${isSelected ? "font-[600]" : "font-[500]"}`}>
                {brand.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BrandFilter;
