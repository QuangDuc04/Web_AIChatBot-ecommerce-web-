"use client";

import React from "react";
import Image from "next/image";
import { Award, ShieldCheck, Truck, ArrowRight, Headphones } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const features = [
  { icon: Truck, title: "Giao hàng nhanh", subtitle: "Toàn quốc 24/7" },
  { icon: Award, title: "Giá tốt nhất", subtitle: "Cam kết thị trường" },
  { icon: ShieldCheck, title: "Chất lượng cao", subtitle: "Bảo hành uy tín" },
  { icon: Headphones, title: "Hỗ trợ tận tâm", subtitle: "Tư vấn miễn phí" },
];

const WelcomeSection = () => {
  const sectionRef = useScrollAnimation<HTMLElement>();

  return (
    <section ref={sectionRef} className="w-full sm:py-10 py-4">
      {/* Feature strip */}
      <div className="mb-6 sm:mb-10">
        {/* Mobile: 2x2 grid */}
        <div className="grid grid-cols-2 gap-2 sm:hidden">
          {features.map((feature, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white border border-gray-100 shadow-sm"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1a7a74] to-[#2ba69e] flex items-center justify-center flex-shrink-0">
                <feature.icon size={16} className="text-white" />
              </div>
              <div>
                <p className="text-[13px] font-[700] text-gray-800">{feature.title}</p>
                <p className="text-[11px] text-gray-400 font-[500]">{feature.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: grid */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 rounded-2xl bg-white overflow-hidden border border-gray-100/80 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`relative flex items-center gap-4 px-6 py-6 group cursor-default overflow-hidden transition-all duration-500 ease-out hover:bg-gradient-to-r hover:from-[#edf9f8]/60 hover:to-transparent
                ${i % 2 !== 0 ? "border-l border-gray-100/80" : ""}
                ${i === 2 ? "border-t border-gray-100/80 lg:border-t-0 lg:border-l lg:border-gray-100/80" : ""}
                ${i === 3 ? "border-t border-gray-100/80 lg:border-t-0" : ""}
              `}
            >
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-[#1a7a74]/0 group-hover:bg-[#1a7a74]/[0.06] blur-2xl transition-all duration-700 ease-out pointer-events-none" />
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1a7a74] to-[#2ba69e] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:shadow-[0_6px_20px_rgba(26,122,116,0.25)] transition-all duration-500 ease-out">
                <feature.icon size={22} className="text-white group-hover:scale-110 transition-transform duration-500 ease-out" />
              </div>
              <div className="relative">
                <p className="text-[14px] font-bold text-gray-800 group-hover:text-[#1a7a74] transition-colors duration-500 ease-out">
                  {feature.title}
                </p>
                <p className="text-[13px] text-gray-400 group-hover:text-gray-500 font-medium mt-0.5 transition-colors duration-500 ease-out">
                  {feature.subtitle}
                </p>
              </div>
              <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-[#1a7a74] to-[#31c9c0]/0 transition-all duration-700 ease-out" />
            </div>
          ))}
        </div>
      </div>

      {/* About section */}
      <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-10 lg:gap-12 max-w-6xl w-full mx-auto">
        {/* Left image */}
        <div className="lg:w-5/12 w-full flex justify-center">
          <div className="relative w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[440px]">
            {/* Decorative elements — hidden on mobile */}
            <div className="absolute -top-4 -left-4 w-20 h-20 rounded-2xl bg-[#1a7a74]/10 -z-10 hidden sm:block" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-[#1a7a74]/5 -z-10 hidden sm:block" />
            <div className="relative rounded-2xl overflow-hidden" style={{ boxShadow: '0 20px 50px rgba(26,122,116,0.15)' }}>
              <Image
                src="/assets/images/products/combo.png"
                alt="Halo Products"
                width={500}
                height={500}
                className="w-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Right content */}
        <div className="lg:w-7/12 w-full text-center lg:text-left">
          <div className="flex items-center gap-3 mb-3 sm:mb-4 justify-center lg:justify-start">
            <div className="w-8 sm:w-10 h-[3px] bg-[#1a7a74] rounded-full" />
            <span className="text-[13px] sm:text-sm font-[700] text-[#1a7a74] uppercase tracking-[2px]">
              Về chúng tôi
            </span>
          </div>

          <h2 className="text-[22px] sm:text-[26px] md:text-[30px] font-[800] text-gray-900 leading-tight mb-4 sm:mb-6">
            Tiên phong công nghệ xanh
            <br />
            <span className="text-[#1a7a74]">cho cuộc sống an lành</span>
          </h2>

          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            <p className="text-[15px] sm:text-base leading-[1.8] sm:leading-[1.85] text-gray-600">
              <strong className="text-gray-800">Halo</strong> tự hào là đơn vị tiên phong hàng đầu trong lĩnh vực sản xuất và cung cấp các sản phẩm tiêu dùng xanh chất lượng cao. Với đội ngũ nghiên cứu dày dặn kinh nghiệm, chúng tôi không ngừng ứng dụng công nghệ tiên tiến hàng đầu thế giới.
            </p>
            <p className="text-[15px] sm:text-base leading-[1.8] sm:leading-[1.85] text-gray-600">
              Cam kết tạo ra các sản phẩm không chỉ thân thiện với môi trường mà còn đảm bảo sự an toàn và hiệu quả tối ưu cho người tiêu dùng, nâng cao chất lượng sống cho mọi gia đình.
            </p>
          </div>

          <Link href="/lien-he">
            <Button variant="primary" size="md">
              Tìm hiểu thêm
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
