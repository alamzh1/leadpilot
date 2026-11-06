// Минимальный статический сервер для out/ (без зависимостей). Учитывает basePath.
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { createGzip } from "node:zlib";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "out");
const port = Number(process.env.PORT ?? 4173);
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

createServer((req, res) => {
  let path = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
  if (basePath && path.startsWith(basePath)) path = path.slice(basePath.length) || "/";
  let file = normalize(join(root, path));
  if (!file.startsWith(root)) {
    res.writeHead(403).end();
    return;
  }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file) && existsSync(`${file}.html`)) file = `${file}.html`;
  if (!existsSync(file)) {
    res.writeHead(404, { "content-type": types[".html"] });
    createReadStream(join(root, "404.html")).pipe(res);
    return;
  }
  const type = types[extname(file)] ?? "application/octet-stream";
  // GZIP=1 имитирует сжатие GitHub Pages для текстовых файлов (нужно для честного замера Lighthouse).
  if (process.env.GZIP && /^(text|application\/json|image\/svg)/.test(type) && /gzip/.test(req.headers["accept-encoding"] ?? "")) {
    res.writeHead(200, { "content-type": type, "content-encoding": "gzip", vary: "accept-encoding" });
    createReadStream(file).pipe(createGzip()).pipe(res);
    return;
  }
  res.writeHead(200, { "content-type": type });
  createReadStream(file).pipe(res);
}).listen(port, "127.0.0.1", () => {
  console.log(`serving ${root} on http://127.0.0.1:${port}${basePath}/`);
});
