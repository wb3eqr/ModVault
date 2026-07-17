const BASE = "https://api.modrinth.com/v2";

let cachedVersions = null;
let cachedLoaders = null;

export async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export async function getGameVersions() {
  if (cachedVersions) return cachedVersions;
  const data = await fetchJSON(`${BASE}/tag/game_version`);
  cachedVersions = data
    .filter((v) => v.version_type === "release")
    .map((v) => v.version)
    .filter((v) => {
      const [major, minor] = v.split(".").map(Number);
      return major === 1 && minor >= 16;
    })
    .sort((a, b) => {
      const [am, an] = a.split(".").slice(0, 2).map(Number);
      const [bm, bn] = b.split(".").slice(0, 2).map(Number);
      return bm - am || bn - an;
    });
  return cachedVersions;
}

export async function getLoaders() {
  if (cachedLoaders) return cachedLoaders;
  const data = await fetchJSON(`${BASE}/tag/loader`);
  cachedLoaders = data.map((l) => l.icon ?? l.name);
  return cachedLoaders;
}

export async function searchProjects({ query, versions, loaders, categories, limit, offset }) {
  const facets = [];
  if (categories?.length) facets.push(categories.map((c) => `categories:${c}`));
  if (versions?.length) facets.push(versions.map((v) => `versions:${v}`));
  if (loaders?.length) facets.push(loaders.map((l) => `loaders:${l}`));

  const params = new URLSearchParams({ query: query || "", limit: String(limit || 20), offset: String(offset || 0) });
  if (facets.length) params.set("facets", JSON.stringify(facets));

  return fetchJSON(`${BASE}/search?${params}`);
}

export function getProject(id) {
  return fetchJSON(`${BASE}/project/${id}`);
}

export function getProjectVersions(id) {
  return fetchJSON(`${BASE}/project/${id}/version`);
}

export function getVersion(id) {
  return fetchJSON(`${BASE}/version/${id}`);
}
