import { codeToHtml } from "shiki";
import { createTwoFilesPatch, diffLines } from "diff";

const themes = { light: "github-light", dark: "github-dark" };
export const highlight = (code: string, lang = "css") =>
  codeToHtml(code || "// 此阶段暂无代码", { lang, themes });

export function changedLines(before: string, after: string) {
  const removed = new Set<number>();
  const added = new Set<number>();
  let left = 1;
  let right = 1;
  for (const part of diffLines(before, after)) {
    const count = part.count ?? 0;
    if (part.removed) {
      for (let i = 0; i < count; i++) removed.add(left++);
    } else if (part.added) {
      for (let i = 0; i < count; i++) added.add(right++);
    } else {
      left += count;
      right += count;
    }
  }
  return { removed, added };
}
export type HighlightPair = {
  before: string;
  after: string;
  unified: string;
  additions: number;
  deletions: number;
};
export async function highlightPair(
  before: string,
  after: string,
  lang: string,
): Promise<HighlightPair> {
  const { removed, added } = changedLines(before, after);
  const side = (code: string, lines: Set<number>, kind: string) =>
    codeToHtml(
      code ||
        (lang === "markdown" ? "此阶段尚未创建。" : "/* 此阶段尚未创建 */"),
      {
        lang,
        themes,
        transformers: [
          {
            line(node, line) {
              node.properties[
                `data-${kind === "remove" ? "before" : "after"}-line`
              ] = line;
              if (lines.has(line)) this.addClassToHast(node, kind);
            },
          },
        ],
      },
    );
  const patch =
    before === after
      ? "本阶段没有代码变更。"
      : createTwoFilesPatch("before", "after", before, after, "", "", {
          context: 3,
        });
  const patchLines = patch.split("\n");
  let oldLine = 0;
  let newLine = 0;
  const [left, right, unified] = await Promise.all([
    side(before, removed, "remove"),
    side(after, added, "add"),
    codeToHtml(patch, {
      lang: before === after ? "text" : "diff",
      themes,
      transformers: [
        {
          line(node, line) {
            const text = patchLines[line - 1] || "";
            const hunk = /^@@ -(\d+)(?:,\d+)? \+(\d+)/.exec(text);
            if (hunk) {
              oldLine = Number(hunk[1]);
              newLine = Number(hunk[2]);
              return;
            }
            if (!oldLine && !newLine) return;
            if (text.startsWith("-"))
              node.properties["data-before-line"] = oldLine++;
            else if (text.startsWith("+"))
              node.properties["data-after-line"] = newLine++;
            else if (text.startsWith(" ")) {
              node.properties["data-before-line"] = oldLine++;
              node.properties["data-after-line"] = newLine++;
            }
          },
        },
      ],
    }),
  ]);
  return {
    before: left,
    after: right,
    unified,
    additions: added.size,
    deletions: removed.size,
  };
}
