import Product from "@/components/Product";
import type { Product as ProductType } from "@/types/product";
import type { Category } from "@/types/category";
import type { Brand } from "@/types/brand";
import type { PaginatedResponse } from "@/types/api";
import CategoriesSlide from "./CategoriesSlide";
import Breadcrumb from "@/components/Breadcrumb";
import PageHeader from "@/components/PageHeader";
import CategoriesWidget from "@/components/CategoriesWidget";
import BrandFilter from "@/components/BrandFilter";
import Pagination from "@/components/Pagination";
import { Suspense } from "react";
import { Package } from "lucide-react";

interface CategoriesProps {
  products: PaginatedResponse<ProductType>;
  category: Category;
  categories: Category[];
  brands?: Brand[];
  selectedBrandId?: string;
  currentPage: number;
}

export default function Categories(props: CategoriesProps) {
  const { products, category, categories, brands = [], selectedBrandId, currentPage } = props;
  const { items, totalPages, total } = products;

  return (
    <main className="container py-6">
      <Breadcrumb
        crumbs={[{ href: `/danh-muc/${category.slug}`, label: category.name, isLast: true }]}
      />

      <CategoriesSlide category={category} categories={categories} />

      <PageHeader
        title={category.name}
        subtitle={`${total ?? items?.length ?? 0} sản phẩm`}
        description={category.description}
      />

      <div className="flex items-start gap-6 lg:gap-8">
        {/* Sidebar */}
        <div className="w-[260px] @5xl:block hidden flex-shrink-0 space-y-4">
          <CategoriesWidget activeCategory={category.slug} categories={categories} />
          <Suspense>
            <BrandFilter brands={brands} selectedBrandId={selectedBrandId} />
          </Suspense>
        </div>

        {/* Products */}
        <div className="flex-1 min-w-0">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 rounded-full bg-[#edf9f8] flex items-center justify-center mb-5">
                <Package size={36} className="text-[#1a7a74]/40" />
              </div>
              <p className="font-[600] text-gray-800 text-[16px]">Không tìm thấy sản phẩm</p>
              <p className="text-[14px] text-gray-400 mt-1">Thử bỏ bộ lọc hoặc chọn danh mục khác.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {items.map((product) => (
                <Product product={product} key={product.id} />
              ))}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl={`/danh-muc/${category.slug}`}
          />
        </div>
      </div>
    </main>
  );
}
