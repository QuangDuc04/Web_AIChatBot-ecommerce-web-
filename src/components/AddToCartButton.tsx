"use client";

import { useState } from "react";
import { ACTION_TYPES, useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";
import { UNIT_LABELS } from "@/types/product";
import { ShoppingBag, Check, AlertCircle } from "lucide-react";
import { flyToElement } from "@/utils/flyToElement";

interface IAddToCart {
  product: Product;
  text?: string;
}

const AddToCart = (props: IAddToCart) => {
  const { product, text } = props;
  const { dispatch, handleOpenCartSlider } = useCart();
  const [status, setStatus] = useState<"idle" | "added" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.quantity === 0) return;

    const imageUrl = product.images?.[0]?.url ?? "";

    // Fly animation
    flyToElement(
      e.currentTarget as HTMLElement,
      "header-cart-icon",
      imageUrl,
    );

    try {
      const unitLabel = product.unitType ? UNIT_LABELS[product.unitType] : null;
      const boxInfo = product.unitsPerBox && product.boxSubUnit
        ? `${product.unitsPerBox} ${UNIT_LABELS[product.boxSubUnit]}/thùng`
        : null;

      await dispatch({
        type: ACTION_TYPES.ADD_PRODUCT,
        payload: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          image: imageUrl,
          price: product.comparePrice && product.comparePrice > 0 && product.comparePrice < product.price
            ? product.comparePrice
            : product.price,
          quantity: 1,
          unitLabel,
          boxInfo,
          buyingUnitType: product.unitType,
        },
      });
      setTimeout(() => handleOpenCartSlider(true), 2000);
      setStatus("added");
      setTimeout(() => setStatus("idle"), 1500);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Không thể thêm vào giỏ");
      setTimeout(() => { setStatus("idle"); setErrorMsg(""); }, 3000);
    }
  };

  const bgClass = {
    idle: "bg-gradient-to-br from-[#1a7a74] to-[#25998f] shadow-[0_4px_20px_rgba(26,122,116,0.35)]",
    added: "bg-emerald-500 shadow-[0_4px_20px_rgba(16,185,129,0.4)]",
    error: "bg-red-500 shadow-[0_4px_20px_rgba(239,68,68,0.4)]",
  }[status];

  return (
    <>
      <button
        onClick={addToCart}
        className={`add-to-cart-btn absolute bottom-[52px] sm:bottom-[58px] right-3 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full
          flex items-center justify-center
          opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 translate-y-3 group-hover:translate-y-0
          transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
          active:scale-90 ${bgClass}`}
        aria-label="Thêm vào giỏ hàng"
      >
        <span className="absolute inset-0 rounded-full border-2 border-white/30 scale-100 group-hover:scale-[1.4] opacity-60 group-hover:opacity-0 transition-all duration-700 pointer-events-none" />

        <span className={`text-white transition-all duration-300 ${status !== "idle" ? "scale-0 rotate-90" : "scale-100 rotate-0"}`}>
          <ShoppingBag size={18} />
        </span>
        <span className={`absolute text-white transition-all duration-300 ${status === "added" ? "scale-100 rotate-0" : "scale-0 -rotate-90"}`}>
          <Check size={20} strokeWidth={3} />
        </span>
        <span className={`absolute text-white transition-all duration-300 ${status === "error" ? "scale-100 rotate-0" : "scale-0 -rotate-90"}`}>
          <AlertCircle size={20} />
        </span>

        {text && <span className="text-sm font-[600] text-white ml-1">{text}</span>}
      </button>

      {/* Error toast */}
      {status === "error" && (
        <div className="absolute bottom-[100px] sm:bottom-[108px] right-1 z-30 max-w-[200px] bg-red-500 text-white text-[12px] font-[500] px-3 py-2 rounded-lg shadow-lg leading-tight animate-[authSlideIn_0.2s_ease-out]">
          {errorMsg}
        </div>
      )}
    </>
  );
};

export default AddToCart;
