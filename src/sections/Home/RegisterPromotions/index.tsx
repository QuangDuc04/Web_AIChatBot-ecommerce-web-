"use client";

import { useState } from "react";
import { Input, TextArea } from "@/components/ui/Input";
import { app } from "@/config/constants";
import {
  Send,
  Loader2,
  CheckCircle,
  Phone,
  Mail,
  MessageSquareText,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { submitContact } from "@/lib/api/services/contactService";

const RegisterPromotions = () => {
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
        type: "quote",
      });
      setSubmitted(true);
      e.currentTarget.reset();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gửi thất bại. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="sm:my-4 my-2">
      <div
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0d4f4a] via-[#136b63] to-[#1a8a80] sm:p-0 p-0"
        style={{ boxShadow: "0 20px 60px rgba(13,79,74,0.25)" }}
      >
        {/* ── Background decorative elements ── */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#1fb0a8]/10 -translate-y-1/2 translate-x-1/4 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#0d4f4a]/40 translate-y-1/2 -translate-x-1/4 blur-3xl" />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative flex flex-col lg:flex-row">
          {/* ── Left: Info side ── */}
          <div className="lg:w-[42%] w-full flex flex-col justify-center p-6 sm:p-10 lg:p-12 lg:pr-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-1.5 mb-4 sm:mb-5 w-fit">
              <Send size={13} className="text-[#5ee6db]" />
              <span className="text-[11px] sm:text-[12px] font-[700] text-[#5ee6db] uppercase tracking-[2px]">
                Liên hệ tư vấn
              </span>
            </div>

            <h2 className="text-white font-[800] text-[22px] sm:text-[28px] lg:text-[32px] leading-tight mb-3 sm:mb-4">
              Đăng ký nhận
              <br />
              <span className="text-[#5ee6db]">báo giá ngay</span>
            </h2>
            <p className="text-white/60 text-[14px] sm:text-[15px] leading-relaxed mb-6 sm:mb-8 max-w-md">
              <strong className="text-white/80">{app.shopName}</strong> luôn sẵn
              sàng hỗ trợ mọi đơn hàng và giải đáp thắc mắc nhanh chóng nhất.
            </p>

            {/* Quick contact info */}
            <div className="hidden lg:flex flex-col gap-3">
              {[
                {
                  icon: Phone,
                  label: "Hotline",
                  value: "1800 234 573",
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: "support@namnguyeninfotech.com",
                },
                {
                  icon: MessageSquareText,
                  label: "Tư vấn",
                  value: "24/7 hỗ trợ trực tuyến",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/5 flex items-center justify-center shrink-0">
                    <item.icon size={16} className="text-[#5ee6db]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-white/40 font-[600] uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p className="text-[14px] text-white/80 font-[500]">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Form side ── */}
          <div className="lg:w-[58%] w-full p-5 sm:p-8 lg:p-10">
            <div
              className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 h-full"
              style={{
                boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
              }}
            >
              {submitted ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-16 h-16 rounded-full bg-[#e8faf9] flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-[#1a7a74]" />
                  </div>
                  <p className="text-[20px] font-[700] text-gray-900 mb-2">
                    Đăng ký thành công!
                  </p>
                  <p className="text-gray-500 text-[14px] mb-6 max-w-xs mx-auto">
                    Chúng tôi sẽ liên hệ bạn trong thời gian sớm nhất.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-[14px] font-[600] text-[#1a7a74] hover:underline"
                  >
                    Gửi yêu cầu khác
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-5 sm:mb-6">
                    <h3 className="text-[16px] sm:text-[18px] font-[700] text-gray-900">
                      Thông tin liên hệ
                    </h3>
                    <p className="text-[13px] sm:text-[14px] text-gray-400 mt-1">
                      Điền thông tin để nhận báo giá nhanh nhất
                    </p>
                  </div>

                  <form onSubmit={handleOnSubmit}>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <Input
                          placeholder="Họ và Tên *"
                          name="name"
                          type="text"
                          required
                        />
                        <Input
                          placeholder="Số điện thoại *"
                          name="phone"
                          type="tel"
                          required
                        />
                      </div>
                      <Input
                        placeholder="Email *"
                        name="email"
                        type="email"
                        required
                      />
                      <TextArea
                        placeholder="Nội dung cần tư vấn (sản phẩm, số lượng, yêu cầu đặc biệt...)"
                        name="content"
                        rows={3}
                      />
                    </div>

                    {error && (
                      <p className="text-[14px] text-red-500 mt-3">{error}</p>
                    )}

                    <div className="mt-5 sm:mt-6">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto"
                      >
                        {isSubmitting ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : null}
                        {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu báo giá"}
                        {!isSubmitting && (
                          <Send
                            size={15}
                            className="group-hover:translate-x-1 transition-transform duration-300"
                          />
                        )}
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPromotions;
