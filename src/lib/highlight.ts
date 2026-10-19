import { codeToHtml } from "shiki";
import { transformerNotationDiff } from "@shikijs/transformers";
export const highlight = (code: string, lang = "css") =>
  codeToHtml(code || "// 此阶段暂无内容", {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    transformers: [transformerNotationDiff({ matchAlgorithm: "v3" })],
  });
export async function highlightPair(
  before: string,
  after: string,
  lang: string,
) {
  async function side(code: string, other: string, kind: string) {
    const lines = code.split("\n");
    const unchanged = new Set(other.split("\n"));
    return codeToHtml(
      code ||
        (lang === "markdown" ? "此阶段暂无内容。" : "/* 此阶段暂无内容 */"),
      {
        lang,
        themes: { light: "github-light", dark: "github-dark" },
        transformers: [
          {
            line(node, line) {
              if (
                code &&
                lines[line - 1]?.trim() &&
                !unchanged.has(lines[line - 1])
              )
                this.addClassToHast(node, kind);
            },
          },
        ],
      },
    );
  }
  const [left, right] = await Promise.all([
    side(before, after, "remove"),
    side(after, before, "add"),
  ]);
  return { before: left, after: right };
}
