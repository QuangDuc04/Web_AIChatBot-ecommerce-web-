import React, { useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import SlideCart from "../SlideCart";

interface CartProps {
  className?: string;
}

const Cart = (props: CartProps) => {
  const { className } = props;
  const { carts, isSliderCartOpen, handleOpenCartSlider } = useCart();

  useEffect(() => {
    if (isSliderCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSliderCartOpen]);

  return (
    <>
      <div id="header-cart-icon" className={`relative cursor-pointer ${className}`}>
        <Link href="/gio-hang">
          <ShoppingBag size={22} />
          <span className="absolute -top-2 -right-2 button-gradient text-white text-[10px] font-[700] w-[18px] h-[18px] rounded-full flex items-center justify-center">
            {carts.length}
          </span>
        </Link>
      </div>

      <SlideCart
        isOpenCart={isSliderCartOpen}
        handleOpenCart={handleOpenCartSlider}
      />
    </>
  );
};

export default Cart;
