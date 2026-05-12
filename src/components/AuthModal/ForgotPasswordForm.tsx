"use client";

import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { forgotPassword } from "@/lib/api/services/authService";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";

interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
}

export default function ForgotPasswordForm({ onSwitchToLogin }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="w-16 h-16 bg-[#edf9f8] rounded-full flex items-center justify-center mx-auto">
          <CheckCircle size={32} className="text-[#1a7a74]" />
        </div>
        <p className="font-[700] text-gray-800 text-lg">Kiểm tra email</p>
        <p className="text-sm text-gray-500 leading-relaxed">
          Nếu email <strong className="text-gray-700">{email}</strong> tồn tại, bạn sẽ nhận được link đặt lại mật khẩu. Link có hiệu lực trong <strong>1 giờ</strong>.
        </p>
        <p className="text-xs text-gray-400">
          Không nhận được?{" "}
          <button
            onClick={() => { setSent(false); setEmail(""); }}
            className="text-[#1a7a74] font-[600] hover:underline"
          >
            Thử lại
          </button>
        </p>
        <button
          onClick={onSwitchToLogin}
          className="inline-flex items-center gap-1.5 text-sm font-[600] text-[#1a7a74] hover:underline mt-2"
        >
          <ArrowLeft size={14} /> Quay lại đăng nhập
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-5">
        <div className="w-14 h-14 bg-[#edf9f8] rounded-full flex items-center justify-center mx-auto mb-3">
          <Mail size={24} className="text-[#1a7a74]" />
        </div>
        <p className="font-[700] text-gray-800 text-lg">Quên mật khẩu?</p>
        <p className="text-sm text-gray-500 mt-1">
          Nhập email đăng ký để nhận link đặt lại mật khẩu.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <Input
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <Button type="submit" disabled={isSubmitting} variant="primary" size="md" className="w-full">
          {isSubmitting ? "Đang gửi..." : "Gửi link đặt lại"}
        </Button>
      </form>

      <p className="mt-4 text-center">
        <button
          onClick={onSwitchToLogin}
          className="inline-flex items-center gap-1.5 text-sm font-[600] text-[#1a7a74] hover:underline"
        >
          <ArrowLeft size={14} /> Quay lại đăng nhập
        </button>
      </p>
    </>
  );
}
