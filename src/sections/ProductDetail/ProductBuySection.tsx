"use client";

import React, { useState } from "react";
import type { Product } from "@/types/product";
import { UNIT_LABELS } from "@/types/product";
import { formatPrice } from "@/utils/priceFormatter";
import { Phone } from "lucide-react";
import ActionAddCart from "./ActionAddCart";

type BuyingUnit = "unit" | "box";

const ProductBuySection = ({ product }: { product: Product }) => {
  const hasBoxPricing =
    product.boxPrice != null &&
    product.boxPrice > 0 &&
    product.unitsPerBox != null &&
    product.unitsPerBox > 0 &&
    product.boxSubUnit != null;

  const [buyingUnit, setBuyingUnit] = useState<BuyingUnit>("unit");

  const isContactPrice = !product.price || Number(product.price) === 0;

  // Determine display values based on selected buying unit
  const unitSellingPrice =
    product.comparePrice && product.comparePrice > 0 && product.comparePrice < product.price
      ? Number(product.comparePrice)
      : Number(product.price);
  const effectivePrice =
    buyingUnit === "box" && hasBoxPricing
      ? Number(product.boxPrice)
      : unitSellingPrice;

  const effectiveUnitLabel =
    buyingUnit === "box"
      ? "thùng"
      : product.unitType
        ? UNIT_LABELS[product.unitType]
        : null;

  const hasDiscount =
    buyingUnit === "unit" &&
    !!product.comparePrice &&
    product.comparePrice > 0 &&
    product.comparePrice < product.price;

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.comparePrice!) / product.price) * 100,
      )
    : 0;

  const boxInfoText =
    hasBoxPricing
      ? `${product.unitsPerBox} ${UNIT_LABELS[product.boxSubUnit!]}/thùng`
      : null;

  return (
    <>
      {/* Unit toggle */}
      {hasBoxPricing && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[14px] font-semibold text-gray-600">
            Mua theo:
          </span>
          <div className="flex rounded-xl border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setBuyingUnit("unit")}
              className={`px-4 py-2 text-[14px] font-semibold transition-all duration-200 ${
                buyingUnit === "unit"
                  ? "bg-[#1a7a74] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {product.unitType ? UNIT_LABELS[product.unitType].charAt(0).toUpperCase() + UNIT_LABELS[product.unitType].slice(1) : "Đơn vị"}
            </button>
            <button
              type="button"
              onClick={() => setBuyingUnit("box")}
              className={`px-4 py-2 text-[14px] font-semibold transition-all duration-200 border-l border-gray-200 ${
                buyingUnit === "box"
                  ? "bg-[#1a7a74] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Thùng
              {boxInfoText && (
                <span className="ml-1 text-[12px] opacity-75">
                  ({boxInfoText})
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Price */}
      <div className="flex items-center gap-4 mb-5">
        {isContactPrice ? (
          <span className="inline-flex items-center gap-1.5 text-[16px] sm:text-[18px] font-[700] text-[#1a7a74]">
            <Phone size={16} className="flex-shrink-0" />
            Liên hệ
          </span>
        ) : (
          <>
            <span className="text-[24px] sm:text-[28px] font-[800] text-[#1a7a74]">
              {formatPrice(effectivePrice)}
              {effectiveUnitLabel && (
                <span className="text-[16px] sm:text-[18px] font-[600] text-gray-500 ml-1">
                  / {effectiveUnitLabel}
                </span>
              )}
            </span>
            {hasDiscount && (
              <>
                <span className="text-[16px] text-rose-400/80 line-through decoration-rose-300/60 font-[500]">
                  {formatPrice(product.price)}
                </span>
                <span className="bg-red-500 text-white text-[13px] font-[700] px-2.5 py-0.5 rounded-lg">
                  -{discountPercent}%
                </span>
              </>
            )}
            {buyingUnit === "box" && hasBoxPricing && (
              <span className="text-[14px] text-gray-400 font-[500]">
                ({boxInfoText})
              </span>
            )}
          </>
        )}
      </div>

      {/* Add to cart */}
      <ActionAddCart product={product} buyingUnit={buyingUnit} effectivePrice={effectivePrice} />
    </>
  );
};

export default ProductBuySection;
