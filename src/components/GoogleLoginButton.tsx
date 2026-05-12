"use client";

import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface GoogleLoginButtonProps {
  onError?: (message: string) => void;
}

export default function GoogleLoginButton({ onError }: GoogleLoginButtonProps) {
  const { googleLogin } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) {
      onError?.("Không nhận được thông tin từ Google");
      return;
    }

    setLoading(true);
    try {
      await googleLogin(credentialResponse.credential);

      const redirectTo =
        typeof window !== "undefined"
          ? sessionStorage.getItem("auth_redirect") || "/"
          : "/";

      if (typeof window !== "undefined") {
        sessionStorage.removeItem("auth_redirect");
      }

      router.push(redirectTo);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Đăng nhập bằng Google thất bại. Vui lòng thử lại.";
      onError?.(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-2">
        <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-1 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => onError?.("Đăng nhập bằng Google thất bại")}
        size="large"
        width="100%"
        text="signin_with"
        shape="rectangular"
        theme="outline"
      />
    </div>
  );
}
