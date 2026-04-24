"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useAuthModal } from "@/context/AuthModalContext";
import GoogleLoginButton from "@/components/GoogleLoginButton";

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSwitchToForgot: () => void;
}

export default function LoginForm({ onSwitchToRegister, onSwitchToForgot }: LoginFormProps) {
  const { login } = useAuth();
  const { close } = useAuthModal();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      close();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Email hoặc mật khẩu không đúng. Vui lòng thử lại.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-[8px] text-red-600 text-sm">
            {error}
          </div>
        )}

        <label className="block mb-1 text-sm font-medium text-main">Email</label>
        <Input
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <label className="block mb-1 text-sm font-medium text-main">Mật khẩu</label>
        <Input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <div className="flex justify-end mt-1 mb-2">
          <button
            type="button"
            onClick={onSwitchToForgot}
            className="text-sm text-[#1a7a74] font-[500] hover:underline"
          >
            Quên mật khẩu?
          </button>
        </div>

        <Button type="submit" disabled={isSubmitting} variant="primary" size="md" className="w-full">
          {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
        </Button>
      </form>

      {/* Separator */}
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-sm text-gray-400">hoặc</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Google Login */}
      <GoogleLoginButton onError={(msg) => setError(msg)} />

      {/* Switch to register */}
      <p className="mt-4 text-center text-sm text-gray-500">
        Chưa có tài khoản?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-blue-1 font-medium hover:underline"
        >
          Đăng ký
        </button>
      </p>
    </>
  );
}
