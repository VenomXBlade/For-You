/* ═══════════════════════════════════════════════════════════════════
   SCENE — the 3D cake. Optional. Fails politely to the drawn cake.
   ═══════════════════════════════════════════════════════════════════ */

window.BD = window.BD || {};

(function () {
  const THREE_URL  = "https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js";
  const LOADER_URL = "https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/loaders/GLTFLoader.js";
  const MERGE_URL   = "https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/utils/BufferGeometryUtils.js";

  window.BD.scene = function mount(canvas, holder, cfg) {
    let blown = false;
    let blowFn = null;

    if (!canvas || !holder) {
      return {
        blowOut: () => {
          blown = true;
          const flames = document.getElementById("candle-flames");
          if (flames) flames.classList.add("is-blown");
        }
      };
    }

    function useDrawnCake() {
      holder.classList.remove("is-3d");
      canvas.classList.remove("is-ready");
    }

    (async () => {
      if (!cfg.cake || /[?&]nocake\b/.test(location.search)) { useDrawnCake(); return; }

      let THREE, GLTFLoader;
      try {
        THREE = await import(THREE_URL);
        ({ GLTFLoader } = await import(LOADER_URL));
      } catch (err) {
        console.warn("[scene] three.js unavailable — showing the drawn cake.", err);
        useDrawnCake();
        return;
      }

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      } catch (err) {
        console.warn("[scene] WebGL unavailable — showing the drawn cake.", err);
        useDrawnCake();
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
      camera.position.set(0, 1.05, 4.8);

      scene.add(new THREE.AmbientLight(0xffe7d0, 0.62));
      const key = new THREE.DirectionalLight(0xffd2a0, 2.3);
      key.position.set(2.5, 5, 4);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xff7a86, 0.55);
      fill.position.set(-4, 2, -2);
      scene.add(fill);
      const rim = new THREE.DirectionalLight(0xffe0b8, 1.1);
      rim.position.set(-2, 1.4, -4);
      scene.add(rim);

      const gltf = await new Promise((resolve) => {
        new GLTFLoader().load(
          cfg.cake,
          resolve,
          undefined,
          (err) => { console.warn("[scene] cake could not load.", err); resolve(null); }
        );
      });

      if (!gltf) { useDrawnCake(); return; }

      const model = gltf.scene;
      model.updateWorldMatrix(true, true);

      /* ── measure the cake, not the strays ────────────────────────────
         This export ships two meshes flung metres away from everything else
         (one stray cylinder, one stray flame). A naive bounding box swallows
         them, so the cake ends up a speck in the middle of nothing. So: read
         every mesh, find the real cluster by centre distance, bin the rest. */
      const parts = [];
      model.traverse((o) => {
        if (!o.isMesh || !o.geometry) return;
        if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
        parts.push({
          mesh: o,
          box: new THREE.Box3().copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld)
        });
      });

      const centres = parts.map((p) => p.box.getCenter(new THREE.Vector3()));
      const mid = new THREE.Vector3();
      centres.forEach((c) => mid.add(c));
      mid.divideScalar(centres.length || 1);

      const spread = centres.map((c) => c.distanceTo(mid)).sort((a, b) => a - b);
      const edge = spread[Math.floor(spread.length * 0.95)] || 1;
      const limit = edge * 1.6;

      const kept = [];
      parts.forEach((p, i) => {
        if (centres[i].distanceTo(mid) <= limit) kept.push(p);
        else if (p.mesh.parent) p.mesh.parent.remove(p.mesh);
      });

      const box = new THREE.Box3();
      kept.forEach((p) => box.union(p.box));
      if (box.isEmpty()) box.setFromObject(model);

      const size = box.getSize(new THREE.Vector3());
      model.position.sub(box.getCenter(new THREE.Vector3()));
      scene.add(model);
      model.updateWorldMatrix(true, true);

      /* ── the camera stands at the table, looking down at 30° ────────
         Fit the *projected* silhouette (height foreshortened by the tilt,
         depth adding to it), so the cake fills the square canvas. */
      const ELEVATION = THREE.MathUtils.degToRad(30);

      function frame(aspect) {
        aspect = Math.max(0.2, aspect || 1);
        const vFov = THREE.MathUtils.degToRad(camera.fov);
        /* pad the top: the flame sprites sit above the model box, and a
           clipped candle looks like a bug, not a cake */
        const projectedH = size.y * Math.cos(ELEVATION) + size.z * Math.sin(ELEVATION) + 0.36;
        const projectedW = size.x;
        const tan = Math.tan(vFov / 2);
        const dH = (projectedH / 2) / tan;
        const dW = (projectedW / 2) / (tan * aspect);
        const dist = Math.max(dH, dW) * 1.10;

        camera.position.set(0, dist * Math.sin(ELEVATION), dist * Math.cos(ELEVATION));
        /* look a touch high, so the cake sits low in the frame with its
           shadow under it and room for the halo above */
        camera.lookAt(0, size.y * 0.13, 0);
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
      }

      frame(holder.clientWidth > 0 && holder.clientHeight > 0
        ? holder.clientWidth / holder.clientHeight
        : 1);

      window.BD.sceneInfo = {
        size: [size.x, size.y, size.z].map((n) => +n.toFixed(3)),
        dropped: parts.length - kept.length,
        camera: camera.position.toArray().map((n) => +n.toFixed(3))
      };

      /* a little candle heat, so the frosting is not flat grey */
      const glow = new THREE.PointLight(0xffa53f, 3.4, 6, 2);
      glow.position.set(0, size.y * 0.38, 0);
      scene.add(glow);

      /* find the candles before the cream tint — afterwards every tier is
         warm enough to pass for one */
      const candleParts = [];
      model.traverse((o) => {
        if (!o.isMesh || !o.material) return;
        const m = Array.isArray(o.material) ? o.material[0] : o.material;
        if (!m || !m.color) return;
        const hsl = m.color.getHSL({});
        if (hsl.s > 0.4 && /^Cylinder\d+/.test(o.name)) candleParts.push(o);
      });

      /* ── dress it ─────────────────────────────────────────────────────
         This export has no textures, so the frosting arrives bare white and
         the flames arrive as white sticks. Give it cream, and give it fire. */
      const frostingVar = (getComputedStyle(document.documentElement).getPropertyValue("--cake-frosting") || "").trim();
      const cream = new THREE.Color(frostingVar || 0xf2e0c6);
      const flameMat = new THREE.MeshBasicMaterial({
        color: 0xffb257,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false
      });

      model.traverse((o) => {
        if (!o.isMesh || !o.material) return;
        if (/^flame/i.test(o.name)) {
          o.material = flameMat;
          o.renderOrder = 3;
          return;
        }
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => {
          if (!m) return;
          if (m.color && m.color.getHex() === 0xffffff) m.color.copy(cream);
        });
      });

      /* ── the candles ──────────────────────────────────────────────────
         Every candle in this export is two co-axial cylinders with
         different colours, sitting a hair apart. At phone size they
         z-fight into a pixelated rainbow bar. So: keep the outer body,
         bin its twin, and dress the survivors in the theme's paper and
         ink. The set then looks drawn, not rendered. */
      const css = getComputedStyle(document.documentElement);
      const readColor = (name, fallback) => {
        const v = (css.getPropertyValue(name) || "").trim();
        return new THREE.Color(v || fallback);
      };
      const waxPaper = new THREE.MeshStandardMaterial({
        color: readColor("--paper", "#f6e7cb"),
        roughness: 0.58,
        metalness: 0
      });
      const waxInk = new THREE.MeshStandardMaterial({
        color: readColor("--hot", "#c8372d"),
        roughness: 0.52,
        metalness: 0
      });

      const candleGroups = [];
      candleParts.forEach((o) => {
        const c = new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3());
        const k = c.x.toFixed(2) + ":" + c.z.toFixed(2);
        const found = candleGroups.find((g) => g.key === k);
        if (found) found.parts.push(o);
        else candleGroups.push({ key: k, parts: [o], c });
      });

      candleGroups.sort((a, b) => (a.c.z - b.c.z) || (a.c.x - b.c.x));
      candleGroups.forEach((g, i) => {
        const bodies = g.parts
          .map((o) => ({ o, h: new THREE.Box3().setFromObject(o).getSize(new THREE.Vector3()).y }))
          .sort((a, b) => b.h - a.h);
        const body = bodies.shift().o;
        body.material = i % 3 === 2 ? waxInk : waxPaper;
        /* this model's candles are hairlines — fatten them so they read
           on a phone, without moving where they stand */
        body.scale.x *= 1.6;
        body.scale.z *= 1.6;
        bodies.forEach(({ o }) => { o.visible = false; });
        g.keep = bodies;
      });

      /* candle control: this model ships with 9 flames */
      const flames = [];
      model.traverse((o) => {
        if (!o.name) return;
        if (/^flame/i.test(o.name) || o.name === "Fire") flames.push(o);
      });

      const wanted = Math.max(0, Math.round(Number(cfg.candles) || 0));
      if (wanted > 0 && wanted < flames.length) {
        flames.slice(wanted).forEach((f) => {
          f.visible = false;
          /* take its candle with it, so we never leave a stick unlit */
          const p = f.getWorldPosition(new THREE.Vector3());
          let near = null;
          let nearD = Infinity;
          candleGroups.forEach((g) => {
            const d = g.c.distanceTo(p);
            if (d < nearD) { nearD = d; near = g; }
          });
          if (near) near.parts.forEach((o) => { o.visible = false; });
        });
      }

      /* ── the flames in this model are slivers, and they read as nothing
         at phone size. Give each one a soft glow sprite so the cake burns. */
      const flameTex = (() => {
        const c = document.createElement("canvas");
        c.width = c.height = 64;
        const g = c.getContext("2d");
        const grd = g.createRadialGradient(32, 34, 0, 32, 34, 32);
        grd.addColorStop(0, "rgba(255,248,222,1)");
        grd.addColorStop(0.26, "rgba(255,198,102,.96)");
        grd.addColorStop(0.58, "rgba(255,132,36,.38)");
        grd.addColorStop(1, "rgba(255,96,12,0)");
        g.fillStyle = grd;
        g.fillRect(0, 0, 64, 64);
        const t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
      })();

      const halos = [];
      const live = flames.filter((f) => f.visible);
      live.forEach((f) => {
        const p = f.getWorldPosition(new THREE.Vector3());
        model.worldToLocal(p);
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
          map: flameTex,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          transparent: true,
          toneMapped: false
        }));
        sprite.scale.set(0.22, 0.3, 1);
        sprite.position.copy(p);
        sprite.position.y += 0.03;
        sprite.renderOrder = 4;
        model.add(sprite);
        halos.push(sprite);
      });

      /* ── fuse the sprinkles ───────────────────────────────────────────
         The frosting is scattered with ~250 crumbs, each its own mesh.
         At phone size that is ~250 draw calls a frame for specks a few
         pixels wide. Fuse them into one. If the merge cannot run, the
         cake simply stays as it was. */
      try {
        const specks = [];
        model.traverse((o) => {
          if (!o.isMesh || !/^Cylinder\d{3}$/.test(o.name)) return;
          const s = new THREE.Box3().setFromObject(o).getSize(new THREE.Vector3());
          if (Math.max(s.x, s.y, s.z) < 0.14) specks.push(o);
        });

        if (specks.length > 8) {
          const { mergeGeometries } = await import(MERGE_URL);
          const back = model.matrixWorld.clone().invert();
          const geos = specks.map((o) => {
            const g = o.geometry.clone();
            g.applyMatrix4(o.matrixWorld).applyMatrix4(back);
            return g;
          });
          const merged = mergeGeometries(geos, false);
          if (merged) {
            const frosting = new THREE.Mesh(merged, specks[0].material);
            specks.forEach((o) => { if (o.parent) o.parent.remove(o); });
            model.add(frosting);
            window.BD.sceneInfo.specks = specks.length;
          }
          geos.forEach((g) => g.dispose());
        }
      } catch (err) {
        console.warn("[scene] could not fuse the sprinkles — carrying on.", err);
      }

      holder.classList.add("is-3d");
      canvas.classList.add("is-ready");

      const clock = new THREE.Clock();
      let raf = 0;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const resize = () => {
        const w = Math.max(1, holder.clientWidth);
        const h = Math.max(1, holder.clientHeight);
        renderer.setSize(w, h, false);
        frame(w / h);
      };
      resize();
      window.addEventListener("resize", resize);
      if ("ResizeObserver" in window) new ResizeObserver(resize).observe(holder);
      document.addEventListener("visibilitychange", () => { if (!document.hidden) resize(); });

      const animate = () => {
        raf = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        if (!reduce) {
          model.rotation.y = t * 0.24;
          model.position.y = Math.sin(t * 1.1) * 0.03;
        }
        renderer.render(scene, camera);
        if (window.BD.sceneInfo && !window.BD.sceneInfo.calls) {
          window.BD.sceneInfo.calls = renderer.info.render.calls;
          window.BD.sceneInfo.tris = renderer.info.render.triangles;
        }
      };
      animate();

      /* blow the candles out: flames shrink and lights dim */
      blowFn = () => {
        if (blown) return;
        blown = true;
        flames.slice(0, wanted || flames.length).forEach((f, n) => {
          setTimeout(() => { f.visible = false; }, n * 90);
        });
        halos.forEach((h, n) => {
          setTimeout(() => {
            const fade = setInterval(() => {
              h.material.opacity -= 0.07;
              if (h.material.opacity <= 0) {
                clearInterval(fade);
                h.visible = false;
              }
            }, 30);
          }, n * 90);
        });
        const light = model.getObjectByName("Point.002");
        if (light) light.intensity *= 0.25;
        const light2 = model.getObjectByName("Point.003");
        if (light2) light2.intensity *= 0.25;
        glow.intensity *= 0.18;
      };

      window.addEventListener("pagehide", () => cancelAnimationFrame(raf));
    })();

    return {
      blowOut() { if (blowFn) blowFn(); }
    };
  };
})();
