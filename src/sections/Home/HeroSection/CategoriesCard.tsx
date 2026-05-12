"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types/category";

interface ICategoriesCard {
  categories: Category[];
}

const CategoriesCard = ({ categories }: ICategoriesCard) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % categories.length);
  }, [categories.length]);

  useEffect(() => {
    if (isPaused || categories.length <= 1) return;
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [isPaused, next, categories.length]);

  if (!categories || categories.length === 0) return null;

  const active = categories[activeIndex];

  return (
    <div
      className="rounded-2xl overflow-hidden bg-white shadow-[0_2px_16px_rgba(0,0,0,0.05)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Banner area with scale transition */}
      <Link
        href={`/danh-muc/${active.slug}`}
        className="relative block h-[140px] sm:h-[190px] lg:h-[220px] overflow-hidden"
      >
        {categories.map((cat, i) => (
          <div
            key={cat.id}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              i === activeIndex
                ? "opacity-100 scale-100"
                : "opacity-0 scale-[1.04] pointer-events-none"
            }`}
          >
            {cat.image ? (
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 100vw, 1200px"
                className="object-cover"
                priority={i === 0}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a7a74] to-[#25998f]" />
            )}
          </div>
        ))}

        {/* Bottom gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
      </Link>

      {/* Tab bar — horizontal scroll */}
      <div className="flex overflow-x-auto hero-scrollbar-none">
        {categories.map((cat, i) => {
          const isActive = i === activeIndex;
          return (
            <Link
              key={cat.id}
              href={`/danh-muc/${cat.slug}`}
              onMouseEnter={() => setActiveIndex(i)}
              className={`relative flex items-center gap-2.5 px-4 py-3 shrink-0 transition-all duration-300
                ${isActive ? "bg-[#edf9f8]" : "bg-white hover:bg-gray-50/80"}
                ${i > 0 ? "border-l border-gray-100/60" : ""}
              `}
            >
              {/* Active top indicator */}
              <div
                className={`absolute top-0 left-0 right-0 h-[2.5px] rounded-b-full transition-all duration-300 ${
                  isActive
                    ? "bg-[#1a7a74] opacity-100"
                    : "bg-transparent opacity-0"
                }`}
              />

              {/* Icon */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                  isActive ? "bg-[#d6f1ef]" : "bg-gray-100"
                }`}
              >
                {cat.icon ? (
                  <Image
                    src={cat.icon}
                    alt=""
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-base">📦</span>
                )}
              </div>

              {/* Name */}
              <span
                className={`text-[14px] sm:text-[15px] font-semibold leading-tight line-clamp-2 whitespace-nowrap transition-colors duration-200 ${
                  isActive ? "text-[#1a7a74]" : "text-gray-500"
                }`}
              >
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesCard;
