import type { Product } from './product';
import type { ProductVariant } from './product';

export interface FlashSaleItem {
  id: string;
  flashSaleId: string;
  productId: string;
  variantId: string | null;
  /** Discount percentage e.g. 20.00 = 20% */
  discountPercent: number;
  originalPrice: number;
  salePrice: number;
  /** Total quantity allocated for the flash sale */
  quantity: number;
  soldQuantity: number;
  createdAt: Date | string;
  // Eager-loaded relations
  product: Product;
  variant: ProductVariant | null;
}

export interface FlashSale {
  id: string;
  name: string;
  startDate: Date | string;
  endDate: Date | string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  items: FlashSaleItem[];
}
