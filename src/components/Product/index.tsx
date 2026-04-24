import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { UNIT_LABELS } from "@/types/product";
import AddToCart from "../AddToCartButton";
import WishlistButton from "../WishlistButton";
import { formatPrice } from "@/utils/priceFormatter";
import { app } from "@/config/constants";

const FALLBACK_IMAGE = "/assets/images/placeholder.jpg";

const Product = ({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) => {
  const category = product.category;
  if (!category) return null;

  const image0 = product.images?.[0]?.url ?? FALLBACK_IMAGE;
  const image1 = product.images?.[1]?.url ?? image0;
  const isContactPrice = !product.price || Number(product.price) === 0;
  const outOfStock = product.quantity === 0;
  const unitLabel = product.unitType ? UNIT_LABELS[product.unitType] : null;
  const boxInfo = product.unitType === 'thung' && product.unitsPerBox && product.boxSubUnit
    ? `${product.unitsPerBox} ${UNIT_LABELS[product.boxSubUnit]}/thùng`
    : null;

  const hasDiscount =
    !!product.comparePrice &&
    product.comparePrice > 0 &&
    product.comparePrice < product.price;

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.comparePrice!) / product.price) * 100,
      )
    : 0;
  const sellingPrice = hasDiscount ? product.comparePrice! : product.price;

  return (
    <div
      className={`relative bg-white rounded-2xl overflow-hidden group transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_12px_36px_rgba(26,122,116,0.14)] ${outOfStock ? "opacity-80" : ""} ${className}`}
      style={{
        boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.04)',
      }}
    >
      <Link href={`/${category.slug}/${product.slug}`}>
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: '1/1' }}>
          <Image
            src={image0}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${outOfStock ? "grayscale-[30%]" : ""}`}
          />
          <Image
            src={image1}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover product-img-reveal"
          />

          {/* Out of stock overlay */}
          {outOfStock && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center z-[2]">
              <span className="bg-gray-900/75 text-white text-[12px] sm:text-[13px] font-bold px-4 py-1.5 rounded-full backdrop-blur-sm">
                Hết hàng
              </span>
            </div>
          )}

          {/* Discount badge */}
          {hasDiscount && !outOfStock && (
            <div className="absolute top-2.5 left-2.5 z-20">
              <div className="bg-red-500 text-white text-[12px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                -{discountPercent}%
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="relative p-3 sm:p-4">
          <h3 className="text-[14px] sm:text-[15px] font-medium text-gray-800 group-hover:text-[#1a7a74] transition-colors duration-300 line-clamp-2 leading-snug min-h-[2.4em]">
            {product.name}
          </h3>

          <div className="mt-2 sm:mt-2.5">
            {outOfStock || isContactPrice ? (
              <span className="inline-flex items-center gap-1.5 text-[14px] sm:text-[15px] font-bold text-[#1a7a74] bg-[#edf9f8] px-2.5 py-1 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                  <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z" clipRule="evenodd" />
                </svg>
                Liên hệ
              </span>
            ) : (
              <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5">
                <span className="text-[16px] sm:text-[18px] font-extrabold text-[#1a7a74] leading-none">
                  {formatPrice(sellingPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-[12px] sm:text-[13px] text-gray-400 line-through font-medium">
                    {formatPrice(product.price)}
                  </span>
                )}
                {unitLabel && <span className="text-[11px] sm:text-[12px] font-medium text-gray-400">/ {unitLabel}</span>}
                {boxInfo && <span className="text-[11px] sm:text-[12px] font-medium text-gray-400">({boxInfo})</span>}
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Marketplace links + Accent line */}
      <div className="flex items-center justify-between px-3 sm:px-4 pb-3 sm:pb-4">
        <div className="flex items-center gap-1.5">
          <a
            href={app.shoppee}
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-lg bg-[#ee4d2d]/8 flex items-center justify-center hover:bg-[#ee4d2d]/15 hover:scale-110 active:scale-95 transition-all duration-300"
            title="Mua trên Shopee"
          >
            <Image src="/assets/icons/shopee_icon.png" alt="Shopee" width={18} height={18} className="object-contain" />
          </a>
          <a
            href={app.tiktok}
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 hover:scale-110 active:scale-95 transition-all duration-300"
            title="Xem trên TikTok"
          >
            <Image src="/assets/icons/tiktok_icon.png" alt="TikTok" width={18} height={18} className="object-contain rounded-full" />
          </a>
        </div>
        <div className="flex-1 ml-3 h-[2px] rounded-full bg-gray-100 overflow-hidden">
          <div className="h-full w-0 group-hover:w-full bg-gradient-to-r from-[#1a7a74] to-[#31c9c0] transition-all duration-500 ease-out" />
        </div>
      </div>

      {/* Wishlist */}
      <WishlistButton
        productId={product.id}
        className="absolute top-2.5 right-2.5 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100"
      />

      {/* Add to cart — hide if out of stock */}
      {!outOfStock && <AddToCart product={product} />}
    </div>
  );
};

export default Product;
