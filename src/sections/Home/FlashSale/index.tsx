import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Zap } from "lucide-react";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import type { FlashSale } from "@/types/flashSale";
import ProductCard from "@/components/Product";
import FlashSaleCountdown from "@/components/FlashSaleCountdown";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { formatPrice } from "@/utils/priceFormatter";
import { Button } from "@/components/ui/Button";

const FALLBACK_IMAGE = "/assets/images/placeholder.jpg";

interface IFlashSaleSection {
  categories: Category[];
  products: Product[];
  flashSale?: FlashSale | null;
}

// ---------------------------------------------------------------------------
// Flash sale item card
// ---------------------------------------------------------------------------

function FlashSaleCard({ item }: { item: FlashSale["items"][number] }) {
  const product = item.product;
  const category = product.category;
  const image = product.images?.[0]?.url ?? FALLBACK_IMAGE;
  const soldPercent = item.quantity > 0
    ? Math.min(100, Math.round((item.soldQuantity / item.quantity) * 100))
    : 0;
  const isSoldOut = item.soldQuantity >= item.quantity;

  return (
    <div className="relative rounded-[16px] border-[2px] border-red-200 bg-white overflow-hidden group transition-all duration-300 hover:shadow-xl hover:border-red-400">
      <Link href={`/${category?.slug ?? "san-pham"}/${product.slug}`}>
        {/* Discount badge */}
        <div className="absolute top-2 left-2 bg-red-1 text-white text-xs font-bold px-2 py-1 rounded-[4px] z-10">
          -{Math.round(item.discountPercent)}%
        </div>

        {/* Sold out overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 rounded-[14px]">
            <span className="bg-gray-700 text-white text-sm font-bold px-4 py-2 rounded-full">
              Đã hết
            </span>
          </div>
        )}

        {/* Image */}
        <div className="overflow-hidden rounded-t-[14px] xl:h-[250px] sm:h-[220px] h-[180px] relative">
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Info */}
        <div className="px-3 py-2">
          <h3 className="text-[14px] font-[400] text-blue-1 group-hover:text-red-1 truncate">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mt-1">
            <span className="font-[600] text-red-1 text-[15px]">
              {formatPrice(item.salePrice)}
            </span>
            <span className="text-[12px] text-rose-400/80 line-through decoration-rose-300/60">
              {formatPrice(item.originalPrice)}
            </span>
          </div>

          {/* Sold progress */}
          <div className="mt-2">
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-1 rounded-full transition-all"
                style={{ width: `${soldPercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Đã bán: {item.soldQuantity}/{item.quantity}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main section
// ---------------------------------------------------------------------------

const FlashSaleSection = ({ categories, products, flashSale }: IFlashSaleSection) => {
  // Flash sale view
  if (flashSale && flashSale.items?.length > 0) {
    return (
      <section className="mt-8">
        {/* Header with countdown */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-t-[12px] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-yellow-300 fill-yellow-300" />
            <span className="text-white font-bold text-[18px] uppercase tracking-wide">
              {flashSale.name}
            </span>
          </div>
          <FlashSaleCountdown endDate={flashSale.endDate} />
        </div>

        {/* Items grid */}
        <div className="border border-t-0 border-red-200 rounded-b-[12px] p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {flashSale.items.map((item) => (
              <FlashSaleCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Fallback: products grouped by category
  if (!products || products.length === 0) return null;

  const productsByCategory: Record<string, Product[]> = {};
  for (const product of products) {
    const cid = product.categoryId;
    if (!productsByCategory[cid]) productsByCategory[cid] = [];
    productsByCategory[cid].push(product);
  }

  const categoriesWithProducts = categories.filter(
    (cat) => (productsByCategory[cat.id]?.length ?? 0) > 0
  );

  if (categoriesWithProducts.length === 0) return null;

  return (
    <div className="space-y-10 sm:space-y-14">
      {categoriesWithProducts.map((category) => {
        const categoryProducts = productsByCategory[category.id] ?? [];
        return (
          <AnimateOnScroll key={category.id} animation="fade-up">
            <section>
              <div className="flex items-center justify-between mb-5 sm:mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-7 sm:h-8 bg-[#1a7a74] rounded-full" />
                  <h2 className="font-[800] text-[14px] sm:text-[22px] text-gray-900 uppercase tracking-wide">
                    {category.name}
                  </h2>
                </div>
                <Link href={`/danh-muc/${category.slug}`}>
                  <Button variant="outline" size="sm">
                    Xem tất cả
                    <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {categoryProducts.slice(0, 10).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          </AnimateOnScroll>
        );
      })}
    </div>
  );
};

export default FlashSaleSection;
