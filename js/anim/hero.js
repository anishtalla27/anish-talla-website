// Hero background: a routed circuit board. Traces leave an IC package on a grid with 45-degree bends,
// end in vias, and carry signal pulses.
window.mountHero = function (canvas) {
  const ctx = canvas.getContext("2d");
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const GRID = 22;
  const DIRS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
  let w, h, dpr, traces, chip, running = true, raf;

  // small seeded generator so the board looks the same on every load
  let seed = 2027;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);

  function build() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed = 2027;

    const small = w < 760;
    const size = small ? 88 : 132;
    const cx = Math.round((small ? w * 0.74 : w * 0.76) / GRID) * GRID;
    const cy = Math.round((small ? h * 0.8 : h * 0.46) / GRID) * GRID;
    chip = { x: cx - size / 2, y: cy - size / 2, s: size };

    traces = [];
    const occupied = new Set();
    const key = (x, y) => Math.round(x / GRID) + "," + Math.round(y / GRID);
    const pins = small ? 4 : 6;
    for (let side = 0; side < 4; side++) {
      for (let p = 0; p < pins; p++) {
        const off = ((p + 0.5) / pins) * size;
        let x, y, d;
        if (side === 0) { x = chip.x + size; y = chip.y + off; d = 0; }
        if (side === 1) { x = chip.x + off; y = chip.y + size; d = 2; }
        if (side === 2) { x = chip.x; y = chip.y + off; d = 4; }
        if (side === 3) { x = chip.x + off; y = chip.y; d = 6; }
        const home = d;
        const pts = [[x, y]];
        const segs = 3 + Math.floor(rnd() * 3);
        for (let s = 0; s < segs; s++) {
          const len = (s === 0 ? 1 + Math.floor(rnd() * 3) : 2 + Math.floor(rnd() * 7)) * GRID;
          let nx = x + DIRS[d][0] * len, ny = y + DIRS[d][1] * len;
          if (nx < -GRID || nx > w + GRID || ny < 40 || ny > h + GRID || occupied.has(key(nx, ny))) break;
          x = nx; y = ny; pts.push([x, y]); occupied.add(key(x, y));
          // turn 45 degrees, but never back toward the chip
          const turn = rnd() < 0.5 ? 1 : -1;
          const nd = (d + turn + 8) % 8;
          const diff = Math.min((nd - home + 8) % 8, (home - nd + 8) % 8);
          d = diff <= 1 ? nd : home;
        }
        if (pts.length < 2) continue;
        let total = 0;
        const lens = [];
        for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); lens.push(l); total += l; }
        traces.push({ pts, lens, total, t: rnd(), speed: 0.05 + rnd() * 0.08, out: rnd() < 0.5, wait: rnd() * 4 });
      }
    }
  }

  function pointAt(tr, dist) {
    for (let i = 0; i < tr.lens.length; i++) {
      if (dist <= tr.lens[i]) {
        const a = tr.pts[i], b = tr.pts[i + 1], k = dist / tr.lens[i];
        return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
      }
      dist -= tr.lens[i];
    }
    return tr.pts[tr.pts.length - 1];
  }

  // text sits on the left, so fade the board out toward it
  // (on phones the chip sits below the text instead, so fade by height)
  const fade = (x, y) => w < 760
    ? Math.max(0.1, Math.min(0.8, (y / h - 0.62) * 3.2))
    : Math.max(0.12, Math.min(1, (x / w - 0.25) * 1.8));

  function draw(dt) {
    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = "round"; ctx.lineJoin = "round";

    for (const tr of traces) {
      const end = tr.pts[tr.pts.length - 1];
      const a = fade((tr.pts[0][0] + end[0]) / 2, (tr.pts[0][1] + end[1]) / 2);
      ctx.strokeStyle = `rgba(122, 168, 255, ${0.22 * a})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      tr.pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
      ctx.stroke();
      // via
      ctx.beginPath(); ctx.arc(end[0], end[1], 3.5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(122, 168, 255, ${0.4 * a})`; ctx.stroke();

      if (still) continue;
      if (tr.wait > 0) { tr.wait -= dt; continue; }
      tr.t += tr.speed * dt * (260 / tr.total);
      if (tr.t >= 1) { tr.t = 0; tr.wait = 1 + rnd() * 5; tr.out = rnd() < 0.5; continue; }
      const prog = tr.out ? tr.t : 1 - tr.t;
      const tail = 46;
      const head = prog * tr.total;
      for (let k = 0; k < 8; k++) {
        const d0 = head + (tr.out ? -1 : 1) * (tail * k) / 8;
        if (d0 < 0 || d0 > tr.total) continue;
        const p = pointAt(tr, d0);
        ctx.beginPath(); ctx.arc(p[0], p[1], 1.6 - k * 0.12, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(160, 205, 255, ${(1 - k / 8) * 0.95 * a})`;
        ctx.fill();
      }
    }

    // IC package
    const { x, y, s } = chip;
    const a = fade(x + s / 2, y + s / 2);
    ctx.fillStyle = `rgba(9, 22, 44, ${0.92})`;
    ctx.strokeStyle = `rgba(122, 168, 255, ${0.55 * a})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(x, y, s, s, 6); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(x + 12, y + 12, 3, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = `rgba(160, 200, 255, ${0.6 * a})`;
    ctx.font = `500 ${s > 100 ? 11 : 9}px "IBM Plex Mono", ui-monospace, monospace`;
    ctx.textAlign = "center";
    ctx.fillText("AT-2027", x + s / 2, y + s / 2 - 2);
    ctx.fillStyle = `rgba(160, 200, 255, ${0.32 * a})`;
    ctx.fillText("REV C", x + s / 2, y + s / 2 + 14);
  }

  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    draw(dt);
    if (running && !still) raf = requestAnimationFrame(loop);
  }

  build(); draw(0);
  if (!still) raf = requestAnimationFrame(loop);
  let rt;
  window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { build(); draw(0); }, 150); });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((it) => {
      const vis = it[0].isIntersecting;
      if (vis && !running && !still) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
      if (!vis) { running = false; cancelAnimationFrame(raf); }
    }).observe(canvas);
  }
};
