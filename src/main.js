import "./style.css";
import { initLang, setLang, t } from "./i18n.js";
import { getItems, getCount } from "./cart.js";
import { renderHome } from "./pages/home.js";
import { renderProject } from "./pages/project.js";
import { renderCart } from "./pages/cart.js";

const routes = {
  "/": renderHome,
  "/cart": renderCart,
};

function getPath() {
  return window.location.hash.replace(/^#/, "") || "/";
}

function navigate(path) {
  if (!path.startsWith("/")) path = "/" + path;
  if (path === getPath()) return;
  location.hash = "#" + path;
}

let currentPath = "";

function render() {
  try {
    const path = getPath();
    if (path === currentPath) return;
    currentPath = path;

    const app = document.getElementById("app");
    if (!app) { console.error("#app not found"); return; }

    if (path.startsWith("/project/")) {
      const id = path.slice(9);
      renderProject(app, id, navigate);
      return;
    }

    const renderFn = routes[path] || routes["/"];
    renderFn(app, navigate);
    updateCartBadge();
  } catch (e) {
    console.error("render error:", e);
    const app = document.getElementById("app");
    if (app) app.innerHTML = `<div class="p-4 text-red-400 text-sm">Render Error: ${e.message}</div>`;
  }
}

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;
  const count = getCount();
  if (count > 0) {
    badge.textContent = count > 99 ? "99+" : String(count);
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }
}

window.addEventListener("error", (e) => {
  const app = document.getElementById("app");
  if (app) app.innerHTML = `<div class="p-4 text-red-400 text-sm">JS Error: ${e.message}</div>`;
  console.error(e);
});

function init() {
  initLang();
  applyLang();

  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      if (lang && lang !== getLang()) {
        setLang(lang);
        applyLang();
        render();
      }
    });
  });

  const spaPath = sessionStorage.getItem("mv:spa");
  if (spaPath) {
    sessionStorage.removeItem("mv:spa");
    location.hash = "#" + spaPath;
    return;
  }

  render();
  window.addEventListener("hashchange", render);
  window.addEventListener("cart:update", updateCartBadge);
}

function applyLang() {
  const lang = getLang();
  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
