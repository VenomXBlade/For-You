/* ═══════════════════════════════════════════════════════════════════
   FILM — the reel, then the credits
   ═══════════════════════════════════════════════════════════════════ */

window.BD = window.BD || {};

(function () {
  window.BD.film = function mount(refs, cfg) {
    const { layer, reel, credits, creditsList, exitBtn, replayBtn, wishBtn, titleEl } = refs;
    const photos = (cfg.photos || []).filter(p => p && p.src);
    const speed = Math.max(2, Number(cfg.filmSpeed) || 6) * 1000;

    let track = null;
    let frames = [];
    let index = 0;
    let timer = null;
    let running = false;

    /* ── background music for the film reel ────────────────────────── */
    let bgMusic = null;
    function ensureMusic() {
      if (!bgMusic) {
        bgMusic = new Audio("assets/videoplayback.m4a");
        bgMusic.loop = true;
        bgMusic.volume = 0.7;
      }
      return bgMusic;
    }

    /* ── build the strip ──────────────────────────────────────────── */
    function build() {
      reel.innerHTML = "";
      frames = [];

      track = document.createElement("div");
      track.className = "reel-track";
      reel.appendChild(track);

      photos.forEach((photo, n) => {
        const frame = document.createElement("div");
        frame.className = "reel-frame";

        const img = document.createElement("img");
        img.src = photo.src;
        img.alt = photo.caption || ("Memory " + (n + 1));
        img.loading = n === 0 ? "eager" : "lazy";
        img.decoding = "async";
        frame.appendChild(img);

        if (photo.caption) {
          const cap = document.createElement("p");
          cap.className = "reel-caption";
          cap.textContent = photo.caption;
          frame.appendChild(cap);
        }

        const stamp = document.createElement("span");
        stamp.className = "reel-stamp";
        stamp.textContent = "FRAME " + String(n + 1).padStart(2, "0") +
                            " / " + String(photos.length).padStart(2, "0");
        frame.appendChild(stamp);

        track.appendChild(frame);
        frames.push(frame);
      });

      photos.forEach(p => { const im = new Image(); im.src = p.src; });
    }

    /* ── the roll ─────────────────────────────────────────────────── */
    function rollTo(n, immediate) {
      if (!track) return;
      if (immediate) {
        track.style.transition = "none";
        track.style.transform = `translateY(${-n * 100}%)`;
        void track.offsetHeight;             // flush, then restore easing
        track.style.transition = "";
      } else {
        track.style.transform = `translateY(${-n * 100}%)`;
      }
      frames.forEach((f, k) => f.classList.toggle("is-current", k === n));
    }

    function advance() {
      if (!running) return;
      index++;
      if (index >= frames.length) { end(); return; }
      rollTo(index, false);
      timer = setTimeout(advance, speed);
    }

    function end() {
      running = false;
      clearTimeout(timer);
      timer = null;
      credits.hidden = false;
      window.BD.audio.chime();
    }

    function startProjector() {
      if (window.BD.audio.projector) window.BD.audio.projector(true);
    }
    function stopProjector() {
      if (window.BD.audio.projector) window.BD.audio.projector(false);
    }

    /* ── controls ─────────────────────────────────────────────────── */
    function open() {
      build();
      index = 0;
      running = true;
      credits.hidden = true;
      layer.classList.add("is-open");
      window.BD.audio.shutter();
      startProjector();

      /* play background music */
      try { const m = ensureMusic(); m.currentTime = 0; m.play().catch(()=>{}); } catch(e){}

      if (!frames.length) { end(); return; }
      rollTo(0, true);
      timer = setTimeout(advance, speed);
    }

    function stopTimers() {
      running = false;
      clearTimeout(timer);
      timer = null;
    }

    function close() {
      stopTimers();
      stopProjector();
      /* stop background music */
      try { if (bgMusic) { bgMusic.pause(); bgMusic.currentTime = 0; } } catch(e){}
      layer.classList.remove("is-open");
    }

    function replay() {
      stopTimers();
      index = 0;
      running = true;
      credits.hidden = true;
      rollTo(0, true);
      timer = setTimeout(advance, speed);
    }

    /* ── credits content ──────────────────────────────────────────── */
    const header = (cfg.copy && cfg.copy.filmHeader) || "original footage";
    if (titleEl) titleEl.textContent = (cfg.title || "").toUpperCase() + " · " + header.toUpperCase();

    creditsList.innerHTML = "";
    (cfg.credits || []).forEach(([role, name]) => {
      const row = document.createElement("div");
      const dt = document.createElement("dt"); dt.textContent = role;
      const dot = document.createElement("span"); dot.className = "dot";
      const dd = document.createElement("dd"); dd.textContent = name;
      row.append(dt, dot, dd);
      creditsList.appendChild(row);
    });

    exitBtn.addEventListener("click", close);
    replayBtn.addEventListener("click", replay);
    wishBtn.addEventListener("click", () => {
      close();
      if (refs.onWish) refs.onWish();
    });

    return { open, close, replay };
  };
})();
