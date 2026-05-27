import { Suspense } from "react";
import HeroSection from "@/sections/Home/HeroSection";
import WelcomeSection from "@/sections/Home/Welcome";
import WhyChooseUs from "@/sections/Home/WhyChooseUs";
import RegisterPromotions from "@/sections/Home/RegisterPromotions";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import FlashSaleWrapper from "@/sections/Home/FlashSale/FlashSaleWrapper";
import NewsWrapper from "@/sections/Home/News/NewsWrapper";
import { getCategories } from "@/lib/api/services/categoryService";
import { getActiveBanners } from "@/lib/api/services/bannerService";
import type { Category } from "@/types/category";
import type { Banner } from "@/lib/api/services/bannerService";

export const revalidate = 600; // 10 minutes ISR

function SectionSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/4" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default async function Home() {
  // Only fetch critical above-fold data — rest streams via Suspense
  const ALLOWED_SLUGS = ['dien-thoai', 'laptop', 'may-tinh-bang'];

  const [categories, banners] = await Promise.all([
    getCategories().catch((): Category[] => []),
    getActiveBanners().catch((): Banner[] => []),
  ]);

  const filteredCategories = categories.filter(c => ALLOWED_SLUGS.includes(c.slug));

  return (
    <main className="container space-y-6 sm:space-y-8 pb-8">
      <HeroSection
        categories={filteredCategories}
        featuredProducts={[]}
        banners={banners}
      />
      <AnimateOnScroll animation="fade-up">
        <WelcomeSection />
      </AnimateOnScroll>
      <Suspense fallback={<SectionSkeleton />}>
        <FlashSaleWrapper categories={filteredCategories} />
      </Suspense>
      <AnimateOnScroll animation="fade-up">
        <WhyChooseUs />
      </AnimateOnScroll>
      <AnimateOnScroll animation="scale-in">
        <RegisterPromotions />
      </AnimateOnScroll>
      <Suspense fallback={<SectionSkeleton />}>
        <NewsWrapper />
      </Suspense>
    </main>
  );
}
