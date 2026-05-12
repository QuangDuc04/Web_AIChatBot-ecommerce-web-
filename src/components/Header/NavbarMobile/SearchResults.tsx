"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { Product } from "@/types/product";
import { searchProducts } from "@/lib/api/services/productService";
import { Search, X, ArrowRight } from "lucide-react";
import { formatPriceSimple } from "@/utils/priceFormatter";

interface ISearchResults {
  isSearchResultPanelOpen: boolean;
  handleOpenSearchResultPanel: (isOpen: boolean) => void;
}

const SearchResults = (props: ISearchResults) => {
  const { isSearchResultPanelOpen, handleOpenSearchResultPanel } = props;

  const [searchValue, setSearchValueInput] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isSearchResultPanelOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchResultPanelOpen]);

  useEffect(() => {
    if (!searchValue.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await searchProducts(searchValue.trim(), { limit: 5 });
        setSearchResults(data.items);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  function onCloseSearchResults() {
    handleOpenSearchResultPanel(false);
    setSearchValueInput("");
    setSearchResults([]);
  }

  function navigateToSearch() {
    const q = searchValue.trim();
    if (!q) return;
    onCloseSearchResults();
    router.push(`/tim-kiem?q=${encodeURIComponent(q)}`);
  }

  useEffect(() => {
    if (isSearchResultPanelOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isSearchResultPanelOpen]);

  const hasQuery = searchValue.trim().length > 0;

  return (
    <>
      {/* Panel */}
      <div
        className={`fixed inset-0 z-50 bg-white transition-transform duration-300 ease-out flex flex-col ${
          isSearchResultPanelOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Search bar */}
        <div className="flex items-center gap-2 px-3 h-[56px] bg-gray-50 border-b border-gray-100 flex-shrink-0">
          <div className="flex-1 flex items-center gap-2 bg-white rounded-xl border border-gray-200 px-3 h-[40px] focus-within:border-[#1a7a74]/40 transition-colors">
            {isSearching ? (
              <span className="w-4 h-4 border-2 border-[#1a7a74] border-t-transparent rounded-full animate-spin flex-shrink-0" />
            ) : (
              <Search size={16} className="text-gray-400 flex-shrink-0" />
            )}
            <input
              ref={inputRef}
              className="flex-1 bg-transparent text-[14px] text-gray-800 placeholder:text-gray-400 focus:outline-none"
              placeholder="Tìm kiếm sản phẩm..."
              onChange={(e) => setSearchValueInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && navigateToSearch()}
              value={searchValue}
            />
            {searchValue && (
              <button
                onClick={() => { setSearchValueInput(""); inputRef.current?.focus(); }}
                className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 flex-shrink-0"
              >
                <X size={12} className="text-gray-500" />
              </button>
            )}
          </div>
          <button
            onClick={onCloseSearchResults}
            className="text-[14px] font-[600] text-gray-500 px-2 py-1 active:text-gray-800 transition-colors flex-shrink-0"
          >
            Hủy
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {!hasQuery && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-300">
              <Search size={40} strokeWidth={1.5} />
              <p className="text-[14px] mt-3">Nhập từ khóa để tìm kiếm</p>
            </div>
          )}

          {hasQuery && !isSearching && searchResults.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <p className="text-[14px] font-[500]">Không tìm thấy sản phẩm</p>
              <p className="text-[13px] mt-1">Thử từ khóa khác</p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="px-3 py-2">
              <p className="text-[12px] font-[600] text-gray-400 uppercase tracking-wider px-1 mb-2">
                {searchResults.length} kết quả
              </p>
              {searchResults.map((product) => (
                <Link
                  key={product.id}
                  href={`/${product.category?.slug ?? 'san-pham'}/${product.slug}`}
                  onClick={onCloseSearchResults}
                  className="flex items-center gap-3 p-2 rounded-xl active:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0">
                    <Image
                      src={product.images?.[0]?.url ?? '/assets/images/placeholder.jpg'}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-[500] text-gray-800 line-clamp-1">
                      {product.name}
                    </p>
                    <p className="text-[13px] font-[600] text-[#1a7a74] mt-0.5">
                      {formatPriceSimple(product.price)}{Number(product.price) > 0 ? 'đ' : ''}
                    </p>
                  </div>
                  <ArrowRight size={14} className="text-gray-300 flex-shrink-0" />
                </Link>
              ))}

              {searchValue.trim() && (
                <Link
                  href={`/tim-kiem?q=${encodeURIComponent(searchValue.trim())}`}
                  onClick={onCloseSearchResults}
                  className="flex items-center justify-center gap-1.5 mt-2 py-2.5 rounded-xl bg-[#1a7a74]/5 text-[14px] font-[600] text-[#1a7a74] active:bg-[#1a7a74]/10 transition-colors"
                >
                  Xem tất cả kết quả
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchResults;
