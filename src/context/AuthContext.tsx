// @ts-nocheck — Dead file: customer auth removed (guest-only checkout)
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import * as authService from "@/lib/api/services/authService";
import { clearTokens, getAccessToken } from "@/lib/api/client";
import type { User, LoginDto, RegisterDto } from "@/types";

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------

interface IAuthContext {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (dto: LoginDto) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Context creation
// ---------------------------------------------------------------------------

const AuthContext = createContext<IAuthContext | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: restore session if an access token is present
  useEffect(() => {
    const restore = async () => {
      const token = getAccessToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await authService.getMe();
        setUser(me);
      } catch {
        // Token invalid or expired — tokens have already been cleared by the
        // axios interceptor, but call clearTokens defensively.
        clearTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restore();
  }, []);

  // -------------------------------------------------------------------------
  // Auth actions
  // -------------------------------------------------------------------------

  const login = async (dto: LoginDto): Promise<void> => {
    const result = await authService.login(dto);
    setUser(result.user);
  };

  const googleLogin = async (idToken: string): Promise<void> => {
    const result = await authService.googleLogin(idToken);
    setUser(result.user);
  };

  const register = async (dto: RegisterDto): Promise<void> => {
    const result = await authService.register(dto);
    setUser(result.user);
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setUser(null);
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        googleLogin,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
