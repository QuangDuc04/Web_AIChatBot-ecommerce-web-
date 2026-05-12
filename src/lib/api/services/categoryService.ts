// Category service — server-side ISR fetching only.
// All functions use serverFetch (native fetch + Next.js cache).
// Categories change infrequently — revalidate every 60 minutes.

import { serverFetch } from '../server';
import type { Category } from '@/types';

/**
 * Fetch all categories (flat list).
 * Revalidates every 60 minutes.
 */
export async function getCategories(): Promise<Category[]> {
  return serverFetch<Category[]>('/categories', {
    revalidate: 3600,
  });
}

/**
 * Fetch categories as a nested tree (root categories with children populated).
 * Revalidates every 60 minutes.
 */
export async function getCategoryTree(): Promise<Category[]> {
  return serverFetch<Category[]>('/categories/tree', {
    revalidate: 3600,
  });
}

/**
 * Fetch a single category by its slug.
 * Returns null if not found (e.g. when [categorySlug] route catches non-category URLs).
 * Revalidates every 60 minutes.
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    return await serverFetch<Category>(`/categories/slug/${encodeURIComponent(slug)}`, {
      revalidate: 3600,
    });
  } catch {
    return null;
  }
}

/**
 * Fetch a single category by its ID.
 * Revalidates every 60 minutes.
 */
export async function getCategoryById(id: string): Promise<Category> {
  return serverFetch<Category>(`/categories/${encodeURIComponent(id)}`, {
    revalidate: 3600,
  });
}
