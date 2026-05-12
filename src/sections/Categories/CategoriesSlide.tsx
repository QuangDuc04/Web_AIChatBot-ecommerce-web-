"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import type { Category } from "@/types/category";
import Link from "next/link";

interface CategoriesSlideProps {
  category?: Category;
  categories: Category[];
}

const CategoriesSlide = ({ category, categories }: CategoriesSlideProps) => {
  return (
    <Swiper
      className="@5xl:!hidden block mt-4"
      modules={[A11y]}
      slidesPerView="auto"
      spaceBetween={8}
    >
      {categories.map((item) => {
        const isActive = category?.slug === item.slug;
        return (
          <SwiperSlide key={item.id} className="!w-auto">
            <Link
              href={`/${item.slug}`}
              className={`inline-block px-4 py-2 rounded-full text-[13px] sm:text-[14px] font-[600] whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? "bg-[#1a7a74] text-white shadow-md shadow-[#1a7a74]/20"
                  : "bg-gray-100 text-gray-600 hover:bg-[#1a7a74]/10 hover:text-[#1a7a74]"
              }`}
            >
              {item.name}
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default CategoriesSlide;
