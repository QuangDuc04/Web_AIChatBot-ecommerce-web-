import { getCategories, getCategoryBySlug } from "@/lib/api/services/categoryService";
import { getProducts } from "@/lib/api/services/productService";
import { getBrands } from "@/lib/api/services/brandService";
import Categories from "@/sections/Categories";
import { Metadata } from "next";
import { notFound } from "next/navigation";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4000";

export const revalidate = 1800; // 30 min ISR
export const dynamicParams = true;

type Props = {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ page?: string; brand?: string }>;
};

export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    return categories.map((cat) => ({ categorySlug: cat.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return {};
  const canonical = `${SITE_URL}/${categorySlug}`;
  return {
    title: category.name,
    description:
      category.description || `Mua ${category.name} chất lượng tại Halo`,
    alternates: { canonical },
    openGraph: {
      title: category.name,
      description: category.description ?? undefined,
      url: canonical,
      type: "website",
      images: category.image ? [{ url: category.image }] : [],
    },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { categorySlug } = await params;
  const { page, brand } = await searchParams;

  const category = await getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const currentPage = Number(page) || 1;
  const [products, allCategories, brands] = await Promise.all([
    getProducts({ categoryId: category.id, page: currentPage, limit: 12, ...(brand ? { brandId: brand } : {}) }),
    getCategories(),
    getBrands().catch(() => []),
  ]);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: category.name,
        item: `${SITE_URL}/${categorySlug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Categories
        category={category}
        products={products}
        categories={allCategories}
        brands={brands}
        selectedBrandId={brand}
        currentPage={currentPage}
      />
    </>
  );
}
