"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { BrandLoader } from "@/components/ui/BrandLoader";

// Fast responses never flash the loader; once shown it stays long enough to read.
const SHOW_DELAY_MS = 200;
const MIN_VISIBLE_MS = 450;

interface LoadingContextValue {
  /** Wrap an API call: `const data = await track(api.get(...), "Fetching title deed")`. */
  track: <T>(promise: Promise<T>, label?: string) => Promise<T>;
  isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextValue | null>(null);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState(0);
  const [label, setLabel] = useState("Loading");
  const [visible, setVisible] = useState(false);
  const shownAt = useRef(0);

  useEffect(() => {
    if (pending > 0) {
      if (visible) return;
      const timer = setTimeout(() => {
        shownAt.current = Date.now();
        setVisible(true);
      }, SHOW_DELAY_MS);
      return () => clearTimeout(timer);
    }
    if (!visible) return;
    const timer = setTimeout(() => setVisible(false), Math.max(0, MIN_VISIBLE_MS - (Date.now() - shownAt.current)));
    return () => clearTimeout(timer);
  }, [pending, visible]);

  const track = useCallback(<T,>(promise: Promise<T>, nextLabel?: string) => {
    setLabel(nextLabel ?? "Loading");
    setPending((n) => n + 1);
    return promise.finally(() => setPending((n) => n - 1));
  }, []);

  const value = useMemo(() => ({ track, isLoading: pending > 0 }), [track, pending]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {visible && <BrandLoader variant="overlay" label={label} />}
    </LoadingContext.Provider>
  );
}

export function useApiLoader(): LoadingContextValue {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useApiLoader must be used inside <LoadingProvider>");
  return ctx;
}
