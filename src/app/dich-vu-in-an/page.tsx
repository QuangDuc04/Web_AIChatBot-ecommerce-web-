"use client";

import Breadcrumb from "@/components/Breadcrumb";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Package,
  Zap,
  Phone,
  MessageCircle,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { app } from "@/config/constants";

const services = [
  {
    icon: "🧾",
    title: "In Hóa Đơn",
    desc: "Giấy hóa đơn chuyên dụng, độ sắc nét cao, giao hàng nhanh",
    details: [
      "Giấy chuyên dụng",
      "Sắc nét hoàn hảo",
      "Giao hàng 24h",
      "Giá cạnh tranh",
    ],
    num: "01",
  },
  {
    icon: "🏷️",
    title: "In Tem Decal Nhiệt",
    desc: "Tem decal bền đẹp, không phai — lý tưởng cho thương mại điện tử",
    details: [
      "Chống phai màu",
      "Nhiều kích cỡ",
      "Hỗ trợ thiết kế",
      "Chất lượng cao",
    ],
    num: "02",
  },
  {
    icon: "📦",
    title: "In Nhãn Dán",
    desc: "Nhãn dán chuyên dụng với thiết kế tuyệt đẹp theo yêu cầu",
    details: [
      "Thiết kế tuỳ chỉnh",
      "Vật liệu cao cấp",
      "In số lượng nhỏ",
      "File chuẩn in",
    ],
    num: "03",
  },
  {
    icon: "🖨️",
    title: "In Bảng Quảng Cáo",
    desc: "Bảng quảng cáo bền, sắc nét, kích cỡ tuỳ ý theo nhu cầu",
    details: [
      "Kích cỡ tuỳ chỉnh",
      "Chất lượng cao",
      "Dễ thi công",
      "Giá hợp lý",
    ],
    num: "04",
  },
];

const benefits = [
  { icon: Zap, title: "Nhanh Chóng", desc: "Giao hàng trong 24-48h" },
  { icon: CheckCircle, title: "Chất Lượng", desc: "Kiểm tra kỹ lưỡng" },
  { icon: Package, title: "An Toàn", desc: "Đóng gói chắc chắn" },
  { icon: Clock, title: "Hỗ Trợ 24/7", desc: "Tư vấn mọi lúc" },
];

const steps = [
  { num: "01", title: "Tư Vấn", desc: "Liên hệ để trao đổi yêu cầu" },
  { num: "02", title: "Thiết Kế", desc: "Hoàn thiện file in ấn" },
  { num: "03", title: "In Ấn", desc: "Sản xuất chất lượng cao" },
  { num: "04", title: "Giao Hàng", desc: "Đóng gói & giao nhanh" },
];

const faqs = [
  {
    q: "Thời gian giao hàng bao lâu?",
    a: "Thông thường từ 24-48 giờ. Đơn cấp tốc có thể xử lý trong 12 giờ.",
  },
  {
    q: "Có thể đặt in số lượng nhỏ không?",
    a: "Có, chúng tôi nhận in từ số lượng nhỏ. Liên hệ để được tư vấn giá tốt nhất.",
  },
  {
    q: "Chất lượng in như thế nào?",
    a: "Sử dụng máy in hiện đại, vật liệu cao cấp. Kiểm tra kỹ lưỡng trước khi giao.",
  },
  {
    q: "Có hỗ trợ sửa thiết kế không?",
    a: "Hỗ trợ sửa đổi miễn phí cho đến khi bạn hài lòng.",
  },
];

const stats = [
  { stat: "500+", label: "Khách hàng" },
  { stat: "10,000+", label: "Đơn hàng" },
  { stat: "24/7", label: "Hỗ trợ" },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{
        boxShadow:
          "0 1px 4px rgba(26,122,116,0.06), 0 4px 12px rgba(26,122,116,0.04)",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left group"
      >
        <div className="flex items-center gap-3">
          <HelpCircle size={18} className="text-[#1a7a74] flex-shrink-0" />
          <span className="font-[600] text-[15px] text-gray-800 group-hover:text-[#1a7a74] transition-colors">
            {q}
          </span>
        </div>
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform duration-300 flex-shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-40 pb-5" : "max-h-0"}`}
      >
        <p className="px-5 pl-12 text-[14px] text-gray-500 leading-relaxed">
          {a}
        </p>
      </div>
    </div>
  );
}

