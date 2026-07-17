(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(o){if(o.ep)return;o.ep=!0;const i=n(o);fetch(o.href,i)}})();const G={nav:{title:"ModVault"},home:{title:"ModVault",subtitle:"Download Minecraft mods, shaders, and resource packs",search:"Search mods, shaders, resource packs...",category:"Category",version:"Game Version",loader:"Loader",all:"All",mod:"Mods",shader:"Shaders",resourcepack:"Resource Packs",datapack:"Data Packs",loading:"Loading...",no_results:"Nothing found",load_more:"Load More"},project:{downloads:"Downloads",followers:"Followers",versions:"Versions",download:"Download",added:"Added to cart",add_cart:"Add to Cart",latest:"Latest",select_version:"Select version",by:"by",install_readme:"Installation"},cart:{title:"Download Cart",empty:"Cart is empty",total:"Total items",remove:"Remove",clear:"Clear",download_zip:"Download ZIP",preparing:"Preparing...",mods_folder:"mods",shaders_folder:"shaderpacks",packs_folder:"resourcepacks",readme_title:"Installation Guide",readme_content:`How to install:
1. Download the ZIP archive
2. Extract it to your desktop
3. Copy the folders (mods, shaderpacks, resourcepacks) to your .minecraft directory
4. Launch Minecraft with the correct loader and version`}},Z={nav:{title:"ModVault"},home:{title:"ModVault",subtitle:"Скачивай моды, шейдеры и ресурспаки для Minecraft",search:"Поиск модов, шейдеров, ресурспаков...",category:"Категория",version:"Версия игры",loader:"Загрузчик",all:"Все",mod:"Моды",shader:"Шейдеры",resourcepack:"Ресурспаки",datapack:"Датапаки",loading:"Загрузка...",no_results:"Ничего не найдено",load_more:"Загрузить ещё"},project:{downloads:"Скачиваний",followers:"Подписчиков",versions:"Версии",download:"Скачать",added:"Добавлено в корзину",add_cart:"В корзину",latest:"Последняя",select_version:"Выберите версию",by:"от",install_readme:"Установка"},cart:{title:"Корзина загрузок",empty:"Корзина пуста",total:"Всего",remove:"Удалить",clear:"Очистить",download_zip:"Скачать ZIP",preparing:"Подготовка...",mods_folder:"mods",shaders_folder:"shaderpacks",packs_folder:"resourcepacks",readme_title:"Инструкция по установке",readme_content:`Как установить:
1. Скачайте ZIP архив
2. Распакуйте на рабочий стол
3. Скопируйте папки (mods, shaderpacks, resourcepacks) в папку .minecraft
4. Запустите Minecraft с нужным загрузчиком и версией`}};let L="en";function Y(e,t){try{localStorage.setItem(e,t)}catch{}}function Q(e,t){try{return localStorage.getItem(e)??t}catch{return t}}function X(e){L=e,Y("mv:lang",e)}function I(){return L}function u(e){const t=L==="ru"?Z:G,n=e.split(".");let r=t;for(const o of n)r=r==null?void 0:r[o];return r??e}function ee(){L=Q("mv:lang","en")}const b="https://api.modrinth.com/v2",te=["1.21.4","1.21.3","1.21.1","1.21","1.20.6","1.20.4","1.20.2","1.20.1","1.19.4","1.19.2","1.18.2","1.17.1","1.16.5"],ne=["fabric","forge","neoforge","quilt","liteloader","rift"];async function x(e){const t=await fetch(e);if(!t.ok)throw new Error(`API ${t.status}`);return t.json()}async function R(){try{return(await x(`${b}/tag/game_version`)).filter(t=>t.version_type==="release").map(t=>t.version).filter(t=>{const[n,r]=t.split(".").map(Number);return n===1&&r>=16}).sort((t,n)=>{const[r,o]=t.split(".").slice(0,2).map(Number),[i,a]=n.split(".").slice(0,2).map(Number);return i-r||a-o})}catch{return te}}async function V(){try{return(await x(`${b}/tag/loader`)).map(t=>t.name).filter(Boolean)}catch{return ne}}async function D({query:e,versions:t,loaders:n,categories:r,limit:o,offset:i}){const a=[];r!=null&&r.length&&a.push(r.map(g=>`categories:${g}`)),t!=null&&t.length&&a.push(t.map(g=>`versions:${g}`)),n!=null&&n.length&&a.push(n.map(g=>`loaders:${g}`));const s=new URLSearchParams({query:e||"",limit:String(o||20),offset:String(i||0)});a.length&&s.set("facets",JSON.stringify(a));try{return await x(`${b}/search?${s}`)}catch{return{hits:[]}}}async function N(e){return x(`${b}/project/${e}`)}async function q(e){return x(`${b}/project/${e}/version`)}async function U(e){return x(`${b}/version/${e}`)}const re=Object.freeze(Object.defineProperty({__proto__:null,fetchJSON:x,getGameVersions:R,getLoaders:V,getProject:N,getProjectVersions:q,getVersion:U,searchProjects:D},Symbol.toStringTag,{value:"Module"})),z="mv:cart";let y=oe();function oe(){try{const e=localStorage.getItem(z);return e?JSON.parse(e):[]}catch{return[]}}function S(){try{localStorage.setItem(z,JSON.stringify(y))}catch{}se()}function se(){window.dispatchEvent(new CustomEvent("cart:update",{detail:[...y]}))}function ae(){return[...y]}function F(e,t){y.find(r=>r.projectId===e.id&&r.versionId===t)||(y.push({projectId:e.id,projectTitle:e.title,projectType:e.project_type,iconUrl:e.icon_url,versionId:t}),S())}function ie(e,t){y=y.filter(n=>!(n.projectId===e&&n.versionId===t)),S()}function ce(){y=[],S()}function le(){return y.length}async function de(e){var r;const t=y.length,n=[];for(let o=0;o<t;o++){const i=y[o],s=(r=(await U(i.versionId)).files)==null?void 0:r[0];if(!s)continue;const h=await(await fetch(s.url)).blob(),m=i.projectType==="mod"?"mods":i.projectType==="shader"?"shaderpacks":"resourcepacks";n.push({blob:h,name:s.filename,folder:m}),e&&e(o+1,t)}return n}const ue="modulepreload",me=function(e,t){return new URL(e,t).href},j={},K=function(t,n,r){let o=Promise.resolve();if(n&&n.length>0){let a=function(m){return Promise.all(m.map(c=>Promise.resolve(c).then(l=>({status:"fulfilled",value:l}),l=>({status:"rejected",reason:l}))))};const s=document.getElementsByTagName("link"),g=document.querySelector("meta[property=csp-nonce]"),h=(g==null?void 0:g.nonce)||(g==null?void 0:g.getAttribute("nonce"));o=a(n.map(m=>{if(m=me(m,r),m in j)return;j[m]=!0;const c=m.endsWith(".css"),l=c?'[rel="stylesheet"]':"";if(!!r)for(let v=s.length-1;v>=0;v--){const f=s[v];if(f.href===m&&(!c||f.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${m}"]${l}`))return;const p=document.createElement("link");if(p.rel=c?"stylesheet":ue,c||(p.as="script"),p.crossOrigin="",p.href=m,h&&p.setAttribute("nonce",h),document.head.appendChild(p),c)return new Promise((v,f)=>{p.addEventListener("load",v),p.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${m}`)))})}))}function i(a){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=a,window.dispatchEvent(s),!s.defaultPrevented)throw a}return o.then(a=>{for(const s of a||[])s.status==="rejected"&&i(s.reason);return t().catch(i)})},B=["1.21.4","1.21.3","1.21.1","1.21","1.20.6","1.20.4","1.20.2","1.20.1","1.19.4","1.19.2","1.18.2","1.17.1","1.16.5"],pe=["fabric","forge","neoforge","quilt"];function fe(e,t){e.innerHTML=`
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="text-center mb-6">
        <h1 class="text-4xl font-bold tracking-tight glow-text">${u("home.title")}</h1>
        <p class="text-gray-500 mt-1.5 text-sm">${u("home.subtitle")}</p>
      </div>

      <div class="flex flex-col sm:flex-row gap-2.5 mb-6">
        <div class="relative flex-1">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input id="q" type="text" class="input w-full pl-10" placeholder="${u("home.search")}" />
        </div>
        <select id="cat" class="select w-full sm:w-40">
          <option value="">${u("home.category")}</option>
          <option value="mod">${u("home.mod")}</option>
          <option value="shader">${u("home.shader")}</option>
          <option value="resourcepack">${u("home.resourcepack")}</option>
          <option value="datapack">${u("home.datapack")}</option>
        </select>
        <select id="ver" class="select w-full sm:w-40">
          <option value="">${u("home.version")}</option>
          ${B.map(d=>`<option value="${d}">${d}</option>`).join("")}
        </select>
        <select id="ldr" class="select w-full sm:w-40">
          <option value="">${u("home.loader")}</option>
          ${pe.map(d=>`<option value="${d}">${M(d)}</option>`).join("")}
        </select>
      </div>

      <div id="res" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"></div>

      <div id="more" class="text-center mt-6 hidden">
        <button id="more-btn" class="btn-secondary px-6">${u("home.load_more")}</button>
      </div>
    </div>
  `;const n=document.getElementById("q"),r=document.getElementById("cat"),o=document.getElementById("ver"),i=document.getElementById("ldr"),a=document.getElementById("res"),s=document.getElementById("more"),g=document.getElementById("more-btn");let h=0,m=!1;const c=d=>{if(m)return;m=!0,d||(h=0,a.innerHTML='<div class="col-span-full flex justify-center py-16"><div class="spinner"></div></div>',s.classList.add("hidden"));const p={query:n.value.trim(),versions:o.value?[o.value]:[],loaders:i.value?[i.value]:[],categories:r.value?[r.value]:[],limit:20,offset:h};D(p).then(v=>{if(d||(a.innerHTML=""),!v.hits||v.hits.length===0){d||(a.innerHTML=`<div class="col-span-full text-center py-16 text-gray-500">${u("home.no_results")}</div>`),m=!1;return}v.hits.forEach(f=>a.appendChild(ge(f,t))),h+=v.hits.length,s.classList.toggle("hidden",v.hits.length<20),m=!1}).catch(()=>{d||(a.innerHTML='<div class="col-span-full text-center py-16 text-gray-500">Error</div>'),m=!1})};let l;n.addEventListener("input",()=>{clearTimeout(l),l=setTimeout(()=>c(!1),350)}),r.addEventListener("change",()=>c(!1)),o.addEventListener("change",()=>c(!1)),i.addEventListener("change",()=>c(!1)),g.addEventListener("click",()=>c(!0)),R().then(d=>{d.length&&(o.innerHTML=`<option value="">${u("home.version")}</option>`+d.map(p=>`<option value="${p}"${p===B[0],""}>${p}</option>`).join(""))}),V().then(d=>{d.length&&(i.innerHTML=`<option value="">${u("home.loader")}</option>`+d.map(p=>`<option value="${p}">${M(p)}</option>`).join(""))}),c(!1)}function M(e){return e.charAt(0).toUpperCase()+e.slice(1)}function ge(e,t){const n=document.createElement("div");return n.className="card p-3.5",n.innerHTML=`
    <div class="flex items-start gap-3">
      <img src="${e.icon_url||"./favicon.svg"}" alt="" class="project-icon" loading="lazy" />
      <div class="min-w-0 flex-1">
        <h3 class="font-semibold text-sm leading-snug truncate">${E(e.title)}</h3>
        <p class="text-xs text-gray-500 truncate mt-0.5">${E(e.author)}</p>
        <span class="pill mt-1.5 capitalize">${e.project_type}</span>
      </div>
    </div>
    <p class="text-xs text-gray-500 mt-2.5 line-clamp-2 leading-relaxed">${E(e.description||"")}</p>
    <div class="flex items-center justify-between mt-3 pt-2.5 border-t" style="border-color:var(--color-border)">
      <span class="text-xs text-gray-600">${ve(e.downloads)}</span>
      <button class="add text-xs px-3 py-1.5 rounded-lg font-medium transition-all" style="background:rgba(16,185,129,0.1);color:var(--color-accent-light)">+ Cart</button>
    </div>
  `,n.addEventListener("click",r=>{r.target.closest(".add")||t("/project/"+(e.slug||e.id))}),n.querySelector(".add").addEventListener("click",async r=>{r.stopPropagation();try{const{getProjectVersions:o}=await K(async()=>{const{getProjectVersions:s}=await Promise.resolve().then(()=>re);return{getProjectVersions:s}},void 0,import.meta.url),a=(await o(e.id||e.slug))[0];if(a){F(e,a.id);const s=r.currentTarget;s.textContent="✓ Added",s.style.background="rgba(16,185,129,0.2)",s.style.border="1px solid var(--color-accent)",setTimeout(()=>{s.textContent="+ Cart",s.style.background="rgba(16,185,129,0.1)",s.style.border="none"},2e3)}}catch{}}),n}function E(e){if(!e)return"";const t=document.createElement("div");return t.textContent=e,t.innerHTML}function ve(e){return e?e>=1e6?(e/1e6).toFixed(1)+"M":e>=1e3?(e/1e3).toFixed(1)+"K":String(e):"0"}async function he(e,t,n){e.innerHTML='<div class="max-w-4xl mx-auto px-4 py-8"><div class="skeleton h-8 w-64 mb-4"></div><div class="skeleton h-4 w-96 mb-8"></div><div class="skeleton h-48 w-full"></div></div>';try{const r=await N(t),o=await q(t);ye(e,r,o,n)}catch{e.innerHTML='<div class="max-w-4xl mx-auto px-4 py-12 text-center text-gray-500">Error loading project</div>'}}function ye(e,t,n,r){var h,m;n[0],e.innerHTML=`
    <div class="max-w-4xl mx-auto px-4 py-8">
      <button id="back-btn" class="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors mb-6">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
        Back
      </button>

      <div class="flex items-start gap-5 mb-8">
        <img src="${t.icon_url||"./favicon.svg"}" alt="" class="w-20 h-20 rounded-xl object-cover bg-gray-800" />
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl font-bold">${t.title}</h1>
          <p class="text-sm text-gray-400 mt-0.5">${u("project.by")} <span class="text-gray-300">${t.author||"Unknown"}</span></p>
          <div class="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
            <span>${u("project.downloads")}: <strong class="text-gray-300">${T(t.downloads)}</strong></span>
            <span>${u("project.followers")}: <strong class="text-gray-300">${T(t.followers)}</strong></span>
            <span class="capitalize">${t.project_type}</span>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <button id="dl-btn" class="btn-primary text-sm whitespace-nowrap">${u("project.download")}</button>
          <button id="cart-btn" class="btn-secondary text-sm whitespace-nowrap">${u("project.add_cart")}</button>
        </div>
      </div>

      <div class="mb-6">
        <label class="text-xs text-gray-500 block mb-1.5">${u("project.version")}</label>
        <select id="ver-select" class="filter-select px-3 py-2 rounded-lg text-sm w-full max-w-xs"></select>
      </div>

      <div class="prose prose-invert max-w-none text-sm text-gray-300 leading-relaxed" id="project-body">
        ${t.body||""}
      </div>

      <div class="mt-10">
        <h2 class="text-lg font-semibold mb-4">${u("project.versions")} (${n.length})</h2>
        <div class="space-y-2" id="versions-list"></div>
      </div>
    </div>
  `,document.getElementById("back-btn").addEventListener("click",()=>r("/"));const o=document.getElementById("ver-select"),i=[],a=new Set;for(const c of n){const l=((h=c.game_versions)==null?void 0:h.join(", "))||c.version_number,d=((m=c.loaders)==null?void 0:m.join(", "))||"";a.has(l+d)||(a.add(l+d),i.push(c))}o.innerHTML=i.map((c,l)=>{var d,p;return`
    <option value="${c.id}" ${l===0?"selected":""}>
      ${c.version_number} — ${((d=c.game_versions)==null?void 0:d.slice(0,2).join(", "))||""} ${(p=c.loaders)!=null&&p.length?"["+c.loaders.join(", ")+"]":""}
    </option>
  `}).join("");function s(){return i.find(c=>c.id===o.value)||i[0]}document.getElementById("dl-btn").addEventListener("click",()=>{var d;const l=(d=s().files)==null?void 0:d[0];l!=null&&l.url&&window.open(l.url,"_blank")}),document.getElementById("cart-btn").addEventListener("click",()=>{const c=s();F(t,c.id);const l=document.getElementById("cart-btn");l.textContent=u("project.added"),l.classList.remove("btn-secondary"),l.classList.add("bg-emerald-500/20","text-emerald-400"),setTimeout(()=>{l.textContent=u("project.add_cart"),l.classList.add("btn-secondary"),l.classList.remove("bg-emerald-500/20","text-emerald-400")},2e3)});const g=document.getElementById("versions-list");n.slice(0,30).forEach(c=>{var d,p,v,f;const l=document.createElement("div");l.className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-900 text-sm",l.innerHTML=`
      <div>
        <span class="font-medium">${c.version_number}</span>
        <span class="text-gray-500 ml-2 text-xs">${((d=c.game_versions)==null?void 0:d.slice(0,3).join(", "))||""}</span>
        ${(p=c.loaders)!=null&&p.length?`<span class="text-emerald-400 ml-2 text-xs">[${c.loaders.join(", ")}]</span>`:""}
      </div>
      <a href="${(f=(v=c.files)==null?void 0:v[0])==null?void 0:f.url}" target="_blank" class="text-emerald-400 hover:text-emerald-300 text-xs transition-colors">Download</a>
    `,g.appendChild(l)})}function T(e){return e?e>=1e6?(e/1e6).toFixed(1)+"M":e>=1e3?(e/1e3).toFixed(1)+"K":String(e):"0"}async function k(e,t){const n=ae();e.innerHTML=`
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">${u("cart.title")}</h1>
        <div class="flex gap-2">
          <button id="clear-btn" class="btn-secondary text-sm ${n.length?"":"hidden"}">${u("cart.clear")}</button>
          <button id="download-btn" class="btn-primary text-sm ${n.length?"":"hidden"}">${u("cart.download_zip")}</button>
        </div>
      </div>
      <div id="cart-items" class="space-y-2"></div>
      <div id="cart-progress" class="hidden mt-4"></div>
    </div>
  `;const r=document.getElementById("cart-items"),o=document.getElementById("clear-btn"),i=document.getElementById("download-btn");if(!n.length){r.innerHTML=`<p class="text-center py-12 text-gray-500">${u("cart.empty")}</p>`;return}n.forEach(a=>{const s=document.createElement("div");s.className="flex items-center gap-3 p-3 rounded-xl bg-gray-900",s.innerHTML=`
      <img src="${a.iconUrl||"./favicon.svg"}" alt="" class="w-10 h-10 rounded-lg object-cover bg-gray-800" />
      <div class="min-w-0 flex-1">
        <p class="text-sm font-medium truncate">${a.projectTitle}</p>
        <p class="text-xs text-gray-500 capitalize">${a.projectType}</p>
      </div>
      <button class="cart-remove text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1">${u("cart.remove")}</button>
    `,s.querySelector(".cart-remove").addEventListener("click",()=>{ie(a.projectId,a.versionId),k(e)}),r.appendChild(s)}),o.addEventListener("click",()=>{ce(),k(e)}),i.addEventListener("click",async()=>{const a=document.getElementById("cart-progress");a.classList.remove("hidden"),a.innerHTML=`<div class="text-center py-4 text-gray-400">${u("cart.preparing")} <span id="dl-progress">0/${n.length}</span></div>`,i.disabled=!0,i.textContent=u("cart.preparing");try{const s=await de((f,w)=>{document.getElementById("dl-progress").textContent=`${f}/${w}`}),{default:g}=await K(async()=>{const{default:f}=await import("./jszip.min-DvbXqdIg.js").then(w=>w.j);return{default:f}},[],import.meta.url),h=new g,m={};s.forEach(({blob:f,name:w,folder:$})=>{m[$]||(m[$]=h.folder($)),m[$].file(w,f)});const l=I()==="ru"?`ModVault — Инструкция по установке
====================================
Дата сборки: ${new Date().toLocaleDateString("ru-RU")}

Как установить:
1. Распакуйте этот архив в удобное место
2. Откройте папку .minecraft (Windows: Win+R, введите %appdata%/.minecraft)
${Object.keys(m).map(f=>`3. Скопируйте папку "${f}" в .minecraft`).join(`
`)}
4. Запустите Minecraft с нужным загрузчиком и версией

Установленные компоненты:
${s.map(f=>`  - [${f.folder}] ${f.name}`).join(`
`)}

Скачано через ModVault
`:`ModVault — Installation Guide
====================================
Build date: ${new Date().toLocaleDateString("en-US")}

How to install:
1. Extract this archive anywhere
2. Open your .minecraft folder (Windows: Win+R, type %appdata%/.minecraft)
${Object.keys(m).map(f=>`3. Copy the "${f}" folder into .minecraft`).join(`
`)}
4. Launch Minecraft with the correct loader and version

Installed components:
${s.map(f=>`  - [${f.folder}] ${f.name}`).join(`
`)}

Downloaded via ModVault
`;h.file("README.txt",l);const d=await h.generateAsync({type:"blob"}),p=URL.createObjectURL(d),v=document.createElement("a");v.href=p,v.download=`modvault-${Date.now()}.zip`,v.click(),URL.revokeObjectURL(p)}catch(s){a.innerHTML=`<div class="text-center py-4 text-red-400">Error: ${s.message}</div>`}i.disabled=!1,i.textContent=u("cart.download_zip")})}const C={"/":fe,"/cart":k};function J(){return window.location.hash.replace(/^#/,"")||"/"}function P(e){e.startsWith("/")||(e="/"+e),e!==J()&&(location.hash="#"+e)}let A="";function _(){try{const e=J();if(e===A)return;A=e;const t=document.getElementById("app");if(!t){console.error("#app not found");return}if(e.startsWith("/project/")){const r=e.slice(9);he(t,r,P);return}(C[e]||C["/"])(t,P),W()}catch(e){console.error("render error:",e);const t=document.getElementById("app");t&&(t.innerHTML=`<div class="p-4 text-red-400 text-sm">Render Error: ${e.message}</div>`)}}function W(){const e=document.getElementById("cart-badge");if(!e)return;const t=le();t>0?(e.textContent=t>99?"99+":String(t),e.classList.remove("hidden")):e.classList.add("hidden")}window.addEventListener("error",e=>{const t=document.getElementById("app");t&&(t.innerHTML=`<div class="p-4 text-red-400 text-sm">JS Error: ${e.message}</div>`),console.error(e)});function O(){ee(),H(),document.querySelectorAll("[data-lang]").forEach(t=>{t.addEventListener("click",()=>{const n=t.dataset.lang;n&&n!==I()&&(X(n),H(),_())})});const e=sessionStorage.getItem("mv:spa");if(e){sessionStorage.removeItem("mv:spa"),location.hash="#"+e;return}_(),window.addEventListener("hashchange",_),window.addEventListener("cart:update",W)}function H(){const e=I();document.querySelectorAll("[data-lang]").forEach(t=>{t.classList.toggle("active",t.dataset.lang===e)})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",O):O();
