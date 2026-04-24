"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import Product from "@/components/Product";
import type { Product as ProductType } from "@/types/product";

interface IPromoProductCard {
  products: ProductType[];
}

const PromoProductCard = ({ products }: IPromoProductCard) => {
  const productPromos = products.filter((p) => p.isFeatured);
  if (!productPromos.length) return null;

  return (
    <Swiper
      className="swiper-section-container xl:min-h-[400px] min-h-[350] w-full"
      modules={[A11y, Autoplay]}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
    >
      {productPromos.map((product) => (
        <SwiperSlide
          key={product.id}
          className="cursor-pointer xl:h-[400px] h-[350px] relative"
        >
          <Product product={product} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default PromoProductCard;
