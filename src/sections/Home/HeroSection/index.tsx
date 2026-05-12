import React from "react";
import Categories from "./SidebarCategoryList";
import HeroBanner from "./HeroBanner";
import CategoriesCard from "./CategoriesCard";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import type { Banner } from "@/lib/api/services/bannerService";

interface IHeroSection {
  categories: Category[];
  featuredProducts: Product[];
  banners: Banner[];
}

const HeroSection = ({ categories, banners }: IHeroSection) => {
  const firstBannerImage = banners[0]?.image;

  return (
    <section className="space-y-4 sm:space-y-5">
      {/* Preload LCP image — banner is inside Swiper (client component) so browser discovers it late */}
      {firstBannerImage && (
        <link
          rel="preload"
          as="image"
          href={`/_next/image?url=${encodeURIComponent(firstBannerImage)}&w=1920&q=75`}
          fetchPriority="high"
        />
      )}

      {/* Hero area — banner full width with sidebar overlay on desktop */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 6px 32px rgba(0,0,0,0.08)" }}
      >
        {/* Banner — full width */}
        <HeroBanner banners={banners} />

        {/* Sidebar categories — glassmorphism overlay on desktop */}
        <div className="absolute inset-y-0 left-0 w-[260px] @5xl:block hidden z-10">
          <div className="h-full bg-white/[0.97] backdrop-blur-xl shadow-[4px_0_20px_rgba(0,0,0,0.05)]">
            <Categories categories={categories} />
          </div>
        </div>
      </div>

      {/* Category cards below */}
      <CategoriesCard categories={categories} />
    </section>
  );
};

export default HeroSection;
