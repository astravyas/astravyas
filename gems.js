/**
 * ASTRA VAULT — Gem photos: background clean + 3D spin ready (FIXED FOR DIAMOND & PEARL)
 */
(function initGemField() {
  function isBackgroundPixel(r, g, b, isWhiteGem = false) {
    if (isWhiteGem) {
      // 245 bohot strict tha, isko 210 kiya hai taaki off-white corners saaf ho jayein
      return r > 210 && g > 210 && b > 210;
    }
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max - min;
    const lum = (r + g + b) / 3;
    if (sat < 50 && lum > 175) return true;
    if (r > 248 && g > 248 && b > 248) return true;
    if (sat < 32 && lum < 32) return true;
    return false;
  }
  function cutOutGem(img, isWhiteGem = false) {
    const maxSide = 640;
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight, 1));
    const w = Math.max(1, Math.floor(img.naturalWidth * scale));
    const h = Math.max(1, Math.floor(img.naturalHeight * scale));
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h);
    const px = data.data;
    const visited = new Uint8Array(w * h);
    const queue = [];

    const trySeed = (x, y) => {
      const idx = y * w + x;
      if (visited[idx]) return;
      const i = idx * 4;
      if (!isBackgroundPixel(px[i], px[i + 1], px[i + 2], isWhiteGem)) return;
      visited[idx] = 1;
      queue.push(idx);
    };

    for (let x = 0; x < w; x += 1) {
      trySeed(x, 0);
      trySeed(x, h - 1);
    }
    for (let y = 0; y < h; y += 1) {
      trySeed(0, y);
      trySeed(w - 1, y);
    }

    while (queue.length) {
      const idx = queue.pop();
      const i = idx * 4;
      px[i + 3] = 0;
      const x = idx % w;
      const y = (idx / w) | 0;
      if (x > 0) trySeed(x - 1, y);
      if (x < w - 1) trySeed(x + 1, y);
      if (y > 0) trySeed(x, y - 1);
      if (y < h - 1) trySeed(x, y + 1);
    }

    ctx.putImageData(data, 0, 0);
    return c.toDataURL("image/png");
  }

  document.querySelectorAll(".gem-jewel").forEach((img) => {
    const finish = (useCutout) => {
      const stage = img.closest(".gem-3d-stage");
      stage?.classList.add("is-ready");
      if (useCutout) {
        img.style.mixBlendMode = "normal";
      }
    };

    const process = () => {
      try {
        const srcLower = img.src.toLowerCase();
        
        // Agar image transparent PNG hai ya direct load karni hai toh skip attribute use karein
        if (img.hasAttribute("data-skip-cutout")) {
          img.style.mixBlendMode = "normal";
          finish(false);
          return;
        }

        // Auto detect Diamond and Pearl from filename or attribute
        const isWhiteGem = srcLower.includes("diamond") || srcLower.includes("pearl") || img.hasAttribute("data-white-gem");

        img.src = cutOutGem(img, isWhiteGem);
        finish(true);
      } catch (_) {
        finish(false);
      }
    };

    if (img.complete && img.naturalWidth > 0) process();
    else img.addEventListener("load", process, { once: true });

    img.addEventListener(
      "error",
      () => {
        const alt = img.getAttribute("data-fallback");
        if (alt && !img.src.endsWith(alt)) img.src = alt;
        else img.classList.add("is-broken");
      },
      { once: true }
    );
  });

  window.AstraGems = { showField: () => {} };
})();
