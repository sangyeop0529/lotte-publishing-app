import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { Buffer } from "node:buffer";

const MOBILE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

const readTarget = (req) => {
  const raw = new URL(req.url, "http://localhost").searchParams.get("url") || "";
  const target = new URL(raw);
  if (!/^https?:$/.test(target.protocol)) throw new Error("http/https 주소만 열 수 있어요.");
  return target;
};

/* 시안 검수 탭용 (npm run dev 에서만 동작)
 * /__overlay/check?url=  → iframe 차단 헤더 여부 확인
 * /__overlay/proxy?url=  → 차단 헤더를 지우고 모바일 UA로 대신 불러옴 */
const overlayProxy = () => ({
  name: "overlay-proxy",
  apply: "serve",
  configureServer(server) {
    server.middlewares.use("/__overlay/check", async (req, res) => {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      try {
        const target = readTarget(req);
        const r = await fetch(target, { headers: { "User-Agent": MOBILE_UA }, redirect: "follow" });
        const xfo = (r.headers.get("x-frame-options") || "").toLowerCase();
        const csp = r.headers.get("content-security-policy") || "";
        const fa = /frame-ancestors([^;]*)/i.exec(csp)?.[1].trim() || "";
        const blocked = !!xfo || (fa !== "" && !/(^|\s)\*(\s|$)/.test(fa));

        // 페이지 안의 iframe(작업 영역) 주소 찾기
        const frames = [];
        if ((r.headers.get("content-type") || "").includes("text/html")) {
          const html = await r.text();
          for (const m of html.matchAll(/<iframe\b[^>]*>/gi)) {
            const src = /\bsrc\s*=\s*["']([^"']+)["']/i.exec(m[0])?.[1];
            if (!src) continue;
            try {
              const abs = new URL(src.replace(/&amp;/g, "&"), r.url).href;
              if (!/^https?:/.test(abs) || frames.some((f) => f.src === abs)) continue;
              const title = /\btitle\s*=\s*["']([^"']*)["']/i.exec(m[0])?.[1] || "";
              frames.push({ src: abs, title });
            } catch {
              /* 잘못된 주소는 건너뜀 */
            }
          }
        } else {
          r.body?.cancel();
        }
        res.end(JSON.stringify({ ok: true, status: r.status, finalUrl: r.url, blocked, xfo, frameAncestors: fa, frames }));
      } catch (e) {
        res.end(JSON.stringify({ ok: false, error: e.message }));
      }
    });

    server.middlewares.use("/__overlay/proxy", async (req, res) => {
      try {
        const target = readTarget(req);
        const r = await fetch(target, { headers: { "User-Agent": MOBILE_UA }, redirect: "follow" });
        const type = r.headers.get("content-type") || "text/html";
        res.statusCode = r.status;
        res.setHeader("Content-Type", type);
        if (!type.includes("text/html")) {
          res.end(Buffer.from(await r.arrayBuffer()));
          return;
        }
        // 상대 경로 리소스(css, js, 이미지)가 원래 사이트에서 불러와지도록 <base> 주입
        const base = `<base href="${r.url.replace(/"/g, "&quot;")}">`;
        let html = await r.text();
        html = /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, (m) => m + base) : base + html;
        res.end(html);
      } catch (e) {
        res.statusCode = 502;
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end(`프록시로 불러오지 못했어요: ${e.message}`);
      }
    });
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), overlayProxy()],
  build: {
    chunkSizeWarningLimit: 1000, // 1000kB로 한도 상향
  },
});
