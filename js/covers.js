// Small animated SVG covers so each project shows itself on its card.
// An entry picks one with `cover: "<name>"`. If the entry has `shots`, the first screenshot is used instead.
(function () {
  const B = "#1d6bff", N = "#0b1f3a", L = "#c9d8f5", S = "#e8f0ff", G = "#12946a", A = "#f5a524";
  const range = (n) => Array.from({ length: n }, (_, i) => i);

  const covers = {
    fretboard() {
      const path = [[60, 92], [110, 74], [160, 74], [210, 56], [260, 38], [210, 38], [160, 56]];
      return `
        ${range(6).map((i) => `<line x1="20" x2="300" y1="${20 + i * 18}" y2="${20 + i * 18}" stroke="${L}" stroke-width="${1 + i * 0.35}"/>`).join("")}
        ${range(7).map((i) => `<line x1="${35 + i * 50}" x2="${35 + i * 50}" y1="20" y2="110" stroke="${L}" stroke-width="2"/>`).join("")}
        <polyline class="cv-draw" points="${path.map((p) => p.join(",")).join(" ")}" fill="none" stroke="${B}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/>
        ${path.map((p, i) => `<circle class="cv-pop" style="animation-delay:${i * 0.35}s" cx="${p[0]}" cy="${p[1]}" r="7" fill="${B}"/>`).join("")}`;
    },
    pipeline() {
      const xs = [30, 118, 206];
      return `
        ${xs.map((x, i) => `<rect x="${x}" y="42" width="72" height="46" rx="10" fill="${i === 1 ? S : "#fff"}" stroke="${L}" stroke-width="2"/>
          <rect x="${x + 12}" y="56" width="48" height="5" rx="2.5" fill="${L}"/><rect x="${x + 12}" y="68" width="30" height="5" rx="2.5" fill="${L}"/>`).join("")}
        <line x1="102" x2="118" y1="65" y2="65" stroke="${L}" stroke-width="2"/><line x1="190" x2="206" y1="65" y2="65" stroke="${L}" stroke-width="2"/>
        ${range(3).map((i) => `<circle r="5" cy="65" fill="${i === 1 ? G : B}"><animate attributeName="cx" values="40;270" dur="3s" begin="${i}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;1;0" dur="3s" begin="${i}s" repeatCount="indefinite"/></circle>`).join("")}`;
    },
    gripper() {
      return `
        <rect x="150" y="10" width="20" height="26" rx="4" fill="${N}"/>
        <rect x="90" y="34" width="140" height="12" rx="6" fill="${N}"/>
        <g class="cv-jawL"><rect x="100" y="46" width="14" height="60" rx="4" fill="${B}"/></g>
        <g class="cv-jawR"><rect x="206" y="46" width="14" height="60" rx="4" fill="${B}"/></g>
        <rect class="cv-obj" x="138" y="58" width="44" height="50" rx="8" fill="${A}"/>
        <polyline class="cv-draw" pathLength="1" points="20,120 60,120 70,112 80,124 90,104 100,122 110,120 300,120" fill="none" stroke="${G}" stroke-width="2"/>`;
    },
    chart() {
      const hs = [30, 48, 40, 66, 58, 82];
      return `
        <line x1="40" x2="290" y1="108" y2="108" stroke="${L}" stroke-width="2"/>
        ${hs.map((h, i) => `<rect class="cv-bar" style="animation-delay:${i * 0.12}s" x="${56 + i * 38}" y="${108 - h}" width="22" height="${h}" rx="4" fill="${i === 5 ? B : L}"/>`).join("")}
        <polyline class="cv-draw" pathLength="1" points="${hs.map((h, i) => `${67 + i * 38},${98 - h}`).join(" ")}" fill="none" stroke="${N}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    },
    code() {
      const ws = [120, 180, 90, 150, 60];
      return `
        <rect x="40" y="14" width="240" height="104" rx="10" fill="${N}"/>
        <circle cx="56" cy="28" r="4" fill="#ff5f57"/><circle cx="70" cy="28" r="4" fill="#febc2e"/><circle cx="84" cy="28" r="4" fill="#28c840"/>
        ${ws.map((w, i) => `<rect class="cv-type" style="animation-delay:${i * 0.5}s" x="${56 + (i % 2) * 14}" y="${44 + i * 14}" width="${w}" height="6" rx="3" fill="${i === 3 ? "#7ee2b8" : i % 2 ? "#8fb6ff" : "#d5e2f7"}"/>`).join("")}`;
    },
    phone() {
      return `
        <rect x="118" y="8" width="84" height="116" rx="14" fill="#fff" stroke="${N}" stroke-width="3"/>
        <rect x="146" y="14" width="28" height="5" rx="2.5" fill="${N}"/>
        <rect x="128" y="28" width="64" height="34" rx="6" fill="${S}"/>
        <circle class="cv-ping" cx="160" cy="45" r="8" fill="none" stroke="${B}" stroke-width="2"/>
        <circle cx="160" cy="45" r="4" fill="${B}"/>
        ${range(3).map((i) => `<rect class="cv-type" style="animation-delay:${0.4 + i * 0.4}s" x="128" y="${70 + i * 13}" width="${64 - i * 14}" height="6" rx="3" fill="${L}"/>`).join("")}`;
    },
    wave() {
      return range(28).map((i) => {
        const h = 14 + Math.abs(Math.sin(i * 0.9) * 50) + (i % 3) * 6;
        return `<rect class="cv-wave" style="animation-delay:${(i % 7) * 0.12}s" x="${34 + i * 9}" y="${66 - h / 2}" width="5" height="${h}" rx="2.5" fill="${i < 12 ? B : L}"/>`;
      }).join("");
    },
    chipset() {
      return `
        <rect x="50" y="36" width="70" height="60" rx="8" fill="${N}"/><text x="85" y="71" text-anchor="middle" font-size="13" font-weight="700" fill="#fff" font-family="IBM Plex Sans,sans-serif">CPU</text>
        <rect x="200" y="36" width="70" height="60" rx="8" fill="${S}" stroke="${B}" stroke-width="2"/><text x="235" y="71" text-anchor="middle" font-size="13" font-weight="700" fill="${B}" font-family="IBM Plex Sans,sans-serif">MEM</text>
        ${range(3).map((i) => `<line x1="120" x2="200" y1="${52 + i * 14}" y2="${52 + i * 14}" stroke="${L}" stroke-width="3"/>
          <circle r="4" cy="${52 + i * 14}" fill="${A}"><animate attributeName="cx" values="${i % 2 ? "200;120" : "120;200"}" dur="${1.2 + i * 0.3}s" repeatCount="indefinite"/></circle>`).join("")}`;
    },
    route() {
      const d = "M40,104 C90,104 80,40 140,40 S190,100 230,84 S270,30 290,28";
      return `
        <path d="${d}" fill="none" stroke="${L}" stroke-width="10" stroke-linecap="round"/>
        <path class="cv-draw" pathLength="1" d="${d}" fill="none" stroke="${B}" stroke-width="3" stroke-dasharray="1" stroke-linecap="round"/>
        <rect x="-9" y="-6" width="18" height="12" rx="3" fill="${N}"><animateMotion dur="4s" repeatCount="indefinite" rotate="auto" path="${d}"/></rect>
        <circle cx="290" cy="28" r="6" fill="${G}"/>`;
    },
    balloon() {
      return `
        <g class="cv-float"><ellipse cx="160" cy="50" rx="30" ry="36" fill="${S}" stroke="${B}" stroke-width="2.5"/>
        <line x1="160" x2="160" y1="86" y2="106" stroke="${N}" stroke-width="1.5"/><rect x="150" y="106" width="20" height="14" rx="3" fill="${N}"/></g>
        ${range(5).map((i) => `<circle cx="${50 + i * 56}" cy="${24 + ((i * 37) % 80)}" r="2" fill="${L}"/>`).join("")}`;
    },
    medal() {
      return `
        <path d="M140,10 L160,56 L180,10" fill="none" stroke="${B}" stroke-width="10"/>
        <circle cx="160" cy="82" r="32" fill="${A}"/><circle cx="160" cy="82" r="23" fill="none" stroke="#fff" stroke-width="2.5" opacity=".7"/>
        <text x="160" y="91" text-anchor="middle" font-size="26" font-weight="800" fill="#fff" font-family="IBM Plex Sans,sans-serif">1</text>
        <circle class="cv-ping" cx="160" cy="82" r="32" fill="none" stroke="${A}" stroke-width="2"/>`;
    },
    sigmoid() {
      const pts = Array.from({ length: 41 }, (_, i) => { const x = (i - 20) / 3.2; return `${40 + i * 6},${112 - 92 / (1 + Math.exp(-x))}`; }).join(" ");
      const dots = [[58, 108, 0], [82, 100, 0], [104, 110, 0], [128, 92, 0], [150, 74, 1], [139, 99, 0], [172, 48, 1], [186, 66, 0], [204, 34, 1], [232, 26, 1], [258, 22, 1], [222, 40, 1]];
      return `
        <line x1="40" x2="284" y1="112" y2="112" stroke="${L}" stroke-width="2"/><line x1="40" x2="40" y1="16" y2="112" stroke="${L}" stroke-width="2"/>
        <line x1="40" x2="284" y1="66" y2="66" stroke="${L}" stroke-width="1" stroke-dasharray="4 4"/>
        ${dots.map((d, i) => `<circle class="cv-pop" style="animation-delay:${i * 0.08}s" cx="${d[0]}" cy="${d[1]}" r="4.5" fill="${d[2] ? B : L}"/>`).join("")}
        <polyline class="cv-draw" pathLength="1" points="${pts}" fill="none" stroke="${N}" stroke-width="2.5" stroke-linecap="round"/>`;
    },
    printer() {
      return `
        <rect x="90" y="108" width="140" height="8" rx="2" fill="${N}"/>
        ${range(7).map((i) => `<rect class="cv-type" style="animation-delay:${i * 0.35}s" x="${118 + (i > 4 ? (i - 4) * 8 : 0)}" y="${99 - i * 9}" width="${84 - (i > 4 ? (i - 4) * 16 : 0)}" height="7" rx="2" fill="${i % 2 ? B : "#6f9dff"}"/>`).join("")}
        <g class="cv-head"><rect x="146" y="14" width="28" height="16" rx="3" fill="${N}"/><path d="M154,30 L166,30 L160,40 Z" fill="${A}"/></g>
        <line x1="70" x2="250" y1="14" y2="14" stroke="${L}" stroke-width="3"/>`;
    },
    grasprect() {
      // camera frame, an object, candidate grasp rectangles, and the chosen one
      const cands = [[-28, 0.15], [24, 0.5], [62, 0.85]];
      return `
        <rect x="70" y="12" width="180" height="108" rx="4" fill="#fff" stroke="${L}" stroke-width="2"/>
        <path d="M120,84 C112,58 136,36 164,40 S214,58 204,84 S132,104 120,84 Z" fill="${S}" stroke="${N}" stroke-width="2"/>
        ${cands.map((c) => `<rect class="cv-pop" style="animation-delay:${c[1]}s" x="128" y="56" width="64" height="20" fill="none" stroke="${L}" stroke-width="2" stroke-dasharray="4 3" transform="rotate(${c[0]} 160 66)"/>`).join("")}
        <g class="cv-pop" style="animation-delay:1.4s"><rect x="126" y="55" width="68" height="22" fill="none" stroke="${B}" stroke-width="2.5" transform="rotate(-12 160 66)"/>
        <circle cx="160" cy="66" r="3" fill="${B}"/></g>
        <path d="M70,30 V12 H88 M232,12 H250 V30 M250,102 V120 H232 M88,120 H70 V102" fill="none" stroke="${N}" stroke-width="2.5"/>`;
    },
    lane() {
      return `
        <path d="M110,126 L146,10 H174 L210,126 Z" fill="${S}"/>
        <path d="M110,126 L146,10 M210,126 L174,10" stroke="${N}" stroke-width="2.5" fill="none"/>
        <line class="cv-dash" x1="160" y1="126" x2="160" y2="10" stroke="${B}" stroke-width="3" stroke-dasharray="12 10"/>
        <rect x="149" y="84" width="22" height="30" rx="5" fill="${N}"/>
        <path class="cv-ping" d="M136,80 Q160,58 184,80" fill="none" stroke="${A}" stroke-width="2"/>
        <path d="M140,80 Q160,64 180,80" fill="none" stroke="${A}" stroke-width="2"/>`;
    },
    teach() {
      return `
        <rect x="60" y="16" width="200" height="76" rx="8" fill="${N}"/>
        <polyline class="cv-draw" pathLength="1" points="80,74 110,60 140,66 170,40 200,48 240,28" fill="none" stroke="#7ee2b8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        ${range(5).map((i) => `<circle class="cv-pop" style="animation-delay:${0.8 + i * 0.15}s" cx="${92 + i * 34}" cy="112" r="9" fill="${i === 2 ? B : L}"/>`).join("")}`;
    },
  };

  window.coverFor = function (e) {
    if (e.shots && e.shots.length) return `<div class="cover shot"><img src="${e.shots[0]}" alt="${e.title} screenshot" loading="lazy"></div>`;
    const fn = covers[e.cover];
    if (!fn) return "";
    return `<div class="cover" aria-hidden="true"><svg viewBox="0 0 320 132" preserveAspectRatio="xMidYMid meet">${fn()}</svg></div>`;
  };
})();
