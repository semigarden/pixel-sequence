#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${ROOT_DIR}/mirror/site"
START_URL="http://hgjfkdhskjdgturrgehdsbjkfhdsjkahturaytklfdjjfjfff.net/pages.html"
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

rm -rf "${OUT_DIR}"
mkdir -p "${OUT_DIR}"

wget \
  --mirror \
  --no-parent \
  --page-requisites \
  --convert-links \
  --adjust-extension \
  --span-hosts \
  --domains=hgjfkdhskjdgturrgehdsbjkfhdsjkahturaytklfdjjfjfff.net,www.hgjfkdhskjdgturrgehdsbjkfhdsjkahturaytklfdjjfjfff.net,ajax.googleapis.com,code.jquery.com \
  --no-host-directories \
  --directory-prefix="${OUT_DIR}" \
  --execute robots=off \
  --user-agent="${UA}" \
  "${START_URL}" || WGET_EXIT=$?

WGET_EXIT="${WGET_EXIT:-0}"
if [[ "${WGET_EXIT}" -ne 0 && "${WGET_EXIT}" -ne 8 ]]; then
  echo "wget failed with exit code ${WGET_EXIT}" >&2
  exit "${WGET_EXIT}"
fi
if [[ "${WGET_EXIT}" -eq 8 ]]; then
  echo "wget completed with some server errors (exit 8); continuing with downloaded content."
fi

node "${ROOT_DIR}/scripts/localize-mirror-links.mjs"
node "${ROOT_DIR}/scripts/fetch-missing-assets.mjs"

for extra in door1.gif door2.gif door3.gif; do
  curl -fsSL -A "${UA}" "http://hgjfkdhskjdgturrgehdsbjkfhdsjkahturaytklfdjjfjfff.net/${extra}" \
    -o "${OUT_DIR}/${extra}" || true
done

echo "Mirror complete at: ${OUT_DIR}"
