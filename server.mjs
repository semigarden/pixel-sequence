import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const MIRROR_ROOT = path.join(ROOT, "mirror", "site");
const PORT = Number(process.env.PORT) || 3847;

function safeJoin(root, reqPath) {
  const p = path.normalize(reqPath).replace(/^(\.\.(\/|\\|$))+/, "");
  const full = path.join(root, p);
  if (!full.startsWith(root)) return null;
  return full;
}

const server = http.createServer(async (req, res) => {
  const host = req.headers.host || `localhost:${PORT}`;
  const url = new URL(req.url || "/", `http://${host}`);

  if (url.pathname === "/") {
    res.writeHead(302, { Location: "/index.html" });
    res.end();
    return;
  }

  let filePath = url.pathname;
  if (filePath.endsWith("/")) filePath += "index.html";

  const primary = safeJoin(ROOT, filePath);
  const mirrorFallback = safeJoin(MIRROR_ROOT, filePath);

  let resolved = null;
  if (primary && fs.existsSync(primary) && fs.statSync(primary).isFile()) {
    resolved = primary;
  } else if (
    mirrorFallback &&
    fs.existsSync(mirrorFallback) &&
    fs.statSync(mirrorFallback).isFile()
  ) {
    resolved = mirrorFallback;
  }

  if (!resolved) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
    return;
  }

  const ext = path.extname(resolved);
  const types = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".mp3": "audio/mpeg",
    ".ogg": "audio/ogg",
    ".wav": "audio/wav",
    ".ttf": "font/ttf",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
  };
  res.writeHead(200, {
    "Content-Type": types[ext] || "application/octet-stream",
    "Cache-Control": "no-store",
  });
  fs.createReadStream(resolved).pipe(res);
});

server.listen(PORT, () => {
  console.log(`pixel-sequence static server: http://localhost:${PORT}/`);
});
