(function () {
  const id = new URLSearchParams(location.search).get("id");
  const e = ENTRIES.find((x) => x.id === id);
  const root = document.getElementById("project");
  if (!e) {
    root.innerHTML = `<div class="phead"><div class="wrap"><a class="back" href="index.html#index">← All work</a><h1>Entry not found</h1></div></div>`;
    return;
  }
  document.title = `${e.title} | Anish Talla`;

  const block = (title, body) => (body ? `<div class="card block reveal"><h2>${title}</h2>${body}</div>` : "");
  const list = (arr) => (arr && arr.length ? `<ul>${arr.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : "");
  const para = (t) => (t ? `<p>${esc(t)}</p>` : "");

  const evidence = (e.evidence || []).length
    ? `<ul class="evlist">${e.evidence.map((x) => `<li><span class="k">${esc({ code: "code", pr: "pr", live: "live", doc: "doc", note: "note" }[x.kind] || "")}</span>
        ${x.url ? `<a href="${x.url}" ${x.url.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${esc(x.label)}</a>` : `<span>${esc(x.label)}</span>`}</li>`).join("")}</ul>`
    : `<p class="none">Nothing public to link yet. Email me and I can share more.</p>`;

  const others = ENTRIES.filter((x) => x.category === e.category && x.id !== e.id).slice(0, 4);

  root.innerHTML = `
    <div class="phead"><div class="wrap">
      <a class="back" href="index.html#${e.category === "project" ? "projects" : e.category === "award" ? "awards" : e.category}">← ${esc(CATEGORIES[e.category])}</a>
      <h1>${esc(e.title)}</h1>
      <div class="meta">${metaLine(e)}</div>
      <p class="sum">${esc(e.summary)}</p>
    </div></div>
    <div class="wrap pbody">
      <div class="main">
        ${e.shots && e.shots.length ? `<div class="shots reveal">${e.shots.map((s) => `<img src="${s}" alt="${esc(e.title)} screenshot" loading="lazy">`).join("")}</div>` : ""}
        ${e.demo ? `<div class="reveal" id="demo-slot"></div>` : ""}
        ${block("The problem", para(e.problem))}
        ${block("How it works", list(e.details))}
        ${e.deliverables ? block("What I built", `<div class="deliv">${e.deliverables.map((d) => `<div><b>${esc(d.name)}</b>${esc(d.text)}</div>`).join("")}</div>`) : ""}
        ${block("My role", para(e.contribution))}
        ${block("Outcomes", list(e.outcomes))}
      </div>
      <aside class="side">
        <div class="card reveal"><h4>Evidence</h4>${evidence}</div>
        ${e.tech && e.tech.length ? `<div class="card reveal"><h4>Technologies</h4>${stack(e.tech)}</div>` : ""}
        ${others.length ? `<div class="card reveal"><h4>More in ${esc(CATEGORIES[e.category])}</h4><ul class="evlist">${others.map((o) => `<li><a href="project.html?id=${o.id}">${esc(o.title)}</a></li>`).join("")}</ul></div>` : ""}
      </aside>
    </div>`;

  if (e.demo) mountDemo(e.demo, document.getElementById("demo-slot"));
  initReveal();
})();
