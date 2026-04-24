"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ACTION_TYPES, ProductItemCart, useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/priceFormatter";
import { UNIT_LABELS } from "@/types/product";
import type { UnitType } from "@/types/product";
import "./styles.scss";
import { ShoppingBag, Trash2, X, Minus, Plus, ArrowRight } from "lucide-react";

interface ISlideCart {
  isOpenCart: boolean;
  handleOpenCart: (isOpen: boolean) => void;
}

const ProductItem = ({ product }: { product: ProductItemCart }) => {
  const { dispatch } = useCart();

  const remove = () => dispatch({ type: ACTION_TYPES.REMOVE_PRODUCT, payload: product.id });
  const updateQty = (qty: number) =>
    dispatch({ type: ACTION_TYPES.UPDATE_QUANTITY, payload: { id: product.id, quantity: qty } });

  return (
    <div className="flex gap-3 p-4 group hover:bg-white rounded-xl transition-colors duration-200">
      {/* Image */}
      <div className="w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
        <Image
          src={product.image}
          alt={product.name}
          width={90}
          height={90}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/san-pham/${product.slug}`}
          className="text-[14px] sm:text-[15px] font-[500] text-gray-800 hover:text-[#1a7a74] transition-colors duration-200 line-clamp-2 leading-snug"
        >
          {product.name}
        </Link>

        <p className="text-[15px] sm:text-[16px] font-[700] text-[#1a7a74] mt-1">
          {formatPrice(product.price)}
          {product.unitLabel && (
            <span className="text-[13px] font-[500] text-gray-400 ml-1">/ {product.unitLabel}</span>
          )}
        </p>
        {product.boxInfo && (
          <p className="text-[12px] text-gray-400 font-[500] mt-0.5">{product.boxInfo}</p>
        )}
        {(!product.price || Number(product.price) === 0) && (
          <p className="text-[12px] text-amber-600 font-[500] mt-0.5">* Liên hệ để được báo giá ưu đãi</p>
        )}

        {/* Unit toggle */}
        {product.hasBoxPricing && product.productUnitType && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-[11px] text-gray-400">Đơn vị:</span>
            <div className="flex rounded-md border border-gray-200 overflow-hidden">
              <button
                type="button"
                onClick={() => dispatch({ type: ACTION_TYPES.UPDATE_UNIT_OF_MEASURE, payload: { id: product.id, buyingUnitType: product.productUnitType! } })}
                className={`px-2 py-0.5 text-[11px] font-semibold transition-all duration-200 ${
                  product.buyingUnitType !== 'thung'
                    ? "bg-[#1a7a74] text-white"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {UNIT_LABELS[product.productUnitType as UnitType] ? UNIT_LABELS[product.productUnitType as UnitType].charAt(0).toUpperCase() + UNIT_LABELS[product.productUnitType as UnitType].slice(1) : "Đơn vị"}
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: ACTION_TYPES.UPDATE_UNIT_OF_MEASURE, payload: { id: product.id, buyingUnitType: 'thung' } })}
                className={`px-2 py-0.5 text-[11px] font-semibold transition-all duration-200 border-l border-gray-200 ${
                  product.buyingUnitType === 'thung'
                    ? "bg-[#1a7a74] text-white"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                Thùng
              </button>
            </div>
          </div>
        )}

        {/* Quantity + Remove */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-0 bg-gray-100 rounded-lg">
            <button
              onClick={() => product.quantity > 1 && updateQty(product.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#1a7a74] transition-colors rounded-l-lg hover:bg-gray-200"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 h-8 flex items-center justify-center text-[14px] font-[600] text-gray-800">
              {product.quantity}
            </span>
            <button
              onClick={() => updateQty(product.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#1a7a74] transition-colors rounded-r-lg hover:bg-gray-200"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            onClick={remove}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

const SlideCart = ({ isOpenCart, handleOpenCart }: ISlideCart) => {
  const { carts } = useCart();
  const openClass = isOpenCart ? "open" : "";

  const totalPrice = carts.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const totalItems = carts.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div>
      <div className={`cart-widget-side ${openClass}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#edf9f8] flex items-center justify-center">
              <ShoppingBag size={18} className="text-[#1a7a74]" />
            </div>
            <div>
              <h3 className="font-[700] text-[16px] text-gray-800">Giỏ hàng</h3>
              {carts.length > 0 && (
                <p className="text-[13px] text-gray-400 font-[500]">{totalItems} sản phẩm</p>
              )}
            </div>
          </div>
          <button
            onClick={() => handleOpenCart(false)}
            aria-label="Đóng giỏ hàng"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 hover:rotate-90 transition-all duration-300"
          >
            <X size={16} />
          </button>
        </div>

        {carts.length > 0 ? (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto px-1 py-2 space-y-1">
              {carts.map((product: ProductItemCart) => (
                <ProductItem key={product.id} product={product} />
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 bg-white px-5 py-4 space-y-4">
              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-gray-500">Tạm tính</span>
                <span className="text-[18px] font-[800] text-[#1a7a74]">{formatPrice(totalPrice)}</span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Link href="/gio-hang" className="flex-1" onClick={() => handleOpenCart(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Xem giỏ hàng
                  </Button>
                </Link>
                <Link href="/thanh-toan" className="flex-1" onClick={() => handleOpenCart(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    Đặt hàng
                    <ArrowRight size={15} />
                  </Button>
                </Link>
              </div>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="w-20 h-20 rounded-full bg-[#edf9f8] flex items-center justify-center mb-5">
              <ShoppingBag size={36} className="text-[#1a7a74]/40" />
            </div>
            <p className="font-[600] text-gray-800 text-[16px] mb-1">Giỏ hàng trống</p>
            <p className="text-[14px] text-gray-500 text-center mb-6">
              Hãy khám phá sản phẩm và thêm vào giỏ hàng nhé!
            </p>
            <Link href="/san-pham" onClick={() => handleOpenCart(false)}>
              <Button variant="primary" size="md">
                Khám phá sản phẩm
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Overlay */}
      <div className={`overlay ${openClass}`} onClick={() => handleOpenCart(false)} />
    </div>
  );
};

export default SlideCart;
