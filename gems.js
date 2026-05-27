/**
 * ASTRA VAULT — Gem photos: Ultra-clean background cutout & 3D ready
 */
(function initGemField() {
  
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

    // Outer Margin Detector: Pakka background elements ko pehchanta hai (Black bars, white box, gray walls)
    function isOuterBackground(r, g, b) {
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const sat = max - min;
      if (sat < 40) return true;   // Saare gray shades aur rotated card borders
      if (max < 75) return true;   // Absolute black bars
      if (min > 180) return true;  // White boxes aur light checkerboard squares
      return false;
    }

    // Inner Propagation Detector: Gemstone ke paas aakar bilkul safe aur accurate rukta hai
    function isInnerBackground(r, g, b) {
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const sat = max - min;
      const lum = (r + g + b) / 3;

      if (max < 65) return true;   // Dark patches/edges
      if (min > 225) return true;  // Pure white background box
      if (sat < 12 && lum > 175 && lum < 230) return true; // Checkerboard ke gray dhabbe
      return false;
    }

    // --- UPGRADE 1: Dense Grid Margin Seeding ---
    // Outer 35% boundary mein har ek background pixel par seed daal do, 
    // taaki teedhe box ki wajah se bani koi bhi deewar flood-fill ko rok na paye!
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (x < w * 0.35 || x > w * 0.65 || y < h * 0.35 || y > h * 0.65) {
          const idx = y * w + x;
          const i = idx * 4;
          if (isOuterBackground(px[i], px[i + 1], px[i + 2])) {
            visited[idx] = 1;
            queue.push(idx);
          }
        }
      }
    }

    // --- UPGRADE 2: 8-Way Marching Flood Fill ---
    while (queue.length) {
      const idx = queue.pop();
      const i = idx * 4;
      px[i + 3] = 0; // Pixel ko poora transparent karo
      
      const x = idx % w;
      const y = (idx / w) | 0;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          
          if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
            const nIdx = ny * w + nx;
            if (!visited[nIdx]) {
              const ni = nIdx * 4;
              if (isInnerBackground(px[ni], px[ni + 1], px[ni + 2])) {
                visited[nIdx] = 1;
                queue.push(nIdx);
              }
            }
          }
        }
      }
    }

    // --- UPGRADE 3: Smart Edge Shaving ---
    // Kinaron par bache hue halkay jhoothe pixels ko clean karke Pearl jaisa smooth look dena
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = y * w + x;
        const i = idx * 4;
        
        if (px[i + 3] > 0) { 
          const touchesTransparent = 
            px[((y - 1) * w + x) * 4 + 3] === 0 ||
            px[((y + 1) * w + x) * 4 + 3] === 0 ||
            px[(y * w + (x - 1)) * 4 + 3] === 0 ||
            px[(y * w + (x + 1)) * 4 + 3] === 0;

          if (touchesTransparent) {
            const max = Math.max(px[i], px[i + 1], px[i + 2]);
            const min = Math.min(px[i], px[i + 1], px[i + 2]);
            const sat = max - min;
            const lum = (px[i] + px[i + 1] + px[i + 2]) / 3;

            if (sat < 30 && (lum > 140 || lum < 80)) {
              px[i + 3] = 0; // Kinare ke dhabbe gayab!
            }
          }
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
        const srcLower = img.src.toLowerCase();
        
        // Pearl pehle se hi perfectly transparent hai, isko chhedne ki zaroorat nahi hai
        if (srcLower.includes("pearl") || img.hasAttribute("data-skip-cutout")) {
          img.style.mixBlendMode = "normal";
          finish(true);
          return;
        }

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
