// Product service — server-side ISR fetching + client-side search.
// Server functions use serverFetch (native fetch + Next.js cache).
// Client functions use apiGet (axios, only in 'use client' components).

import { serverFetch } from '../server';
import { apiGet } from '../client';
import type { Product, PaginatedResponse } from '@/types';

// ---------------------------------------------------------------------------
// Query param builders
// ---------------------------------------------------------------------------

interface ProductListParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

interface SearchParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  brandId?: string;
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ''
  ) as [string, string | number][];
  if (entries.length === 0) return '';
  const qs = entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
  return `?${qs}`;
}

// ---------------------------------------------------------------------------
// Server-side functions (use in Server Components / Route Handlers)
// ---------------------------------------------------------------------------

/**
 * Fetch paginated product list with optional filters.
 * Revalidates every 30 minutes.
 */
export async function getProducts(
  params?: ProductListParams
): Promise<PaginatedResponse<Product>> {
  const qs = params ? buildQuery(params as Record<string, string | number | undefined>) : '';
  return serverFetch<PaginatedResponse<Product>>(`/products${qs}`, {
    revalidate: 1800,
  });
}

/**
 * Fetch a single product by its slug.
 * Revalidates every 60 minutes.
 */
export async function getProductBySlug(slug: string): Promise<Product> {
  return serverFetch<Product>(`/products/slug/${encodeURIComponent(slug)}`, {
    revalidate: 3600,
  });
}

/**
 * Fetch a single product by its ID.
 * Revalidates every 60 minutes.
 */
export async function getProductById(id: string): Promise<Product> {
  return serverFetch<Product>(`/products/${encodeURIComponent(id)}`, {
    revalidate: 3600,
  });
}

/**
 * Fetch featured products.
 * Revalidates every 30 minutes.
 */
export async function getFeaturedProducts(limit?: number): Promise<Product[]> {
  const qs = limit !== undefined ? `?limit=${limit}` : '';
  return serverFetch<Product[]>(`/products/featured${qs}`, {
    revalidate: 1800,
  });
}

/**
 * Fetch best-selling products.
 * Revalidates every 30 minutes.
 */
export async function getBestSellers(limit?: number): Promise<Product[]> {
  const qs = limit !== undefined ? `?limit=${limit}` : '';
  return serverFetch<Product[]>(`/products/best-sellers${qs}`, {
    revalidate: 1800,
  });
}

/**
 * Fetch products related to a given product.
 * Revalidates every 30 minutes.
 */
export async function getRelatedProducts(
  productId: string,
  limit?: number
): Promise<Product[]> {
  const qs = limit !== undefined ? `?limit=${limit}` : '';
  return serverFetch<Product[]>(
    `/products/${encodeURIComponent(productId)}/related${qs}`,
    { revalidate: 1800 }
  );
}

// ---------------------------------------------------------------------------
// Client-side functions (use in 'use client' components only)
// ---------------------------------------------------------------------------

/**
 * Search products by query string.
 * Uses axios — call only from Client Components.
 */
export async function searchProducts(
  query: string,
  params?: SearchParams
): Promise<PaginatedResponse<Product>> {
  const allParams: Record<string, string | number | undefined> = {
    q: query,
    ...params,
  };
  const qs = buildQuery(allParams);
  return apiGet<PaginatedResponse<Product>>(`/products/search${qs}`);
}
