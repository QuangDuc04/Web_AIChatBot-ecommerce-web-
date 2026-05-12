import ImageProduct from "./ImageProduct";
import DescriptionTabs from "./DescriptionTabs";
import RelatedProducts from "./RelatedProducts";
import type { Product } from "@/types/product";
import type { Category } from "@/types/category";
import { app } from "@/config/constants";
import ProductBuySection from "./ProductBuySection";
import Breadcrumb from "@/components/Breadcrumb";
import { Phone, ShieldCheck, Truck, RotateCcw, ExternalLink } from "lucide-react";
import Image from "next/image";

const guarantees = [
  { icon: Truck, label: "Giao hàng nhanh 24h" },
  { icon: ShieldCheck, label: "Cam kết chất lượng" },
  { icon: RotateCcw, label: "Đổi trả trong 7 ngày" },
];

const ProductDetail = ({
  product,
  category,
  relatedProducts,
}: {
  product: Product;
  category: Category;
  relatedProducts: Product[];
}) => {
  const isContactPrice = !product.price || Number(product.price) === 0;

  return (
    <div className="container py-6">
      <Breadcrumb
        crumbs={[
          { href: `/danh-muc/${category.slug}`, label: category.name, isLast: false },
          { href: `/${category.slug}/${product.slug}`, label: product.name, isLast: true },
        ]}
      />

      {/* Main product section */}
      <div
        className="flex items-start @5xl:flex-row flex-col gap-6 sm:gap-8 lg:gap-10 mt-4 bg-white rounded-2xl p-4 sm:p-6 lg:p-8"
        style={{ boxShadow: '0 2px 8px rgba(26,122,116,0.06), 0 8px 24px rgba(26,122,116,0.04)' }}
      >
        {/* Images */}
        <div className="@5xl:w-[45%] w-full">
          <ImageProduct images={product.images} />
        </div>

        {/* Info */}
        <div className="@5xl:w-[55%] w-full">
          {/* Title */}
          <h1 className="font-[800] text-[22px] sm:text-[26px] lg:text-[28px] text-gray-900 leading-tight mb-4">
            {product.name}
          </h1>

          {/* Short description */}
          {product.shortDescription && (
            <div
              className="text-[15px] text-gray-600 leading-relaxed mb-6 pb-6 border-b border-gray-100 product-short-desc"
              dangerouslySetInnerHTML={{ __html: product.shortDescription }}
            />
          )}

          {/* Contact price note */}
          {isContactPrice && (
            <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
              <Phone size={16} className="text-amber-600 flex-shrink-0" />
              <p className="text-[14px] sm:text-[15px] font-[500] text-amber-700">
                Sản phẩm cần liên hệ để được giá ưu đãi khi đặt hàng. Hotline: <a href={`tel:${app.phones?.[0]}`} className="font-[700] underline">{app.phones?.[0]}</a>
              </p>
            </div>
          )}

          {/* Price + Unit toggle + Add to cart */}
          <ProductBuySection product={product} />

          {/* Marketplace links */}
          <div className="mt-6 flex items-center gap-3">
            <span className="text-[14px] font-[600] text-gray-500">Mua trên sàn:</span>
            <a
              href={app.shoppee}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#ee4d2d]/5 border border-[#ee4d2d]/15 rounded-xl px-4 py-2.5 hover:bg-[#ee4d2d]/10 hover:border-[#ee4d2d]/30 hover:scale-[1.02] transition-all duration-300 group"
            >
              <Image src="/assets/icons/shopee_icon.png" alt="Shopee" width={22} height={22} className="object-contain" />
              <span className="text-[14px] font-[600] text-[#ee4d2d]">Shopee</span>
              <ExternalLink size={13} className="text-[#ee4d2d]/50 group-hover:text-[#ee4d2d] transition-colors" />
            </a>
            <a
              href={app.tiktok}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-black/[0.03] border border-black/8 rounded-xl px-4 py-2.5 hover:bg-black/[0.06] hover:border-black/15 hover:scale-[1.02] transition-all duration-300 group"
            >
              <Image src="/assets/icons/tiktok_icon.png" alt="TikTok" width={22} height={22} className="object-contain rounded-full" />
              <span className="text-[14px] font-[600] text-gray-800">TikTok</span>
              <ExternalLink size={13} className="text-gray-400 group-hover:text-gray-700 transition-colors" />
            </a>
          </div>

          {/* Promo + Hotline */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-3 bg-gradient-to-r from-[#fff7ed] to-[#fff3e0] rounded-xl px-4 py-3 border border-orange-100">
              <span className="text-[20px]">🔥</span>
              <p className="text-[14px] font-[600] text-orange-700">
                Liên hệ để được giá ưu đãi nhất!
              </p>
            </div>
            <a
              href={`tel:${app.phones?.[0]}`}
              className="flex items-center gap-3 bg-[#edf9f8] rounded-xl px-4 py-3 hover:bg-[#1a7a74] group transition-all duration-300"
            >
              <div className="w-9 h-9 rounded-lg bg-[#1a7a74] group-hover:bg-white/20 flex items-center justify-center flex-shrink-0">
                <Phone size={16} className="text-white" />
              </div>
              <div>
                <p className="text-[13px] text-gray-500 group-hover:text-white/70 transition-colors">Hotline 24/7</p>
                <p className="text-[15px] font-[700] text-[#1a7a74] group-hover:text-white transition-colors">
                  {app.phones?.[0]}
                </p>
              </div>
            </a>
          </div>

          {/* Guarantees */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            {guarantees.map((g, i) => (
              <div key={i} className="flex flex-col items-center gap-2 text-center py-3">
                <div className="w-10 h-10 rounded-xl bg-[#edf9f8] flex items-center justify-center">
                  <g.icon size={18} className="text-[#1a7a74]" />
                </div>
                <span className="text-[13px] sm:text-[14px] font-[500] text-gray-600 leading-tight">
                  {g.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description tabs */}
      <DescriptionTabs product={product} />

      {/* Related products */}
      <RelatedProducts category={category} relatedProducts={relatedProducts} />
    </div>
  );
};

export default ProductDetail;
