import type { Category } from './category';

export type UnitType = 'cuon' | 'thung' | 'cai';

export const UNIT_LABELS: Record<UnitType, string> = {
  cuon: 'cuộn',
  thung: 'thùng',
  cai: 'cái',
};

export interface ProductImage {
  id: string;
  productId: string;
  /** Cloudinary URL */
  url: string;
  /** Cloudinary public_id for deletion */
  publicId: string | null;
  altText: string | null;
  displayOrder: number;
  isPrimary: boolean;
  createdAt: Date | string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  /** Variant attributes e.g. { size: 'L', color: 'red' } */
  attributes: Record<string, string> | null;
  image: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  categoryId: string;
  brandId: string | null;
  /** Đơn vị bán hàng (cuộn / thùng / cái) — null = không hiển thị */
  unitType: UnitType | null;
  /** Số lượng đơn vị con trong 1 thùng */
  unitsPerBox: number | null;
  /** Đơn vị con trong thùng */
  boxSubUnit: UnitType | null;
  /** Giá bán theo thùng */
  boxPrice: number | null;
  /** Sale price (VND) */
  price: number;
  /** Original/compare price — equivalent to oldPrice in paper-web */
  comparePrice: number | null;
  /** Cost price (not shown to customers) */
  costPrice: number | null;
  sku: string;
  barcode: string | null;
  quantity: number;
  /** Weight in kg */
  weight: number | null;
  /** Dimensions in cm */
  dimensions: { length: number; width: number; height: number } | null;
  isActive: boolean;
  /** Featured flag — equivalent to isPromoted in paper-web */
  isFeatured: boolean;
  tags: string[] | null;
  views: number;
  soldCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  // Eager-loaded relations
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
}

/**
 * Subset of Product used in listing pages (search, category, homepage).
 * Avoids loading heavy fields like description/content.
 */
export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  unitType: UnitType | null;
  price: number;
  /** Original/compare price — equivalent to oldPrice in paper-web */
  comparePrice: number | null;
  images: ProductImage[];
  /** Featured flag — equivalent to isPromoted in paper-web */
  isFeatured: boolean;
  categoryId: string;
  category: Category;
}
