// Server-only: Shiki and diff never enter the client bundle.
import { highlight, highlightPair } from "./highlight";
import { homepageVersions } from "../data/homepage";
import { todoChanges } from "../data/todo";
import { todoCodeAfter } from "../data/todo-code";
export async function caseAssets() {
  const fixed = todoCodeAfter(2, "v2");
  const broken = todoCodeAfter(2, "v1");
  const [source, sourceAfter, diff, todoDiffs, todoInitialDiffs, fix] =
    await Promise.all([
      highlight(homepageVersions.v1, "html"),
      highlight(homepageVersions.v2, "html"),
      highlightPair(homepageVersions.v1, homepageVersions.v2, "html"),
      Promise.all(
        todoChanges.map((c) => highlightPair(c.before, c.after, c.lang)),
      ),
      Promise.all(
        todoChanges.map((c, index) =>
          highlightPair(c.before, todoCodeAfter(index, "v1"), c.lang),
        ),
      ),
      highlightPair(broken, fixed, "javascript"),
    ]);
  return { source, sourceAfter, diff, todoDiffs, todoInitialDiffs, fix };
}
