import type { System } from "../../../data/setup";

/** Absolute sample path used in terminal output and the readiness sidebar. */
export function projectPath(system: System, folder = "my-homepage") {
  if (system === "windows") return `C:\\Users\\student\\${folder}`;
  if (system === "mac") return `/Users/student/${folder}`;
  return `/home/student/${folder}`;
}

/** Compact path shown in the prompt line of a simulated terminal. */
export function promptPath(system: System, folder = "my-homepage") {
  return system === "windows" ? projectPath(system, folder) : `~/${folder}`;
}

/** PowerShell uses `>`; POSIX shells use `$`. */
export function shellSigil(system: System) {
  return system === "windows" ? ">" : "$";
}
