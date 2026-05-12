"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import { X, ChevronRight, ChevronDown, Home, ShoppingBag, Printer, Newspaper, Phone } from "lucide-react";
import { app } from "@/config/constants";
import type { Category } from "@/types/category";

interface IContentMobileMenu {
  isShowMenuMobile: boolean;
  handleToggleMenuMobile: () => void;
  categories: Category[];
}

const menuItems = [
  { href: "/", label: "Trang chủ", icon: Home },
  { href: "/san-pham", label: "Sản phẩm", icon: ShoppingBag, hasSubmenu: true },
  { href: "/tin-tuc", label: "Tin tức", icon: Newspaper },
  { href: "/lien-he", label: "Liên hệ", icon: Phone },
];

const ContentMobileMenu = (props: IContentMobileMenu) => {
  const { isShowMenuMobile, handleToggleMenuMobile, categories } = props;
  const [openSubMenu, setOpenSubMenu] = React.useState(false);
  const pathName = usePathname();

  const isActive = (path: string) => pathName === path;

  useEffect(() => {
    if (isShowMenuMobile) {
      document.body.classList.add("!overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isShowMenuMobile]);

  return (
    <div className="relative">
      <div
        className={`w-[85%] max-w-[320px] h-full bg-white fixed top-0 z-50 transition-transform duration-300 ease-out flex flex-col ${
          isShowMenuMobile ? "translate-x-0" : "-translate-x-full"
        } left-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-[60px] bg-gradient-to-r from-[#0e4f4c] to-[#1a7a74] flex-shrink-0">
          <Link href="/" onClick={handleToggleMenuMobile}>
            <Image src={app.shopLogoWhite} alt="Logo" width={100} height={32} className="h-[30px] w-auto" />
          </Link>
          <button
            onClick={handleToggleMenuMobile}
            aria-label="Đóng menu"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/15 active:bg-white/25 transition-colors"
          >
            <X size={18} className="text-white" />
          </button>
        </div>

        {/* Menu items */}
        <nav className="flex-1 overflow-y-auto py-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            if (item.hasSubmenu) {
              return (
                <div key={item.href}>
                  <div className="flex items-center mx-3">
                    <Link
                      href={item.href}
                      onClick={handleToggleMenuMobile}
                      className={`flex-1 flex items-center gap-3 px-3 py-3 rounded-xl text-[14px] font-[600] transition-colors ${
                        active ? "text-[#1a7a74] bg-[#1a7a74]/8" : "text-gray-700 active:bg-gray-50"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${active ? "bg-[#1a7a74]/10" : "bg-gray-100"}`}>
                        <Icon size={16} className={active ? "text-[#1a7a74]" : "text-gray-400"} />
                      </div>
                      {item.label}
                    </Link>
                    <button
                      onClick={() => setOpenSubMenu(!openSubMenu)}
                      aria-label="Mở danh mục con"
                      className="px-3 py-3 text-gray-400 active:bg-gray-50 rounded-lg transition-colors"
                    >
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-300 ${openSubMenu ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>

                  {/* Sub-menu */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-out ${
                      openSubMenu ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="py-1.5 ml-10 mr-4 border-l-2 border-[#1a7a74]/15">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/${category.slug}`}
                          onClick={handleToggleMenuMobile}
                          className="flex items-center gap-2.5 pl-4 pr-5 py-2.5 text-[14px] font-[500] text-gray-500 hover:text-[#1a7a74] active:bg-[#1a7a74]/5 transition-colors rounded-r-lg"
                        >
                          {category.icon ? (
                            <Image src={category.icon} alt={category.name} width={18} height={18} className="object-contain" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1a7a74]/30 flex-shrink-0" />
                          )}
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleToggleMenuMobile}
                className={`flex items-center gap-3 mx-3 px-3 py-3 rounded-xl text-[14px] font-[600] transition-colors ${
                  active ? "text-[#1a7a74] bg-[#1a7a74]/8" : "text-gray-700 active:bg-gray-50"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${active ? "bg-[#1a7a74]/10" : "bg-gray-100"}`}>
                  <Icon size={16} className={active ? "text-[#1a7a74]" : "text-gray-400"} />
                </div>
                {item.label}
                <ChevronRight size={16} className="ml-auto text-gray-300" />
              </Link>
            );
          })}
        </nav>

        {/* Footer contact */}
        <div className="flex-shrink-0 border-t border-gray-100 px-5 py-4">
          <a href={`tel:${app.phones[0].replace(/\./g, '')}`} className="flex items-center gap-3 text-[14px] text-gray-500">
            <div className="w-8 h-8 rounded-lg bg-[#1a7a74]/10 flex items-center justify-center">
              <Phone size={14} className="text-[#1a7a74]" />
            </div>
            <span>Hotline: <span className="font-[600] text-gray-700">{app.phones[0]}</span></span>
          </a>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isShowMenuMobile ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={handleToggleMenuMobile}
      />
    </div>
  );
};

export default ContentMobileMenu;
