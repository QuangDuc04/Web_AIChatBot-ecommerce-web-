"use client";

import { useEffect, useState } from "react";
import { X, LogIn, UserPlus } from "lucide-react";
import { useAuthModal } from "@/context/AuthModalContext";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default function AuthModal() {
  const { isOpen, view, close, switchView } = useAuthModal();
  const { isAuthenticated } = useAuth();
  const [animState, setAnimState] = useState<"closed" | "opening" | "open" | "closing">("closed");

  // Animate open
  useEffect(() => {
    if (isOpen) {
      setAnimState("opening");
      const t = setTimeout(() => setAnimState("open"), 20);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Close modal when authenticated
  useEffect(() => {
    if (isAuthenticated && isOpen) handleClose();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Lock scroll
  useEffect(() => {
    if (animState !== "closed") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [animState]);

  const handleClose = () => {
    setAnimState("closing");
    setTimeout(() => {
      setAnimState("closed");
      close();
    }, 350);
  };

  if (animState === "closed") return null;

  const isVisible = animState === "open";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center perspective-[1200px]">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-[6px] transition-opacity duration-350 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`auth-modal relative bg-white rounded-3xl w-full max-w-[420px] mx-4 max-h-[90vh] overflow-hidden transition-all duration-350 ${
          isVisible
            ? "opacity-100 scale-100 translate-y-0 rotate-x-0"
            : "opacity-0 scale-95 translate-y-6 rotate-x-[-4deg]"
        }`}
        style={{
          boxShadow: isVisible
            ? '0 30px 80px rgba(26,122,116,0.15), 0 8px 30px rgba(0,0,0,0.12), 0 0 0 1px rgba(26,122,116,0.05)'
            : 'none',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Top decorative gradient bar */}
        <div className="h-1 bg-gradient-to-r from-[#1a7a74] via-[#31c9c0] to-[#1a7a74]" />

        {/* Header with tabs */}
        <div className="relative px-6 pt-5 pb-0">
          {/* Close */}
          <button
            onClick={handleClose}
            aria-label="Đóng"
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 hover:rotate-90 transition-all duration-300"
          >
            <X size={16} />
          </button>

          {/* Tab buttons — hide on forgot view */}
          {view !== "forgot" && (
            <div className="flex gap-2 mb-5">
              <button
                onClick={() => switchView("login")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[14px] font-[600] transition-all duration-300 ${
                  view === "login"
                    ? "bg-[#1a7a74] text-white shadow-[0_4px_15px_rgba(26,122,116,0.25)]"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                <LogIn size={15} />
                Đăng nhập
              </button>
              <button
                onClick={() => switchView("register")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[14px] font-[600] transition-all duration-300 ${
                  view === "register"
                    ? "bg-[#1a7a74] text-white shadow-[0_4px_15px_rgba(26,122,116,0.25)]"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                <UserPlus size={15} />
                Đăng ký
              </button>
            </div>
          )}
        </div>

        {/* Content with slide transition */}
        <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div
            key={view}
            className="animate-[authSlideIn_0.3s_ease-out]"
          >
            {view === "login" && (
              <LoginForm onSwitchToRegister={() => switchView("register")} onSwitchToForgot={() => switchView("forgot")} />
            )}
            {view === "register" && (
              <RegisterForm onSwitchToLogin={() => switchView("login")} />
            )}
            {view === "forgot" && (
              <ForgotPasswordForm onSwitchToLogin={() => switchView("login")} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
