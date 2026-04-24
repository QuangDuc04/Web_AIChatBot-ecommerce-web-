"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Tag,
  AlertCircle,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { useCart, ACTION_TYPES } from "@/context/CartContext";
import { formatPrice } from "@/utils/priceFormatter";
import { UNIT_LABELS } from "@/types/product";
import type { UnitType } from "@/types/product";

const FALLBACK_IMAGE = "/assets/images/placeholder.jpg";

const CartSection = () => {
  const { carts, dispatch } = useCart();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    await dispatch({
      type: ACTION_TYPES.UPDATE_QUANTITY,
      payload: { id, quantity },
    });
  };

  const changeUnit = async (id: string, buyingUnitType: string) => {
    await dispatch({
      type: ACTION_TYPES.UPDATE_UNIT_OF_MEASURE,
      payload: { id, buyingUnitType },
    });
  };

  const removeProduct = async (id: string) => {
    setRemovingId(id);
    try {
      await dispatch({ type: ACTION_TYPES.REMOVE_PRODUCT, payload: id });
    } finally {
      setRemovingId(null);
    }
  };

  const itemCount = carts.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = carts.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  /* ── Empty state ── */
  if (carts.length === 0) {
    return (
      <section className="py-16 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 rounded-full bg-[#edf9f8] flex items-center justify-center mb-6">
          <ShoppingBag size={40} className="text-[#1a7a74]" />
        </div>
        <h2 className="text-[22px] font-bold text-gray-800 mb-2">
          Giỏ hàng trống
        </h2>
        <p className="text-[15px] text-gray-500 mb-8 max-w-sm">
          Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm
          của chúng tôi.
        </p>
        <Link href="/san-pham">
          <Button variant="primary" size="md">
            <ArrowLeft size={16} />
            Tiếp tục mua sắm
          </Button>
        </Link>
      </section>
    );
  }

  /* ── Cart with items ── */
  return (
    <section className="py-6 sm:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div>
          <h1 className="text-[22px] sm:text-[28px] font-extrabold text-gray-900">
            Giỏ hàng
          </h1>
          <p className="text-[14px] sm:text-[15px] text-gray-400 mt-0.5">
            {itemCount} sản phẩm trong giỏ hàng
          </p>
        </div>
        <Link
          href="/san-pham"
          className="hidden sm:flex items-center gap-2 text-[14px] font-semibold text-[#1a7a74] hover:text-[#15635e] transition-colors"
        >
          <ArrowLeft size={16} />
          Tiếp tục mua sắm
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 lg:gap-8">
        {/* ── Cart Items ── */}
        <div className="flex-1 space-y-3">
          {carts.map((item) => {
            const isRemoving = removingId === item.id;
            const lineTotal = Number(item.price) * item.quantity;
            const isContactPrice = !item.price || Number(item.price) === 0;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl overflow-hidden border border-gray-100/80 transition-all duration-300 ${
                  isRemoving ? "opacity-40 scale-[0.98]" : ""
                }`}
                style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}
              >
                {/* ── Mobile layout (< sm): stacked ── */}
                <div className="sm:hidden">
                  {/* Top row: image + info */}
                  <div className="flex gap-3 p-3">
                    <Link
                      href={`/${item.slug}`}
                      className="shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gray-50"
                    >
                      <Image
                        src={item.image || FALLBACK_IMAGE}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/${item.slug}`}
                          className="text-[14px] font-semibold text-gray-800 line-clamp-2 leading-snug flex-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeProduct(item.id)}
                          disabled={isRemoving}
                          className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:bg-red-50 hover:text-red-400 transition-all duration-200"
                        >
                          <X size={15} />
                        </button>
                      </div>
                      {isContactPrice ? (
                        <p className="text-[12px] text-amber-600 font-medium mt-1">
                          * Liên hệ báo giá
                        </p>
                      ) : (
                        <>
                          <p className="text-[13px] text-gray-400 mt-1">
                            {formatPrice(item.price)}{item.unitLabel ? ` / ${item.unitLabel}` : ''}
                          </p>
                          {item.boxInfo && (
                            <p className="text-[12px] text-gray-400">{item.boxInfo}</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Unit toggle (mobile) */}
                  {item.hasBoxPricing && item.productUnitType && (
                    <div className="flex items-center gap-2 px-3 pb-2">
                      <span className="text-[12px] text-gray-400">Đơn vị:</span>
                      <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => changeUnit(item.id, item.productUnitType!)}
                          className={`px-2.5 py-1 text-[12px] font-semibold transition-all duration-200 ${
                            item.buyingUnitType !== 'thung'
                              ? "bg-[#1a7a74] text-white"
                              : "bg-white text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {UNIT_LABELS[item.productUnitType as UnitType] ? UNIT_LABELS[item.productUnitType as UnitType].charAt(0).toUpperCase() + UNIT_LABELS[item.productUnitType as UnitType].slice(1) : "Đơn vị"}
                        </button>
                        <button
                          type="button"
                          onClick={() => changeUnit(item.id, 'thung')}
                          className={`px-2.5 py-1 text-[12px] font-semibold transition-all duration-200 border-l border-gray-200 ${
                            item.buyingUnitType === 'thung'
                              ? "bg-[#1a7a74] text-white"
                              : "bg-white text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          Thùng
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Bottom row: quantity + total */}
                  <div className="flex items-center justify-between px-3 pb-3 pt-0">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#1a7a74] hover:bg-[#edf9f8] transition-all disabled:opacity-30"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-9 text-center text-[14px] font-semibold text-gray-800 border-x border-gray-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#1a7a74] hover:bg-[#edf9f8] transition-all"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <span className="text-[16px] font-extrabold text-[#1a7a74]">
                      {formatPrice(lineTotal)}
                    </span>
                  </div>
                </div>

                {/* ── Tablet / Desktop layout (>= sm): horizontal ── */}
                <div className="hidden sm:flex items-center gap-4 md:gap-5 p-4 md:p-5">
                  {/* Image */}
                  <Link
                    href={`/${item.slug}`}
                    className="shrink-0 w-[100px] h-[100px] md:w-[110px] md:h-[110px] rounded-xl overflow-hidden bg-gray-50"
                  >
                    <Image
                      src={item.image || FALLBACK_IMAGE}
                      alt={item.name}
                      width={110}
                      height={110}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Info — takes remaining space */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/${item.slug}`}
                      className="text-[15px] md:text-[16px] font-semibold text-gray-800 hover:text-[#1a7a74] transition-colors line-clamp-2 leading-snug"
                    >
                      {item.name}
                    </Link>
                    {isContactPrice ? (
                      <p className="text-[13px] text-amber-600 font-medium mt-1">
                        * Liên hệ để được báo giá ưu đãi
                      </p>
                    ) : (
                      <>
                        <p className="text-[14px] text-gray-400 mt-1">
                          Đơn giá: {formatPrice(item.price)}{item.unitLabel ? ` / ${item.unitLabel}` : ''}
                        </p>
                        {item.boxInfo && (
                          <p className="text-[13px] text-gray-400">{item.boxInfo}</p>
                        )}
                      </>
                    )}

                    {/* Unit toggle (desktop) */}
                    {item.hasBoxPricing && item.productUnitType && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[13px] text-gray-400">Đơn vị:</span>
                        <div className="flex rounded-xl border border-gray-200 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => changeUnit(item.id, item.productUnitType!)}
                            className={`px-3 py-1.5 text-[13px] font-semibold transition-all duration-200 ${
                              item.buyingUnitType !== 'thung'
                                ? "bg-[#1a7a74] text-white"
                                : "bg-white text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {UNIT_LABELS[item.productUnitType as UnitType] ? UNIT_LABELS[item.productUnitType as UnitType].charAt(0).toUpperCase() + UNIT_LABELS[item.productUnitType as UnitType].slice(1) : "Đơn vị"}
                          </button>
                          <button
                            type="button"
                            onClick={() => changeUnit(item.id, 'thung')}
                            className={`px-3 py-1.5 text-[13px] font-semibold transition-all duration-200 border-l border-gray-200 ${
                              item.buyingUnitType === 'thung'
                                ? "bg-[#1a7a74] text-white"
                                : "bg-white text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            Thùng
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Controls row */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-[#1a7a74] hover:bg-[#edf9f8] transition-all disabled:opacity-30"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-11 text-center text-[14px] font-semibold text-gray-800 border-x border-gray-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-[#1a7a74] hover:bg-[#edf9f8] transition-all"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-[17px] md:text-[18px] font-extrabold text-[#1a7a74]">
                          {formatPrice(lineTotal)}
                        </span>
                        <button
                          onClick={() => removeProduct(item.id)}
                          disabled={isRemoving}
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Order Summary ── */}
        <div className="lg:w-[380px] shrink-0">
          <div
            className="bg-white rounded-2xl p-4 sm:p-6 sticky top-24 border border-gray-100/80"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
          >
            <h2 className="text-[16px] sm:text-[17px] font-bold text-gray-900 mb-4 sm:mb-5">
              Tóm tắt đơn hàng
            </h2>

            {/* Line items summary */}
            <div className="space-y-2.5 mb-4 sm:mb-5">
              {carts.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-[14px] sm:text-[15px]"
                >
                  <span className="text-gray-500 truncate mr-3 max-w-[200px]">
                    {item.name}{" "}
                    <span className="text-gray-400">x{item.quantity}</span>
                  </span>
                  <span className="font-semibold text-gray-800 shrink-0">
                    {formatPrice(Number(item.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 sm:pt-4 space-y-2.5">
              <div className="flex justify-between text-[14px] sm:text-[15px]">
                <span className="text-gray-500">Tạm tính</span>
                <span className="font-semibold text-gray-800">
                  {formatPrice(cartTotal)}
                </span>
              </div>
              <div className="flex justify-between text-[14px] sm:text-[15px]">
                <span className="text-gray-500">Phí vận chuyển</span>
                <span className="font-semibold text-[#1a7a74]">
                  Tính khi thanh toán
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 mt-3 sm:mt-4 pt-3 sm:pt-4">
              <div className="flex justify-between items-center">
                <span className="text-[15px] sm:text-[16px] font-bold text-gray-900">
                  Tổng cộng
                </span>
                <span className="text-[20px] sm:text-[22px] font-extrabold text-[#1a7a74]">
                  {formatPrice(cartTotal)}
                </span>
              </div>
            </div>

            {/* Contact price note */}
            {carts.some((item) => !item.price || Number(item.price) === 0) && (
              <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                <AlertCircle
                  size={15}
                  className="text-amber-500 flex-shrink-0 mt-0.5"
                />
                <p className="text-[12px] sm:text-[13px] text-amber-700 font-medium leading-relaxed">
                  Đơn hàng có sản phẩm cần liên hệ báo giá. Chúng tôi sẽ liên
                  hệ xác nhận giá ưu đãi sau khi bạn đặt hàng.
                </p>
              </div>
            )}

            {/* Checkout button */}
            <Link href="/thanh-toan" className="block mt-4 sm:mt-5">
              <Button variant="primary" size="lg" className="w-full">
                Tiến hành thanh toán
              </Button>
            </Link>

            {/* Trust badges */}
            <div className="mt-4 sm:mt-5 grid grid-cols-3 gap-2">
              {[
                { icon: Truck, label: "Giao nhanh 24h" },
                { icon: ShieldCheck, label: "Bảo đảm chất lượng" },
                { icon: Tag, label: "Giá tốt nhất" },
              ].map((badge, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1.5 text-center py-2"
                >
                  <badge.icon size={16} className="text-[#1a7a74]" />
                  <span className="text-[11px] sm:text-[12px] font-medium text-gray-500 leading-tight">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile continue shopping */}
      <div className="sm:hidden mt-5 text-center">
        <Link
          href="/san-pham"
          className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#1a7a74]"
        >
          <ArrowLeft size={15} />
          Tiếp tục mua sắm
        </Link>
      </div>
    </section>
  );
};

export default CartSection;
