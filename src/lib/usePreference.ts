import { useEffect, useState } from "react";

export const systems = ["Windows", "macOS", "Linux"] as const;
export type OperatingSystem = (typeof systems)[number];

/** A browser-only preference shared by independent Astro islands. */
export function usePreference<T extends string>(
  key: string,
  fallback: T,
  allowed: readonly T[],
) {
  const [value, update] = useState<T>(fallback);
  useEffect(() => {
    const read = () => {
      try {
        const saved = localStorage.getItem(key) as T;
        if (allowed.includes(saved)) update(saved);
      } catch {
        /* Private browsing can disable storage. */
      }
    };
    read();
    window.addEventListener("storage", read);
    window.addEventListener("p2s-preference", read);
    return () => {
      window.removeEventListener("storage", read);
      window.removeEventListener("p2s-preference", read);
    };
  }, [key, allowed]);
  const setValue = (next: T) => {
    update(next);
    try {
      localStorage.setItem(key, next);
    } catch {
      /* Keep the current session usable. */
    }
    window.dispatchEvent(new Event("p2s-preference"));
  };
  return [value, setValue] as const;
}
