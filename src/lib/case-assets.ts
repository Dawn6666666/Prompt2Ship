// Server-only: Shiki and diff never enter the client bundle.
import { highlight, highlightPair } from "./highlight";
import { homepageVersions } from "../data/homepage";
import { todoChanges } from "../data/todo";
export async function caseAssets() {
  const fixed = todoChanges[2].after;
  const broken = fixed.replace(
    "notes !== undefined ? notes.trim() : existing.notes",
    "(notes ?? '').trim()",
  );
  const [source, sourceAfter, diff, todoDiffs, fix] = await Promise.all([
    highlight(homepageVersions.v1, "html"),
    highlight(homepageVersions.v2, "html"),
    highlightPair(homepageVersions.v1, homepageVersions.v2, "html"),
    Promise.all(
      todoChanges.map((c) => highlightPair(c.before, c.after, c.lang)),
    ),
    highlightPair(broken, fixed, "javascript"),
  ]);
  return { source, sourceAfter, diff, todoDiffs, fix };
}
