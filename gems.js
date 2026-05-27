/**
 * ASTRA VAULT — Gem photos: background clean + 3D spin ready
 */
(function initGemField() {
  function isBackgroundPixel(r, g, b) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max - min;
    const lum = (r + g + b) / 3;

    // 1. Match white, light gray, and checkerboard grays
    if (sat < 55 && lum > 145) return true;
    // 2. Match absolute pure white
    if (r > 240 && g > 240 && b > 240) return true;
    // 3. Match dark borders / black bars
    if (sat < 35 && lum < 45) return true;

    return false;
  }

  function cutOutGem(img) {
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
      if (x < 0 || x >= w || y < 0 || y >= h) return;
      const idx = y * w + x;
      if (visited[idx]) return;
      const i = idx * 4;
      if (!isBackgroundPixel(px[i], px[i + 1], px[i + 2])) return;
      visited[idx] = 1;
      queue.push(idx);
    };

    // --- UPGRADE 1: Inward Scanning Seeds ---
    // Scan from top/bottom borders inward until hitting the actual gemstone
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        const i = (y * w + x) * 4;
        if (isBackgroundPixel(px[i], px[i+1], px[i+2])) trySeed(x, y);
        else break; 
      }
      for (let y = h - 1; y >= 0; y--) {
        const i = (y * w + x) * 4;
        if (isBackgroundPixel(px[i], px[i+1], px[i+2])) trySeed(x, y);
        else break;
      }
    }
    // Scan from left/right borders inward
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        if (isBackgroundPixel(px[i], px[i+1], px[i+2])) trySeed(x, y);
        else break;
      }
      for (let x = w - 1; x >= 0; x--) {
        const i = (y * w + x) * 4;
        if (isBackgroundPixel(px[i], px[i+1], px[i+2])) trySeed(x, y);
        else break;
      }
    }

    // --- UPGRADE 2: 8-Way Flood Fill ---
    while (queue.length) {
      const idx = queue.pop();
      const i = idx * 4;
      px[i + 3] = 0; // Clear background to transparent
      
      const x = idx % w;
      const y = (idx / w) | 0;

      // Check all 8 surrounding pixels (handles checkerboard diagonals)
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          trySeed(x + dx, y + dy);
        }
      }
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
        img.src = cutOutGem(img);
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

/**
 * ASTRA VAULT — Gem data config (GitHub Fixed)
 */
const gems = [
  {
    id: 1,
    name: "Ruby",
    image: "images/ruby.png",
    description: "A deep red precious gemstone, historically associated with nobility, wealth, and passion.",
    rarity: "Rare",
    price: "$2,500/ct"
  },
  {
    id: 2,
    name: "Pearl",
    image: "images/pearl.png",
    description: "An organic gemstone formed within the shells of living mollusks, symbolizing purity and wisdom.",
    rarity: "Uncommon",
    price: "$800/ct"
  },
  {
    id: 3,
    name: "Coral",
    image: "images/coral.png",
    description: "A vibrant, organic gemstone formed by marine polyps, valued for its warm reddish-pink hues.",
    rarity: "Uncommon",
    price: "$400/ct"
  },
  {
    id: 4,
    name: "Diamond",
    image: "images/diamond.png",
    description: "The hardest known natural material, famous for its brilliant sparkle, clarity, and timeless elegance.",
    rarity: "Extremely Rare",
    price: "$8,500/ct"
  }
];

export default gems;
