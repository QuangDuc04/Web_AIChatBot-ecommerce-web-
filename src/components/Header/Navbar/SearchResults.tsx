// import styles from "./styles.module.scss";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { X } from "lucide-react";
import { formatPriceSimple } from "@/utils/priceFormatter";

interface ISearchResults {
  searchResults: Product[];
  onCloseSearchResults: () => void;
  searchTerm?: string;
}

const SearchResults = (props: ISearchResults) => {
  const { searchResults, onCloseSearchResults, searchTerm = "" } = props;

  if (!searchResults?.length) return null;

  return (
    <div
      className="absolute top-[50px] left-0 w-full bg-white rounded-xl p-3 z-50 text-main"
      style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)' }}
    >
      <div className="flex items-center justify-between px-2 pb-2 mb-1 border-b border-gray-100">
        <p className="text-[13px] font-[600] text-gray-500">
          {searchResults.length} sản phẩm
        </p>
        <button onClick={onCloseSearchResults} className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center transition">
          <X size={16} className="text-gray-400" />
        </button>
      </div>
      <div className="max-h-[360px] overflow-y-auto space-y-0.5">
        {searchResults.map((product) => (
          <Link
            key={product.id}
            href={`/${product.category?.slug ?? 'san-pham'}/${product.slug}`}
            onClick={() => onCloseSearchResults()}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <Image
              src={product.images?.[0]?.url ?? '/assets/images/placeholder.jpg'}
              alt={product.name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-lg object-cover bg-gray-100"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-[500] text-gray-800 group-hover:text-[#1a7a74] transition-colors truncate">
                {product.name}
              </p>
              <p className="text-[14px] font-[700] text-[#1a7a74] mt-0.5">
                {formatPriceSimple(product.price)} đ
              </p>
            </div>
          </Link>
        ))}
      </div>
      {searchTerm && (
        <div className="pt-2 mt-1 border-t border-gray-100 text-center">
          <Link
            href={`/tim-kiem?q=${encodeURIComponent(searchTerm)}`}
            onClick={onCloseSearchResults}
            className="text-[13px] font-[600] text-[#1a7a74] hover:underline"
          >
            Xem tất cả kết quả →
          </Link>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
