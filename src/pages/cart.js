import { t, getLang } from "../i18n.js";
import { getItems, removeItem, clearItems, downloadAll } from "../cart.js";

export async function renderCart(container, navigate) {
  const items = getItems();

  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">${t("cart.title")}</h1>
        <div class="flex gap-2">
          <button id="clear-btn" class="btn-secondary text-sm ${items.length ? "" : "hidden"}">${t("cart.clear")}</button>
          <button id="download-btn" class="btn-primary text-sm ${items.length ? "" : "hidden"}">${t("cart.download_zip")}</button>
        </div>
      </div>
      <div id="cart-items" class="space-y-2"></div>
      <div id="cart-progress" class="hidden mt-4"></div>
    </div>
  `;

  const list = document.getElementById("cart-items");
  const clearBtn = document.getElementById("clear-btn");
  const dlBtn = document.getElementById("download-btn");

  if (!items.length) {
    list.innerHTML = `<p class="text-center py-12 text-gray-500">${t("cart.empty")}</p>`;
    return;
  }

  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "flex items-center gap-3 p-3 rounded-xl bg-gray-900";
    row.innerHTML = `
      <img src="${item.iconUrl || "./favicon.svg"}" alt="" class="w-10 h-10 rounded-lg object-cover bg-gray-800" />
      <div class="min-w-0 flex-1">
        <p class="text-sm font-medium truncate">${item.projectTitle}</p>
        <p class="text-xs text-gray-500 capitalize">${item.projectType}</p>
      </div>
      <button class="cart-remove text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1">${t("cart.remove")}</button>
    `;
    const removeBtn = row.querySelector(".cart-remove");
    removeBtn.addEventListener("click", () => {
      removeItem(item.projectId, item.versionId);
      renderCart(container, navigate);
    });
    list.appendChild(row);
  });

  clearBtn.addEventListener("click", () => {
    clearItems();
    renderCart(container, navigate);
  });

  dlBtn.addEventListener("click", async () => {
    const progress = document.getElementById("cart-progress");
    progress.classList.remove("hidden");
    progress.innerHTML = `<div class="text-center py-4 text-gray-400">${t("cart.preparing")} <span id="dl-progress">0/${items.length}</span></div>`;
    dlBtn.disabled = true;
    dlBtn.textContent = t("cart.preparing");

    try {
      const blobs = await downloadAll((done, total) => {
        document.getElementById("dl-progress").textContent = `${done}/${total}`;
      });

      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();

      const folders = {};
      blobs.forEach(({ blob, name, folder }) => {
        if (!folders[folder]) folders[folder] = zip.folder(folder);
        folders[folder].file(name, blob);
      });

      const lang = getLang();
      const readmeContent = lang === "ru"
        ? `ModVault — Инструкция по установке
====================================
Дата сборки: ${new Date().toLocaleDateString("ru-RU")}

Как установить:
1. Распакуйте этот архив в удобное место
2. Откройте папку .minecraft (Windows: Win+R, введите %appdata%/.minecraft)
${Object.keys(folders).map((f) => `3. Скопируйте папку "${f}" в .minecraft`).join("\n")}
4. Запустите Minecraft с нужным загрузчиком и версией

Установленные компоненты:
${blobs.map((b) => `  - [${b.folder}] ${b.name}`).join("\n")}

Скачано через ModVault
`
        : `ModVault — Installation Guide
====================================
Build date: ${new Date().toLocaleDateString("en-US")}

How to install:
1. Extract this archive anywhere
2. Open your .minecraft folder (Windows: Win+R, type %appdata%/.minecraft)
${Object.keys(folders).map((f) => `3. Copy the "${f}" folder into .minecraft`).join("\n")}
4. Launch Minecraft with the correct loader and version

Installed components:
${blobs.map((b) => `  - [${b.folder}] ${b.name}`).join("\n")}

Downloaded via ModVault
`;

      zip.file("README.txt", readmeContent);

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `modvault-${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      progress.innerHTML = `<div class="text-center py-4 text-red-400">Error: ${e.message}</div>`;
    }

    dlBtn.disabled = false;
    dlBtn.textContent = t("cart.download_zip");
  });
}
