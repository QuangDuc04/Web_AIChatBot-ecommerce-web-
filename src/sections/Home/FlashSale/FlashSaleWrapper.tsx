import { getActiveFlashSale } from "@/lib/api/services/flashSaleService";
import { getProducts } from "@/lib/api/services/productService";
import FlashSaleSection from "./index";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

interface Props {
  categories: Category[];
}

export default async function FlashSaleWrapper({ categories }: Props) {
  const flashSale = await getActiveFlashSale();

  // Only fetch products when there's no active flash sale (fallback mode needs them)
  let products: Product[] = [];
  if (!flashSale || !flashSale.items?.length) {
    const response = await getProducts({ limit: 50 }).catch(() => ({
      items: [] as Product[],
      total: 0,
      page: 1,
      limit: 50,
      totalPages: 0,
    }));
    products = response?.items ?? [];
  }

  return (
    <FlashSaleSection
      categories={categories}
      products={products}
      flashSale={flashSale}
    />
  );
}
