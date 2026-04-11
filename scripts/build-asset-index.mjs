import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const mirrorRoot = path.join(rootDir, "mirror", "site");
const outDir = path.join(rootDir, "data");
const outFile = path.join(outDir, "site-index.json");
const targetHosts = new Set([
  "hgjfkdhskjdgturrgehdsbjkfhdsjkahturaytklfdjjfjfff.net",
  "www.hgjfkdhskjdgturrgehdsbjkfhdsjkahturaytklfdjjfjfff.net",
]);

const assetExtension = /\.(png|jpe?g|gif|webp|bmp|svg|mp3|wav|ogg|m4a|aac|mp4|webm|json|xml|txt|ttf|otf|woff2?|css|js)$/i;
const htmlExtension = /\.html?$/i;

function walk(dir) {
  const items = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      items.push(...walk(full));
    } else {
      items.push(full);
    }
  }
  return items;
}

function toPosix(p) {
  return p.split(path.sep).join("/");
}

function relFromMirror(abs) {
  return toPosix(path.relative(mirrorRoot, abs));
}

function resolveRef(pageFile, ref) {
  if (!ref || ref.startsWith("#") || ref.startsWith("javascript:")) return null;
  if (/^https?:\/\//i.test(ref)) {
    try {
      const u = new URL(ref);
      if (targetHosts.has(u.hostname.toLowerCase())) {
        return u.pathname.replace(/^\/+/, "");
      }
    } catch {}
    return ref;
  }
  if (ref.startsWith("//")) return `https:${ref}`;

  const clean = ref.split("#")[0].split("?")[0];
  if (!clean) return null;

  if (clean.startsWith("/")) {
    return clean.slice(1);
  }
  const based = path.resolve(path.dirname(pageFile), clean);
  if (!based.startsWith(mirrorRoot)) return null;
  return relFromMirror(based);
}

function extractRefsFromHtml(html) {
  const refs = [];

  const attrRegex = /\b(?:src|href|poster|data)\s*=\s*["']([^"']+)["']/gi;
  let match = null;
  while ((match = attrRegex.exec(html))) refs.push(match[1]);

  const cssRegex = /url\(\s*["']?([^"')]+)["']?\s*\)/gi;
  while ((match = cssRegex.exec(html))) refs.push(match[1]);

  const quotedPathRegex = /["']([^"']+\.(?:png|jpe?g|gif|webp|mp3|wav|ogg|json|xml|txt|ttf|otf|woff2?|css|js))["']/gi;
  while ((match = quotedPathRegex.exec(html))) refs.push(match[1]);

  return refs;
}

function safeRead(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

if (!fs.existsSync(mirrorRoot)) {
  console.error(`Mirror directory missing: ${mirrorRoot}`);
  process.exit(1);
}

const files = walk(mirrorRoot);
const htmlFiles = files.filter((f) => htmlExtension.test(f));

const pages = [];
const pagesMap = {};
const allAssets = new Set();

for (const file of htmlFiles) {
  const rel = relFromMirror(file);
  const html = safeRead(file);
  const refs = extractRefsFromHtml(html);
  const resolved = new Set();

  for (const ref of refs) {
    const normalized = resolveRef(file, ref);
    if (!normalized) continue;

    if (typeof normalized === "string" && normalized.startsWith("http")) {
      resolved.add(normalized);
      allAssets.add(normalized);
      continue;
    }

    if (assetExtension.test(normalized) || htmlExtension.test(normalized)) {
      resolved.add(normalized);
      if (assetExtension.test(normalized)) allAssets.add(normalized);
    }
  }

  pages.push(rel);
  pagesMap[rel] = Array.from(resolved).sort((a, b) => a.localeCompare(b));
}

pages.sort((a, b) => a.localeCompare(b));

const output = {
  generatedAt: new Date().toISOString(),
  mirrorRoot: "mirror/site",
  pageCount: pages.length,
  assetCount: allAssets.size,
  pages,
  assetsByPage: pagesMap,
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(output, null, 2) + "\n", "utf8");

console.log(`Wrote ${outFile}`);
console.log(`Pages: ${output.pageCount}`);
console.log(`Unique assets: ${output.assetCount}`);
