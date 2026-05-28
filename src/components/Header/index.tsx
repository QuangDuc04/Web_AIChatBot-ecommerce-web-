import React from "react";
import Navbar from "./Navbar";
import NavbarMobile from "./NavbarMobile";
import NavbarTop from "./Navbar/NavbarTop";
import { getCategories } from "@/lib/api/services/categoryService";

const Header = async () => {
  const categories = await getCategories().catch(() => []);

  return (
    <>
      <header className="sticky top-0 z-50 @5xl:static">
        <NavbarTop />
        <NavbarMobile categories={categories} />
      </header>
      <Navbar categories={categories} />
    </>
  );
};

export default Header;
