"use client";

import Image from "next/image";
import Link from "next/link";
import { Pagination, A11y, Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import type { Banner } from "@/lib/api/services/bannerService";

interface IHeroBanner {
  banners: Banner[];
}

function HeroBanner({ banners }: IHeroBanner) {
  if (!banners || banners.length === 0) return null;

  const slides = banners.map((b) => ({
    id: b.id,
    image: b.image,
    link: b.link || "#",
    alt: b.title || "banner",
  }));

  return (
    <Swiper
      className="w-full hero-swiper"
      modules={[Pagination, A11y, Autoplay, EffectFade]}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      pagination={{
        clickable: true,
        bulletClass: "hero-bullet",
        bulletActiveClass: "hero-bullet-active",
      }}
      loop
      speed={1200}
    >
      {slides.map((slide, i) => (
        <SwiperSlide key={slide.id}>
          <Link href={slide.link}>
            <div className="relative w-full xl:h-[480px] md:h-[400px] sm:h-[320px] h-[240px] overflow-hidden">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={i === 0}
                className="object-cover hero-ken-burns"
                sizes="100vw"
              />
            </div>
          </Link>
        </SwiperSlide>
      ))}

      {/* Bottom gradient for pagination contrast */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/25 to-transparent z-[5] pointer-events-none" />
    </Swiper>
  );
}

export default HeroBanner;
