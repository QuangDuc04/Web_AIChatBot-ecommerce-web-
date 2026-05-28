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

      {/* Hero area — sidebar + banner side-by-side on desktop, banner-only on mobile/tablet */}
      <div
        className="flex rounded-2xl overflow-hidden bg-white"
        style={{ boxShadow: "0 6px 32px rgba(0,0,0,0.08)" }}
      >
        {/* Sidebar categories — fixed width on desktop, hidden on smaller screens */}
        <div className="hidden @5xl:block w-[260px] shrink-0 border-r border-gray-100">
          <Categories categories={categories} />
        </div>

        {/* Banner — takes remaining width */}
        <div className="flex-1 min-w-0">
          <HeroBanner banners={banners} />
        </div>
      </div>

      {/* Category cards below */}
      <CategoriesCard categories={categories} />
    </section>
  );
};

export default HeroSection;
