const BASE = "https://api.modrinth.com/v2";

const FALLBACK_VERSIONS = [
  "1.21.4", "1.21.3", "1.21.1", "1.21",
  "1.20.6", "1.20.4", "1.20.2", "1.20.1",
  "1.19.4", "1.19.2",
  "1.18.2",
  "1.17.1",
  "1.16.5",
];

const FALLBACK_LOADERS = [
  "fabric", "forge", "neoforge", "quilt", "liteloader", "rift",
];

export async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export async function getGameVersions() {
  try {
    const data = await fetchJSON(`${BASE}/tag/game_version`);
    return data
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
  } catch {
    return FALLBACK_VERSIONS;
  }
}

export async function getLoaders() {
  try {
    const data = await fetchJSON(`${BASE}/tag/loader`);
    return data.map((l) => l.name).filter(Boolean);
  } catch {
    return FALLBACK_LOADERS;
  }
}

export async function searchProjects({ query, versions, loaders, categories, limit, offset }) {
  const facets = [];
  if (categories?.length) facets.push(categories.map((c) => `categories:${c}`));
  if (versions?.length) facets.push(versions.map((v) => `versions:${v}`));
  if (loaders?.length) facets.push(loaders.map((l) => `loaders:${l}`));

  const params = new URLSearchParams({
    query: query || "",
    limit: String(limit || 20),
    offset: String(offset || 0),
  });
  if (facets.length) params.set("facets", JSON.stringify(facets));

  try {
    return await fetchJSON(`${BASE}/search?${params}`);
  } catch {
    return { hits: [] };
  }
}

export async function getProject(id) {
  return fetchJSON(`${BASE}/project/${id}`);
}

export async function getProjectVersions(id) {
  return fetchJSON(`${BASE}/project/${id}/version`);
}

export async function getVersion(id) {
  return fetchJSON(`${BASE}/version/${id}`);
}
