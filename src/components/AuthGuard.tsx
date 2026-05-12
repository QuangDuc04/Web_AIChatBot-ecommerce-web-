"use client";

import { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface IAuthGuard {
  children: ReactNode;
}

/**
 * Wraps protected pages.
 * - While authentication is loading, renders a centred loading spinner.
 * - If the user is not authenticated, stores the current path in sessionStorage
 *   and redirects to /dang-nhap.
 * - Once authenticated, renders children normally.
 */
const AuthGuard = ({ children }: IAuthGuard) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      // Store the requested path so the login page can redirect back after success
      if (typeof window !== "undefined") {
        sessionStorage.setItem("auth_redirect", pathname);
      }
      router.push("/dang-nhap");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-1 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Return null while the redirect is in flight
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
