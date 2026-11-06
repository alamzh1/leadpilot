// Проверка сборки с basePath: отдаёт out/ под /leadpilot/ и убеждается, что страница и все её ресурсы отвечают 200.
// Запуск: NEXT_PUBLIC_BASE_PATH=/leadpilot npm run build && node scripts/check-basepath.mjs
import { spawn } from "node:child_process";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "/leadpilot";
const PORT = process.env.PORT ?? "4321";
const origin = `http://127.0.0.1:${PORT}`;

const server = spawn("node", ["tests/e2e/serve.mjs", "out"], {
  env: { ...process.env, PORT, NEXT_PUBLIC_BASE_PATH: BASE },
  stdio: "ignore",
});

let failed = 0;
try {
  let html = "";
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`${origin}${BASE}/`);
      if (res.ok) {
        html = await res.text();
        break;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 150));
  }
  if (!html) throw new Error(`${origin}${BASE}/ не отвечает`);
  const urls = new Set();
  for (const m of html.matchAll(/(?:href|src|srcset)="([^"]+)"/g)) {
    for (const part of m[1].split(",")) {
      const u = part.trim().split(/\s+/)[0];
      if (u.startsWith("/") && !u.startsWith("//")) urls.add(u);
    }
  }
  for (const u of urls) {
    const res = await fetch(origin + u);
    const ok = res.ok && u.startsWith(BASE + "/");
    if (!ok) failed++;
    console.log(`${ok ? "ok  " : "FAIL"} ${res.status} ${u}`);
  }
  console.log(`${urls.size} ресурсов, ошибок: ${failed}`);
} finally {
  server.kill();
}
process.exit(failed ? 1 : 0);
