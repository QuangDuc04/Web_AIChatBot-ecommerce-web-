"use client";

import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Link from "next/link";

import "swiper/css";

import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import ProductCard from "@/components/Product";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const RelatedProductsSection = ({
  category,
  relatedProducts,
}: {
  category: Category;
  relatedProducts: Product[];
}) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  if (!relatedProducts.length) return (
    <section className="mt-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-7 bg-[#1a7a74] rounded-full" />
        <h2 className="font-[800] text-[18px] sm:text-[22px] text-gray-900 uppercase tracking-wide">
          Sản phẩm liên quan
        </h2>
      </div>
      <p className="text-center text-[14px] text-gray-400 py-8">Chưa có sản phẩm liên quan.</p>
    </section>
  );

  return (
    <section className="mt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 bg-[#1a7a74] rounded-full" />
          <h2 className="font-[800] text-[14px] sm:text-[22px] text-gray-900 uppercase tracking-wide">
            Sản phẩm liên quan
          </h2>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              disabled={isBeginning}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#1a7a74] hover:text-[#1a7a74] hover:bg-[#1a7a74]/5 transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              disabled={isEnd}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#1a7a74] hover:text-[#1a7a74] hover:bg-[#1a7a74]/5 transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <Link href={`/danh-muc/${category.slug}`}>
            <Button variant="outline" size="sm">
              Xem tất cả <ChevronRight size={15} />
            </Button>
          </Link>
        </div>
      </div>

      {/* Swiper */}
      <Swiper
        onSwiper={(s) => { swiperRef.current = s; }}
        onSlideChange={(s) => { setIsBeginning(s.isBeginning); setIsEnd(s.isEnd); }}
        modules={[A11y, Autoplay]}
        autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        breakpoints={{
          0: { slidesPerView: 2, spaceBetween: 12 },
          640: { slidesPerView: 3, spaceBetween: 16 },
          1024: { slidesPerView: 4, spaceBetween: 16 },
          1280: { slidesPerView: 5, spaceBetween: 20 },
        }}
      >
        {relatedProducts.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default RelatedProductsSection;
