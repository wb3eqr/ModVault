import { t } from "../i18n.js";
import { searchProjects, getGameVersions, getLoaders } from "../api.js";
import { addItem, getCount } from "../cart.js";

export async function renderHome(container, navigate) {
  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold tracking-tight">${t("home.title")}</h1>
        <p class="text-gray-400 mt-1 text-sm">${t("home.subtitle")}</p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 mb-6">
        <input id="search-q" type="text" class="search-input flex-1 px-4 py-2.5 rounded-lg text-sm" placeholder="${t("home.search")}" />
        <select id="filter-category" class="filter-select px-3 py-2.5 rounded-lg text-sm"></select>
        <select id="filter-version" class="filter-select px-3 py-2.5 rounded-lg text-sm"></select>
        <select id="filter-loader" class="filter-select px-3 py-2.5 rounded-lg text-sm"></select>
      </div>

      <div id="results" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"></div>

      <div id="load-more" class="text-center mt-6 hidden">
        <button class="btn-secondary">${t("home.load_more")}</button>
      </div>
    </div>
  `;

  const categorySel = document.getElementById("filter-category");
  const versionSel = document.getElementById("filter-version");
  const loaderSel = document.getElementById("filter-loader");
  const results = document.getElementById("results");
  const loadMore = document.getElementById("load-more");
  const searchQ = document.getElementById("search-q");

  let offset = 0;
  let currentQuery = "";

  function buildFacets() {
    const categories = [];
    const cat = categorySel.value;
    if (cat) categories.push(cat);
    return {
      query: searchQ.value.trim(),
      versions: versionSel.value ? [versionSel.value] : [],
      loaders: loaderSel.value ? [loaderSel.value] : [],
      categories: categories.length ? categories : undefined,
      limit: 20,
      offset,
    };
  }

  async function loadResults(append = false) {
    if (!append) {
      results.innerHTML = `<div class="col-span-full text-center py-12 text-gray-500">${t("home.loading")}</div>`;
      offset = 0;
    }
    const params = buildFacets();
    params.offset = offset;
    try {
      const data = await searchProjects(params);
      if (!append) results.innerHTML = "";
      if (!data.hits?.length) {
        if (!append) results.innerHTML = `<div class="col-span-full text-center py-12 text-gray-500">${t("home.no_results")}</div>`;
        loadMore.classList.add("hidden");
        return;
      }
      data.hits.forEach((hit) => results.appendChild(createCard(hit, navigate)));
      offset += data.hits.length;
      loadMore.classList.toggle("hidden", data.hits.length < 20);
    } catch {
      if (!append) results.innerHTML = `<div class="col-span-full text-center py-12 text-gray-500">Error loading</div>`;
    }
  }

  getGameVersions().then((versions) => {
    versionSel.innerHTML = `<option value="">${t("home.version")}</option>` + versions.map((v) => `<option value="${v}">${v}</option>`).join("");
  });
  getLoaders().then((loaders) => {
    loaderSel.innerHTML = `<option value="">${t("home.loader")}</option>` + loaders.map((l) => `<option value="${l}">${l}</option>`).join("");
  });
  categorySel.innerHTML = `
    <option value="">${t("home.category")}</option>
    <option value="mod">${t("home.mod")}</option>
    <option value="shader">${t("home.shader")}</option>
    <option value="resourcepack">${t("home.resourcepack")}</option>
    <option value="datapack">${t("home.datapack")}</option>
  `;

  let debounceTimer;
  searchQ.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(loadResults, 400);
  });
  categorySel.addEventListener("change", () => loadResults());
  versionSel.addEventListener("change", () => loadResults());
  loaderSel.addEventListener("change", () => loadResults());
  loadMore.querySelector("button").addEventListener("click", () => loadResults(true));

  loadResults();
}

function createCard(project, navigate) {
  const card = document.createElement("div");
  card.className = "project-card rounded-xl p-4 cursor-pointer";
  card.innerHTML = `
    <div class="flex items-start gap-3 mb-3">
      <img src="${project.icon_url || "./favicon.svg"}" alt="" class="project-icon" loading="lazy" />
      <div class="min-w-0 flex-1">
        <h3 class="font-semibold text-sm truncate">${project.title}</h3>
        <p class="text-xs text-gray-500 truncate">${project.author}</p>
        <p class="text-xs text-emerald-400 mt-0.5 capitalize">${t("home." + project.project_type) || project.project_type}</p>
      </div>
    </div>
    <p class="text-xs text-gray-400 line-clamp-2 leading-relaxed">${project.description || ""}</p>
    <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
      <span class="text-xs text-gray-500">${shortNum(project.downloads)}</span>
      <button class="cart-add text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg hover:bg-emerald-500/20 transition-colors">+</button>
    </div>
  `;
  card.addEventListener("click", (e) => {
    if (e.target.closest(".cart-add")) return;
    navigate("/project/" + project.slug || project.id);
  });
  card.querySelector(".cart-add").addEventListener("click", async (e) => {
    e.stopPropagation();
    // Quick-add latest version
    try {
      const { getProjectVersions } = await import("../api.js");
      const versions = await getProjectVersions(project.id || project.slug);
      const latest = versions[0];
      if (latest) {
        addItem(project, latest.id);
      }
    } catch {}
  });
  return card;
}

function shortNum(n) {
  if (!n) return "0";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return String(n);
}