export default function PrintServicePage() {
  return (
    <main className="container py-6 space-y-12 sm:space-y-16">
      <div>
        <Breadcrumb
          crumbs={[
            { href: "/dich-vu-in-an", label: "Dịch vụ in ấn", isLast: true },
          ]}
        />

        <PageHeader
          badge="Dịch vụ chuyên nghiệp"
          title="Dịch vụ in ấn chất lượng cao"
          subtitle="Từ hóa đơn, tem decal đến nhãn dán — xử lý nhanh, giá cạnh tranh"
        >
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/lien-he">
              <Button variant="primary" size="sm">
                Liên hệ ngay <ArrowRight size={15} />
              </Button>
            </Link>
            <a href="tel:0347366345">
              <Button variant="outline" size="sm">
                <Phone size={15} /> 0347.366.345
              </Button>
            </a>
          </div>
        </PageHeader>

        {/* Stats */}
        <div className="flex flex-wrap gap-8 sm:gap-12 mb-4">
          {stats.map((s, i) => (
            <div key={i} className="flex items-baseline gap-2">
              <span className="text-[26px] sm:text-[30px] font-[800] text-[#1a7a74]">
                {s.stat}
              </span>
              <span className="text-gray-400 text-[14px] font-[500]">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-7 bg-[#1a7a74] rounded-full" />
          <h2 className="text-[22px] sm:text-[28px] font-[800] text-gray-900">
            Các dịch vụ <span className="text-[#1a7a74]">in ấn</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
          {services.map((s) => (
            <div
              key={s.num}
              className="relative bg-white rounded-2xl p-5 sm:p-6 group hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              style={{
                boxShadow:
                  "0 1px 4px rgba(26,122,116,0.06), 0 4px 12px rgba(26,122,116,0.04)",
              }}
            >
              <span className="absolute top-3 right-4 text-[40px] font-[900] text-gray-100/80 select-none">
                {s.num}
              </span>
              <div className="relative">
                <span className="text-3xl mb-3 block">{s.icon}</span>
                <h3 className="font-[700] text-[17px] text-gray-800 group-hover:text-[#1a7a74] transition-colors duration-200 mb-2">
                  {s.title}
                </h3>
                <p className="text-[14px] text-gray-500 mb-4 leading-relaxed">
                  {s.desc}
                </p>
                <ul className="grid grid-cols-2 gap-2">
                  {s.details.map((d, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-[14px] text-gray-600"
                    >
                      <CheckCircle
                        size={14}
                        className="text-[#1a7a74] flex-shrink-0"
                      />{" "}
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="relative bg-[#edf9f8]/60 rounded-2xl sm:rounded-3xl p-6 sm:p-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-7 bg-[#1a7a74] rounded-full" />
          <h2 className="text-[22px] sm:text-[28px] font-[800] text-gray-900">
            Tại sao chọn <span className="text-[#1a7a74]">{app.shopName}</span>?
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 text-center group hover:-translate-y-1 transition-all duration-300"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
            >
              <div className="w-12 h-12 rounded-xl bg-[#edf9f8] flex items-center justify-center mx-auto mb-3 group-hover:bg-[#1a7a74] transition-colors duration-300">
                <b.icon
                  size={22}
                  className="text-[#1a7a74] group-hover:text-white transition-colors duration-300"
                />
              </div>
              <p className="font-[700] text-[14px] text-gray-800 mb-1">
                {b.title}
              </p>
              <p className="text-[14px] text-gray-500">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Process */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-7 bg-[#1a7a74] rounded-full" />
          <h2 className="text-[22px] sm:text-[28px] font-[800] text-gray-900">
            Quy trình <span className="text-[#1a7a74]">làm việc</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <div key={i} className="relative">
              <div
                className="bg-white rounded-2xl p-5 sm:p-6 text-center group hover:-translate-y-1 transition-all duration-300"
                style={{
                  boxShadow:
                    "0 1px 4px rgba(26,122,116,0.06), 0 4px 12px rgba(26,122,116,0.04)",
                }}
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1a7a74] to-[#25998f] flex items-center justify-center mx-auto mb-4 text-white font-[800] text-[18px]">
                  {s.num}
                </div>
                <h3 className="font-[700] text-[15px] text-gray-800 mb-1">
                  {s.title}
                </h3>
                <p className="text-[14px] text-gray-500">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-2 -translate-y-1/2 z-10">
                  <ArrowRight size={18} className="text-[#1a7a74]/30" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-7 bg-[#1a7a74] rounded-full" />
          <h2 className="text-[22px] sm:text-[28px] font-[800] text-gray-900">
            Câu hỏi <span className="text-[#1a7a74]">thường gặp</span>
          </h2>
        </div>
        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((f, i) => (
            <FaqItem key={i} q={f.q} a={f.a} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1a7a74] via-[#1f8a84] to-[#25998f] px-6 sm:px-12 py-10 sm:py-14 text-white text-center">
        <div className="relative">
          <h2 className="text-[22px] sm:text-[28px] font-[800] mb-3">
            Sẵn sàng bắt đầu?
          </h2>
          <p className="text-white/70 text-[15px] mb-8 max-w-lg mx-auto">
            Liên hệ ngay để nhận tư vấn miễn phí và báo giá tốt nhất cho nhu cầu
            in ấn của bạn.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/lien-he">
              <Button variant="white" size="lg">
                Liên hệ ngay <MessageCircle size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
