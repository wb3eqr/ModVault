export const en = {
  nav: { title: "ModVault" },
  home: {
    title: "ModVault",
    subtitle: "Download Minecraft mods, shaders, and resource packs",
    search: "Search mods, shaders, resource packs...",
    category: "Category",
    version: "Game Version",
    loader: "Loader",
    all: "All",
    mod: "Mods",
    shader: "Shaders",
    resourcepack: "Resource Packs",
    datapack: "Data Packs",
    loading: "Loading...",
    no_results: "Nothing found",
    load_more: "Load More",
  },
  project: {
    downloads: "Downloads",
    followers: "Followers",
    versions: "Versions",
    download: "Download",
    added: "Added to cart",
    add_cart: "Add to Cart",
    latest: "Latest",
    select_version: "Select version",
    by: "by",
    install_readme: "Installation",
  },
  cart: {
    title: "Download Cart",
    empty: "Cart is empty",
    total: "Total items",
    remove: "Remove",
    clear: "Clear",
    download_zip: "Download ZIP",
    preparing: "Preparing...",
    mods_folder: "mods",
    shaders_folder: "shaderpacks",
    packs_folder: "resourcepacks",
    readme_title: "Installation Guide",
    readme_content: `How to install:
1. Download the ZIP archive
2. Extract it to your desktop
3. Copy the folders (mods, shaderpacks, resourcepacks) to your .minecraft directory
4. Launch Minecraft with the correct loader and version`,
  },
};

export const ru = {
  nav: { title: "ModVault" },
  home: {
    title: "ModVault",
    subtitle: "Скачивай моды, шейдеры и ресурспаки для Minecraft",
    search: "Поиск модов, шейдеров, ресурспаков...",
    category: "Категория",
    version: "Версия игры",
    loader: "Загрузчик",
    all: "Все",
    mod: "Моды",
    shader: "Шейдеры",
    resourcepack: "Ресурспаки",
    datapack: "Датапаки",
    loading: "Загрузка...",
    no_results: "Ничего не найдено",
    load_more: "Загрузить ещё",
  },
  project: {
    downloads: "Скачиваний",
    followers: "Подписчиков",
    versions: "Версии",
    download: "Скачать",
    added: "Добавлено в корзину",
    add_cart: "В корзину",
    latest: "Последняя",
    select_version: "Выберите версию",
    by: "от",
    install_readme: "Установка",
  },
  cart: {
    title: "Корзина загрузок",
    empty: "Корзина пуста",
    total: "Всего",
    remove: "Удалить",
    clear: "Очистить",
    download_zip: "Скачать ZIP",
    preparing: "Подготовка...",
    mods_folder: "mods",
    shaders_folder: "shaderpacks",
    packs_folder: "resourcepacks",
    readme_title: "Инструкция по установке",
    readme_content: `Как установить:
1. Скачайте ZIP архив
2. Распакуйте на рабочий стол
3. Скопируйте папки (mods, shaderpacks, resourcepacks) в папку .minecraft
4. Запустите Minecraft с нужным загрузчиком и версией`,
  },
};

let current = "en";

function lsSet(key, val) {
  try { localStorage.setItem(key, val); } catch {}
}
function lsGet(key, def) {
  try { return localStorage.getItem(key) ?? def; } catch { return def; }
}

export function setLang(lang) {
  current = lang;
  lsSet("mv:lang", lang);
}

export function getLang() {
  return current;
}

export function t(path) {
  const dict = current === "ru" ? ru : en;
  const keys = path.split(".");
  let val = dict;
  for (const k of keys) {
    val = val?.[k];
  }
  return val ?? path;
}

export function initLang() {
  current = lsGet("mv:lang", "en");
}
