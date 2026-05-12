"use client";

import React from "react";
import Image from "next/image";
import { app } from "@/config/constants";
import { ChevronRight, LayoutGrid } from "lucide-react";
import Search from "./Search";
import Cart from "../Cart";
import WishlistIcon from "./WishlistIcon";
import Link from "next/link";
import type { Category } from "@/types/category";

const socials = [
  {
    href: app.facebook,
    icon: "/assets/icons/facebook_icon.png",
    label: "Facebook",
  },
  {
    href: app.zalo,
    icon: "/assets/icons/zalo.webp",
    label: "Zalo",
    rounded: true,
  },
  { href: app.shoppee, icon: "/assets/icons/shopee_icon.png", label: "Shopee" },
  {
    href: app.tiktok,
    icon: "/assets/icons/tiktok_icon.png",
    label: "TikTok",
    rounded: true,
  },
];

const Navbar = ({ categories }: { categories: Category[] }) => {
  return (
    <nav className="@5xl:block hidden sticky top-0 z-20">
      <div
        className="min-h-[56px] xl:px-[80px] px-[50px] bg-gradient-to-r from-[#1a7a74] via-[#1f8a84] to-[#25998f] flex items-center justify-between text-white"
        style={{
          borderRadius: "0 0 28px 28px",
          boxShadow: "0 4px 20px rgba(26,122,116,0.2)",
        }}
      >
        {/* Left — Category dropdown */}
        <div className="group relative">
          <button className="flex items-center gap-2 py-2 px-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-300">
            <LayoutGrid size={16} />
            <span className="text-[14px] font-[600]">Danh mục</span>
          </button>

          {/* Dropdown */}
          <div
            className="absolute top-[48px] left-0 w-[280px] bg-white rounded-xl text-main opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 overflow-hidden"
            style={{
              boxShadow:
                "0 12px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
            }}
          >
            <div className="py-2">
              {categories.map((category, i) => (
                <Link
                  href={`/danh-muc/${category.slug}`}
                  key={category.id}
                  className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-all duration-200 group/item ${i < categories.length - 1
                      ? "border-b border-gray-100/60"
                      : ""
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#edf9f8] flex items-center justify-center group-hover/item:bg-[#d6f1ef] group-hover/item:scale-105 group-hover/item:ring-1 group-hover/item:ring-[#1a7a74]/20 transition-all duration-300">
                      {category.icon ? (
                        <Image
                          src={category.icon}
                          alt={category.name}
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                      ) : (
                        <span className="text-sm">📦</span>
                      )}
                    </div>
                    <span className="text-[14px] font-[500] text-gray-700 group-hover/item:text-[#1a7a74] transition-colors duration-200">
                      {category.name}
                    </span>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-gray-300 group-hover/item:text-[#1a7a74] group-hover/item:translate-x-0.5 transition-all duration-200"
                  />
                </Link>
              ))}
            </div>
            <Link
              href="/san-pham"
              className="block text-center py-3 text-[13px] font-[600] text-[#1a7a74] bg-gray-50/80 hover:bg-[#1a7a74] hover:text-white transition-all duration-300 border-t border-gray-100"
            >
              Xem tất cả sản phẩm
            </Link>
          </div>
        </div>

        {/* Center — Search */}
        <div className="flex-1 max-w-[480px] mx-8">
          <Search />
        </div>

        {/* Right — Social + Actions */}
        <div className="flex items-center gap-1.5">
          {/* Social icons */}
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/15 transition-all duration-300 hover:scale-110"
            >
              <Image
                src={s.icon}
                alt={s.label}
                width={22}
                height={22}
                className={`object-cover ${s.rounded ? "rounded-full" : ""}`}
              />
            </a>
          ))}

          <div className="h-5 w-px bg-white/20 mx-2" />

          {/* Action icons */}
          <WishlistIcon />
          <Cart />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
