"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ACTION_TYPES, useCart, ProductItemCart } from "@/context/CartContext";
import type { Product, ProductVariant } from "@/types/product";
import { UNIT_LABELS } from "@/types/product";
import VariantSelector from "@/components/VariantSelector";
import { useRouter } from "next/navigation";
import { ShoppingBag, Zap, Minus, Plus, AlertCircle } from "lucide-react";

const ActionAddCart = ({
  product,
  buyingUnit = "unit",
  effectivePrice: parentPrice,
}: {
  product: Product;
  buyingUnit?: "unit" | "box";
  effectivePrice?: number;
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [error, setError] = useState("");
  const { dispatch, handleOpenCartSlider } = useCart();
  const router = useRouter();

  const hasVariants = product.variants && product.variants.length > 0;
  const effectivePrice = selectedVariant?.price ?? parentPrice ?? product.price;
  const isContactPrice = !product.price || Number(product.price) === 0;
  const outOfStock = hasVariants
    ? selectedVariant !== null && selectedVariant.quantity === 0
    : product.quantity === 0;

  const isBoxBuying = buyingUnit === "box";
  const unitLabel = isBoxBuying
    ? "thùng"
    : product.unitType
      ? UNIT_LABELS[product.unitType]
      : null;
  const boxInfoStr =
    product.unitsPerBox && product.boxSubUnit
      ? `${product.unitsPerBox} ${UNIT_LABELS[product.boxSubUnit]}/thùng`
      : null;

  const buildCartItem = (): ProductItemCart => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    image: selectedVariant?.image ?? product.images?.[0]?.url ?? "",
    price: effectivePrice,
    quantity,
    unitLabel,
    boxInfo: isBoxBuying ? boxInfoStr : null,
    buyingUnitType: isBoxBuying ? 'thung' : (product.unitType ?? null),
  });

  const addToCart = async (openSlider = true) => {
    if (hasVariants && !selectedVariant) return;
    if (outOfStock) return;
    setError("");
    try {
      await dispatch({ type: ACTION_TYPES.ADD_TO_DETAIL, payload: buildCartItem() });
      if (openSlider) handleOpenCartSlider(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể thêm vào giỏ hàng");
    }
  };

  const buyNow = async () => {
    await addToCart(false);
    if (!error) router.push("/thanh-toan");
  };

  return (
    <>
      {/* Variants */}
      {hasVariants && (
        <div className="mb-5">
          <VariantSelector variants={product.variants} onVariantChange={setSelectedVariant} />
        </div>
      )}

      {/* Quantity */}
      <div className="flex items-center gap-4 mb-5">
        <span className="text-[14px] font-semibold text-gray-600">Số lượng</span>
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
          <button
            disabled={quantity <= 1}
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#1a7a74] hover:bg-[#edf9f8] active:scale-90 transition-all duration-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500"
          >
            <Minus size={15} />
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v) && v >= 1) setQuantity(v);
            }}
            className="w-12 h-10 text-center text-[15px] font-semibold text-gray-800 border-x border-gray-200 bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#1a7a74] hover:bg-[#edf9f8] active:scale-90 transition-all duration-200"
          >
            <Plus size={15} />
          </button>
        </div>
        {product.quantity > 0 ? (
          <span className="text-[14px] text-[#1a7a74] font-medium whitespace-nowrap">
            Còn <strong>{product.quantity}</strong> sản phẩm
          </span>
        ) : (
          <span className="text-[14px] text-red-500 font-semibold">Hết hàng</span>
        )}
      </div>

      {/* Hints / Errors */}
      {hasVariants && !selectedVariant && (
        <p className="text-[14px] text-orange-500 mb-3">Vui lòng chọn phân loại trước khi mua.</p>
      )}
      {error && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl mb-3 animate-[authSlideIn_0.2s_ease-out]">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-[14px] text-red-600 font-[500]">{error}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center gap-3">
        <Button
          onClick={() => addToCart()}
          disabled={outOfStock || (hasVariants && !selectedVariant)}
          variant="outline"
          size="md"
        >
          <ShoppingBag size={17} />
          {outOfStock ? "Hết hàng" : "Thêm vào giỏ"}
        </Button>
        <Button
          onClick={buyNow}
          disabled={outOfStock || (hasVariants && !selectedVariant)}
          variant="primary"
          size="md"
        >
          <Zap size={17} />
          Mua ngay
        </Button>
      </div>
    </>
  );
};

export default ActionAddCart;
