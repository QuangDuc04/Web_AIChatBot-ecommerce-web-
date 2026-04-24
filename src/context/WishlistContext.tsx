"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
  useRef,
} from "react";

const STORAGE_KEY = "packing_wishlist";

interface IWishlistContext {
  wishlistIds: Set<string>;
  count: number;
  toggle: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<IWishlistContext | null>(null);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const isInitialized = useRef(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        setWishlistIds(new Set(parsed));
      }
    } catch {
      // Corrupted localStorage
    }
    isInitialized.current = true;
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (!isInitialized.current) return;
    try {
      if (wishlistIds.size === 0) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...wishlistIds]));
      }
    } catch {
      // localStorage unavailable
    }
  }, [wishlistIds]);

  const isInWishlist = useCallback(
    (productId: string) => wishlistIds.has(productId),
    [wishlistIds],
  );

  const toggle = useCallback((productId: string) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  }, []);

  return (
    <WishlistContext.Provider
      value={{ wishlistIds, count: wishlistIds.size, toggle, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): IWishlistContext => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
};
