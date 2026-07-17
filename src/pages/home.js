import { t } from "../i18n.js";
import { searchProjects, getGameVersions, getLoaders } from "../api.js";
import { addItem } from "../cart.js";

const FALLBACK_VERSIONS = [
  "1.21.4", "1.21.3", "1.21.1", "1.21",
  "1.20.6", "1.20.4", "1.20.2", "1.20.1",
  "1.19.4", "1.19.2",
  "1.18.2",
  "1.17.1",
  "1.16.5",
];

const FALLBACK_LOADERS = [
  "fabric", "forge", "neoforge", "quilt",
];

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
          <input id="q" type="text" class="input w-full pl-10" placeholder="${t("home.search")}" />
        </div>
        <select id="cat" class="select w-full sm:w-40">
          <option value="">${t("home.category")}</option>
          <option value="mod">${t("home.mod")}</option>
          <option value="shader">${t("home.shader")}</option>
          <option value="resourcepack">${t("home.resourcepack")}</option>
          <option value="datapack">${t("home.datapack")}</option>
        </select>
        <select id="ver" class="select w-full sm:w-40">
          <option value="">${t("home.version")}</option>
          ${FALLBACK_VERSIONS.map((v) => `<option value="${v}">${v}</option>`).join("")}
        </select>
        <select id="ldr" class="select w-full sm:w-40">
          <option value="">${t("home.loader")}</option>
          ${FALLBACK_LOADERS.map((l) => `<option value="${l}">${cap(l)}</option>`).join("")}
        </select>
      </div>

      <div id="res" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"></div>

      <div id="more" class="text-center mt-6 hidden">
        <button id="more-btn" class="btn-secondary px-6">${t("home.load_more")}</button>
      </div>
    </div>
  `;

  const q = document.getElementById("q");
  const cat = document.getElementById("cat");
  const ver = document.getElementById("ver");
  const ldr = document.getElementById("ldr");
  const res = document.getElementById("res");
  const more = document.getElementById("more");
  const moreBtn = document.getElementById("more-btn");

  let offset = 0;
  let busy = false;

  const search = (append) => {
    if (busy) return;
    busy = true;

    if (!append) {
      offset = 0;
      res.innerHTML = `<div class="col-span-full flex justify-center py-16"><div class="spinner"></div></div>`;
      more.classList.add("hidden");
    }

    const params = {
      query: q.value.trim(),
      versions: ver.value ? [ver.value] : [],
      loaders: ldr.value ? [ldr.value] : [],
      categories: cat.value ? [cat.value] : [],
      limit: 20,
      offset,
    };

    searchProjects(params).then((data) => {
      if (!append) res.innerHTML = "";

      if (!data.hits || data.hits.length === 0) {
        if (!append) res.innerHTML = `<div class="col-span-full text-center py-16 text-gray-500">${t("home.no_results")}</div>`;
        busy = false;
        return;
      }

      data.hits.forEach((hit) => res.appendChild(card(hit, navigate)));
      offset += data.hits.length;
      more.classList.toggle("hidden", data.hits.length < 20);
      busy = false;
    }).catch(() => {
      if (!append) res.innerHTML = `<div class="col-span-full text-center py-16 text-gray-500">Error</div>`;
      busy = false;
    });
  };

  let timer;
  q.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(() => search(false), 350); });
  cat.addEventListener("change", () => search(false));
  ver.addEventListener("change", () => search(false));
  ldr.addEventListener("change", () => search(false));
  moreBtn.addEventListener("click", () => search(true));

  getGameVersions().then((versions) => {
    if (versions.length) {
      ver.innerHTML = `<option value="">${t("home.version")}</option>` +
        versions.map((v) => `<option value="${v}"${v === FALLBACK_VERSIONS[0] ? "" : ""}>${v}</option>`).join("");
    }
  });

  getLoaders().then((loaders) => {
    if (loaders.length) {
      ldr.innerHTML = `<option value="">${t("home.loader")}</option>` +
        loaders.map((l) => `<option value="${l}">${cap(l)}</option>`).join("");
    }
  });

  search(false);
}

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function card(project, navigate) {
  const el = document.createElement("div");
  el.className = "card p-3.5";

  el.innerHTML = `
    <div class="flex items-start gap-3">
      <img src="${project.icon_url || "./favicon.svg"}" alt="" class="project-icon" loading="lazy" />
      <div class="min-w-0 flex-1">
        <h3 class="font-semibold text-sm leading-snug truncate">${esc(project.title)}</h3>
        <p class="text-xs text-gray-500 truncate mt-0.5">${esc(project.author)}</p>
        <span class="pill mt-1.5 capitalize">${project.project_type}</span>
      </div>
    </div>
    <p class="text-xs text-gray-500 mt-2.5 line-clamp-2 leading-relaxed">${esc(project.description || "")}</p>
    <div class="flex items-center justify-between mt-3 pt-2.5 border-t" style="border-color:var(--color-border)">
      <span class="text-xs text-gray-600">${fmt(project.downloads)}</span>
      <button class="add text-xs px-3 py-1.5 rounded-lg font-medium transition-all" style="background:rgba(16,185,129,0.1);color:var(--color-accent-light)">+ Cart</button>
    </div>
  `;

  el.addEventListener("click", (e) => {
    if (e.target.closest(".add")) return;
    navigate("/project/" + (project.slug || project.id));
  });

  el.querySelector(".add").addEventListener("click", async (e) => {
    e.stopPropagation();
    try {
      const { getProjectVersions } = await import("../api.js");
      const versions = await getProjectVersions(project.id || project.slug);
      const latest = versions[0];
      if (latest) {
        addItem(project, latest.id);
        const btn = e.currentTarget;
        btn.textContent = "\u2713 Added";
        btn.style.background = "rgba(16,185,129,0.2)";
        btn.style.border = "1px solid var(--color-accent)";
        setTimeout(() => {
          btn.textContent = "+ Cart";
          btn.style.background = "rgba(16,185,129,0.1)";
          btn.style.border = "none";
        }, 2000);
      }
    } catch {}
  });

  return el;
}

function esc(s) {
  if (!s) return "";
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

function fmt(n) {
  if (!n) return "0";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return String(n);
}
