import { todoChanges } from "./todo";

// The initial implementation must show the very defect reproduced by the
// verification script, rather than accidentally presenting v2 as v1.
export function todoCodeAfter(index: number, version: "v1" | "v2") {
  const after = todoChanges[index].after;
  return index === 2 && version === "v1"
    ? after.replace(
        "notes !== undefined ? notes.trim() : existing.notes",
        "(notes ?? '').trim()",
      )
    : after;
}
