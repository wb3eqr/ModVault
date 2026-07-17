import { t } from "../i18n.js";
import { searchProjects, getGameVersions, getLoaders } from "../api.js";
import { addItem } from "../cart.js";

export function renderHome(container, navigate) {
  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="text-center mb-6">
        <h1 class="text-4xl font-bold tracking-tight glow-text">${t("home.title")}</h1>
        <p class="text-gray-500 mt-1.5 text-sm">${t("home.subtitle")}</p>
      </div>

      <div class="flex flex-col sm:flex-row gap-2.5 mb-6">
        <div class="relative flex-1">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input id="search-q" type="text" class="input w-full pl-10" placeholder="${t("home.search")}" />
        </div>
        <select id="filter-category" class="select w-full sm:w-40"></select>
        <select id="filter-version" class="select w-full sm:w-40"></select>
        <select id="filter-loader" class="select w-full sm:w-40"></select>
      </div>

      <div id="results" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"></div>

      <div id="load-more-wrap" class="text-center mt-6 hidden">
        <button id="load-more-btn" class="btn-secondary px-6">${t("home.load_more")}</button>
      </div>
    </div>
  `;

  const searchQ = document.getElementById("search-q");
  const categorySel = document.getElementById("filter-category");
  const versionSel = document.getElementById("filter-version");
  const loaderSel = document.getElementById("filter-loader");
  const results = document.getElementById("results");
  const loadMoreWrap = document.getElementById("load-more-wrap");
  const loadMoreBtn = document.getElementById("load-more-btn");

  categorySel.innerHTML = `
    <option value="">${t("home.category")}</option>
    <option value="mod">${t("home.mod")}</option>
    <option value="shader">${t("home.shader")}</option>
    <option value="resourcepack">${t("home.resourcepack")}</option>
    <option value="datapack">${t("home.datapack")}</option>
  `;

  getGameVersions().then((versions) => {
    versionSel.innerHTML = `<option value="">${t("home.version")}</option>` +
      versions.map((v) => `<option value="${v}">${v}</option>`).join("");
  });

  getLoaders().then((loaders) => {
    loaderSel.innerHTML = `<option value="">${t("home.loader")}</option>` +
      loaders.map((l) => `<option value="${l}">${l.charAt(0).toUpperCase() + l.slice(1)}</option>`).join("");
  });

  let offset = 0;
  let loading = false;

  function buildParams() {
    const cats = [];
    const cat = categorySel.value;
    if (cat) cats.push(cat);
    return {
      query: searchQ.value.trim(),
      versions: versionSel.value ? [versionSel.value] : [],
      loaders: loaderSel.value ? [loaderSel.value] : [],
      categories: cats.length ? cats : undefined,
      limit: 20,
      offset,
    };
  }

  async function load(append) {
    if (loading) return;
    loading = true;

    if (!append) {
      offset = 0;
      results.innerHTML = `<div class="col-span-full flex justify-center py-16"><div class="spinner"></div></div>`;
      loadMoreWrap.classList.add("hidden");
    }

    try {
      const data = await searchProjects(buildParams());

      if (!append) results.innerHTML = "";

      if (!data.hits || data.hits.length === 0) {
        if (!append) results.innerHTML = `<div class="col-span-full text-center py-16 text-gray-500">${t("home.no_results")}</div>`;
        loading = false;
        return;
      }

      data.hits.forEach((hit) => results.appendChild(createCard(hit, navigate)));

      offset += data.hits.length;
      loadMoreWrap.classList.toggle("hidden", data.hits.length < 20);
      loadMoreBtn.textContent = t("home.load_more");
    } catch {
      if (!append) results.innerHTML = `<div class="col-span-full text-center py-16 text-gray-500">Error — try again</div>`;
    }

    loading = false;
  }

  let debounce;
  searchQ.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => load(false), 350);
  });
  categorySel.addEventListener("change", () => load(false));
  versionSel.addEventListener("change", () => load(false));
  loaderSel.addEventListener("change", () => load(false));

  loadMoreBtn.addEventListener("click", () => load(true));

  load(false);
}

function createCard(project, navigate) {
  const card = document.createElement("div");
  card.className = "card p-3.5";

  const typeColors = { mod: "emerald", shader: "violet", resourcepack: "amber", datapack: "blue" };
  const tc = typeColors[project.project_type] || "gray";

  card.innerHTML = `
    <div class="flex items-start gap-3">
      <img src="${project.icon_url || "./favicon.svg"}" alt="" class="project-icon" loading="lazy" />
      <div class="min-w-0 flex-1">
        <h3 class="font-semibold text-sm leading-snug truncate">${project.title}</h3>
        <p class="text-xs text-gray-500 truncate mt-0.5">${project.author}</p>
        <span class="pill mt-1.5 capitalize" style="background:rgba(var(--${tc}-rgb,16,185,129),0.1);color:var(--color-accent-light)">${project.project_type}</span>
      </div>
    </div>
    <p class="text-xs text-gray-500 mt-2.5 line-clamp-2 leading-relaxed">${project.description || ""}</p>
    <div class="flex items-center justify-between mt-3 pt-2.5 border-t" style="border-color:var(--color-border)">
      <span class="text-xs text-gray-600">${fmt(project.downloads)} downloads</span>
      <button class="quick-add text-xs px-3 py-1.5 rounded-lg font-medium transition-all" style="background:rgba(16,185,129,0.1);color:var(--color-accent-light);border:1px solid transparent">+ Cart</button>
    </div>
  `;

  card.addEventListener("click", (e) => {
    if (e.target.closest(".quick-add")) return;
    navigate("/project/" + (project.slug || project.id));
  });

  card.querySelector(".quick-add").addEventListener("click", async (e) => {
    e.stopPropagation();
    try {
      const { getProjectVersions } = await import("../api.js");
      const versions = await getProjectVersions(project.id || project.slug);
      const latest = versions[0];
      if (latest) {
        addItem(project, latest.id);
        const btn = e.currentTarget;
        btn.textContent = "Added";
        btn.style.background = "rgba(16,185,129,0.2)";
        btn.style.borderColor = "var(--color-accent)";
        setTimeout(() => {
          btn.textContent = "+ Cart";
          btn.style.background = "rgba(16,185,129,0.1)";
          btn.style.borderColor = "transparent";
        }, 1500);
      }
    } catch {}
  });

  return card;
}

function fmt(n) {
  if (!n) return "0";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return String(n);
}
