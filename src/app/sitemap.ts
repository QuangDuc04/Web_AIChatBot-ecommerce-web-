import { MetadataRoute } from "next";
import { getCategories } from "@/lib/api/services/categoryService";
import { getProducts } from "@/lib/api/services/productService";
import { getActiveNews } from "@/lib/api/services/newsService";

export const revalidate = 3600; // Regenerate hourly

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/san-pham`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/tin-tuc`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/lien-he`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/gio-hang`, lastModified: now, changeFrequency: "never", priority: 0.2 },
  ];

  // Fetch all data in parallel (errors are silenced — partial sitemap is better than none)
  const [categories, productsRes, news] = await Promise.all([
    getCategories().catch(() => []),
    getProducts({ limit: 1000 }).catch(() => ({ items: [] as { slug: string; category: { slug: string } }[], total: 0, page: 1, totalPages: 1 })),
    getActiveNews().catch(() => []),
  ]);

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = productsRes.items.map((product) => ({
    url: `${SITE_URL}/${product.category?.slug ?? "san-pham"}/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const newsRoutes: MetadataRoute.Sitemap = news.map((article) => ({
    url: `${SITE_URL}/tin-tuc/${article.slug}`,
    lastModified: new Date(article.publishedAt ?? now),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...newsRoutes];
}
