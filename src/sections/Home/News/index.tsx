"use client";

import React, { useRef, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Link from "next/link";
import Image from "next/image";

import "swiper/css";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Newspaper,
} from "lucide-react";
import type { News } from "@/types/news";

interface INewsSection {
  news: News[];
}

const FALLBACK_IMAGE = "/assets/images/placeholder.jpg";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const monthNames = [
    "Th01", "Th02", "Th03", "Th04", "Th05", "Th06",
    "Th07", "Th08", "Th09", "Th10", "Th11", "Th12",
  ];
  return { day, month: monthNames[d.getMonth()], year: d.getFullYear() };
}

/* ── Thumbnail with built-in error fallback ── */
function Thumb({
  src,
  alt,
  className,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
}) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_IMAGE);
  const onError = useCallback(() => setImgSrc(FALLBACK_IMAGE), []);
  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      sizes={sizes}
      onError={onError}
      className={className}
    />
  );
}

/* ================================================================
   Featured card — bài viết nổi bật (bài đầu tiên, hiển thị lớn)
   ================================================================ */
function FeaturedCard({ item }: { item: News }) {
  const date = formatDate(item.publishedAt || item.createdAt);

  return (
    <Link
      href={`/tin-tuc/${item.slug}`}
      className="group relative flex flex-col sm:flex-row bg-white rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-1"
      style={{
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)",
      }}
    >
      {/* Image */}
      <div className="relative sm:w-[55%] w-full aspect-[16/10] sm:aspect-auto sm:min-h-[320px] overflow-hidden">
        <Thumb
          src={item.thumbnail || FALLBACK_IMAGE}
          alt={item.title}
          sizes="(max-width: 640px) 100vw, 55vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        {/* Tag */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm">
          <span className="text-[11px] font-bold text-[#1a7a74] uppercase tracking-wide">
            Nổi bật
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="sm:w-[45%] w-full flex flex-col justify-center p-5 sm:p-8 lg:p-10">
        {/* Date */}
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <div className="flex items-center gap-1 text-[#1a7a74]">
            <span className="text-2xl sm:text-3xl font-[800] leading-none">
              {date.day}
            </span>
            <div className="flex flex-col -space-y-0.5">
              <span className="text-[11px] sm:text-[12px] font-bold uppercase leading-tight">
                {date.month}
              </span>
              <span className="text-[11px] sm:text-[12px] font-medium text-gray-400 leading-tight">
                {date.year}
              </span>
            </div>
          </div>
          <div className="w-8 h-px bg-gray-200 ml-1" />
        </div>

        <h3 className="text-lg sm:text-xl lg:text-2xl font-[700] text-gray-900 leading-snug group-hover:text-[#1a7a74] transition-colors duration-300 line-clamp-3">
          {item.title}
        </h3>
        <p className="mt-2 sm:mt-3 text-sm sm:text-[15px] text-gray-500 leading-relaxed line-clamp-3">
          {item.summary}
        </p>

        {/* CTA */}
        <div className="mt-4 sm:mt-6 flex items-center gap-2">
          <span className="inline-flex items-center gap-2 text-sm font-[600] text-[#1a7a74] group-hover:gap-3 transition-all duration-300">
            Đọc bài viết
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </span>
          <div className="h-[2px] w-0 group-hover:w-16 bg-gradient-to-r from-[#1a7a74] to-[#31c9c0] rounded-full transition-all duration-500" />
        </div>
      </div>
    </Link>
  );
}

/* ================================================================
   Small card — các bài viết còn lại trong carousel
   ================================================================ */
function SmallCard({ item }: { item: News }) {
  const date = formatDate(item.publishedAt || item.createdAt);

  return (
    <Link
      href={`/tin-tuc/${item.slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden h-full transition-all duration-400 hover:-translate-y-1.5 hover:shadow-xl"
      style={{
        boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      {/* Image */}
      <div className="relative aspect-[3/2] overflow-hidden">
        <Thumb
          src={item.thumbnail || FALLBACK_IMAGE}
          alt={item.title}
          sizes="(max-width: 480px) 70vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 22vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
        {/* Date badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <div className="bg-[#1a7a74] text-white rounded-lg px-2 py-1 text-center leading-none">
            <span className="block text-[15px] font-[800]">{date.day}</span>
            <span className="block text-[9px] font-[600] uppercase tracking-wider opacity-80">
              {date.month}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <h3 className="font-[600] text-[14px] sm:text-[15px] text-gray-800 line-clamp-2 group-hover:text-[#1a7a74] transition-colors duration-300 leading-snug min-h-[2.6em]">
          {item.title}
        </h3>
        <p className="text-[13px] sm:text-[14px] text-gray-400 line-clamp-2 leading-relaxed mt-2 flex-1">
          {item.summary}
        </p>

        {/* Read more */}
        <div className="mt-3 pt-3 border-t border-gray-100/80">
          <span className="inline-flex items-center gap-1.5 text-[13px] sm:text-[14px] font-[600] text-[#1a7a74] group-hover:gap-2.5 transition-all duration-300">
            Đọc thêm
            <ArrowRight
              size={13}
              className="group-hover:translate-x-0.5 transition-transform duration-300"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ================================================================
   Main section
   ================================================================ */
const NewsSection = ({ news }: INewsSection) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [canNavigate, setCanNavigate] = useState(false);

  if (!news || news.length === 0) return null;

  const featured = news[0];
  const rest = news.slice(1);

  return (
    <section className="sm:py-8 py-4">
      {/* ── Section Header ── */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#1a7a74] to-[#2ba69e] shadow-sm">
            <Newspaper size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="font-[800] text-[18px] sm:text-[22px] text-gray-900 uppercase tracking-wide leading-none">
              Tin tức
            </h2>
            <p className="text-[12px] sm:text-[13px] text-gray-400 font-medium mt-0.5 hidden sm:block">
              Cập nhật thông tin mới nhất
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {canNavigate && (
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                disabled={isBeginning}
                aria-label="Tin trước"
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#1a7a74] hover:text-[#1a7a74] hover:bg-[#1a7a74]/5 transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => swiperRef.current?.slideNext()}
                disabled={isEnd}
                aria-label="Tin tiếp"
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#1a7a74] hover:text-[#1a7a74] hover:bg-[#1a7a74]/5 transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
          <Link
            href="/tin-tuc"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#1a7a74]/20 text-[#1a7a74] text-[14px] font-[600] hover:bg-[#1a7a74] hover:text-white hover:border-[#1a7a74] transition-all duration-300"
          >
            Xem tất cả
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      {/* ── Featured Article ── */}
      <div className="mb-5 sm:mb-6">
        <FeaturedCard item={featured} />
      </div>

      {/* ── Carousel: Remaining Articles ── */}
      {rest.length > 0 && (
        <Swiper
          className="!overflow-hidden"
          modules={[A11y, Autoplay]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setCanNavigate(!swiper.isLocked);
          }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onResize={(swiper) => setCanNavigate(!swiper.isLocked)}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            0: { slidesPerView: 1.4, spaceBetween: 10 },
            480: { slidesPerView: 2, spaceBetween: 12 },
            640: { slidesPerView: 2.3, spaceBetween: 14 },
            768: { slidesPerView: 3, spaceBetween: 16 },
            1024: { slidesPerView: 3.5, spaceBetween: 18 },
            1280: { slidesPerView: 4, spaceBetween: 20 },
          }}
        >
          {rest.map((item) => (
            <SwiperSlide key={item.id} className="!h-auto">
              <SmallCard item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
};

export default NewsSection;
