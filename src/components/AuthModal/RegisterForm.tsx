"use client";

import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useAuthModal } from "@/context/AuthModalContext";
import GoogleLoginButton from "@/components/GoogleLoginButton";

const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const { register } = useAuth();
  const { close } = useAuthModal();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);

  const validate = (): string | null => {
    if (!firstName.trim()) return "Vui lòng nhập họ.";
    if (!lastName.trim()) return "Vui lòng nhập tên.";
    if (!email.trim() || !isValidEmail(email)) return "Địa chỉ email không hợp lệ.";
    if (password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự.";
    if (password !== confirmPassword) return "Mật khẩu xác nhận không khớp.";
    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        ...(phone.trim() ? { phone: phone.trim() } : {}),
      });
      setRegistered(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Đăng ký không thành công. Vui lòng thử lại.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (registered) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-blue-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="font-semibold text-main text-lg">Đăng ký thành công!</p>
        <p className="text-sm text-gray-500">
          Chúng tôi đã gửi email xác nhận đến <strong>{email}</strong>.
          Vui lòng kiểm tra hộp thư và nhấn vào link xác nhận.
        </p>
        <button
          onClick={() => { onSwitchToLogin(); setRegistered(false); }}
          className="inline-block px-6 py-2 button-gradient text-white rounded-[8px] text-sm font-medium hover:opacity-90 transition"
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-[8px] text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3 sm:flex-row flex-col">
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium text-main">Họ</label>
            <Input
              type="text"
              placeholder="Nguyễn"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              autoComplete="given-name"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium text-main">Tên</label>
            <Input
              type="text"
              placeholder="Văn A"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              autoComplete="family-name"
            />
          </div>
        </div>

        <label className="block mb-1 text-sm font-medium text-main">Email</label>
        <Input
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <label className="block mb-1 text-sm font-medium text-main">
          Số điện thoại <span className="text-gray-400 font-normal">(tuỳ chọn)</span>
        </label>
        <Input
          type="tel"
          placeholder="0347 366 345"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
        />

        <label className="block mb-1 text-sm font-medium text-main">Mật khẩu</label>
        <Input
          type="password"
          placeholder="Tối thiểu 6 ký tự"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        <label className="block mb-1 text-sm font-medium text-main">Xác nhận mật khẩu</label>
        <Input
          type="password"
          placeholder="Nhập lại mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        <div className="mt-4">
          <Button type="submit" disabled={isSubmitting} variant="primary" size="md" className="w-full">
            {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
          </Button>
        </div>
      </form>

      {/* Separator */}
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-sm text-gray-400">hoặc</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Google Login */}
      <GoogleLoginButton onError={(msg) => setError(msg)} />

      {/* Switch to login */}
      <p className="mt-4 text-center text-sm text-gray-500">
        Đã có tài khoản?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-blue-1 font-medium hover:underline"
        >
          Đăng nhập
        </button>
      </p>
    </>
  );
}
