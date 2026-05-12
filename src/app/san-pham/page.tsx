import { getProducts } from "@/lib/api/services/productService";
import { getCategories } from "@/lib/api/services/categoryService";
import Product from "@/components/Product";
import Breadcrumb from "@/components/Breadcrumb";
import PageHeader from "@/components/PageHeader";
import Pagination from "@/components/Pagination";
import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Tất cả sản phẩm",
  description: "Xem tất cả sản phẩm giấy in nhiệt, giấy in bill, tem decal tại Halo",
};

export default async function AllProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const [products, categories] = await Promise.all([
    getProducts({ page: currentPage, limit: 20, sort: 'category_order' }).catch(() => null),
    getCategories().catch(() => []),
  ]);
  const { items = [], totalPages = 1, total = 0 } = products ?? {};

  return (
    <main className="container py-6">
      <Breadcrumb crumbs={[{ href: "/san-pham", label: "Tất cả sản phẩm", isLast: true }]} />

      <PageHeader
        title="Tất cả sản phẩm"
        subtitle={`${total} sản phẩm chất lượng cao`}
      >
        <span className="text-[14px] font-[600] text-gray-400">
          Trang {currentPage} / {totalPages}
        </span>
      </PageHeader>

      {/* Category quick links */}
      {categories.length > 0 && (
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          <Link
            href="/san-pham"
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a7a74] text-white text-[14px] font-[600]"
          >
            <SlidersHorizontal size={14} /> Tất cả
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/danh-muc/${cat.slug}`}
              className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gray-200 text-[14px] font-[500] text-gray-600 hover:border-[#1a7a74] hover:text-[#1a7a74] hover:bg-[#edf9f8] transition-colors duration-200"
            >
              {cat.icon && (
                <Image src={cat.icon} alt={cat.name} width={16} height={16} className="object-contain" />
              )}
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      {/* Products */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-24 h-24 rounded-full bg-[#edf9f8] flex items-center justify-center mb-5">
            <Search size={40} className="text-[#1a7a74]/30" />
          </div>
          <p className="text-[18px] font-[700] text-gray-800 mb-2">Không tìm thấy sản phẩm</p>
          <p className="text-[14px] text-gray-400 mb-6">Hãy thử danh mục khác hoặc quay lại sau.</p>
          <Link href="/" className="text-[14px] font-[600] text-[#1a7a74] hover:underline">
            ← Về trang chủ
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {items.map((product) => (
            <Product product={product} key={product.id} />
          ))}
        </div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/san-pham" />
    </main>
  );
}
