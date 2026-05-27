import React from "react";
import Navbar from "./Navbar";
import NavbarMobile from "./NavbarMobile";
import NavbarTop from "./Navbar/NavbarTop";
import { getCategories } from "@/lib/api/services/categoryService";

const ALLOWED_SLUGS = ['dien-thoai', 'laptop', 'may-tinh-bang'];

const Header = async () => {
  const allCategories = await getCategories().catch(() => []);
  const categories = allCategories.filter(c => ALLOWED_SLUGS.includes(c.slug));

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
