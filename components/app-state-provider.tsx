'use client'

import API from "@/lib/api";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type AppStateContextType = {
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  cartCount: number;
  isCartSyncing: boolean;
  login: (token: string, userId: string) => Promise<void>;
  logout: () => void;
  refreshCartCount: () => Promise<void>;
  bumpCartCount: (delta: number) => void;
  setCartCountFromItems: (items: Array<{ quantity?: number }>) => void;
};

const AppStateContext = createContext<AppStateContextType | null>(null);

function getStoredAuth() {
  if (typeof window === "undefined") return { token: null, userId: null };
  return {
    token: window.localStorage.getItem("token"),
    userId: window.localStorage.getItem("userId"),
  };
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [isCartSyncing, setIsCartSyncing] = useState(false);

  const syncAuthFromStorage = useCallback(() => {
    const auth = getStoredAuth();
    setToken(auth.token);
    setUserId(auth.userId);
    if (!auth.token || !auth.userId) {
      setCartCount(0);
    }
  }, []);

  const refreshCartCount = useCallback(async () => {
    const auth = getStoredAuth();
    if (!auth.userId) {
      setCartCount(0);
      return;
    }

    setIsCartSyncing(true);
    try {
      const res = await API.get(`/cart/${auth.userId}`);
      const count = (res.data || []).reduce(
        (sum: number, item: { quantity?: number }) => sum + (Number(item?.quantity) || 0),
        0
      );
      setCartCount(count);
    } catch {
      // Keep the previous badge count if sync fails.
    } finally {
      setIsCartSyncing(false);
    }
  }, []);

  const login = useCallback(async (nextToken: string, nextUserId: string) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("token", nextToken);
      window.localStorage.setItem("userId", nextUserId);
    }
    setToken(nextToken);
    setUserId(nextUserId);
    await refreshCartCount();
  }, [refreshCartCount]);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("userId");
    }
    setToken(null);
    setUserId(null);
    setCartCount(0);
  }, []);

  const bumpCartCount = useCallback((delta: number) => {
    setCartCount((prev) => Math.max(0, prev + delta));
  }, []);

  const setCartCountFromItems = useCallback((items: Array<{ quantity?: number }>) => {
    const count = (items || []).reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0);
    setCartCount(count);
  }, []);

  useEffect(() => {
    syncAuthFromStorage();
  }, [syncAuthFromStorage]);

  useEffect(() => {
    if (!token || !userId) return;
    refreshCartCount();
  }, [pathname, token, userId, refreshCartCount]);

  useEffect(() => {
    const onStorage = () => syncAuthFromStorage();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [syncAuthFromStorage]);

  const value = useMemo<AppStateContextType>(() => ({
    token,
    userId,
    isAuthenticated: Boolean(token && userId),
    cartCount,
    isCartSyncing,
    login,
    logout,
    refreshCartCount,
    bumpCartCount,
    setCartCountFromItems,
  }), [token, userId, cartCount, isCartSyncing, login, logout, refreshCartCount, bumpCartCount, setCartCountFromItems]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState must be used inside AppStateProvider");
  }
  return ctx;
}

