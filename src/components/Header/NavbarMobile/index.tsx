"use client";

import React, { useState } from "react";
import Image from "next/image";
import { app } from "@/config/constants";
import { Search, TableOfContents } from "lucide-react";
import Link from "next/link";
import ContentMobileMenu from "./ContentMobileMenu";
import SearchResults from "./SearchResults";
import Cart from "../Cart";
import WishlistIcon from "../Navbar/WishlistIcon";
import type { Category } from "@/types/category";

const Navbar = ({ categories }: { categories: Category[] }) => {
  const [isShowMenuMobile, setIsShowMenuMobile] = useState(false);
  const [isSearchResultPanelOpen, setIsSearchResultPanelOpen] = useState(false);

  const handleToggleMenuMobile = () => {
    setIsShowMenuMobile((prev) => !prev);
  };

  const handleOpenSearchResultPanel = (isOpen: boolean) => {
    setIsSearchResultPanelOpen(isOpen);
  };

  return (
    <>
      <div className="@5xl:hidden block">
        <div className="flex items-center justify-between h-[56px] bg-gradient-to-r from-[#0e4f4c] to-[#1a7a74] px-3">
          <button
            onClick={handleToggleMenuMobile}
            aria-label="Mở menu"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 active:bg-white/20 transition-colors"
          >
            <TableOfContents className="text-white" size={20} />
          </button>
          <Link href="/">
            <Image
              src={app.shopLogo}
              alt="Logo"
              width={62}
              height={36}
              priority
              className="h-[32px] w-auto"
            />
          </Link>
          <div className="flex items-center gap-1.5 text-white">
            <button
              onClick={() => handleOpenSearchResultPanel(true)}
              aria-label="Tìm kiếm"
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 active:bg-white/20 transition-colors"
            >
              <Search className="text-white" size={18} />
            </button>
            <WishlistIcon />
            <Cart />
          </div>
        </div>
      </div>

      {isSearchResultPanelOpen && (
        <SearchResults
          isSearchResultPanelOpen={isSearchResultPanelOpen}
          handleOpenSearchResultPanel={handleOpenSearchResultPanel}
        />
      )}

      {/* Mobile menu */}
      <ContentMobileMenu
        isShowMenuMobile={isShowMenuMobile}
        handleToggleMenuMobile={handleToggleMenuMobile}
        categories={categories}
      />
    </>
  );
};

export default Navbar;
