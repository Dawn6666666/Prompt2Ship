import { portfolioHtml } from "../../data/course";
export function GET() {
  return new Response(portfolioHtml(2), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
