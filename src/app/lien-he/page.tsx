"use client";

import { useState } from "react";
import {
  Clock3,
  MailCheck,
  MapPin,
  PhoneCall,
  Send,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { Input, TextArea } from "@/components/ui/Input";
import { app } from "@/config/constants";
import { Button } from "@/components/ui/Button";
import Breadcrumb from "@/components/Breadcrumb";
import { submitContact } from "@/lib/api/services/contactService";

const contactInfo = [
  { icon: MapPin, title: "Địa chỉ", content: app.address },
  {
    icon: Clock3,
    title: "Giờ làm việc",
    content: "8h - 20h | Thứ 2 - Chủ nhật",
  },
  {
    icon: PhoneCall,
    title: "Hotline / Zalo",
    content: `${app.phones?.[0]}${app.phones?.[1] ? ` - ${app.phones[1]}` : ""}`,
  },
  { icon: MailCheck, title: "Email", content: app.email },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    try {
      await submitContact({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        content: (formData.get("content") as string) || undefined,
        type: "contact",
      });
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gửi thất bại. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container py-6">
      <Breadcrumb
        crumbs={[{ href: "/lien-he", label: "Liên hệ", isLast: true }]}
      />

      {/* Hero */}
      <div className="mt-6 mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-10 h-[3px] bg-[#1a7a74] rounded-full" />
          <span className="text-[13px] font-[700] text-[#1a7a74] uppercase tracking-[2px]">
            Liên hệ
          </span>
          <div className="w-10 h-[3px] bg-[#1a7a74] rounded-full" />
        </div>
        <h1 className="text-[24px] sm:text-[30px] font-[800] text-gray-900">
          Chúng tôi luôn <span className="text-[#1a7a74]">sẵn sàng</span> hỗ trợ
        </h1>
        <p className="text-[15px] text-gray-500 mt-2 max-w-xl mx-auto">
          Liên hệ ngay để được tư vấn miễn phí về sản phẩm và dịch vụ phù hợp
          nhất.
        </p>
      </div>

      {/* Contact info cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
        {contactInfo.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 sm:p-5 text-center group hover:-translate-y-1 transition-all duration-400"
            style={{
              boxShadow:
                "0 2px 8px rgba(26,122,116,0.08), 0 8px 24px rgba(26,122,116,0.06)",
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-[#edf9f8] flex items-center justify-center mx-auto mb-3 group-hover:bg-[#1a7a74] group-hover:scale-110 transition-all duration-400">
              <item.icon
                size={22}
                className="text-[#1a7a74] group-hover:text-white transition-colors duration-400"
              />
            </div>
            <p className="font-[700] text-[14px] text-gray-800 mb-1">
              {item.title}
            </p>
            <p className="text-[14px] text-gray-500 leading-relaxed">
              {item.content}
            </p>
          </div>
        ))}
      </div>

      {/* Form + Map */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Form */}
        <div
          className="lg:w-1/2 w-full bg-white rounded-2xl p-6 sm:p-8"
          style={{
            boxShadow:
              "0 2px 8px rgba(26,122,116,0.08), 0 8px 24px rgba(26,122,116,0.06)",
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#edf9f8] flex items-center justify-center">
              <Send size={18} className="text-[#1a7a74]" />
            </div>
            <div>
              <h2 className="font-[700] text-[18px] text-gray-800">
                Gửi tin nhắn
              </h2>
              <p className="text-[14px] text-gray-400">
                Chúng tôi sẽ phản hồi trong 24h
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle size={48} className="mx-auto text-green-500 mb-3" />
              <p className="text-[16px] font-[700] text-gray-800 mb-1">
                Gửi thành công!
              </p>
              <p className="text-[14px] text-gray-500 mb-4">
                Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-[14px] font-[600] text-[#1a7a74] hover:underline"
              >
                Gửi tin nhắn khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleOnSubmit} className="space-y-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[14px] font-[600] text-gray-600 mb-1.5">
                    Họ và Tên
                  </label>
                  <Input
                    placeholder="Nguyễn Văn A"
                    name="name"
                    type="text"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-[600] text-gray-600 mb-1.5">
                    Số điện thoại
                  </label>
                  <Input
                    placeholder="0347 366 345"
                    name="phone"
                    type="tel"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[14px] font-[600] text-gray-600 mb-1.5">
                  Email
                </label>
                <Input
                  placeholder="example@email.com"
                  name="email"
                  type="email"
                  required
                />
              </div>
              <div>
                <label className="block text-[14px] font-[600] text-gray-600 mb-1.5">
                  Nội dung
                </label>
                <TextArea
                  rows={4}
                  name="content"
                  placeholder="Nội dung cần tư vấn..."
                />
              </div>
              {error && <p className="text-[14px] text-red-500">{error}</p>}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Map */}
        <div className="lg:w-1/2 w-full">
          <div
            className="bg-white rounded-2xl overflow-hidden h-full min-h-[400px]"
            style={{
              boxShadow:
                "0 2px 8px rgba(26,122,116,0.08), 0 8px 24px rgba(26,122,116,0.06)",
            }}
          >
            <iframe
              src={app.mapEmbed}
              width="100%"
              height="100%"
              className="min-h-[400px] lg:min-h-full"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
