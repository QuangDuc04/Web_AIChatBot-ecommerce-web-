import { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getProductBySlug,
  getProducts,
  getRelatedProducts,
} from "@/lib/api/services/productService";
import {
  getCategories,
  getCategoryBySlug,
} from "@/lib/api/services/categoryService";
import ProductDetail from "@/sections/ProductDetail";

export const revalidate = 3600;
export const dynamicParams = true;

type Props = {
  params: Promise<{ categorySlug: string; productSlug: string }>;
};

export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    const allParams: { categorySlug: string; productSlug: string }[] = [];
    for (const cat of categories) {
      try {
        const productsRes = await getProducts({ categoryId: cat.id, limit: 100 });
        for (const product of productsRes?.items ?? []) {
          allParams.push({ categorySlug: cat.slug, productSlug: product.slug });
        }
      } catch {
        // Skip category if products fail to load
      }
    }
    return allParams;
  } catch {
    return [];
  }
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4000";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug, productSlug } = await params;
  try {
    const product = await getProductBySlug(productSlug);
    if (!product) return {};
    const canonical = `${SITE_URL}/${categorySlug}/${productSlug}`;
    return {
      title: product.name,
      description:
        product.shortDescription ||
        product.description?.substring(0, 160) ||
        undefined,
      alternates: { canonical },
      openGraph: {
        title: product.name,
        description: product.shortDescription || undefined,
        url: canonical,
        type: "website",
        images: product.images?.[0]?.url ? [{ url: product.images[0]!.url }] : [],
      },
    };
  } catch {
    return {};
  }
}

export default async function ProductPage({ params }: Props) {
  const { categorySlug, productSlug } = await params;

  let product;
  try {
    product = await getProductBySlug(productSlug);
  } catch {
    return notFound();
  }

  if (!product) return notFound();

  let category;
  try {
    category = await getCategoryBySlug(categorySlug);
  } catch {
    return notFound();
  }

  let relatedProducts: any[];
  try {
    relatedProducts = await getRelatedProducts(product.id, 8);
  } catch {
    relatedProducts = [];
  }

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((img) => img.url),
    description: product.shortDescription || product.description || undefined,
    brand: { "@type": "Brand", name: "Halo" },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/${categorySlug}/${productSlug}`,
      priceCurrency: "VND",
      price: product.price,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Halo" },
    },
  };

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
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${SITE_URL}/${categorySlug}/${productSlug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetail
        product={product}
        category={category}
        relatedProducts={relatedProducts}
      />
    </>
  );
}
