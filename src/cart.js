import { getVersion } from "./api.js";

const STORAGE_KEY = "mv:cart";

let items = load();

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  dispatch();
}

function dispatch() {
  window.dispatchEvent(new CustomEvent("cart:update", { detail: [...items] }));
}

export function getItems() {
  return [...items];
}

export function addItem(project, versionId) {
  const exists = items.find((i) => i.projectId === project.id && i.versionId === versionId);
  if (exists) return;
  items.push({
    projectId: project.id,
    projectTitle: project.title,
    projectType: project.project_type,
    iconUrl: project.icon_url,
    versionId,
  });
  save();
}

export function removeItem(projectId, versionId) {
  items = items.filter((i) => !(i.projectId === projectId && i.versionId === versionId));
  save();
}

export function clearItems() {
  items = [];
  save();
}

export function getCount() {
  return items.length;
}

export async function downloadAll(onProgress) {
  const total = items.length;
  const blobs = [];
  for (let i = 0; i < total; i++) {
    const item = items[i];
    const ver = await getVersion(item.versionId);
    const file = ver.files?.[0];
    if (!file) continue;
    const res = await fetch(file.url);
    const blob = await res.blob();
    const folder = item.projectType === "mod" ? "mods" : item.projectType === "shader" ? "shaderpacks" : "resourcepacks";
    blobs.push({ blob, name: file.filename, folder });
    if (onProgress) onProgress(i + 1, total);
  }
  return blobs;
}
