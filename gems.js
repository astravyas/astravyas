/**
 * ASTRA VAULT — Gem photos: Ultra-clean background cutout (Black bars & Checkerboard Destroyer)
 */
(function initGemField() {
  
  function cutOutGem(img, isDiamond = false) {
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
    
    const cx = w / 2;
    const cy = h / 2;

    // Poore canvas ke ek-ek pixel ko line-by-line scan karo
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const r = px[i];
        const g = px[i + 1];
        const b = px[i + 2];
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const sat = max - min;
        const lum = (r + g + b) / 3;
        
        // Center se pixel ki doori (Elliptical Boundary)
        const dx = (x - cx) / cx;
        const dy = (y - cy) / cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // 1. Sabse pehle bahar ke gande Black Bars ko udaao (Everywhere)
        if (max < 65) {
          px[i + 3] = 0;
          continue;
        }

        // 2. Agar pixel Gem ke core area se bahar hai (Outer 50% zone)
        if (dist > 0.48) {
          // Pure White Card ya Fake Checkerboard ke Gray/White squares ko saaf karo
          if (min > 185 || (sat < 25 && lum > 130)) {
            px[i + 3] = 0;
            continue;
          }
        } else {
          // 3. Inner Gem Area: Yahan sirf tabhi touch karenge jab pakka background ho
          // Diamond ke facets ko bachane ke liye strict rules
          if (!isDiamond && min > 230) {
            px[i + 3] = 0; // Ruby aur Coral ke aaspas ka background saaf
          } else if (isDiamond && min > 248 && sat < 10) {
            px[i + 3] = 0; // Diamond ke andar ke dhabbe clean karne ke liye ultra-safe white filter
          }
        }
      }
    }

    // Kinaron ko smooth (anti-alias) karne ke liye halka sa alpha blend
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = (y * w + x) * 4;
        if (px[i + 3] > 0) {
          const n1 = px[((y - 1) * w + x) * 4 + 3] === 0;
          const n2 = px[((y + 1) * w + x) * 4 + 3] === 0;
          const n3 = px[(y * w + (x - 1)) * 4 + 3] === 0;
          const n4 = px[(y * w + (x + 1)) * 4 + 3] === 0;
          
          if (n1 || n2 || n3 || n4) {
            const max = Math.max(px[i], px[i + 1], px[i + 2]);
            if (max > 150 && (px[i] - px[i + 2]) < 40) {
              px[i + 3] = Math.floor(px[i + 3] * 0.3); // Edge smoothing pass
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
        
        // Pearl pehle se hi perfectly transparent asset hai, ise chhedne ki zarurat nahi hai
        if (srcLower.includes("pearl") || img.hasAttribute("data-skip-cutout")) {
          img.style.mixBlendMode = "normal";
          finish(true);
          return;
        }

        const isDiamond = srcLower.includes("diamond") || srcLower.includes("heera");
        img.src = cutOutGem(img, isDiamond);
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
 * ASTRA VAULT — Gem data config
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
