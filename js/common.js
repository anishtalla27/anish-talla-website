// Shared helpers for index.html and project.html
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function chip(status) {
  if (!status) return "";
  return `<span class="chip s-${status.toLowerCase().replace(/\s+/g, "-")}">${esc(status)}</span>`;
}

function metaLine(e) {
  return [e.role, e.org, e.dates].filter(Boolean).map(esc).join(" · ");
}

function firstLink(e) {
  return (e.evidence || []).find((x) => x.url && !x.url.startsWith("project.html"));
}

function cardHTML(e, i, big) {
  const link = firstLink(e);
  const evLabel = { code: "Code", pr: "Pull requests", live: "Live site", doc: "Evidence" };
  return `
  <a class="card reveal ${big ? "big" : ""}" style="--d:${(i % 3) * 70}ms" href="project.html?id=${e.id}">
    ${window.coverFor ? coverFor(e) : ""}
    <div class="top"><h3>${esc(e.title)}</h3>${chip(e.status)}</div>
    ${metaLine(e) ? `<div class="meta">${metaLine(e)}</div>` : ""}
    <p class="sum">${esc(e.summary)}</p>
    ${e.tech && e.tech.length ? `<div class="tags">${e.tech.slice(0, big ? 8 : 5).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>` : ""}
    <div class="more"><span>Details →</span>${link ? `<span class="ext">${evLabel[link.kind] || "Link"} available</span>` : ""}</div>
  </a>`;
}

function contactButtons(el, dark) {
  const alt = dark ? "ghost" : "light";
  el.innerHTML = `
    <a class="btn primary" href="${PROFILE.github}" target="_blank" rel="noopener">GitHub ↗</a>
    <a class="btn ${alt}" data-resume href="${PROFILE.resume}" target="_blank" rel="noopener" hidden>Resume (PDF)</a>
    <a class="btn ${alt}" href="mailto:${PROFILE.email}">${PROFILE.email}</a>`;
  // Only show the resume button once assets/resume.pdf actually exists.
  fetch(PROFILE.resume, { method: "HEAD" })
    .then((r) => { if (r.ok) el.querySelector("[data-resume]").hidden = false; })
    .catch(() => {});
}

function mountDemo(name, el) {
  const fn = { fretboard: window.mountFretboard, gripper: window.mountGripper, sync: window.mountSync }[name];
  if (fn && el) fn(el);
}

function initReveal() {
  const els = document.querySelectorAll(".reveal:not(.in)");
  if (reducedMotion || !("IntersectionObserver" in window)) return els.forEach((n) => n.classList.add("in"));
  const io = new IntersectionObserver((items) => {
    items.forEach((it) => { if (it.isIntersecting) { it.target.classList.add("in"); io.unobserve(it.target); } });
  }, { rootMargin: "0px 0px -8% 0px" });
  els.forEach((n) => io.observe(n));
}

// Calls cb(true/false) as el enters or leaves the viewport, so animations can pause offscreen.
function whenVisible(el, cb) {
  if (!("IntersectionObserver" in window)) return cb(true);
  new IntersectionObserver((items) => cb(items[0].isIntersecting), { threshold: 0.05 }).observe(el);
}
