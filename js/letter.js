/* ═══════════════════════════════════════════════════════════════════
   LETTER — the card that types itself, with a skip
   ═══════════════════════════════════════════════════════════════════ */

window.BD = window.BD || {};

(function () {
  const PAUSE_AFTER = { "\n": 320, ".": 240, "!": 240, "?": 240, ",": 110, "—": 180 };

  window.BD.letter = function mount(refs, cfg) {
    const { layer, body, sign, skipBtn, closeBtn } = refs;
    /* config letters are hand-wrapped, so reflow them: blank lines are
       paragraph breaks, single line breaks are just the edge of the file */
    const text = String(cfg.letter || "")
      .replace(/\r\n/g, "\n")
      .split(/\n{2,}/)
      .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
      .join("\n\n");
    let i = 0;
    let timer = null;
    let typing = false;

    function revealAll() {
      clearTimeout(timer);
      timer = null;
      typing = false;
      body.textContent = text;
      body.classList.add("is-done");
      sign.classList.add("is-on");
    }

    function step() {
      if (i >= text.length) { revealAll(); return; }
      const ch = text[i++];
      body.textContent += ch;
      const wait = PAUSE_AFTER[ch] || (ch === "." ? 240 : 26);
      timer = setTimeout(step, wait);
    }

    function open() {
      clearTimeout(timer);
      i = 0;
      typing = true;
      body.textContent = "";
      body.classList.remove("is-done");
      sign.classList.remove("is-on");
      layer.classList.add("is-open");
      timer = setTimeout(step, 320);
    }

    function close() {
      clearTimeout(timer);
      timer = null;
      typing = false;
      layer.classList.remove("is-open");
    }

    skipBtn.addEventListener("click", revealAll);
    closeBtn.addEventListener("click", close);

    layer.addEventListener("click", (e) => { if (e.target === layer) close(); });

    return { open, close, skip: revealAll, isTyping: () => typing };
  };
})();
