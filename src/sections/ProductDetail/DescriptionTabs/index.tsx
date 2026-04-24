"use client";

import React, { useState } from "react";
import DescriptionProduct from "./DescriptionProduct";
import ReviewsProduct from "./ReviewsProduct";
import type { Product } from "@/types/product";
import { FileText, MessageSquare } from "lucide-react";

const tabs = [
  { id: 1, label: "Thông tin chi tiết", short: "Chi tiết", icon: FileText },
  { id: 2, label: "Đánh giá sản phẩm", short: "Đánh giá", icon: MessageSquare },
];

const DescriptionDetail = ({ product }: { product: Product }) => {
  const [active, setActive] = useState(1);

  return (
    <div
      className="mt-8 bg-white rounded-2xl overflow-hidden"
      style={{ boxShadow: '0 2px 8px rgba(26,122,116,0.06), 0 8px 24px rgba(26,122,116,0.04)' }}
    >
      {/* Tab bar */}
      <div className="flex border-b border-gray-100">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`relative flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 sm:px-8 py-4 text-[14px] sm:text-[15px] font-[600] transition-all duration-300 ${
                isActive ? "text-[#1a7a74]" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <tab.icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.short}</span>

              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-[#1a7a74] to-[#31c9c0] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Content with slide animation */}
      <div className="p-5 sm:p-8" key={active}>
        <div className="animate-[authSlideIn_0.3s_ease-out]">
          {active === 1 && <DescriptionProduct product={product} />}
          {active === 2 && <ReviewsProduct productId={product.id} />}
        </div>
      </div>
    </div>
  );
};

export default DescriptionDetail;
