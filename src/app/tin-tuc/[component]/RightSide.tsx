import { getActiveNews } from "@/lib/api/services/newsService";
import { getFeaturedProducts } from "@/lib/api/services/productService";
import { getCategories } from "@/lib/api/services/categoryService";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import CategoriesWidget from "@/components/CategoriesWidget";
import { formatPrice } from "@/utils/priceFormatter";
import { Calendar, Flame, ArrowRight } from "lucide-react";

const FALLBACK_IMAGE = "/assets/images/placeholder.jpg";

const RightSide = async () => {
  const [news, featuredProducts, categories] = await Promise.all([
    getActiveNews().catch(() => []),
    getFeaturedProducts(6).catch(() => []),
    getCategories().catch(() => []),
  ]);

  return (
    <div className="space-y-6">
      <CategoriesWidget categories={categories} />

      {/* Latest articles */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ boxShadow: '0 2px 8px rgba(26,122,116,0.06)' }}
      >
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100">
          <Calendar size={15} className="text-[#1a7a74]" />
          <h3 className="font-[700] text-[14px] text-gray-800 uppercase tracking-wide">Bài viết mới</h3>
        </div>
        <div className="p-3">
          {news
            .filter((item) => item.isActive)
            .slice(0, 5)
            .map((item) => (
              <Link
                key={item.id}
                href={`/tin-tuc/${item.slug}`}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
              >
                <div className="w-[52px] h-[52px] rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  {item.thumbnail && (
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      width={52}
                      height={52}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-[500] text-gray-800 group-hover:text-[#1a7a74] transition-colors duration-200 line-clamp-2 leading-snug">
                    {item.title}
                  </p>
                  <p className="text-[12px] text-gray-400 mt-1">
                    {new Date(item.publishedAt || item.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </div>

      {/* Hot products */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ boxShadow: '0 2px 8px rgba(26,122,116,0.06)' }}
      >
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100">
          <Flame size={15} className="text-orange-500" />
          <h3 className="font-[700] text-[14px] text-gray-800 uppercase tracking-wide">Sản phẩm hot</h3>
        </div>
        <div className="p-3">
          {featuredProducts.map((item) => {
            const slug = item.category?.slug;
            const hasDiscount = !!item.comparePrice && item.comparePrice > item.price;
            return (
              <Link
                key={item.id}
                href={`/${slug}/${item.slug}`}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
              >
                <div className="w-[52px] h-[52px] rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  {item.images?.[0]?.url && (
                    <Image
                      src={item.images[0].url}
                      alt={item.name}
                      width={52}
                      height={52}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-[500] text-gray-800 group-hover:text-[#1a7a74] transition-colors duration-200 line-clamp-1 leading-snug">
                    {item.name}
                  </p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-[14px] font-[700] text-[#1a7a74]">
                      {formatPrice(item.price)}
                    </span>
                    {hasDiscount && (
                      <span className="text-[12px] text-rose-400/80 line-through decoration-rose-300/60">
                        {formatPrice(item.comparePrice ?? undefined)}
                      </span>
                    )}
                  </div>
                </div>
                <ArrowRight size={14} className="text-gray-300 group-hover:text-[#1a7a74] group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RightSide;
