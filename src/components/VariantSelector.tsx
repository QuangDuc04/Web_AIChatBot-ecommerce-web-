"use client";

import { useState, useEffect } from "react";
import type { ProductVariant } from "@/types/product";
import { formatPrice } from "@/utils/priceFormatter";

interface IVariantSelector {
  variants: ProductVariant[];
  onVariantChange: (variant: ProductVariant | null) => void;
}

/**
 * Groups variants by their attribute keys and renders a set of
 * button-selectors per attribute. When all attributes of a variant
 * are chosen, that variant is emitted via onVariantChange.
 */
const VariantSelector = ({ variants, onVariantChange }: IVariantSelector) => {
  // Collect all attribute keys and their possible values
  const attrMap = new Map<string, Set<string>>();
  for (const v of variants) {
    if (!v.attributes) continue;
    for (const [key, val] of Object.entries(v.attributes)) {
      if (!attrMap.has(key)) attrMap.set(key, new Set());
      attrMap.get(key)!.add(val);
    }
  }

  const attrKeys = Array.from(attrMap.keys());

  // Selected attribute values: { [key]: selectedValue }
  const [selected, setSelected] = useState<Record<string, string>>({});

  // Find the variant matching all selected attributes
  useEffect(() => {
    if (attrKeys.length === 0) {
      onVariantChange(null);
      return;
    }

    if (Object.keys(selected).length < attrKeys.length) {
      onVariantChange(null);
      return;
    }

    const match = variants.find((v) => {
      if (!v.attributes) return false;
      return attrKeys.every((k) => v.attributes![k] === selected[k]);
    });

    onVariantChange(match ?? null);
  }, [selected, attrKeys.length, variants, onVariantChange]);

  if (attrKeys.length === 0) return null;

  // Find the matched variant to show its price/stock
  const matched = variants.find((v) => {
    if (!v.attributes) return false;
    return attrKeys.every((k) => v.attributes![k] === selected[k]);
  });

  // Determine which attribute values are out of stock
  function isValueOutOfStock(key: string, value: string): boolean {
    return variants
      .filter((v) => v.attributes?.[key] === value)
      .every((v) => v.quantity === 0);
  }

  return (
    <div className="space-y-3 mt-4">
      {attrKeys.map((key) => (
        <div key={key}>
          <p className="text-sm font-medium text-main mb-1.5 capitalize">{key}:</p>
          <div className="flex flex-wrap gap-2">
            {Array.from(attrMap.get(key)!).map((value) => {
              const isSelected = selected[key] === value;
              const outOfStock = isValueOutOfStock(key, value);
              return (
                <button
                  key={value}
                  onClick={() => {
                    if (!outOfStock) {
                      setSelected((prev) => ({ ...prev, [key]: value }));
                    }
                  }}
                  disabled={outOfStock}
                  className={`px-3 py-1.5 text-sm border rounded-[6px] transition-colors ${
                    isSelected
                      ? "border-blue-main bg-blue-main/10 text-blue-main font-medium"
                      : outOfStock
                      ? "border-gray-200 text-gray-300 cursor-not-allowed line-through"
                      : "border-gray-300 text-main hover:border-blue-1"
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Show matched variant price/stock */}
      {matched && (
        <div className="flex items-center gap-3 mt-2 text-sm">
          {matched.price !== undefined && (
            <span className="font-bold text-blue-1 text-[16px]">
              {formatPrice(matched.price)}
            </span>
          )}
          <span className={matched.quantity > 0 ? "text-green-600" : "text-red-500"}>
            {matched.quantity > 0 ? `Còn ${matched.quantity} sản phẩm` : "Hết hàng"}
          </span>
        </div>
      )}
    </div>
  );
};

export default VariantSelector;
