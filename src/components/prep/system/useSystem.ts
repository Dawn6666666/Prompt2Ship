import { usePreference } from "../../../lib/usePreference";
import type { System } from "../../../data/setup";

const systemIds = ["windows", "mac", "linux"] as const;

/** The chosen operating system is shared by every preparation island. */
export function useSystem() {
  return usePreference<System>("p2s:system", "windows", systemIds);
}
