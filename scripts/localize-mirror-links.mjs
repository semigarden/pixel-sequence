import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const mirrorRoot = path.join(rootDir, "mirror", "site");

const HOST_RE = /(https?:)?\/\/(www\.)?hgjfkdhskjdgturrgehdsbjkfhdsjkahturaytklfdjjfjfff\.net(\/[^\s"'`<>)\]}]*)?/gi;
const TEXT_EXTS = new Set([".html", ".htm", ".js", ".css", ".json", ".txt", ".xml"]);
const HTML_LIKE_EXTS = new Set([".html", ".htm"]);
const CSS_EXTS = new Set([".css"]);
const HTML_ROOT_ATTR_RE = /((?:src|href|poster|data)\s*=\s*["'])\/(?!mirror\/site\/)([^"']+)(["'])/gi;
const CSS_URL_RE = /(url\(\s*["'])\/(?!mirror\/site\/)([^"')]+)(["'])/gi;

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function localizeUrlPath(pathPart) {
  const raw = pathPart || "/";
  const normalized = raw.startsWith("/") ? raw : `/${raw}`;
  return normalized;
}

function rewriteText(text, ext) {
  let out = text.replace(HOST_RE, (_m, _proto, _www, pathPart) => localizeUrlPath(pathPart));
  out = out.replace(/\/mirror\/site\//g, "/");

  if (HTML_LIKE_EXTS.has(ext)) {
    out = out.replace(HTML_ROOT_ATTR_RE, (_m, prefix, pathPart, quote) => `${prefix}/${pathPart}${quote}`);
    out = out.replace(/target\s*=\s*["']_blank["']/gi, 'target="_self"');
    out = out.replace(
      /arrows\.kill\(\);/g,
      'if (typeof arrows !== "undefined" && arrows && arrows.kill) { arrows.kill(); }'
    );
  }

  if (CSS_EXTS.has(ext)) {
    out = out.replace(CSS_URL_RE, (_m, prefix, pathPart, quote) => `${prefix}/${pathPart}${quote}`);
  }

  return out;
}

if (!fs.existsSync(mirrorRoot)) {
  console.error(`Mirror directory missing: ${mirrorRoot}`);
  process.exit(1);
}

let changed = 0;
for (const file of walk(mirrorRoot)) {
  const ext = path.extname(file).toLowerCase();
  if (!TEXT_EXTS.has(ext)) continue;
  const original = fs.readFileSync(file, "utf8");
  const rewritten = rewriteText(original, ext);
  if (rewritten !== original) {
    fs.writeFileSync(file, rewritten, "utf8");
    changed += 1;
  }
}

console.log(`Localized original-domain links in ${changed} files.`);
