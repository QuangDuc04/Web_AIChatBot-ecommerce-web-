"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

type AuthModalView = "login" | "register" | "forgot";

interface IAuthModalContext {
  isOpen: boolean;
  view: AuthModalView;
  openLogin: () => void;
  openRegister: () => void;
  openForgot: () => void;
  close: () => void;
  switchView: (view: AuthModalView) => void;
}

const AuthModalContext = createContext<IAuthModalContext | null>(null);

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<AuthModalView>("login");

  const openLogin = useCallback(() => { setView("login"); setIsOpen(true); }, []);
  const openRegister = useCallback(() => { setView("register"); setIsOpen(true); }, []);
  const openForgot = useCallback(() => { setView("forgot"); setIsOpen(true); }, []);
  const close = useCallback(() => { setIsOpen(false); }, []);
  const switchView = useCallback((v: AuthModalView) => { setView(v); }, []);

  return (
    <AuthModalContext.Provider value={{ isOpen, view, openLogin, openRegister, openForgot, close, switchView }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used within AuthModalProvider");
  return ctx;
};
