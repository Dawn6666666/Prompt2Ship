import { useEffect, useState } from "react";
const key = "p2s:progress:v2";
export function readProgress(): Record<string, Record<string, boolean>> {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return {};
    // Keep old self-checks as historical records, not evidence that the new lessons are done.
    let migrated = false;
    for (const name of Object.keys(localStorage).filter((k) =>
      k.startsWith("p2s-practice-"),
    )) {
      try {
        const old = JSON.parse(localStorage.getItem(name) || "null");
        if (old && typeof old.complete === "boolean") {
          parsed.legacy = { ...parsed.legacy, [name.slice(13)]: old.complete };
          localStorage.setItem(key, JSON.stringify(parsed));
          localStorage.removeItem(name);
          migrated = true;
        }
      } catch {
        /* An unreadable legacy record is left untouched. */
      }
    }
    if (migrated) localStorage.setItem(key, JSON.stringify(parsed));
    return parsed;
  } catch {
    return {};
  }
}
export function useProgress(page: string, check: string) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const read = () => setDone(readProgress()[page]?.[check] === true);
    read();
    window.addEventListener("p2s-progress", read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener("p2s-progress", read);
      window.removeEventListener("storage", read);
    };
  }, [page, check]);
  function update(value: boolean) {
    setDone(value);
    try {
      const p = readProgress();
      p[page] = { ...p[page], [check]: value };
      localStorage.setItem(key, JSON.stringify(p));
      window.dispatchEvent(new Event("p2s-progress"));
    } catch {}
  }
  return [done, update] as const;
}
