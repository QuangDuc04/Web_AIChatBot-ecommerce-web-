// Review service — client-side only ('use client' components).
import { apiGet, apiPost } from '@/lib/api/client';
import type { PaginatedResponse } from '@/types/api';
import type { User } from '@/types/user';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  user: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatar'>;
  rating: number;
  comment: string | null;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface CreateReviewDto {
  productId: string;
  rating: number;
  comment?: string;
}

/** Fetch paginated reviews for a product. */
export const getProductReviews = (
  productId: string,
  page = 1,
  limit = 10
): Promise<PaginatedResponse<Review>> =>
  apiGet<PaginatedResponse<Review>>(
    `/reviews?productId=${productId}&page=${page}&limit=${limit}`
  );

/** Fetch rating stats for a product. */
export const getProductReviewStats = (
  productId: string
): Promise<ReviewStats> =>
  apiGet<ReviewStats>(`/reviews/stats?productId=${productId}`);

/** Check if the current user can review this product (has purchased it). */
export const canReviewProduct = (productId: string): Promise<{ canReview: boolean }> =>
  apiGet<{ canReview: boolean }>(`/reviews/can-review/${productId}`);

/** Submit a new review. */
export const createReview = (dto: CreateReviewDto): Promise<Review> =>
  apiPost<Review>('/reviews', dto);

/** Mark a review as helpful. */
export const markReviewHelpful = (reviewId: string): Promise<{ helpfulCount: number }> =>
  apiPost<{ helpfulCount: number }>(`/reviews/${reviewId}/helpful`);
