import type { Product } from './product';
import type { ProductVariant } from './product';

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  /** Price snapshot at the time the item was added to the cart */
  price: number;
  /** Đơn vị khách chọn mua */
  buyingUnitType: string | null;
  addedAt: Date | string;
  // Eager-loaded relations
  product: Product;
  variant: ProductVariant | null;
}

export interface Cart {
  id: string;
  /** Null for guest carts */
  userId: string | null;
  /** Session ID for unauthenticated guests */
  sessionId: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  items: CartItem[];
}
