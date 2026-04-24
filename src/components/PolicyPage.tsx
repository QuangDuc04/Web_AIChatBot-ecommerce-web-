import Link from "next/link";
import { ChevronRight, House } from "lucide-react";
import type { ReactNode } from "react";
import { app } from "@/config/constants";

interface PolicySection {
  title: string;
  content: ReactNode;
}

interface PolicyPageProps {
  title: string;
  description: string;
  icon: ReactNode;
  sections: PolicySection[];
  lastUpdated?: string;
}

const POLICY_LINKS = [
  { href: "/chinh-sach-van-chuyen", label: "Vận chuyển" },
  { href: "/chinh-sach-doi-tra", label: "Đổi trả" },
  { href: "/chinh-sach-kiem-hang", label: "Kiểm hàng" },
  { href: "/hinh-thuc-thanh-toan", label: "Thanh toán" },
];

export default function PolicyPage({
  title,
  description,
  icon,
  sections,
  lastUpdated,
}: PolicyPageProps) {
  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center text-sm text-gray-500 gap-1.5 py-3 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            <Link
              href="/"
              className="flex items-center gap-1.5 hover:text-blue-1 transition-colors shrink-0"
            >
              <House size={15} className="text-blue-1" />
              <span>Trang chủ</span>
            </Link>
            <ChevronRight size={14} className="text-gray-300 shrink-0" />
            <span className="font-medium text-gray-800 truncate">{title}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-1/5 via-white to-teal-50">
        <div className="container py-10 sm:py-14 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-1/10 text-blue-1 mb-4">
            {icon}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            {title}
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-[15px] leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Table of Contents */}
          <nav className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 mb-8 shadow-sm">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Nội dung
            </p>
            <ol className="space-y-2">
              {sections.map((s, i) => (
                <li key={i}>
                  <a
                    href={`#section-${i + 1}`}
                    className="flex items-start gap-3 text-[15px] text-gray-600 hover:text-blue-1 transition-colors group"
                  >
                    <span className="w-6 h-6 rounded-lg bg-blue-1/10 text-blue-1 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-1 group-hover:text-white transition-colors">
                      {i + 1}
                    </span>
                    <span>{s.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((s, i) => (
              <section
                key={i}
                id={`section-${i + 1}`}
                className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-7 shadow-sm scroll-mt-24"
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className="w-8 h-8 rounded-xl bg-blue-1 text-white text-sm font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug pt-0.5">
                    {s.title}
                  </h2>
                </div>
                <div className="text-gray-600 text-[15px] leading-relaxed space-y-3 pl-11">
                  {s.content}
                </div>
              </section>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-8 bg-gradient-to-r from-blue-1 to-teal-500 rounded-2xl p-6 sm:p-8 text-white text-center">
            <p className="font-bold text-lg mb-1">
              Bạn có thắc mắc?
            </p>
            <p className="text-white/80 text-sm mb-5">
              Liên hệ với chúng tôi để được tư vấn và hỗ trợ nhanh nhất
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`tel:${app.phones[0]}`}
                className="inline-flex items-center gap-2 bg-white text-blue-1 font-semibold px-6 py-2.5 rounded-xl hover:bg-white/90 transition-colors text-sm"
              >
                Gọi {app.phones[0]}
              </a>
              <a
                href={`mailto:${app.email}`}
                className="inline-flex items-center gap-2 bg-white/15 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-white/25 transition-colors text-sm border border-white/20"
              >
                Email hỗ trợ
              </a>
            </div>
          </div>

          {/* Related Policies */}
          <div className="mt-8">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Chính sách liên quan
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {POLICY_LINKS.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="bg-white border border-gray-100 rounded-xl px-4 py-3 text-center text-sm font-medium text-gray-600 hover:border-blue-1/30 hover:text-blue-1 hover:shadow-sm transition-all"
                >
                  {p.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Last updated */}
          {lastUpdated && (
            <p className="text-center text-xs text-gray-400 mt-8">
              Cập nhật lần cuối: {lastUpdated}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
