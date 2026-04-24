"use client";

import React from "react";
import Image from "next/image";
import { app } from "@/config/constants";
import { Clock3, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButtons from "../AuthButtons";

const NavbarTop = () => {
  const pathName = usePathname();

  const isActive = (path: string) => pathName === path;

  return (
    <div className="@5xl:block hidden">
      {/* Top utility bar — contact info */}
      <div className="bg-[#0a3d3a] px-16">
        <div className="grid grid-cols-3 items-center h-[34px] text-[11.5px] text-white/60">
          {/* Left: contact items */}
          <div className="flex items-center gap-3">
            <a
              href={`mailto:${app.email}`}
              className="flex items-center gap-1.5 hover:text-white/90 transition"
            >
              <Mail size={12} />
              <span>{app.email}</span>
            </a>
            <span className="text-white/20">|</span>
            <a
              href={`tel:${app.phones?.[0]}`}
              className="flex items-center gap-1.5 hover:text-white/90 transition"
            >
              <Phone size={12} />
              <span>{app.phones?.[0]}</span>
            </a>
          </div>

          {/* Center: welcome */}
          <div className="flex items-center justify-center gap-1.5">
            <span>Chào mừng bạn đến với</span>
            <Image
              src={app.shopLogo}
              alt={app.shopName}
              width={60}
              height={20}
              className="h-[15px] w-auto"
            />
          </div>

          {/* Right: support */}
          <div className="flex items-center justify-end gap-1.5">
            <Clock3 size={12} />
            <span>Hỗ trợ 24/7</span>
          </div>
        </div>
      </div>

      {/* Main nav bar — logo, menu, auth */}
      <div className="flex items-center justify-between h-[56px] bg-gradient-to-r from-[#0e4f4c] to-[#1a7a74] px-16 shadow-md">
        {/* Left: Logo + Navigation */}
        <div className="flex items-center gap-10">
          <Link href="/">
            <Image
              src={app.shopLogo}
              alt="Logo"
              width={150}
              height={40}
              priority
              className="h-[45px] w-auto"
            />
          </Link>
          <ul className="flex items-center gap-1">
            {[
              { href: "/", label: "TRANG CHỦ" },
              { href: "/san-pham", label: "SẢN PHẨM" },
              { href: "/tin-tuc", label: "TIN TỨC" },
              { href: "/lien-he", label: "LIÊN HỆ" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`px-3 py-1.5 rounded-full text-[13px] font-[600] transition-all duration-300 ${
                    isActive(item.href)
                      ? "bg-white/15 text-blue-2"
                      : "text-white hover:bg-white/10 hover:text-blue-2"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Auth buttons */}
        <AuthButtons />
      </div>
    </div>
  );
};

export default NavbarTop;
