"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api/client";
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import Product from "@/components/Product";
import type { Product as ProductType } from "@/types/product";
import { Button } from "@/components/ui/Button";

export default function WishlistPage() {
  const { wishlistIds, count } = useWishlist();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlistIds.size === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const ids = [...wishlistIds];

    Promise.all(
      ids.map((id) =>
        apiGet<any>(`/products/${id}`)
          .then((res) => {
            // Handle both direct product and nested { data: product }
            const product = res?.data ?? res;
            return product?.id ? product : null;
          })
          .catch(() => null),
      ),
    )
      .then((results) => {
        setProducts(results.filter(Boolean) as ProductType[]);
      })
      .finally(() => setLoading(false));
  }, [wishlistIds.size]);

  return (
    <main className="container py-6">
      <Breadcrumb crumbs={[{ href: "/yeu-thich", label: "Yêu thích", isLast: true }]} />

      <div className="mt-6 mb-8">
        <h1 className="text-[24px] sm:text-[28px] font-[800] text-gray-900">
          Sản phẩm yêu thích
        </h1>
        <p className="text-[14px] text-gray-500 mt-1">
          {count} sản phẩm
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#1a7a74] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 rounded-full bg-[#edf9f8] flex items-center justify-center mx-auto mb-6">
            <Heart size={40} className="text-[#1a7a74]" />
          </div>
          <h2 className="text-[20px] font-[700] text-gray-800 mb-2">Chưa có sản phẩm yêu thích</h2>
          <p className="text-[15px] text-gray-500 mb-8">
            Nhấn vào biểu tượng trái tim trên sản phẩm để thêm vào danh sách yêu thích.
          </p>
          <Link href="/san-pham">
            <Button variant="primary">
              <ArrowLeft size={16} />
              Khám phá sản phẩm
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {products.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
