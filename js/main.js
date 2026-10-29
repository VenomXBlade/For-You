/* ═══════════════════════════════════════════════════════════════════
   MAIN — reads config, wires the scene, runs the order of events
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  const cfg = window.BIRTHDAY;
  if (!cfg) { console.error("[birthday] config.js is missing."); return; }

  const $  = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const copy = cfg.copy || {};

  /* ── theme ────────────────────────────────────────────────────── */
  const themeParam = new URLSearchParams(location.search).get("theme");
  document.documentElement.setAttribute("data-theme", themeParam || cfg.theme || "amber");

  /* ── text from config ─────────────────────────────────────────── */
  document.title = cfg.title || cfg.name || "Happy birthday";

  const title = cfg.title || ("For " + cfg.name);
  if ($("#door-title"))  $("#door-title").textContent  = title;
  if ($("#door-kicker")) $("#door-kicker").textContent = cfg.kicker || "";
  if ($("#begin"))       $("#begin").textContent       = copy.beginLabel || "open your surprise 💌";

  if ($("#paper-top"))   $("#paper-top").textContent   = cfg.letterTop || "";
  if ($("#paper-name"))  $("#paper-name").textContent  = "For " + cfg.name + ".";
  if ($("#paper-sign"))  $("#paper-sign").textContent  = cfg.from || "";
  if ($("#card-to"))     $("#card-to").textContent     = "For " + cfg.name;
  if ($("#poster-name")) $("#poster-name").textContent = cfg.name || "";
  if ($("#stage-name"))  $("#stage-name").textContent  = cfg.name || "Devika";

  $("#wish-kicker").textContent = copy.wishKicker || "";
  $("#wish-title").textContent  = copy.wishTitle || "";
  $("#wish-end").textContent    = copy.endLine || ("Happy birthday, " + cfg.name + ".");

  $$("[data-copy]").forEach((el) => {
    const v = copy[el.dataset.copy];
    if (v != null) el.textContent = v;
  });

  if (copy.wishKicker) $("#wish-kicker").textContent = copy.wishKicker;
  if (copy.wishTitle)  $("#wish-title").textContent  = copy.wishTitle;

  /* ── scenes ───────────────────────────────────────────────────── */  const scenes = { door: $("#door"), table: $("#table") };
  function show(name) {
    Object.entries(scenes).forEach(([k, el]) => el.classList.toggle("is-active", k === name));
  }

  /* ── blossom fall ─────────────────────────────────────────────── */
  (function petals() {
    const root = $("#petals");
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (let i = 0; i < 24; i++) {
      const p = document.createElement("i");
      p.className = "petal";
      p.style.setProperty("--sz", (7 + Math.random() * 8).toFixed(1) + "px");
      p.style.setProperty("--op", (0.32 + Math.random() * 0.42).toFixed(2));
      p.style.setProperty("--dur", (11 + Math.random() * 9).toFixed(1) + "s");
      p.style.setProperty("--delay", (-Math.random() * 20).toFixed(1) + "s");
      p.style.setProperty("--sway", (-46 + Math.random() * 92).toFixed(0) + "px");
      p.style.setProperty("--sway2", (-46 + Math.random() * 92).toFixed(0) + "px");
      p.style.left = (Math.random() * 100).toFixed(1) + "%";
      root.appendChild(p);
    }
  })();

  /* ── confetti ─────────────────────────────────────────────────── */
  function confetti(count) {
    const root = $("#confetti");
    const palette = ["var(--accent)", "var(--paper)", "var(--hot)", "#E6C76B", "#F6A5A2"];
    const n = count || 90;
    for (let i = 0; i < n; i++) {
      const bit = document.createElement("i");
      bit.className = "confetti-bit";
      bit.style.left = Math.random() * 100 + "%";
      bit.style.background = palette[i % palette.length];
      bit.style.setProperty("--dx", (Math.random() * 240 - 120) + "px");
      bit.style.setProperty("--dur", (2.6 + Math.random() * 2.6) + "s");
      bit.style.animationDelay = (Math.random() * 0.5) + "s";
      root.appendChild(bit);
      setTimeout(() => bit.remove(), 6000);
    }
  }
  window.confetti = confetti;

  /* ── the pieces ───────────────────────────────────────────────── */
  const letter = window.BD.letter({
    layer:   $("#card-layer"),
    body:    $("#paper-body"),
    sign:    $("#paper-sign"),
    skipBtn: $("#card-skip"),
    closeBtn: $("#card-close")
  }, cfg);

  let film = null;
  let filmDone = false;
  const cake3d = window.BD.scene($("#cake-canvas"), $("#cake-holder"), cfg);

  function openWish() {
    filmDone = true;
    closeCake();
    $("#wish-layer").classList.add("is-open");
    $("#wish-end").hidden = true;
    $("#wish-restart").hidden = true;
    $("#wish-blow").hidden = false;
    window.BD.audio.soft();
  }

  /* ── the slice: a small aside, not a step in the story ────────── */
  const cakeLayer = $("#cake-layer");
  function openCake() {
    $("#cake-blow").hidden = !filmDone;
    cakeLayer.classList.add("is-open");
    window.BD.audio.paper();
  }
  function closeCake() { cakeLayer.classList.remove("is-open"); }

  $("#cake-close").addEventListener("click", closeCake);
  $("#cake-blow").addEventListener("click", () => { openWish(); });
  cakeLayer.addEventListener("click", (e) => { if (e.target === cakeLayer) closeCake(); });

  film = window.BD.film({
    layer:       $("#film-layer"),
    reel:        $("#reel"),
    credits:     $("#credits"),
    creditsList: $("#credits-list"),
    exitBtn:     $("#film-exit"),
    replayBtn:   $("#credits-replay"),
    wishBtn:     $("#credits-wish"),
    titleEl:     $("#film-title"),
    onWish:      openWish
  }, cfg);

  if ($("#credits-kicker")) $("#credits-kicker").textContent = cfg.creditsKicker || "";
  if ($("#credits-title"))  $("#credits-title").textContent  = "Starring " + cfg.name + ".";

  if (window.BD.stickerBook) window.BD.stickerBook();
  if (window.BD.initCurtain) window.BD.initCurtain();

  /* ── door → table ─────────────────────────────────────────────── */
  let begun = false;
  $("#begin").addEventListener("click", () => {
    if (begun) return;
    begun = true;

    window.BD.audio.unlock();
    window.BD.audio.open();
    confetti(110);

    setTimeout(() => {
      show("table");
      window.BD.audio.chime();
      /* the cake was mounted while this scene was hidden, so its canvas is
         still 1×1 — tell it to measure itself now that it has a size */
      window.dispatchEvent(new Event("resize"));

      // one gentle invitation, then never again
      $$(".prop").forEach((p) => {
        p.dataset.invite = "1";
        setTimeout(() => { delete p.dataset.invite; }, 2600);
      });
      setTimeout(() => $("#hint").classList.add("is-on"), 900);
      setTimeout(() => $("#hint").classList.remove("is-on"), 5200);
    }, 420);
  });

  /* ── table → card / film / polaroids ──────────────────────────── */
  if ($("#prop-card")) {
    $("#prop-card").addEventListener("click", () => {
      window.BD.audio.paper();
      letter.open();
    });
  }

  if ($("#pill-card")) {
    $("#pill-card").addEventListener("click", () => {
      window.BD.audio.paper();
      letter.open();
    });
  }

  if ($("#prop-camera")) {
    $("#prop-camera").addEventListener("click", () => {
      film.open();
    });
  }

  if ($("#polaroid-1")) {
    $("#polaroid-1").addEventListener("click", () => film.open());
  }
  if ($("#polaroid-2")) {
    $("#polaroid-2").addEventListener("click", () => film.open());
  }

  /* cake: tap to blow out candles with celebration and open the wish */
  if ($("#prop-cake")) {
    const triggerCakeWish = () => {
      if (scenes.table.classList.contains("is-active")) {
        const flames = $("#candle-flames");
        if (flames) flames.classList.add("is-blown");
        if (cake3d && cake3d.blowOut) cake3d.blowOut();
        window.BD.audio.puff();
        confetti(120);
        setTimeout(() => openWish(), 650);
      }
    };
    $("#prop-cake").addEventListener("click", triggerCakeWish);
    $("#prop-cake").addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); triggerCakeWish(); }
    });
  }

  /* ── the wish ─────────────────────────────────────────────────── */
  $("#wish-blow").addEventListener("click", () => {
    window.BD.audio.puff();
    const flames = $("#candle-flames");
    if (flames) flames.classList.add("is-blown");
    if (cake3d && cake3d.blowOut) cake3d.blowOut();
    confetti(150);
    $("#wish-blow").hidden = true;
    setTimeout(() => {
      $("#wish-end").hidden = false;
      $("#wish-restart").hidden = false;
    }, 500);
  });

  $("#wish-restart").addEventListener("click", () => {
    $("#wish-layer").classList.remove("is-open");
  });

  /* ── escape ───────────────────────────────────────────────────── */
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if ($("#card-layer").classList.contains("is-open")) { letter.close(); return; }
    if ($("#film-layer").classList.contains("is-open")) { film.close(); return; }
    if ($("#cake-layer").classList.contains("is-open")) { closeCake(); return; }
    if ($("#wish-layer").classList.contains("is-open")) { $("#wish-layer").classList.remove("is-open"); }
  });

  /* ── dev shortcut: ?s=table | card | film | wish ──────────────── */
  const params = new URLSearchParams(location.search);
  const devScreen = params.get("s");
  if (params.get("plain")) {          // dev: bright background, to inspect props
    $("#table").style.background = "#dcdcdc";
    $("#grain").style.display = "none";
  }
  if (params.get("noanim")) {         // dev: freeze animations for screenshots
    const s = document.createElement("style");
    s.textContent = "*,*::before,*::after{animation:none!important;transition:none!important}";
    document.head.appendChild(s);
  }
  if (devScreen) {
    $("#begin").click();
    /* with animations frozen there is nothing to wait for, so the
       screenshot can't race the 900ms hand-off */
    const jump = () => {
      if (devScreen === "card") $("#prop-card").click();
      if (devScreen === "film") $("#prop-camera").click();
      if (devScreen === "credits") {
        $("#prop-camera").click();
        $("#credits").hidden = false;
      }
      if (devScreen === "wish") { filmDone = true; openWish(); }
      if (devScreen === "wish" && params.get("blow")) {
        setTimeout(() => $("#wish-blow").click(), 1400);
      }
      if (devScreen === "slice") openCake();
      if (devScreen === "slice" && params.get("blow")) {
        filmDone = true;
        $("#cake-blow").hidden = false;
      }
      if (devScreen === "stickers" && $("#pill-stickers")) {
        $("#pill-stickers").click();
      }
    };
    if (params.get("noanim")) jump();
    else setTimeout(jump, 900);
  }

  /* ── dev: ?rects — report layout into the title, for headless checks ── */
  if (params.get("rects")) {
    setTimeout(() => {
      const rd = (s) => {
        const el = document.querySelector(s);
        if (!el) return s + "=none";
        const r = el.getBoundingClientRect();
        return s + "=" + [r.left, r.top, r.width, r.height].map(Math.round).join(",");
      };
      const cv = $("#cake-canvas");
      document.title = [
        "vw=" + innerWidth + "x" + innerHeight,
        rd(".diorama"), rd(".prop-card"), rd(".prop-cake"), rd(".prop-camera"),
        rd(".cake-holder"), "#cake-canvas=" + cv.width + "x" + cv.height,
        "sceneInfo=" + JSON.stringify(window.BD.sceneInfo || null)
      ].join(" | ");
    }, 6000);
  }
})();
