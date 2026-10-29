/* ═══════════════════════════════════════════════════════════════════
   AUDIO — every sound is synthesised. No .mp3 files needed.
   Keeps the template tiny, and nothing can fail to load.
   ═══════════════════════════════════════════════════════════════════ */

window.BD = window.BD || {};

(function () {
  let ctx = null;
  let on = true;
  /* ?silent — used by the headless screenshot harness, and handy for testing */
  const silent = /[?&]silent\b/.test(location.search);

  function ensure() {
    if (silent) return null;
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try { ctx = new AC(); } catch (e) { return null; }
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(freq, at, dur, peak, type) {
    if (!on) return;
    const c = ensure(); if (!c) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type || "sine";
    o.frequency.value = freq;
    const t = c.currentTime + at;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  function noise(at, dur, peak, filterHz) {
    if (!on) return;
    const c = ensure(); if (!c) return;
    const len = Math.max(1, Math.floor(c.sampleRate * dur));
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.4);
    const src = c.createBufferSource(); src.buffer = buf;
    const f = c.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = filterHz || 2400;
    const g = c.createGain(); g.gain.value = peak;
    src.connect(f).connect(g).connect(c.destination);
    src.start(c.currentTime + at);
  }

  /* ── the projector: a mechanical flutter, synthesised ─────────── */
  let proj = null;

  function startProjector() {
    if (!on || proj) return;
    const c = ensure();
    if (!c) return;

    /* noise pre-shaped into a 7 Hz claw / pulldown flutter */
    const secs = 2;
    const len = Math.floor(c.sampleRate * secs);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const t = i / c.sampleRate;
      const pulse = Math.pow(0.5 + 0.5 * Math.sin(2 * Math.PI * 7 * t), 6);
      d[i] = (Math.random() * 2 - 1) * pulse;
    }

    const src = c.createBufferSource();
    src.buffer = buf;
    src.loop = true;

    const band = c.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 1350;
    band.Q.value = 1.1;

    const g = c.createGain();
    g.gain.value = 0.0001;

    src.connect(band).connect(g).connect(c.destination);

    const hum = c.createOscillator();
    hum.type = "sine";
    hum.frequency.value = 57;
    const hg = c.createGain();
    hg.gain.value = 0.0001;
    hum.connect(hg).connect(c.destination);

    src.start();
    hum.start();

    const t0 = c.currentTime;
    g.gain.exponentialRampToValueAtTime(0.052, t0 + 0.7);
    hg.gain.exponentialRampToValueAtTime(0.018, t0 + 0.7);

    proj = { src, hum, g, hg };
  }

  function stopProjector() {
    if (!proj || !ctx) { proj = null; return; }
    const t = ctx.currentTime;
    const p = proj;
    proj = null;
    try {
      p.g.gain.cancelScheduledValues(t);
      p.hg.gain.cancelScheduledValues(t);
      p.g.gain.setValueAtTime(Math.max(p.g.gain.value, 0.0001), t);
      p.hg.gain.setValueAtTime(Math.max(p.hg.gain.value, 0.0001), t);
      p.g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      p.hg.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      setTimeout(() => {
        try { p.src.stop(); p.hum.stop(); } catch (e) {}
      }, 700);
    } catch (e) {}
  }

  window.BD.audio = {
    /* call from a real user gesture */
    unlock() { ensure(); },
    isOn() { return on; },
    setOn(v) { on = !!v; if (!on) stopProjector(); },

    /* the door opening */
    open() { noise(0, 0.35, 0.25, 1200); tone(392, 0.05, 1.1, 0.09); },
    /* confetti / sparkle */
    pop() { noise(0, 0.09, 0.35, 5000); tone(880, 0.01, 0.28, 0.06, "triangle"); },
    /* warm three-note rise */
    chime() {
      [523.25, 659.25, 783.99].forEach((f, i) => tone(f, i * 0.16, 1.9, 0.055, "sine"));
    },
    /* card opening */
    paper() { noise(0, 0.22, 0.12, 3200); },
    /* light switch click */
    click() { noise(0, 0.035, 0.45, 5200); tone(640, 0.01, 0.18, 0.1, "triangle"); },
    /* camera starting */
    shutter() { noise(0, 0.06, 0.4, 6000); noise(0.08, 0.05, 0.28, 5000); },
    /* blow out the candles */
    puff() { noise(0, 0.55, 0.3, 900); },
    /* the last note */
    soft() { [392, 523.25].forEach((f, i) => tone(f, i * 0.12, 2.4, 0.05, "sine")); },

    /* the reel turning — true to start, false to fade out */
    projector(start) { if (start) startProjector(); else stopProjector(); }
  };
})();
