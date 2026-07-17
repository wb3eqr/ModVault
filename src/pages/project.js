import { t } from "../i18n.js";
import { getProject, getProjectVersions } from "../api.js";
import { addItem } from "../cart.js";

export async function renderProject(container, id, navigate) {
  container.innerHTML = `<div class="max-w-4xl mx-auto px-4 py-8"><div class="skeleton h-8 w-64 mb-4"></div><div class="skeleton h-4 w-96 mb-8"></div><div class="skeleton h-48 w-full"></div></div>`;

  try {
    const project = await getProject(id);
    const versions = await getProjectVersions(id);
    render(container, project, versions, navigate);
  } catch {
    container.innerHTML = `<div class="max-w-4xl mx-auto px-4 py-12 text-center text-gray-500">Error loading project</div>`;
  }
}

function render(container, project, versions, navigate) {
  const latest = versions[0];

  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <button id="back-btn" class="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors mb-6">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
        Back
      </button>

      <div class="flex items-start gap-5 mb-8">
        <img src="${project.icon_url || "./favicon.svg"}" alt="" class="w-20 h-20 rounded-xl object-cover bg-gray-800" />
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl font-bold">${project.title}</h1>
          <p class="text-sm text-gray-400 mt-0.5">${t("project.by")} <span class="text-gray-300">${project.author || "Unknown"}</span></p>
          <div class="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
            <span>${t("project.downloads")}: <strong class="text-gray-300">${shortNum(project.downloads)}</strong></span>
            <span>${t("project.followers")}: <strong class="text-gray-300">${shortNum(project.followers)}</strong></span>
            <span class="capitalize">${project.project_type}</span>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <button id="dl-btn" class="btn-primary text-sm whitespace-nowrap">${t("project.download")}</button>
          <button id="cart-btn" class="btn-secondary text-sm whitespace-nowrap">${t("project.add_cart")}</button>
        </div>
      </div>

      <div class="mb-6">
        <label class="text-xs text-gray-500 block mb-1.5">${t("project.version")}</label>
        <select id="ver-select" class="filter-select px-3 py-2 rounded-lg text-sm w-full max-w-xs"></select>
      </div>

      <div class="prose prose-invert max-w-none text-sm text-gray-300 leading-relaxed" id="project-body">
        ${project.body || ""}
      </div>

      <div class="mt-10">
        <h2 class="text-lg font-semibold mb-4">${t("project.versions")} (${versions.length})</h2>
        <div class="space-y-2" id="versions-list"></div>
      </div>
    </div>
  `;

  document.getElementById("back-btn").addEventListener("click", () => navigate("/"));

  const verSelect = document.getElementById("ver-select");
  const uniqueVersions = [];
  const seen = new Set();
  for (const v of versions) {
    const label = v.game_versions?.join(", ") || v.version_number;
    const loaders = v.loaders?.join(", ") || "";
    if (!seen.has(label + loaders)) {
      seen.add(label + loaders);
      uniqueVersions.push(v);
    }
  }
  verSelect.innerHTML = uniqueVersions.map((v, i) => `
    <option value="${v.id}" ${i === 0 ? "selected" : ""}>
      ${v.version_number} — ${v.game_versions?.slice(0, 2).join(", ") || ""} ${v.loaders?.length ? "[" + v.loaders.join(", ") + "]" : ""}
    </option>
  `).join("");

  function getSelectedVersion() {
    return uniqueVersions.find((v) => v.id === verSelect.value) || uniqueVersions[0];
  }

  document.getElementById("dl-btn").addEventListener("click", () => {
    const ver = getSelectedVersion();
    const file = ver.files?.[0];
    if (file?.url) window.open(file.url, "_blank");
  });

  document.getElementById("cart-btn").addEventListener("click", () => {
    const ver = getSelectedVersion();
    addItem(project, ver.id);
    const btn = document.getElementById("cart-btn");
    btn.textContent = t("project.added");
    btn.classList.remove("btn-secondary");
    btn.classList.add("bg-emerald-500/20", "text-emerald-400");
    setTimeout(() => {
      btn.textContent = t("project.add_cart");
      btn.classList.add("btn-secondary");
      btn.classList.remove("bg-emerald-500/20", "text-emerald-400");
    }, 2000);
  });

  const versionsList = document.getElementById("versions-list");
  versions.slice(0, 30).forEach((v) => {
    const row = document.createElement("div");
    row.className = "flex items-center justify-between py-2 px-3 rounded-lg bg-gray-900 text-sm";
    row.innerHTML = `
      <div>
        <span class="font-medium">${v.version_number}</span>
        <span class="text-gray-500 ml-2 text-xs">${v.game_versions?.slice(0, 3).join(", ") || ""}</span>
        ${v.loaders?.length ? `<span class="text-emerald-400 ml-2 text-xs">[${v.loaders.join(", ")}]</span>` : ""}
      </div>
      <a href="${v.files?.[0]?.url}" target="_blank" class="text-emerald-400 hover:text-emerald-300 text-xs transition-colors">Download</a>
    `;
    versionsList.appendChild(row);
  });
}

function shortNum(n) {
  if (!n) return "0";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return String(n);
}
