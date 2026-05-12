import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/api/services/productService";
import { getCategories, getCategoryBySlug } from "@/lib/api/services/categoryService";
import { getBrands } from "@/lib/api/services/brandService";
import Categories from "@/sections/Categories";

export const revalidate = 1800;
export const dynamicParams = true;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; brand?: string }>;
};

export async function generateStaticParams() {
  const categories = await getCategories().catch(() => []);
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug).catch(() => null);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description || `Sản phẩm ${category.name} tại Halo`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page, brand } = await searchParams;

  const category = await getCategoryBySlug(slug).catch(() => null);
  if (!category) notFound();

  const currentPage = Number(page) || 1;
  const [products, allCategories, brands] = await Promise.all([
    getProducts({ categoryId: category.id, page: currentPage, limit: 12, ...(brand ? { brandId: brand } : {}) }),
    getCategories(),
    getBrands().catch(() => []),
  ]);

  return (
    <Categories
      category={category}
      products={products}
      categories={allCategories}
      brands={brands}
      selectedBrandId={brand}
      currentPage={currentPage}
    />
  );
}
