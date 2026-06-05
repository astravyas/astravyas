/**
 * ASTRA VAULT — Core experience engine
 * Lenis smooth scroll · GSAP cinematic motion · Canvas void field
 */
(function initAstraVault() {
  "use strict";

  /* DOM refs */
  const canvas = document.querySelector("#void-field");
  const ctx = canvas?.getContext("2d", { alpha: false, desynchronized: true });
  const vault = document.querySelector(".vault");
  const trigger = document.querySelector(".obsidian-trigger");
  const cursor = document.querySelector(".energy-cursor");
  const cursorTrail = document.querySelector(".cursor-trail");
  const coreMessage = document.querySelector("[data-core-message]");
  const form = document.querySelector(".consult-form");
  const zoomLabel = document.querySelector("[data-zoom-label]");
  const zoomNote = document.querySelector("[data-zoom-note]");
  const zoomBar = document.querySelector("[data-zoom-bar]");
  const loader = document.querySelector("#loader");
  const loaderParticles = document.querySelector("#loader-particles");
  const yearEl = document.querySelector("[data-year]");

  const whatsappNumber = "918839961889";
  const isTouch = window.matchMedia("(max-width: 768px)").matches || "ontouchstart" in window;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (isTouch) document.body.classList.add("is-touch");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Zodiac copy */
  const zodiacData = {
    aries: { planet: "Mars · Fire", title: "Aries — The Sacred Flame", text: "Your path demands decisive initiation. This season favors courage over hesitation — align Ruby only after full chart verification." },
    taurus: { planet: "Venus · Earth", title: "Taurus — The Eternal Garden", text: "Stability and sensual wisdom rise. Diamond or Emerald paths open when Venus is dignified in your chart — never by impulse alone." },
    gemini: { planet: "Mercury · Air", title: "Gemini — Twin Intelligence", text: "Communication becomes your ritual. Emerald supports Mercury only when mental restlessness is chart-confirmed, not assumed." },
    cancer: { planet: "Moon · Water", title: "Cancer — Lunar Sanctuary", text: "Emotional tides require Pearl's soft resonance. Home, mother-energy and inner peace seek structured remedy, not escape." },
    leo: { planet: "Sun · Fire", title: "Leo — Solar Sovereignty", text: "Authority and creative radiance expand. Ruby amplifies the Sun — verify strength before wearing, lest ego outpaces dharma." },
    virgo: { planet: "Mercury · Earth", title: "Virgo — Precision Dharma", text: "Discipline refines destiny. Emerald serves analytical clarity; ritual consistency matters more than intensity." },
    libra: { planet: "Venus · Air", title: "Libra — Sacred Balance", text: "Relationships mirror karma. Diamond and Opal paths honor Venus — timing of partnership matters as much as compatibility." },
    scorpio: { planet: "Mars · Water", title: "Scorpio — Depth Alchemy", text: "Transformation is your native language. Red Coral and intense mantra work require guru-level chart gatekeeping." },
    sagittarius: { planet: "Jupiter · Fire", title: "Sagittarius — Expansive Wisdom", text: "Yellow Sapphire aligns with Jupiter's grace — wisdom, travel, teaching. Over-expansion without grounding invites dasha turbulence." },
    capricorn: { planet: "Saturn · Earth", title: "Capricorn — Karmic Architecture", text: "Blue Sapphire carries Saturn's weight — discipline, delay, mastery. Never worn casually; trial period is essential." },
    aquarius: { planet: "Saturn · Air", title: "Aquarius — Cosmic Vision", text: "Innovation meets ancient law. Saturn remedies plus humanitarian dharma align your eccentric path to collective good." },
    pisces: { planet: "Jupiter · Water", title: "Pisces — Mystic Ocean", text: "Pearl and Yellow Sapphire soothe spiritual sensitivity. Boundaries are remedies too — compassion needs structure." }
  };

  const zoomStates = [
    ["Solar System Field", "Auto zoom: planets orbiting inside the birth field.", "42%", 0.15],
    ["Milky Way Pullback", "Auto zoom: one destiny chart expands into a galactic map.", "68%", 0.58],
    ["Galaxies Beyond", "Auto zoom: the universe opens into multi-galaxy silence.", "100%", 1.08]
  ];

  const coreLines = [
    "System online. Horoscope field rotating.",
    "Glass resonance stabilized.",
    "Gemstone realm unlocked.",
    "Birth signal chamber ready.",
    "WhatsApp consultation gate active.",
    "Solar map breathing in silence."
  ];

  /* State */
  let width = 0;
  let height = 0;
  let dpr = 1;
  let stars = [];
  let dust = [];
  let galaxies = [];
  let shards = [];
  let time = 0;
  let awakened = false;
  let zoomIndex = 0;
  let targetZoom = 0;
  let zoom = 0;
  let lineIndex = 0;
  let renderActive = true;
  let frameSkip = 0;
  let reverseBurst = 0;
  let mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, speed: 0 };
  let lastMouse = { x: 0.5, y: 0.5 };
  let lenis = null;
  let trailPool = [];
  let trailIndex = 0;
  let motionReady = false;

  /* ------------------------------------------------------------------ */
  /* Loader                                                              */
  /* ------------------------------------------------------------------ */
  function initLoader() {
    if (loaderParticles) {
      const count = isTouch ? 24 : 48;
      for (let i = 0; i < count; i += 1) {
        const s = document.createElement("span");
        s.style.left = `${Math.random() * 100}%`;
        s.style.top = `${Math.random() * 100}%`;
        s.style.animationDelay = `${Math.random() * 4}s`;
        s.style.opacity = String(0.2 + Math.random() * 0.5);
        loaderParticles.appendChild(s);
      }
    }
      const finish = () => {
  loader?.classList.add("is-done");
  document.body.classList.add("is-loaded");
  awaken(true);
};

    if (prefersReduced) {
      setTimeout(finish, 300);
    } else {
      setTimeout(finish, isTouch ? 1200 : 1600);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Lenis + GSAP                                                        */
  /* ------------------------------------------------------------------ */
  function revealVisibleContent() {
    document.querySelectorAll(".reveal-item, .section-title h2").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }

  function initMotion() {
    if (motionReady) {
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
      return;
    }
    motionReady = true;

    if (typeof Lenis !== "undefined" && !prefersReduced && !lenis && !isTouch) {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => 1 - Math.pow(1 - t, 4),
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 0.85
      });

      lenis.on("scroll", () => {
        if (typeof ScrollTrigger !== "undefined") ScrollTrigger.update();
      });

      function raf(t) {
        lenis.raf(t);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      revealVisibleContent();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    /* Only animate elements below the fold — hero stays visible immediately */
    gsap.defaults({ ease: "power2.out", duration: 1.1 });

    gsap.utils.toArray(".reveal-item").forEach((el) => {
      if (el.closest(".hero")) return;
      gsap.fromTo(
        el,
        { opacity: 0, y: prefersReduced ? 0 : 28 },
        {
          opacity: 1,
          y: 0,
          duration: prefersReduced ? 0.01 : 1.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        }
      );
    });

    gsap.utils.toArray(".section-title").forEach((el) => {
      gsap.from(el.querySelector("h2"), {
        opacity: 0,
        y: prefersReduced ? 0 : 28,
        duration: prefersReduced ? 0.01 : 1.4,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" }
      });
    });

    ScrollTrigger.refresh();
  }

  /* ------------------------------------------------------------------ */
  /* Canvas void field                                                   */
  /* ------------------------------------------------------------------ */
  function rnd(min, max) {
    return min + Math.random() * (max - min);
  }

  function resize() {
    if (!canvas || !ctx) return;
    dpr = Math.min(window.devicePixelRatio || 1, isTouch ? 1 : 1.35);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seedSpace();
  }

  function seedSpace() {
    const area = width * height;
    const density = isTouch ? 2.4 : 1;
    const starCount = Math.min(isTouch ? 180 : 360, Math.floor(area / (2800 * density)));
    const dustCount = isTouch ? 0 : Math.min(50, Math.floor(area / (12000 * density)));

    stars = Array.from({ length: starCount }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: rnd(0.25, 1.4),
      r: rnd(0.3, 1.2),
      hue: i % 11 === 0 ? rnd(190, 210) : rnd(38, 48),
      drift: rnd(-0.05, 0.05),
      pulse: rnd(0, Math.PI * 2),
      layer: i % 9
    }));

    dust = Array.from({ length: dustCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: rnd(0.4, 1.4),
      vx: rnd(-0.08, 0.08),
      vy: rnd(-0.06, 0.06),
      a: rnd(0.03, 0.16),
      pixel: Math.random() > 0.55
    }));

    galaxies = Array.from({ length: isTouch ? 2 : 4 }, (_, i) => ({
      x: rnd(width * -0.05, width * 1.05),
      y: rnd(height * 0.08, height * 0.82),
      radius: rnd(80, 180),
      hue: i % 3 === 0 ? 42 : i % 3 === 1 ? 200 : 330,
      phase: rnd(0, Math.PI * 2),
      alpha: rnd(0.08, 0.2)
    }));

    shards = Array.from({ length: 60 }, () => ({
      x: width * 0.5,
      y: height * 0.5,
      vx: rnd(-6, 6),
      vy: rnd(-5, 5),
      life: 999,
      max: rnd(45, 85),
      size: rnd(1, 2.5)
    }));
  }

  function fillVoid() {
    const cx = width * (0.5 + (mouse.x - 0.5) * 0.03);
    const cy = height * (0.48 + (mouse.y - 0.5) * 0.03);
    const gradient = ctx.createRadialGradient(cx, cy, 0, width * 0.5, height * 0.5, Math.max(width, height) * 0.85);
    gradient.addColorStop(0, awakened ? "#06080c" : "#010101");
    gradient.addColorStop(0.4, "#020203");
    gradient.addColorStop(1, "#000");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  function drawNebula() {
    if (!awakened) return;
    const breathe = Math.sin(time * 0.00028) * 0.5 + 0.5;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    [
      [0.5, 0.52, 0.38, 201, 169, 98, 0.028 + breathe * 0.01],
      [0.2, 0.3, 0.3, 142, 184, 200, 0.018]
    ].forEach(([x, y, radius, r, g, b, a], i) => {
      const gx = width * x + Math.sin(time * 0.00015 + i) * 28 + (mouse.x - 0.5) * 40;
      const gy = height * y + Math.cos(time * 0.00012 + i) * 22 + (mouse.y - 0.5) * 32;
      const nebula = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(width, height) * radius);
      nebula.addColorStop(0, `rgba(${r},${g},${b},${a * (0.5 + zoom * 0.4)})`);
      nebula.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, width, height);
    });
    ctx.restore();
  }

  function drawStars() {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    stars.forEach((star, i) => {
      const parallax = (star.layer + 1) * (awakened ? 3 : 1.5);
      let x = star.x + (mouse.x - 0.5) * parallax * 3 + time * star.drift - zoom * (star.layer - 4) * 12;
      let y = star.y + (mouse.y - 0.5) * parallax * 2.5 + Math.sin(time * 0.0002 + i) * star.z * 3;
      x = ((x % width) + width) % width;
      y = ((y % height) + height) % height;
      const twinkle = 0.22 + Math.sin(time * 0.0018 + star.pulse) * 0.2 + star.z * 0.18;
      ctx.fillStyle = `hsla(${star.hue}, 70%, ${62 + star.z * 12}%, ${Math.max(0.04, twinkle)})`;
      if (i % 6 === 0) {
        ctx.fillRect(x, y, star.r, star.r);
      } else {
        ctx.beginPath();
        ctx.arc(x, y, star.r * star.z, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.restore();
  }

  function drawGalaxies() {
    if (!awakened && zoom < 0.15) return;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    galaxies.forEach((galaxy, gi) => {
      const alpha = galaxy.alpha * Math.min(1, zoom + 0.1);
      const spin = time * 0.00003 + galaxy.phase;
      ctx.save();
      ctx.translate(galaxy.x + (mouse.x - 0.5) * 14, galaxy.y + (mouse.y - 0.5) * 10);
      ctx.rotate(spin);
      const core = ctx.createRadialGradient(0, 0, 0, 0, 0, galaxy.radius * 0.38);
      core.addColorStop(0, `hsla(${galaxy.hue}, 80%, 72%, ${alpha})`);
      core.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.ellipse(0, 0, galaxy.radius * 0.38, galaxy.radius * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();
      const arms = isTouch ? 50 : 70;
      for (let i = 0; i < arms; i += 1) {
        const t = i / arms;
        const arm = i % 3;
        const angle = arm * 2.094 + t * 5.4;
        const r = t * galaxy.radius;
        ctx.fillStyle = `hsla(${galaxy.hue}, 80%, ${60 + (1 - t) * 18}%, ${alpha * (1 - t)})`;
        ctx.fillRect(Math.cos(angle) * r, Math.sin(angle) * r * 0.4, 1, 1);
      }
      ctx.restore();
    });
    ctx.restore();
  }

  function drawDust() {
    if (!dust.length) return;
    const cx = mouse.x * width;
    const cy = mouse.y * height;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    dust.forEach((p) => {
      const dx = p.x - cx;
      const dy = p.y - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const force = Math.max(0, 1 - dist / 140);
      const dir = reverseBurst > 0 ? -1.6 : 1;
      p.x += (p.vx + (dx / dist) * force) * dir;
      p.y += (p.vy + (dy / dist) * force) * dir;
      if (p.x < -15) p.x = width + 15;
      if (p.x > width + 15) p.x = -15;
      if (p.y < -15) p.y = height + 15;
      if (p.y > height + 15) p.y = -15;
      ctx.fillStyle = `rgba(201, 169, 98, ${p.a + force * 0.2})`;
      if (p.pixel) ctx.fillRect(p.x, p.y, p.r + force * 0.5, p.r + force * 0.5);
      else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + force * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.restore();
  }

  function drawShards() {
    if (!awakened) return;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    shards.forEach((s) => {
      if (s.life >= s.max) return;
      s.life += 1;
      s.x += s.vx;
      s.y += s.vy;
      s.vx *= 0.98;
      s.vy *= 0.98;
      ctx.fillStyle = `rgba(201, 169, 98, ${(1 - s.life / s.max) * 0.5})`;
      ctx.fillRect(s.x, s.y, s.size, s.size);
    });
    ctx.restore();
  }

  function render(now) {
    requestAnimationFrame(render);
    if (!renderActive || !ctx) return;
    if (!awakened) {
      time = now;
      fillVoid();
      drawStars();
      return;
    }
    frameSkip += 1;
    if (frameSkip % 2 !== 0) return;
    time = now;
    mouse.x += (mouse.tx - mouse.x) * 0.07;
    mouse.y += (mouse.ty - mouse.y) * 0.07;
    mouse.speed *= 0.88;
    zoom += (targetZoom - zoom) * 0.016;
    reverseBurst *= 0.93;
    fillVoid();
    drawStars();
    if (awakened) {
      drawNebula();
      drawGalaxies();
      drawDust();
      drawShards();
    }
  }

  /* ------------------------------------------------------------------ */
  /* Awakening sequence                                                  */
  /* ------------------------------------------------------------------ */

  function completeAwakening() {
    awakened = true;
    vault.dataset.state = "awakened";
    vault.dataset.phase = "awakened";
    document.body.classList.add("motion-live");
    document.querySelector(".horoscope-engine")?.classList.add("is-live");
    targetZoom = zoomStates[0][3];

    shards.forEach((s) => {
      s.x = width * 0.5;
      s.y = height * 0.5;
      s.life = 0;
    });

    coreMessage.textContent = "Astra Vault awakened. Sacred gemstone realm online.";
    window.AstraGems?.showField?.();
    startAutoZoom();
    revealVisibleContent();

    requestAnimationFrame(() => {
      initMotion();
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
    });

    if (typeof gsap !== "undefined") {
      gsap.fromTo(
        ".app-shell",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.15 }
      );
      gsap.from(".hero-copy .hero-title .line", {
        y: 28,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: "power3.out",
        delay: 0.35
      });
      gsap.from(".hero-cosmic-stack", {
        scale: 0.92,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.4
      });
    }
  }

  function awaken(instant = false) {
    if (awakened) return;
    loader?.classList.add("is-done");

    if (instant) {
      completeAwakening();
      return;
    }

    vault.dataset.phase = "opening";
    setTimeout(completeAwakening, 650);
  }

  function setZoomState(index) {
    zoomIndex = index % zoomStates.length;
    const state = zoomStates[zoomIndex];
    zoomLabel.textContent = state[0];
    zoomNote.textContent = state[1];
    zoomBar.style.width = state[2];
    targetZoom = state[3];
    coreMessage.textContent = state[1];
  }

  function startAutoZoom() {
    setZoomState(0);
    setInterval(() => {
      if (!awakened) return;
      setZoomState(zoomIndex + 1);
    }, 5400);
  }

  /* ------------------------------------------------------------------ */
  /* Interactions                                                        */
  /* ------------------------------------------------------------------ */
  function updateTilt(nx, ny) {
    vault.style.setProperty("--tilt-x", `${((nx - 0.5) * 24).toFixed(2)}deg`);
    vault.style.setProperty("--tilt-y", `${((0.5 - ny) * 18).toFixed(2)}deg`);
    vault.style.setProperty("--glow-x", `${(nx * 100).toFixed(1)}%`);
    vault.style.setProperty("--glow-y", `${(ny * 100).toFixed(1)}%`);
    vault.style.setProperty("--mouse-x", nx.toFixed(3));
    vault.style.setProperty("--mouse-y", ny.toFixed(3));
  }

  function openWhatsApp(data) {
    const message = [
      "Namaste Raghvendra Kumar Vyas ji,",
      "I want astrology consultation.",
      "",
      `Name: ${data.get("name") || "-"}`,
      `Phone: ${data.get("phone") || "-"}`,
      `Birth Date: ${data.get("date") || "-"}`,
      `Birth Time: ${data.get("time") || "-"}`,
      `Birth Place: ${data.get("place") || "-"}`,
      `Category: ${data.get("category") || "-"}`,
      `Question: ${data.get("question") || "-"}`
    ].join("\n");
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  /* Magnetic buttons */
  function initMagnetic() {
    if (isTouch || prefersReduced) return;

    document.querySelectorAll("[data-magnetic], .magnetic-target").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transform = "";
      });
    });
  }

  /* Gem card tilt + shine */
  function initGemCards() {
    document.querySelectorAll(".gem-card[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        card.style.setProperty("--shine-x", `${x * 100}%`);
        card.style.setProperty("--shine-y", `${y * 100}%`);
      });
    });

    document.querySelectorAll("[data-tilt]:not(.gem-card)").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        if (isTouch) return;
        const rect = card.getBoundingClientRect();
        const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
        const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
        card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* Stat counters */
  function initCounters() {
    const counters = document.querySelectorAll("[data-count]");
    if (!counters.length || typeof ScrollTrigger === "undefined") return;

    counters.forEach((el) => {
      const target = Number(el.dataset.count) || 0;
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: prefersReduced ? 0.01 : 2.2,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = Math.floor(obj.val).toLocaleString();
            }
          });
        }
      });
    });
  }

  /* Zodiac */
  function initZodiac() {
    const planet = document.querySelector("[data-zodiac-planet]");
    const title = document.querySelector("[data-zodiac-title]");
    const text = document.querySelector("[data-zodiac-text]");

    document.querySelectorAll(".zodiac-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".zodiac-btn").forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        const data = zodiacData[btn.dataset.sign];
        if (!data) return;
        if (typeof gsap !== "undefined") {
          gsap.fromTo(
            [planet, title, text],
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" }
          );
        }
        planet.textContent = data.planet;
        title.textContent = data.title;
        text.textContent = data.text;
      });
    });
  }

  /* Nav active state */
  function initNavSpy() {
    const links = document.querySelectorAll(".side-panel nav a");
    const sections = [...links].map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);

    const onScroll = () => {
      const scrollY = lenis?.scroll ?? lenis?.animatedScroll ?? window.scrollY;
      let current = sections[0];
      sections.forEach((sec) => {
        if (sec.offsetTop - 120 <= scrollY) current = sec;
      });
      links.forEach((a) => {
        const match = current && a.getAttribute("href") === `#${current.id}`;
        a.classList.toggle("is-active", match);
      });
    };

    if (lenis) lenis.on("scroll", onScroll);
    else window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Custom cursor — single transform anchor so ring stays on pointer */
  function placeCursorEl(el, x, y, size) {
    if (!el) return;
    el.style.left = "0";
    el.style.top = "0";
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
  }

  function initCursor() {
    if (isTouch || !cursor) return;

    const maxTrail = 6;
    for (let i = 0; i < maxTrail; i += 1) {
      const dot = document.createElement("span");
      cursorTrail?.appendChild(dot);
      trailPool.push({ el: dot, x: 0, y: 0, life: 0 });
    }
  }

  function onPointerMove(event) {
    const nx = event.clientX / Math.max(1, width);
    const ny = event.clientY / Math.max(1, height);
    mouse.tx = nx;
    mouse.ty = ny;
    mouse.speed = Math.min(1, Math.hypot(nx - lastMouse.x, ny - lastMouse.y) * 18);
    lastMouse = { x: nx, y: ny };
    updateTilt(nx, ny);

    if (cursor) {
      const size = 28 + mouse.speed * 24;
      placeCursorEl(cursor, event.clientX, event.clientY, size);
    }

    if (cursorTrail && trailPool.length) {
      const t = trailPool[trailIndex % trailPool.length];
      trailIndex += 1;
      t.x = event.clientX;
      t.y = event.clientY;
      t.life = 1;
      placeCursorEl(t.el, t.x, t.y, 4);
      t.el.style.opacity = "0.5";
      gsap?.to(t.el, { opacity: 0, duration: 0.8, ease: "power2.out" });
    }
  }

  /* Event bindings */
  window.addEventListener("resize", resize);

  window.addEventListener("pointermove", onPointerMove, { passive: true });

  document.addEventListener("visibilitychange", () => {
    renderActive = !document.hidden;
  });

  document.addEventListener(
    "pointerover",
    (e) => {
      if (e.target.closest("a, button, input, select, textarea, summary") && cursor) {
        cursor.classList.add("is-hover");
      }
    },
    true
  );

  document.addEventListener(
    "pointerout",
    (e) => {
      if (e.target.closest("a, button, input, select, textarea, summary") && cursor) {
        cursor.classList.remove("is-hover");
      }
    },
    true
  );

  trigger?.addEventListener("click", () => awaken(false));
  trigger?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      awaken(false);
    }
  });

  document.querySelector("#skip-entry")?.addEventListener("click", () => awaken(true));

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    openWhatsApp(new FormData(form));
  });

  setInterval(() => {
    if (!awakened) return;
    lineIndex = (lineIndex + 1) % coreLines.length;
    coreMessage.textContent = coreLines[lineIndex];
  }, 7800);

  /* Boot */
  initLoader();
  initMagnetic();
  initGemCards();
  initZodiac();
  resize();
  setZoomState(0);
  requestAnimationFrame(render);

  /* Deferred GSAP (after loader) */
  setTimeout(() => {
    initCounters();
    initNavSpy();
    initCursor();
  }, 3000);
})();
