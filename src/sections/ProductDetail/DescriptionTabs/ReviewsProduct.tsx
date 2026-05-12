"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Star } from "lucide-react";
import Image from "next/image";
import {
  getProductReviews,
  getProductReviewStats,
  markReviewHelpful,
  Review,
  ReviewStats,
} from "@/lib/api/services/reviewService";

const FALLBACK_AVATAR = "/assets/images/placeholder.jpg";

// ---------------------------------------------------------------------------
// Stars helper
// ---------------------------------------------------------------------------
const Stars = ({ rating, size = 16 }: { rating: number; size?: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={size}
        fill={i <= rating ? "gold" : "none"}
        color={i <= rating ? "gold" : "#ccc"}
      />
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// Rating distribution bar
// ---------------------------------------------------------------------------
const RatingBar = ({
  star,
  count,
  total,
}: {
  star: number;
  count: number;
  total: number;
}) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-4 text-right">{star}</span>
      <Star size={12} fill="gold" color="gold" />
      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-right text-gray-500">{count}</span>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Write review placeholder (reviews disabled for guest-only mode)
// ---------------------------------------------------------------------------
const WriteReview = ({
}: {
  productId: string;
  onSubmitted: () => void;
}) => {
  return null; // Reviews disabled — guest-only mode
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
const ReviewsProduct = ({ productId }: { productId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [helpfulVoted, setHelpfulVoted] = useState<Set<string>>(new Set());

  const loadReviews = useCallback(
    async (p: number) => {
      setLoading(true);
      try {
        const res = await getProductReviews(productId, p, 10);
        setReviews(res.items);
        setTotalPages(res.totalPages);
        setPage(p);
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    },
    [productId]
  );

  const loadStats = useCallback(async () => {
    try {
      const s = await getProductReviewStats(productId);
      setStats(s);
    } catch {
      setStats(null);
    }
  }, [productId]);

  useEffect(() => {
    loadReviews(1);
    loadStats();
  }, [loadReviews, loadStats]);

  const handleReviewSubmitted = () => {
    loadReviews(1);
    loadStats();
  };

  const handleHelpful = async (reviewId: string) => {
    if (helpfulVoted.has(reviewId)) return;
    try {
      const { helpfulCount } = await markReviewHelpful(reviewId);
      setHelpfulVoted((prev) => new Set(prev).add(reviewId));
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount } : r))
      );
    } catch {
      // ignore
    }
  };

  const avg = stats?.averageRating ?? 0;
  const total = stats?.totalReviews ?? 0;

  return (
    <div>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-[18px] sm:text-[20px] font-[700] text-gray-900 text-center mb-6">Đánh giá sản phẩm</h2>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row gap-6 mb-6 p-5 bg-[#edf9f8]/50 rounded-2xl border border-[#1a7a74]/10">
          <div className="flex flex-col items-center justify-center min-w-[120px]">
            <span className="text-[40px] font-[800] text-[#1a7a74]">
              {avg.toFixed(1)}
            </span>
            <Stars rating={Math.round(avg)} size={18} />
            <span className="text-[14px] text-gray-500 mt-1.5">{total} đánh giá</span>
          </div>
          <div className="flex-1 flex flex-col gap-1.5 justify-center">
            {([5, 4, 3, 2, 1] as const).map((s) => (
              <RatingBar
                key={s}
                star={s}
                count={stats?.distribution[s] ?? 0}
                total={total}
              />
            ))}
          </div>
        </div>

        {/* Write review */}
        <div className="mb-6">
          <WriteReview productId={productId} onSubmitted={handleReviewSubmitted} />
        </div>

        {/* Reviews list */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-1 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-center text-gray-400 py-6">
            Chưa có đánh giá nào. Hãy là người đầu tiên!
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Image
                    src={r.user.avatar ?? FALLBACK_AVATAR}
                    alt={r.user.firstName}
                    width={36}
                    height={36}
                    className="rounded-full object-cover w-9 h-9"
                  />
                  <div>
                    <p className="font-medium text-sm">
                      {r.user.firstName} {r.user.lastName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  {r.isVerifiedPurchase && (
                    <span className="ml-auto text-xs text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                      Đã mua hàng
                    </span>
                  )}
                </div>
                <Stars rating={r.rating} />
                {r.comment && (
                  <p className="mt-2 text-sm text-gray-700">{r.comment}</p>
                )}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => handleHelpful(r.id)}
                    disabled={helpfulVoted.has(r.id)}
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      helpfulVoted.has(r.id)
                        ? "bg-blue-50 border-blue-200 text-blue-600 cursor-default"
                        : "border-gray-300 text-gray-500 hover:border-blue-1 hover:text-blue-1"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill={helpfulVoted.has(r.id) ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                    </svg>
                    Hữu ích {(r.helpfulCount ?? 0) > 0 && `(${r.helpfulCount})`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {page > 1 && (
              <button
                onClick={() => loadReviews(page - 1)}
                className="px-3 py-1 text-sm rounded border border-gray-300 hover:border-blue-1 hover:text-blue-1"
              >
                &laquo;
              </button>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => loadReviews(p)}
                className={`w-8 h-8 text-sm rounded border transition-colors ${
                  p === page
                    ? "bg-blue-1 text-white border-blue-1"
                    : "border-gray-300 hover:border-blue-1 hover:text-blue-1"
                }`}
              >
                {p}
              </button>
            ))}
            {page < totalPages && (
              <button
                onClick={() => loadReviews(page + 1)}
                className="px-3 py-1 text-sm rounded border border-gray-300 hover:border-blue-1 hover:text-blue-1"
              >
                &raquo;
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ReviewsProduct);
