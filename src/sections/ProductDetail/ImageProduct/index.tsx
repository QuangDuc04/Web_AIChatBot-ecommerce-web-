"use client";
import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import type { ProductImage } from "@/types/product";
import { Search } from "lucide-react";

const ZOOM_FACTOR = 2.5;

function ZoomableImage({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zooming, setZooming] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden cursor-crosshair"
      onMouseEnter={() => setZooming(true)}
      onMouseLeave={() => setZooming(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Normal image */}
      <div className="flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-gray-50/50 to-white">
        <Image
          src={src}
          alt={alt}
          width={500}
          height={500}
          className="md:h-[400px] sm:h-[340px] h-[260px] w-full object-contain"
          priority
        />
      </div>

      {/* Zoom overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-200 pointer-events-none ${
          zooming ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: `${ZOOM_FACTOR * 100}%`,
          backgroundPosition: `${pos.x}% ${pos.y}%`,
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Lens indicator */}
      {zooming && (
        <div
          className="absolute w-[120px] h-[120px] rounded-full border-2 border-[#1a7a74]/30 pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-none"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            boxShadow: '0 0 0 2000px rgba(255,255,255,0.4), inset 0 0 20px rgba(26,122,116,0.08)',
          }}
        />
      )}

      {/* Hint badge */}
      <div
        className={`absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm rounded-lg px-2.5 py-1 text-[12px] font-[500] text-gray-500 transition-opacity duration-300 ${
          zooming ? "opacity-0" : "opacity-100"
        }`}
      >
        <Search size={12} /> Di chuột để phóng to
      </div>
    </div>
  );
}

const Images = ({ images }: { images: ProductImage[] }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main image with zoom */}
      <div
        className="rounded-2xl overflow-hidden bg-white"
        style={{ boxShadow: '0 2px 8px rgba(26,122,116,0.08), 0 8px 24px rgba(26,122,116,0.06)' }}
      >
        <Swiper
          spaceBetween={10}
          navigation={false}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Thumbs]}
          onSlideChange={(s) => setActiveIndex(s.activeIndex)}
        >
          {images?.map((image, index) => (
            <SwiperSlide key={image.id || index}>
              <ZoomableImage
                src={image.url}
                alt={image.altText || `Product Image ${index + 1}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Dots */}
        {images?.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 pb-3">
            {images.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "w-6 h-1.5 bg-[#1a7a74]"
                    : "w-1.5 h-1.5 bg-gray-200"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images?.length > 1 && (
        <div className="px-1">
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            breakpoints={{
              0: { slidesPerView: 4, spaceBetween: 8 },
              640: { slidesPerView: 5, spaceBetween: 10 },
            }}
            freeMode
            watchSlidesProgress
            modules={[FreeMode, Navigation, Thumbs]}
          >
            {images.map((image, index) => (
              <SwiperSlide key={image.id || index}>
                <div
                  className={`rounded-xl overflow-hidden cursor-pointer transition-all duration-300 bg-white p-1.5 ${
                    index === activeIndex
                      ? "ring-2 ring-[#1a7a74] shadow-[0_2px_12px_rgba(26,122,116,0.15)]"
                      : "ring-1 ring-gray-200 hover:ring-[#1a7a74]/40 hover:shadow-[0_2px_8px_rgba(26,122,116,0.08)]"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.altText || `Thumb ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-[60px] sm:h-[70px] object-contain rounded-lg"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default Images;
