export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  /** UUID of parent category, null for root categories */
  parentId: string | null;
  icon: string | null;
  image: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  /** Nested child categories (populated on tree endpoints) */
  children?: Category[];
}
