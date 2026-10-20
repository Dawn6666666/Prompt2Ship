import { useCallback, useEffect, useState } from "react";
export function useStage(ids: readonly string[], storageKey?: string) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const sync = () => {
      let id = location.hash.slice(1);
      if (!id && storageKey) {
        try {
          id = localStorage.getItem(storageKey) ?? "";
        } catch {
          /* Optional progress. */
        }
      }
      const i = ids.indexOf(id);
      setStage(i < 0 ? 0 : i);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [ids, storageKey]);
  const select = useCallback(
    (index: number) => {
      const next = Math.max(0, Math.min(ids.length - 1, index));
      setStage(next);
      history.replaceState(null, "", `#${ids[next]}`);
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, ids[next]);
        } catch {
          /* Optional progress. */
        }
      }
    },
    [ids, storageKey],
  );
  return [stage, select] as const;
}
