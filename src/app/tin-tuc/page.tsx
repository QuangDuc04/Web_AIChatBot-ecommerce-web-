import { getActiveNews } from "@/lib/api/services/newsService";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import RightSide from "./[component]/RightSide";
import Breadcrumb from "@/components/Breadcrumb";
import PageHeader from "@/components/PageHeader";
import { Calendar, ArrowRight, Newspaper, User } from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Tin tức",
  description: "Tin tức mới nhất về ngành giấy in nhiệt, tem decal",
};

const FALLBACK_IMAGE = "/assets/images/placeholder.jpg";

function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function NewsPage() {
  const news = await getActiveNews().catch(() => []);
  const featured = news[0];

  return (
    <main className="container py-6">
      <Breadcrumb crumbs={[{ href: "/tin-tuc", label: "Tin tức", isLast: true }]} />

      <PageHeader
        badge="Blog & Tin tức"
        title="Cập nhật tin tức mới nhất"
        subtitle={`${news.length} bài viết về ngành giấy in nhiệt & tem decal`}
      />

      {/* Main layout */}
      <div className="flex items-start gap-8 lg:gap-10">
        <div className="flex-1 min-w-0">

          {/* Featured article */}
          {featured && (
            <Link
              href={`/tin-tuc/${featured.slug}`}
              className="flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden group mb-6 transition-all duration-300 hover:-translate-y-1"
              style={{ boxShadow: '0 1px 4px rgba(26,122,116,0.06), 0 4px 12px rgba(26,122,116,0.04)' }}
            >
              <div className="relative sm:w-[45%] w-full h-[200px] sm:h-auto sm:min-h-[260px] overflow-hidden flex-shrink-0">
                <Image
                  src={featured.thumbnail ?? FALLBACK_IMAGE}
                  alt={featured.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, 45vw"
                />
                <div className="absolute top-3 left-3 bg-[#1a7a74] text-white text-[11px] font-[700] px-3 py-1 rounded-lg uppercase tracking-wider">
                  Nổi bật
                </div>
              </div>
              <div className="sm:w-[55%] w-full p-5 sm:p-7 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-gray-400 mb-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    <span className="text-[13px] font-[500]">{formatDate(featured.publishedAt || featured.createdAt)}</span>
                  </div>
                  {featured.author && (
                    <>
                      <span className="text-gray-300">|</span>
                      <div className="flex items-center gap-1.5">
                        <User size={13} />
                        <span className="text-[13px] font-[500]">{featured.author}</span>
                      </div>
                    </>
                  )}
                </div>
                <h2 className="font-[800] text-[18px] sm:text-[22px] text-gray-900 group-hover:text-[#1a7a74] transition-colors duration-200 line-clamp-2 leading-snug mb-3">
                  {featured.title}
                </h2>
                <p className="text-[14px] sm:text-[15px] text-gray-500 line-clamp-3 leading-relaxed mb-4">
                  {featured.summary}
                </p>
                <span className="inline-flex items-center gap-1.5 text-[14px] font-[600] text-[#1a7a74]">
                  Đọc bài viết <ArrowRight size={15} />
                </span>
              </div>
            </Link>
          )}

          {/* Articles list */}
          <div className="space-y-4">
            {news.slice(1).map((item) => (
              <Link
                key={item.id}
                href={`/tin-tuc/${item.slug}`}
                className="flex bg-white rounded-2xl overflow-hidden group transition-colors duration-200"
                style={{ boxShadow: '0 1px 4px rgba(26,122,116,0.06), 0 4px 12px rgba(26,122,116,0.04)' }}
              >
                <div className="w-[140px] sm:w-[200px] flex-shrink-0 overflow-hidden relative">
                  <Image
                    src={item.thumbnail ?? FALLBACK_IMAGE}
                    alt={item.title}
                    width={200}
                    height={160}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 p-4 sm:p-5 flex flex-col justify-center min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 text-gray-400 mb-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-[#1a7a74]/60" />
                      <span className="text-[12px] sm:text-[13px] font-[500]">{formatDate(item.publishedAt || item.createdAt)}</span>
                    </div>
                    {item.author && (
                      <div className="items-center gap-1.5 hidden sm:flex">
                        <span className="text-gray-200">|</span>
                        <User size={12} className="text-[#1a7a74]/60" />
                        <span className="text-[12px] sm:text-[13px] font-[500]">{item.author}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-[600] text-[15px] sm:text-[17px] text-gray-800 group-hover:text-[#1a7a74] transition-colors duration-200 line-clamp-2 leading-snug mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[14px] sm:text-[14px] text-gray-500 line-clamp-2 leading-relaxed mb-3 hidden sm:block">{item.summary}</p>
                  <span className="inline-flex items-center gap-1.5 text-[14px] font-[600] text-[#1a7a74]">
                    Đọc thêm <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {news.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-24 h-24 rounded-full bg-[#edf9f8] flex items-center justify-center mb-5">
                <Newspaper size={40} className="text-[#1a7a74]/30" />
              </div>
              <p className="font-[700] text-gray-800 text-[18px] mb-2">Chưa có bài viết nào</p>
              <p className="text-[14px] text-gray-400">Quay lại sau để xem tin tức mới nhất.</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-[280px] @5xl:block hidden flex-shrink-0">
          <RightSide />
        </div>
      </div>
    </main>
  );
}
