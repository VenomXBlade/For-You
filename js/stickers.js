/* ═══════════════════════════════════════════════════════════════════
   STICKER BOOK LOGIC — Drag-and-Drop ONLY (Desktop Drag & Touch Drag)
   No Tap-to-Place. Live Component Reload, EXP Bar & Auto-Advance.
   ═══════════════════════════════════════════════════════════════════ */

window.BD = window.BD || {};

(function () {
  const STICKERS = [
    { id: 1,  src: "assets/stickers/sticker1.png",  title: "Sticker 1" },
    { id: 2,  src: "assets/stickers/sticker2.png",  title: "Sticker 2" },
    { id: 3,  src: "assets/stickers/sticker3.png",  title: "Sticker 3" },
    { id: 4,  src: "assets/stickers/sticker4.png",  title: "Sticker 4" },
    { id: 5,  src: "assets/stickers/sticker5.png",  title: "Sticker 5" },
    { id: 6,  src: "assets/stickers/sticker6.png",  title: "Sticker 6" },
    { id: 7,  src: "assets/stickers/sticker7.png",  title: "Sticker 7" },
    { id: 8,  src: "assets/stickers/sticker8.png",  title: "Sticker 8" },
    { id: 9,  src: "assets/stickers/sticker9.png",  title: "Sticker 9" },
    { id: 10, src: "assets/stickers/sticker10.png", title: "Sticker 10" }
  ];

  const SPREADS = [
    { title: "Chapter 1 · Sweet Memories", sub: "Drag stickers #1 and #2 to the slots ✨", slots: [1, 2], pageText: "Pages 1-2 of 10" },
    { title: "Chapter 2 · Endless Smiles", sub: "Drag stickers #3 and #4 to the slots ✨", slots: [3, 4], pageText: "Pages 3-4 of 10" },
    { title: "Chapter 3 · Little Adventures", sub: "Drag stickers #5 and #6 to the slots ✨", slots: [5, 6], pageText: "Pages 5-6 of 10" },
    { title: "Chapter 4 · Golden Hours", sub: "Drag stickers #7 and #8 to the slots ✨", slots: [7, 8], pageText: "Pages 7-8 of 10" },
    { title: "Chapter 5 · Forever & Always", sub: "Drag stickers #9 and #10 to the slots ✨", slots: [9, 10], pageText: "Pages 9-10 of 10" }
  ];

  let currentSpread = 0;
  let placedStickers = new Set();

  window.BD.stickerBook = function initStickerBook() {
    const layer = document.getElementById("sticker-book-layer");
    if (!layer) return;

    const openBtn = document.getElementById("pill-stickers");
    const closeBtn = document.getElementById("sticker-close");
    const congratsModal = document.getElementById("sticker-congrats-modal");
    const homeBtn = document.getElementById("congrats-home-btn");
    const viewAgainBtn = document.getElementById("congrats-view-btn");

    const prevBtn = document.getElementById("prev-page");
    const nextBtn = document.getElementById("next-page");
    const pageTitle = document.getElementById("page-title");
    const pageSub = document.getElementById("page-sub");
    const pageIndicator = document.getElementById("page-indicator");

    const slotLeft = document.getElementById("slot-left");
    const slotRight = document.getElementById("slot-right");
    const carouselEl = document.getElementById("sticker-carousel");

    const expCounter = document.getElementById("exp-counter");
    const expBarFill = document.getElementById("exp-bar-fill");

    function openBook() {
      layer.classList.add("is-open");
      if (window.BD.audio && window.BD.audio.paper) window.BD.audio.paper();
      reloadComponent();
    }

    function closeBook() {
      layer.classList.remove("is-open");
    }

    if (openBtn) openBtn.addEventListener("click", openBook);
    if (closeBtn) closeBtn.addEventListener("click", closeBook);

    if (homeBtn) {
      homeBtn.addEventListener("click", function () {
        if (congratsModal) congratsModal.hidden = true;
        closeBook();
      });
    }

    if (viewAgainBtn) {
      viewAgainBtn.addEventListener("click", function () {
        if (congratsModal) congratsModal.hidden = true;
        currentSpread = 0;
        reloadComponent();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        if (currentSpread > 0) {
          currentSpread--;
          if (window.BD.audio && window.BD.audio.paper) window.BD.audio.paper();
          reloadComponent();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        if (currentSpread < SPREADS.length - 1) {
          currentSpread++;
          if (window.BD.audio && window.BD.audio.paper) window.BD.audio.paper();
          reloadComponent();
        }
      });
    }

    /* ── CORE COMPONENT RELOAD ────────────────────────────────────── */
    function reloadComponent() {
      renderSpread();
      renderCarousel();
      renderExpBar();
    }

    /* ── LOVE EXP BAR ────────────────────────────────────────────── */
    function renderExpBar() {
      const count = placedStickers.size;
      const pct = Math.round((count / 10) * 100);

      if (expCounter) {
        expCounter.textContent = count + " / 10";
      }
      if (expBarFill) {
        expBarFill.style.width = pct + "%";
      }
    }

    /* ── SPREAD / BOOK PAGES ─────────────────────────────────────── */
    function renderSpread() {
      const sp = SPREADS[currentSpread];
      if (!sp) return;

      if (pageTitle) pageTitle.textContent = sp.title;
      if (pageSub) pageSub.textContent = sp.sub;
      if (pageIndicator) pageIndicator.textContent = sp.pageText;

      if (prevBtn) prevBtn.disabled = (currentSpread === 0);
      if (nextBtn) nextBtn.disabled = (currentSpread === SPREADS.length - 1);

      renderSlot(slotLeft, sp.slots[0]);
      renderSlot(slotRight, sp.slots[1]);
    }

    function renderSlot(slotEl, expectedId) {
      if (!slotEl) return;
      slotEl.dataset.slotId = expectedId;

      const isPlaced = placedStickers.has(expectedId);

      /* Rebuild slot HTML */
      if (isPlaced) {
        slotEl.className = "sticker-slot is-filled";
        slotEl.innerHTML =
          '<div class="slot-outline">' +
            '<img class="slot-placed-img" ' +
              'src="assets/stickers/sticker' + expectedId + '.png" ' +
              'alt="Sticker #' + expectedId + '">' +
          '</div>';
      } else {
        slotEl.className = "sticker-slot";
        slotEl.innerHTML =
          '<div class="slot-outline">' +
            '<span class="slot-number">#' + expectedId + '</span>' +
            '<span class="slot-hint">Drag #' + expectedId + ' here</span>' +
          '</div>';
      }

      /* Desktop Drag-and-drop Dropzone (HTML5 Drag API) */
      slotEl.ondragover = function (e) {
        e.preventDefault();
        slotEl.classList.add("drag-over");
      };
      slotEl.ondragleave = function () {
        slotEl.classList.remove("drag-over");
      };
      slotEl.ondrop = function (e) {
        e.preventDefault();
        slotEl.classList.remove("drag-over");
        const raw = e.dataTransfer.getData("text/plain");
        const draggedId = parseInt(raw, 10);
        if (!isNaN(draggedId)) {
          confirmPlacement(draggedId, expectedId);
        }
      };

      /* NO TAP AND PLACE: slot click does nothing */
      slotEl.onclick = null;
    }

    /* ── CAROUSEL INVENTORY (DRAGGABLE ONLY) ──────────────────────── */
    function renderCarousel() {
      if (!carouselEl) return;
      carouselEl.innerHTML = "";

      STICKERS.forEach(function (st) {
        const item = document.createElement("div");
        item.className = "carousel-item";
        item.dataset.id = st.id;
        const isPlaced = placedStickers.has(st.id);
        item.draggable = !isPlaced;

        if (isPlaced) {
          item.classList.add("is-placed");
        }

        const img = document.createElement("img");
        img.className = "carousel-img";
        img.src = st.src;
        img.alt = st.title;
        img.draggable = false; /* prevent browser native image ghost conflict */

        const badge = document.createElement("span");
        badge.className = "carousel-badge";
        badge.textContent = "#" + st.id;

        item.appendChild(img);
        item.appendChild(badge);

        /* 1. Desktop HTML5 Drag Start */
        item.addEventListener("dragstart", function (e) {
          if (placedStickers.has(st.id)) {
            e.preventDefault();
            return;
          }
          e.dataTransfer.setData("text/plain", String(st.id));
        });

        /* 2. NO TAP AND PLACE: click on sticker does nothing */
        item.onclick = null;

        /* 3. Mobile Touch Drag & Drop */
        setupTouchDrag(item, st.id);

        carouselEl.appendChild(item);
      });
    }

    /* Auto-scroll carousel so next unplaced sticker is first in view */
    function autoScrollCarousel() {
      if (!carouselEl) return;
      const nextItem = carouselEl.querySelector(".carousel-item:not(.is-placed)");
      if (nextItem) {
        nextItem.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      }
    }

    /* ── MOBILE TOUCH DRAG & DROP ────────────────────────────────── */
    function setupTouchDrag(itemEl, stickerId) {
      let touchGhost = null;
      let activeHoverSlot = null;

      itemEl.addEventListener("touchstart", function (e) {
        if (placedStickers.has(stickerId)) return;
        const touch = e.touches[0];

        touchGhost = itemEl.cloneNode(true);
        touchGhost.style.position = "fixed";
        touchGhost.style.zIndex = "9999";
        touchGhost.style.pointerEvents = "none";
        touchGhost.style.opacity = "0.9";
        touchGhost.style.transform = "scale(1.15) translate(-50%, -50%)";
        touchGhost.style.left = touch.clientX + "px";
        touchGhost.style.top = touch.clientY + "px";
        touchGhost.style.boxShadow = "0 10px 25px rgba(214, 68, 107, 0.4)";
        document.body.appendChild(touchGhost);
      }, { passive: true });

      itemEl.addEventListener("touchmove", function (e) {
        if (!touchGhost) return;
        const touch = e.touches[0];
        touchGhost.style.left = touch.clientX + "px";
        touchGhost.style.top = touch.clientY + "px";

        /* Highlight hovered slot */
        const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const slotEl = elemBelow ? elemBelow.closest(".sticker-slot") : null;
        if (slotEl !== activeHoverSlot) {
          if (activeHoverSlot) activeHoverSlot.classList.remove("drag-over");
          activeHoverSlot = slotEl;
          if (activeHoverSlot) activeHoverSlot.classList.add("drag-over");
        }
      }, { passive: true });

      itemEl.addEventListener("touchend", function (e) {
        if (!touchGhost) return;
        const touch = e.changedTouches[0];
        touchGhost.remove();
        touchGhost = null;

        if (activeHoverSlot) {
          activeHoverSlot.classList.remove("drag-over");
          activeHoverSlot = null;
        }

        /* Check if dropped onto a slot */
        const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const slotEl = elemBelow ? elemBelow.closest(".sticker-slot") : null;
        if (slotEl) {
          const expectedId = parseInt(slotEl.dataset.slotId, 10);
          confirmPlacement(stickerId, expectedId);
        }
      });

      itemEl.addEventListener("touchcancel", function () {
        if (touchGhost) {
          touchGhost.remove();
          touchGhost = null;
        }
        if (activeHoverSlot) {
          activeHoverSlot.classList.remove("drag-over");
          activeHoverSlot = null;
        }
      });
    }

    /* ── PLACEMENT CONFIRMATION (DRAG ONLY) ───────────────────────── */
    function confirmPlacement(stickerId, targetSlotId) {
      if (!stickerId || placedStickers.has(stickerId)) return;

      const currentSp = SPREADS[currentSpread];
      const belongsToCurrentSpread = currentSp && currentSp.slots.includes(stickerId);

      /* If dropped on matching slot OR matches current spread, confirm placement */
      if (stickerId === targetSlotId || belongsToCurrentSpread) {
        placedStickers.add(stickerId);

        /* Audio feedback */
        if (window.BD.audio && window.BD.audio.chime) window.BD.audio.chime();

        /* Sparkle celebration */
        if (window.confetti) window.confetti(30);

        /* 1. RELOAD THE COMPONENT (re-renders slots, updates EXP bar & carousel) */
        reloadComponent();

        /* 2. AUTO-SCROLL CAROUSEL TO NEXT UNPLACED STICKER */
        setTimeout(autoScrollCarousel, 300);

        /* 3. AUTO-ADVANCE PAGE IF BOTH SLOTS ON THIS PAGE ARE PLACED */
        if (currentSp) {
          const bothPlaced = currentSp.slots.every(id => placedStickers.has(id));
          if (bothPlaced && currentSpread < SPREADS.length - 1) {
            setTimeout(function () {
              currentSpread++;
              if (window.BD.audio && window.BD.audio.paper) window.BD.audio.paper();
              reloadComponent();
            }, 750);
          }
        }

        /* 4. CHECK COMPLETION (10 / 10) */
        if (placedStickers.size >= 10) {
          setTimeout(showCongratsModal, 1100);
        }
      } else {
        /* Red flash feedback on slot if mismatched */
        const slotEl = document.querySelector('[data-slot-id="' + targetSlotId + '"]');
        if (slotEl) {
          slotEl.style.borderColor = "#E74C3C";
          setTimeout(function () { slotEl.style.borderColor = ""; }, 400);
        }
      }
    }

    /* ── COMPLETION CONGRATS MODAL ───────────────────────────────── */
    function showCongratsModal() {
      if (congratsModal) {
        congratsModal.hidden = false;
        if (window.BD.audio && window.BD.audio.open) window.BD.audio.open();
        if (window.confetti) window.confetti(120);
      }
    }

    /* Initial component load */
    reloadComponent();
  };
})();
