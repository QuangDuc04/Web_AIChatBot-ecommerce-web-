"use client";

import { useState, FormEvent } from "react";
import { changePassword } from "@/lib/api/services/authService";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "Mật khẩu mới phải có ít nhất 8 ký tự." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Mật khẩu xác nhận không khớp." });
      return;
    }

    setIsSubmitting(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setMessage({ type: "success", text: "Đổi mật khẩu thành công!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const text =
        err instanceof Error ? err.message : "Không thể đổi mật khẩu. Vui lòng thử lại.";
      setMessage({ type: "error", text });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-2 border-blue-1 rounded-[8px] overflow-hidden">
      <p className="bg-blue-1 px-4 py-3 text-white text-[16px] font-bold">
        Đổi mật khẩu
      </p>
      <form className="p-6 max-w-md" onSubmit={handleSubmit}>
        {message && (
          <div
            className={`mb-4 px-4 py-3 rounded-[8px] text-sm ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-600"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-main">
              Mật khẩu hiện tại
            </label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-main">
              Mật khẩu mới
            </label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
            <p className="mt-1 text-[13px] text-gray-400">Ít nhất 8 ký tự.</p>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-main">
              Xác nhận mật khẩu mới
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
          </div>
        </div>

        <div className="mt-6">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang xử lý..." : "Đổi mật khẩu"}
          </Button>
        </div>
      </form>
    </div>
  );
}
