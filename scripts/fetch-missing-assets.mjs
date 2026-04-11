import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const mirrorRoot = path.join(rootDir, "mirror", "site");
const siteOrigins = [
  "http://hgjfkdhskjdgturrgehdsbjkfhdsjkahturaytklfdjjfjfff.net",
  "http://www.hgjfkdhskjdgturrgehdsbjkfhdsjkahturaytklfdjjfjfff.net",
];
const targetHosts = new Set([
  "hgjfkdhskjdgturrgehdsbjkfhdsjkahturaytklfdjjfjfff.net",
  "www.hgjfkdhskjdgturrgehdsbjkfhdsjkahturaytklfdjjfjfff.net",
]);
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const FETCH_TIMEOUT_MS = 7000;
const MAX_CONCURRENCY = 16;

const htmlExtension = /\.html?$/i;
const ASSET_EXT =
  "png|jpe?g|gif|webp|bmp|svg|mp3|wav|ogg|m4a|aac|mp4|webm|json|xml|txt|fnt|ttf|otf|woff2?|css|js";
const candidateExt = new RegExp(`\\.(${ASSET_EXT})$`, "i");

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function toPosix(p) {
  return p.split(path.sep).join("/");
}

function relFromMirror(abs) {
  return toPosix(path.relative(mirrorRoot, abs));
}

function extractRefs(text) {
  const refs = [];
  const attrRegex = /\b(?:src|href|poster|data)\s*=\s*["']([^"']+)["']/gi;
  const cssRegex = /url\(\s*["']?([^"')]+)["']?\s*\)/gi;
  const quotedPathRegex = new RegExp(`["']([^"']+\\.(?:${ASSET_EXT}))["']`, "gi");
  const arrayRegex = /var\s+([A-Za-z_$][\w$]*)\s*=\s*\[([^\]]+)\]/g;
  const concatSuffixRegex = new RegExp(
    `([A-Za-z_$][\\w$]*)\\s*\\[[^\\]]+\\]\\s*\\+\\s*["']([^"']+\\.(?:${ASSET_EXT}))["']`,
    "gi"
  );

  let match;
  while ((match = attrRegex.exec(text))) refs.push(match[1]);
  while ((match = cssRegex.exec(text))) refs.push(match[1]);
  while ((match = quotedPathRegex.exec(text))) refs.push(match[1]);

  const arrays = new Map();
  while ((match = arrayRegex.exec(text))) {
    const arrayName = match[1];
    const body = match[2];
    const values = [];
    const valueRegex = /["']([^"']+)["']/g;
    let vm;
    while ((vm = valueRegex.exec(body))) values.push(vm[1]);
    if (values.length) arrays.set(arrayName, values);
  }

  while ((match = concatSuffixRegex.exec(text))) {
    const arrayName = match[1];
    const suffix = match[2];
    const values = arrays.get(arrayName);
    if (!values || !suffix) continue;
    for (const v of values) refs.push(`${v}${suffix}`);
  }

  return refs;
}

function normalizeRefToPath(pageFile, ref) {
  if (!ref || ref.startsWith("#") || ref.startsWith("javascript:") || ref.startsWith("data:")) return null;
  let clean = ref.split("#")[0].split("?")[0];
  if (!clean) return null;

  if (clean.startsWith("/mirror/site/")) {
    clean = clean.slice("/mirror/site/".length);
  }

  if (/^https?:\/\//i.test(clean)) {
    try {
      const u = new URL(clean);
      if (!targetHosts.has(u.hostname.toLowerCase())) return null;
      clean = u.pathname.replace(/^\/+/, "");
    } catch {
      return null;
    }
  } else if (clean.startsWith("//")) {
    try {
      const u = new URL(`http:${clean}`);
      if (!targetHosts.has(u.hostname.toLowerCase())) return null;
      clean = u.pathname.replace(/^\/+/, "");
    } catch {
      return null;
    }
  } else if (clean.startsWith("/")) {
    clean = clean.replace(/^\/+/, "");
  } else {
    const resolved = path.resolve(path.dirname(pageFile), clean);
    if (!resolved.startsWith(mirrorRoot)) return null;
    clean = relFromMirror(resolved);
  }

  if (!candidateExt.test(clean)) return null;
  return clean;
}

async function fetchToDisk(relativePath) {
  const localFile = path.join(mirrorRoot, relativePath);
  if (fs.existsSync(localFile)) return false;

  for (const origin of siteOrigins) {
    const url = `${origin}/${relativePath}`;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const res = await fetch(url, {
          headers: { "User-Agent": UA, Accept: "*/*" },
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        });
        if (!res.ok) continue;
        const buf = Buffer.from(await res.arrayBuffer());
        fs.mkdirSync(path.dirname(localFile), { recursive: true });
        fs.writeFileSync(localFile, buf);
        return true;
      } catch {}
    }
  }

  return false;
}

if (!fs.existsSync(mirrorRoot)) {
  console.error(`Mirror directory missing: ${mirrorRoot}`);
  process.exit(1);
}

const htmlFiles = walk(mirrorRoot).filter((f) => htmlExtension.test(f));
const candidates = new Set();
for (const file of htmlFiles) {
  const text = fs.readFileSync(file, "utf8");
  const refs = extractRefs(text);
  for (const ref of refs) {
    const normalized = normalizeRefToPath(file, ref);
    if (normalized) candidates.add(normalized);
  }
}

let downloaded = 0;
const missing = [...candidates]
  .sort((a, b) => a.localeCompare(b))
  .filter((relativePath) => !fs.existsSync(path.join(mirrorRoot, relativePath)));

let idx = 0;
async function worker() {
  while (idx < missing.length) {
    const i = idx;
    idx += 1;
    const relativePath = missing[i];
    const did = await fetchToDisk(relativePath);
    if (did) downloaded += 1;
  }
}

const workers = Array.from({ length: Math.min(MAX_CONCURRENCY, missing.length) }, () => worker());
await Promise.all(workers);

console.log(`Fetched ${downloaded} missing referenced assets (attempted ${missing.length}).`);
