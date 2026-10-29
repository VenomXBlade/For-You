/* ═══════════════════════════════════════════════════════════════════
   INTRO CURTAIN LOGIC — One-Click Mistletoe to reveal surprise
   ═══════════════════════════════════════════════════════════════════ */

window.BD = window.BD || {};

(function () {
  function initCurtain() {
    const curtain = document.getElementById("intro-curtain");
    if (!curtain) return;

    /* Check if dev shortcut is active (?s=...) */
    const params = new URLSearchParams(location.search);
    if (params.get("s") || params.get("nocertain") || params.get("nocurtain")) {
      curtain.remove();
      return;
    }

    const rig = document.getElementById("pull-rig");
    const flash = document.getElementById("light-flash");
    const prompt = document.getElementById("pull-prompt");
    if (!rig) return;

    let isTriggered = false;

    function triggerSwitch() {
      if (isTriggered) return;
      isTriggered = true;

      /* 1. Unlock browser audio */
      if (window.BD.audio && window.BD.audio.unlock) {
        window.BD.audio.unlock();
      }

      /* 2. Visual spring bounce pull-down */
      rig.classList.add("is-animating-pull");

      /* 3. Audio click + light chime at bottom of the pull */
      setTimeout(function () {
        if (window.BD.audio && window.BD.audio.click) window.BD.audio.click();
        if (window.BD.audio && window.BD.audio.chime) window.BD.audio.chime();
      }, 160);

      /* 4. Light burst & veil dissolution */
      setTimeout(function () {
        if (flash) flash.classList.add("flash-active");

        /* Small sparkle */
        if (typeof window.confetti === "function") window.confetti(40);

        setTimeout(function () {
          curtain.classList.add("is-hidden");
          setTimeout(function () {
            curtain.remove();
          }, 950);
        }, 320);
      }, 240);
    }

    /* ── ONE-CLICK ONLY ──────────────────────────────────────────── */
    /* Clicking anywhere on the mistletoe, cord, bead, or prompt triggers the unfold */
    rig.addEventListener("click", triggerSwitch);

    if (prompt) {
      prompt.addEventListener("click", triggerSwitch);
    }

    /* Also allow tapping anywhere on the dark curtain backdrop */
    curtain.addEventListener("click", function (e) {
      if (e.target === curtain || (e.target && e.target.classList && e.target.classList.contains("curtain-dust"))) {
        triggerSwitch();
      }
    });
  }

  window.BD.initCurtain = initCurtain;

  /* Self-initialize as soon as DOM is ready */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCurtain);
  } else {
    initCurtain();
  }
})();
