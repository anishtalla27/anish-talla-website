(function () {
  const $ = (s) => document.querySelector(s);

  // hero
  $("#p-name").textContent = PROFILE.name;
  $("#p-tagline").textContent = PROFILE.tagline;
  $("#p-intro").textContent = PROFILE.intro;
  $("#p-school").textContent = PROFILE.school;
  contactButtons($("#hero-btns"), true);
  contactButtons($("#foot-btns"), true);
  if (window.mountHero) mountHero($("#hero-canvas"));

  // cards
  const featured = document.querySelector("[data-featured]");
  featured.innerHTML = ENTRIES.filter((e) => e.featured).map((e, i) => cardHTML(e, i)).join("");
  document.querySelectorAll("[data-cat]").forEach((grid) => {
    const cat = grid.dataset.cat;
    const big = grid.hasAttribute("data-big");
    grid.innerHTML = ENTRIES.filter((e) => e.category === cat || (e.alsoIn || []).includes(cat))
      .map((e, i) => cardHTML(e, i, big)).join("");
  });

  // demos
  document.querySelectorAll("[data-demo]").forEach((el) => mountDemo(el.dataset.demo, el));

  // index
  const rows = $("#idx-rows");
  rows.innerHTML = ENTRIES.map((e) => {
    const link = firstLink(e);
    const hay = [e.title, e.org, e.role, e.summary, e.status, ...(e.tech || [])].join(" ").toLowerCase();
    return `<a class="row" href="project.html?id=${e.id}" data-cat="${e.category} ${(e.alsoIn || []).join(" ")}" data-hay="${esc(hay)}">
      <div><div class="t">${esc(e.title)}</div><div class="c">${esc(CATEGORIES[e.category])}</div></div>
      <div class="s">${esc(e.summary)}</div>
      ${chip(e.status)}
      <span class="ev">${link ? esc({ code: "Code", pr: "PRs", live: "Live", doc: "Evidence" }[link.kind] || "Link") + " ↗" : e.privateCode ? "Private" : ""}</span>
    </a>`;
  }).join("") + `<div class="empty" hidden>No entries match.</div>`;

  let cat = "all", q = "";
  const filters = $("#idx-filters");
  filters.innerHTML = [["all", "All"], ...Object.entries(CATEGORIES)]
    .map(([k, v]) => `<button data-k="${k}" class="${k === "all" ? "on" : ""}">${esc(v)}</button>`).join("");
  function apply() {
    let n = 0;
    rows.querySelectorAll(".row").forEach((r) => {
      const ok = (cat === "all" || r.dataset.cat.split(" ").includes(cat)) && (!q || r.dataset.hay.includes(q));
      r.classList.toggle("hide", !ok);
      if (ok) n++;
    });
    rows.querySelector(".empty").hidden = n > 0;
  }
  filters.addEventListener("click", (ev) => {
    const b = ev.target.closest("button");
    if (!b) return;
    cat = b.dataset.k;
    filters.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
    apply();
  });
  $("#idx-search").addEventListener("input", (ev) => { q = ev.target.value.trim().toLowerCase(); apply(); });

  // skills
  $("#skills-grid").innerHTML = SKILLS.map((s, i) => `
    <div class="card reveal" style="--d:${(i % 3) * 70}ms"><h4>${esc(s.area)}</h4>
    <div class="tags">${s.items.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div></div>`).join("");

  // nav state
  const nav = $("#nav");
  const links = [...nav.querySelectorAll("li a")];
  const secs = links.map((a) => document.querySelector(a.getAttribute("href")));
  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 40);
    const y = window.scrollY + 120;
    let cur = -1;
    secs.forEach((s, i) => { if (s && s.offsetTop <= y) cur = i; });
    links.forEach((a, i) => a.classList.toggle("active", i === cur));
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  initReveal();
})();
