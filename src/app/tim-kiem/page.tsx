"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SearchX, ArrowLeft } from "lucide-react";
import Product from "@/components/Product";
import Breadcrumb from "@/components/Breadcrumb";
import Pagination from "@/components/Pagination";
import { searchProducts } from "@/lib/api/services/productService";
import type { Product as ProductType } from "@/types/product";
import Link from "next/link";

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") ?? "";
  const pageParam = Number(searchParams.get("page")) || 1;

  const [inputValue, setInputValue] = useState(q);
  const [results, setResults] = useState<ProductType[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const doSearch = useCallback(async (query: string, page: number) => {
    if (!query.trim()) {
      setResults([]);
      setTotal(0);
      setTotalPages(1);
      return;
    }
    setLoading(true);
    try {
      const data = await searchProducts(query.trim(), { page, limit: 20 });
      setResults(data?.items ?? []);
      setTotal(data?.total ?? 0);
      setTotalPages(data?.totalPages ?? 1);
    } catch {
      setResults([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setInputValue(q);
    doSearch(q, pageParam);
  }, [q, pageParam, doSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    router.push(`/tim-kiem?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <main className="container py-6">
      <Breadcrumb crumbs={[{ href: "/tim-kiem", label: "Tìm kiếm", isLast: true }]} />

      {/* Hero search */}
      <div
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1a7a74] via-[#1f8a84] to-[#25998f] px-6 sm:px-10 py-8 sm:py-10 mt-2 mb-8"
        style={{ boxShadow: '0 12px 40px rgba(26,122,116,0.15)' }}
      >
        <div className="absolute top-0 right-0 w-60 h-60 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3 blur-2xl" />
        <div className="relative max-w-2xl mx-auto text-center">
          <h1 className="text-white text-[22px] sm:text-[28px] font-[800] mb-2">
            {q ? `Kết quả cho "${q}"` : "Tìm kiếm sản phẩm"}
          </h1>
          <p className="text-white/60 text-[14px] mb-6">
            {q && !loading ? `${total} sản phẩm được tìm thấy` : "Nhập từ khóa để tìm kiếm sản phẩm"}
          </p>

          {/* Search form */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-lg mx-auto">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-11 pr-4 py-3 rounded-xl text-[15px] text-gray-800 bg-white border-0 outline-none focus:ring-2 focus:ring-white/30 transition-all"
                style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
              />
            </div>
            <button
              type="submit"
              className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#1a7a74] hover:bg-white/90 transition-all flex-shrink-0"
              style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
            >
              <Search size={20} />
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-3 border-[#1a7a74] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[14px] text-gray-400">Đang tìm kiếm...</p>
        </div>
      ) : results.length === 0 && q ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 rounded-full bg-[#edf9f8] flex items-center justify-center mb-5">
            <SearchX size={36} className="text-[#1a7a74]/30" />
          </div>
          <p className="text-[18px] font-[700] text-gray-800 mb-2">Không tìm thấy sản phẩm</p>
          <p className="text-[14px] text-gray-400 mb-6 text-center max-w-md">
            Không có sản phẩm nào phù hợp với &quot;{q}&quot;. Hãy thử từ khóa khác hoặc duyệt theo danh mục.
          </p>
          <div className="flex gap-3">
            <Link
              href="/san-pham"
              className="inline-flex items-center gap-2 text-[14px] font-[600] text-[#1a7a74] border border-[#1a7a74]/30 px-4 py-2 rounded-full hover:bg-[#1a7a74] hover:text-white transition-all duration-300"
            >
              Xem tất cả sản phẩm
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[14px] font-[600] text-gray-500 hover:text-[#1a7a74] transition-colors"
            >
              <ArrowLeft size={14} /> Về trang chủ
            </Link>
          </div>
        </div>
      ) : results.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {results.map((product) => (
              <Product key={product.id} product={product} />
            ))}
          </div>
          <Pagination
            currentPage={pageParam}
            totalPages={totalPages}
            baseUrl={`/tim-kiem?q=${encodeURIComponent(q)}`}
          />
        </>
      ) : null}
    </main>
  );
}
