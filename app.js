(function () {
  const iframe = document.getElementById("game");
  const pageSelect = document.getElementById("pageSelect");
  const assetList = document.getElementById("assetList");
  const statusEl = document.getElementById("status");
  const inspectMenu = document.getElementById("inspectMenu");
  const inspectAssetBtn = document.getElementById("inspectAssetBtn");

  const seen = new Set();
  let siteIndex = null;
  let currentPage = "";
  let pendingInspectAsset = "";
  let pendingCanvasPoint = null;
  const targetHosts = new Set([
    "hgjfkdhskjdgturrgehdsbjkfhdsjkahturaytklfdjjfjfff.net",
    "www.hgjfkdhskjdgturrgehdsbjkfhdsjkahturaytklfdjjfjfff.net",
  ]);

  function mirrorUrl(relPath) {
    return "mirror/site/" + relPath;
  }

  function setStatus(text) {
    statusEl.textContent = text;
  }

  function restoreIframeInteractionFocus() {
    try {
      iframe.focus();
      const win = iframe.contentWindow;
      const doc = iframe.contentDocument;
      if (win && win.focus) win.focus();
      if (doc && doc.body && doc.body.focus) doc.body.focus();
      const canvas = doc && doc.querySelector ? doc.querySelector("canvas") : null;
      if (canvas && canvas.focus) canvas.focus();
      if (win && win.game && win.game.input && win.game.input.reset) {
        win.game.input.reset(true);
      }
    } catch {}
  }

  function mediaKind(url) {
    const lower = String(url || "").toLowerCase();
    if (/\.(png|jpe?g|gif|webp|bmp|svg)(\?|$)/.test(lower)) return "image";
    if (/\.(mp4|webm)(\?|$)/.test(lower)) return "video";
    if (/\.(mp3|wav|ogg|m4a|aac)(\?|$)/.test(lower)) return "audio";
    return "";
  }

  function isMediaAsset(url) {
    return mediaKind(url) !== "";
  }

  function hideInspectMenu() {
    inspectMenu.classList.add("hidden");
    pendingInspectAsset = "";
    pendingCanvasPoint = null;
  }

  function showInspectMenu(x, y, assetKey) {
    pendingInspectAsset = assetKey;
    inspectMenu.classList.remove("hidden");
    inspectMenu.style.left = `${x}px`;
    inspectMenu.style.top = `${y}px`;
  }

  function localHrefForAsset(value) {
    const marker = "/mirror/site/";
    if (!value) return value;
    if (value.includes(marker)) {
      const rel = value.slice(value.indexOf(marker) + marker.length);
      return new URL("mirror/site/" + rel, window.location.href).pathname;
    }
    if (/^https?:\/\//i.test(value)) {
      try {
        const u = new URL(value);
        if (targetHosts.has(u.hostname.toLowerCase())) {
          return new URL("mirror/site/" + u.pathname.replace(/^\/+/, ""), window.location.href).pathname;
        }
      } catch {
        return value;
      }
      return value;
    }
    if (/^[a-z]+:/i.test(value)) return value;

    try {
      const base = new URL("mirror/site/" + (currentPage || "pages.html"), window.location.href);
      return new URL(value, base).pathname;
    } catch {
      return value;
    }
  }

  function appendUrl(url) {
    if (!isMediaAsset(url)) return;
    if (seen.has(url)) return;
    seen.add(url);
    const li = document.createElement("li");
    const a = document.createElement("a");
    const preview = document.createElement("span");
    const text = document.createElement("span");
    const kind = mediaKind(url);
    const localHref = localHrefForAsset(url);

    li.dataset.url = url;
    li.className = "asset-row";
    a.className = "asset-row-link";
    a.href = localHref;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    preview.className = "asset-preview";
    text.className = "asset-text";
    text.textContent = url;

    if (kind === "image") {
      const img = document.createElement("img");
      img.className = "asset-thumb";
      img.src = localHref;
      img.alt = "";
      img.loading = "lazy";
      preview.appendChild(img);
    } else if (kind === "video") {
      const v = document.createElement("video");
      v.className = "asset-thumb asset-thumb--video";
      v.src = localHref;
      v.muted = true;
      v.preload = "metadata";
      v.tabIndex = -1;
      preview.appendChild(v);
    } else {
      preview.textContent = "🔊";
    }

    a.appendChild(preview);
    a.appendChild(text);
    li.appendChild(a);
    assetList.appendChild(li);
    setStatus(`${seen.size} asset on ${currentPage || "current page"}`);
  }

  function clearSelection() {
    for (const li of assetList.querySelectorAll("li.asset-selected")) {
      li.classList.remove("asset-selected");
    }
  }

  function selectAssetInPanel(assetKey) {
    if (!assetKey) return;
    if (!seen.has(assetKey)) appendUrl(assetKey);
    const row = assetList.querySelector(`li[data-url="${CSS.escape(assetKey)}"]`);
    if (!row) return;
    clearSelection();
    row.classList.add("asset-selected");
    row.scrollIntoView({ block: "nearest", behavior: "smooth" });
    setStatus(`Inspected asset: ${assetKey}`);
  }

  function clearList() {
    seen.clear();
    assetList.replaceChildren();
  }

  function normalizeResourceName(value) {
    try {
      const url = new URL(value, window.location.href);
      const localMirrorRoot = "/mirror/site/";
      const idx = url.pathname.indexOf(localMirrorRoot);
      if (idx >= 0) {
        return url.pathname.slice(idx + localMirrorRoot.length);
      }
      return url.href;
    } catch {
      return value;
    }
  }

  function toPanelAssetKey(rawUrl, baseHref) {
    if (!rawUrl) return "";
    try {
      const url = new URL(rawUrl, baseHref || iframe.contentWindow.location.href);
      if (targetHosts.has(url.hostname.toLowerCase())) {
        return url.pathname.replace(/^\/+/, "");
      }
      if (url.origin === window.location.origin) {
        const marker = "/mirror/site/";
        const idx = url.pathname.indexOf(marker);
        if (idx >= 0) {
          return url.pathname.slice(idx + marker.length);
        }
        return url.pathname.replace(/^\/+/, "");
      }
      return url.href;
    } catch {
      return "";
    }
  }

  function firstUrlFromCss(value) {
    if (!value || value === "none") return "";
    const m = /url\((['"]?)([^"')]+)\1\)/i.exec(value);
    return m ? m[2] : "";
  }

  function phaserAssetFromCanvasPointer(point, canvasEl) {
    let win;
    try {
      win = iframe.contentWindow;
    } catch {
      return "";
    }
    const game = win && win.game;
    if (!game || !game.world || !game.cache) return "";

    const rect = canvasEl && canvasEl.getBoundingClientRect ? canvasEl.getBoundingClientRect() : null;
    const localX = rect ? point.clientX - rect.left : point.clientX;
    const localY = rect ? point.clientY - rect.top : point.clientY;
    const worldX = localX + (game.camera ? game.camera.x : 0);
    const worldY = localY + (game.camera ? game.camera.y : 0);

    function assetFromDisplayObject(obj) {
      const key = obj && obj.key;
      if (key && game.cache._images && game.cache._images[key] && game.cache._images[key].url) {
        return toPanelAssetKey(game.cache._images[key].url, win.location.href);
      }
      try {
        const src =
          obj &&
          obj.texture &&
          obj.texture.baseTexture &&
          obj.texture.baseTexture.source &&
          obj.texture.baseTexture.source.src;
        if (src) return toPanelAssetKey(src, win.location.href);
      } catch {}
      return "";
    }

    let drawIndex = 0;
    const hits = [];

    function visit(children) {
      if (!children || !children.length) return;
      for (const child of children) {
        if (!child || child.visible === false || child.exists === false) continue;
        if (child.getBounds) {
          try {
            const b = child.getBounds();
            if (b) {
              drawIndex += 1;
              if (worldX >= b.x && worldX <= b.right && worldY >= b.y && worldY <= b.bottom) {
                const asset = assetFromDisplayObject(child);
                if (asset) {
                  const area = Math.max(1, (b.right - b.x) * (b.bottom - b.y));
                  hits.push({
                    asset,
                    area,
                    drawIndex,
                    inputEnabled: !!(child.inputEnabled || (child.input && child.input.enabled)),
                  });
                }
              }
            }
          } catch {}
        }
        if (child.children && child.children.length) {
          visit(child.children);
        }
      }
    }

    visit(game.world.children || []);
    if (!hits.length) return "";

    hits.sort((a, b) => {
      if (a.inputEnabled !== b.inputEnabled) return a.inputEnabled ? -1 : 1;
      if (a.drawIndex !== b.drawIndex) return b.drawIndex - a.drawIndex;
      return a.area - b.area;
    });
    return hits[0].asset;
  }

  function extractInspectableAssetFromTarget(target, doc, event) {
    const baseHref = iframe.contentWindow.location.href;
    let node = target;
    for (let depth = 0; node && depth < 8; depth += 1) {
      if (node.getAttribute) {
        const direct = node.getAttribute("src") || node.getAttribute("poster") || node.getAttribute("data-src");
        if (direct) {
          const key = toPanelAssetKey(direct, baseHref);
          if (key) return key;
        }
        const styleAttr = node.getAttribute("style");
        const styleUrl = firstUrlFromCss(styleAttr);
        if (styleUrl) {
          const key = toPanelAssetKey(styleUrl, baseHref);
          if (key) return key;
        }
        const href = node.getAttribute("href");
        if (href && !href.endsWith(".html") && !href.endsWith(".htm")) {
          const key = toPanelAssetKey(href, baseHref);
          if (key) return key;
        }
      }
      try {
        const computed = iframe.contentWindow.getComputedStyle(node);
        const bg = firstUrlFromCss(computed.backgroundImage);
        if (bg) {
          const key = toPanelAssetKey(bg, baseHref);
          if (key) return key;
        }
      } catch {}
      node = node.parentElement;
    }
    if (doc && doc.activeElement && doc.activeElement.getAttribute) {
      const src = doc.activeElement.getAttribute("src");
      if (src) return toPanelAssetKey(src, baseHref);
    }

    let canvasEl = null;
    if (target && target.tagName === "CANVAS") {
      canvasEl = target;
    } else if (doc && doc.querySelector) {
      canvasEl = doc.querySelector("canvas");
    }
    if (canvasEl && event) {
      const fromPhaser = phaserAssetFromCanvasPointer(event, canvasEl);
      if (fromPhaser) return fromPhaser;
    }

    return "";
  }

  function renderExtractedAssets(page) {
    if (!siteIndex || !siteIndex.assetsByPage) return;
    const list = siteIndex.assetsByPage[page] || [];
    for (const item of list) appendUrl(item);
  }

  function relPathFromMirrorPathname(pathname) {
    const marker = "/mirror/site/";
    const idx = pathname.indexOf(marker);
    if (idx < 0) return "";
    return pathname.slice(idx + marker.length);
  }

  function syncCurrentPageFromIframe() {
    try {
      const rel = relPathFromMirrorPathname(iframe.contentWindow.location.pathname);
      if (!rel) return;
      currentPage = rel;
      if ([...pageSelect.options].some((o) => o.value === rel)) {
        pageSelect.value = rel;
      } else {
        const opt = document.createElement("option");
        opt.value = rel;
        opt.textContent = rel;
        pageSelect.appendChild(opt);
        pageSelect.value = rel;
      }
    } catch {}
  }

  function navigateIframeToResolvedUrl(rawHref) {
    try {
      const resolved = new URL(rawHref, iframe.contentWindow.location.href);
      if (resolved.origin !== window.location.origin) return false;
      if (resolved.pathname.indexOf("/mirror/site/") < 0) return false;
      iframe.src = resolved.pathname + resolved.search + resolved.hash;
      return true;
    } catch {
      return false;
    }
  }

  function keepIframeNavigationInApp() {
    let doc;
    let win;
    try {
      doc = iframe.contentDocument;
      win = iframe.contentWindow;
    } catch {
      return;
    }
    if (!doc || !win) return;

    const anchors = doc.querySelectorAll("a[href]");
    for (const a of anchors) {
      if (a.target === "_blank") a.target = "_self";
    }

    if (!doc.__psNavPatched) {
      doc.addEventListener(
        "contextmenu",
        (event) => {
          const assetKey = extractInspectableAssetFromTarget(event.target, doc, event);
          const isCanvas =
            (event.target && event.target.tagName === "CANVAS") ||
            (doc && doc.querySelector && !!doc.querySelector("canvas"));
          if (!assetKey && !isCanvas) return;
          event.preventDefault();
          pendingCanvasPoint = isCanvas ? { clientX: event.clientX, clientY: event.clientY } : null;
          const rect = iframe.getBoundingClientRect();
          showInspectMenu(rect.left + event.clientX, rect.top + event.clientY, assetKey);
        },
        true
      );

      doc.addEventListener(
        "click",
        (event) => {
          const el = event.target && event.target.closest ? event.target.closest("a[href]") : null;
          if (!el) return;
          const href = el.getAttribute("href");
          if (!href) return;
          if (navigateIframeToResolvedUrl(href)) {
            event.preventDefault();
          }
        },
        true
      );
      doc.__psNavPatched = true;
    }

    if (!win.__psWindowOpenPatched) {
      const oldOpen = win.open ? win.open.bind(win) : null;
      win.open = function patchedOpen(url, name, specs) {
        if (typeof url === "string" && navigateIframeToResolvedUrl(url)) {
          return win;
        }
        if (oldOpen) return oldOpen(url, name, specs);
        return null;
      };
      win.__psWindowOpenPatched = true;
    }
  }

  function renderLiveAssetsFromFrame() {
    try {
      const entries = iframe.contentWindow.performance.getEntriesByType("resource");
      for (const entry of entries) {
        appendUrl(normalizeResourceName(entry.name));
      }
    } catch {}
  }

  function loadPage() {
    if (!siteIndex || !pageSelect.value) {
      setStatus("No page selected.");
      return;
    }
    currentPage = pageSelect.value;
    clearList();
    renderExtractedAssets(currentPage);
    setStatus(`Loading ${currentPage}…`);
    iframe.src = mirrorUrl(currentPage);
  }

  iframe.addEventListener("load", () => {
    hideInspectMenu();
    syncCurrentPageFromIframe();
    clearList();
    if (currentPage) renderExtractedAssets(currentPage);
    keepIframeNavigationInApp();
    setTimeout(renderLiveAssetsFromFrame, 700);
    const poll = window.setInterval(() => {
      if (iframe.contentWindow && iframe.contentWindow.location) {
        renderLiveAssetsFromFrame();
      }
    }, 1200);
    window.setTimeout(() => window.clearInterval(poll), 12000);
  });

  pageSelect.addEventListener("change", loadPage);
  inspectAssetBtn.addEventListener("click", () => {
    let asset = pendingInspectAsset;
    if (!asset && pendingCanvasPoint) {
      try {
        const doc = iframe.contentDocument;
        const canvas = doc && doc.querySelector ? doc.querySelector("canvas") : null;
        if (canvas) {
          asset = phaserAssetFromCanvasPointer(pendingCanvasPoint, canvas);
        }
      } catch {}
    }
    if (!asset) {
      setStatus("No media sprite asset resolved at pointer.");
    } else {
      selectAssetInPanel(asset);
    }
    hideInspectMenu();
    setTimeout(restoreIframeInteractionFocus, 0);
  });
  inspectMenu.addEventListener("click", (e) => e.stopPropagation());
  inspectMenu.addEventListener("mousedown", (e) => e.stopPropagation());
  window.addEventListener("click", (e) => {
    if (inspectMenu.classList.contains("hidden")) return;
    if (inspectMenu.contains(e.target)) return;
    hideInspectMenu();
    setTimeout(restoreIframeInteractionFocus, 0);
  });
  window.addEventListener("blur", hideInspectMenu);

  fetch("data/site-index.json")
    .then((r) => r.json())
    .then((index) => {
      siteIndex = index;
      pageSelect.replaceChildren();
      for (const page of index.pages || []) {
        const opt = document.createElement("option");
        opt.value = page;
        opt.textContent = page;
        pageSelect.appendChild(opt);
      }
      const preferred = (index.pages || []).includes("pages.html")
        ? "pages.html"
        : (index.pages || [])[0];
      if (preferred) {
        pageSelect.value = preferred;
        loadPage();
      } else {
        setStatus("No HTML pages found in mirror.");
      }
    })
    .catch(() => {
      setStatus("Could not load data");
    });
})();
