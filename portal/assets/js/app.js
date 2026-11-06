// app.js — shell da aplicação: router, navegação, busca global.
import { $, $$, esc } from "./util.js";

/** Mapa de rotas → módulo de view (carregado sob demanda). */
const ROTAS = {
  painel: { titulo: "Painel", mod: () => import("./views/painel.js") },
  cronograma: { titulo: "Cronograma", mod: () => import("./views/cronograma.js") },
  entenda: { titulo: "Entenda o modelo", mod: () => import("./views/entenda.js") },
  legislacao: { titulo: "Legislação", mod: () => import("./views/legislacao.js") },
  comparativo: { titulo: "Antes e depois", mod: () => import("./views/comparativo.js") },
  glossario: { titulo: "Glossário", mod: () => import("./views/glossario.js") },
  aprender: { titulo: "Aprender", mod: () => import("./views/aprender.js") },
  calculadora: { titulo: "Calculadora", mod: () => import("./views/calculadora.js") },
  documentos: { titulo: "Documentos fiscais", mod: () => import("./views/documentos.js") },
  dere: { titulo: "DeRE", mod: () => import("./views/dere.js") },
  conformidade: { titulo: "Conformidade", mod: () => import("./views/conformidade.js") },
  divulgacao: { titulo: "Kit de divulgação", mod: () => import("./views/divulgacao.js") },
  fontes: { titulo: "Fontes e base legal", mod: () => import("./views/fontes.js") },
};

const main = $("#conteudo");
const nav = $("#nav");
const crumbs = $("#crumbs");

/**
 * Raiz do portal. As telas têm URL de verdade (/reforma-tributaria/<rota>/),
 * e não hash — é o que permite ao Google indexar cada uma separadamente.
 */
export const BASE = "/reforma-tributaria";

/** Lê a rota atual do caminho: "/reforma-tributaria/cronograma/" → "cronograma". */
function rotaAtual() {
  const caminho = decodeURI(location.pathname);
  const semBase = caminho.startsWith(BASE) ? caminho.slice(BASE.length) : caminho;
  const h = semBase.replace(/^\/+|\/+$/g, "").split("/")[0].split("?")[0].trim();
  return ROTAS[h] ? h : "painel";
}

/** Parâmetros de query da URL. */
export function parametros() {
  return Object.fromEntries(new URLSearchParams(location.search));
}

/** Caminho canônico de uma tela. */
export const caminhoDaRota = (rota) => `${BASE}/${rota}/`;

let renderSeq = 0;

/** Renderiza a rota corrente. */
export async function navegar() {
  const rota = rotaAtual();
  const seq = ++renderSeq;

  nav.querySelectorAll("a").forEach((a) =>
    a.classList.toggle("ativo", a.dataset.rota === rota)
  );
  document.title = `${ROTAS[rota].titulo} · Reforma Tributária | Deeptax`;

  // migalhas
  const grupos = {
    painel: "Visão geral", cronograma: "Visão geral",
    entenda: "Entender", legislacao: "Entender", comparativo: "Entender", glossario: "Entender", aprender: "Entender",
    calculadora: "Operar", documentos: "Operar", dere: "Operar", conformidade: "Operar",
    divulgacao: "Comunicar", fontes: "Comunicar",
  };
  crumbs.innerHTML = `<span>${esc(grupos[rota] ?? "")}</span> › <strong>${esc(ROTAS[rota].titulo)}</strong>`;

  main.setAttribute("aria-busy", "true");
  try {
    const mod = await ROTAS[rota].mod();
    if (seq !== renderSeq) return; // rota mudou enquanto carregava
    main.innerHTML = "";
    const resultado = mod.render(main, parametros());
    if (resultado && typeof resultado.then === "function") await resultado;
    if (mod.bind) mod.bind(main);
  } catch (erro) {
    if (seq !== renderSeq) return;
    console.error(erro);
    main.innerHTML = `
      <div class="card">
        <h2>Não foi possível carregar esta tela</h2>
        <p class="muted">Ocorreu um erro ao montar a página <code>${esc(rota)}</code>.</p>
        <pre class="small" style="white-space:pre-wrap;color:#a8321f">${esc(String(erro && erro.message || erro))}</pre>
        <p><a class="btn btn-ghost" href="/reforma-tributaria/painel/">Voltar ao painel</a></p>
      </div>`;
  } finally {
    if (seq === renderSeq) main.setAttribute("aria-busy", "false");
  }

  // fecha menu mobile e reposiciona o foco
  document.getElementById("sidebar").classList.remove("aberta");
  $("#burger").setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0, behavior: "instant" });
}

/* ---------------- navegação ---------------- */

/**
 * Navegação: links reais, transição sem recarregar.
 * Usar <a href="/reforma-tributaria/..."> de verdade — e não hash — é o que
 * torna as telas rastreáveis e compartilháveis.
 */
function irPara(rota, substituir = false) {
  const destino = caminhoDaRota(rota);
  if (location.pathname !== destino) {
    if (substituir) history.replaceState({ rota }, "", destino);
    else history.pushState({ rota }, "", destino);
  }
  navegar();
}

document.addEventListener("click", (e) => {
  const a = e.target.closest("a[data-rota]");
  if (!a) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // respeita nova aba
  const rota = a.dataset.rota;
  if (!ROTAS[rota]) return;
  e.preventDefault();
  irPara(rota);
});

window.addEventListener("popstate", navegar);

$("#burger").addEventListener("click", () => {
  const sb = $("#sidebar");
  const aberto = sb.classList.toggle("aberta");
  $("#burger").setAttribute("aria-expanded", String(aberto));
});

$("#btn-print").addEventListener("click", () => window.print());

/* ---------------- busca global ---------------- */
let indiceBusca = null;

async function montarIndice() {
  if (indiceBusca) return indiceBusca;
  const { INDICE } = await import("./dados.js");
  indiceBusca = INDICE;
  return indiceBusca;
}

const overlay = $("#busca");
const inputBusca = $("#busca-input");
const resultados = $("#busca-resultados");

function normalizar(s) {
  return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

async function buscar(termo) {
  const idx = await montarIndice();
  const t = normalizar(termo).trim();
  if (!t) {
    resultados.innerHTML = `<div class="vazio">Digite para buscar em todo o conteúdo — ex.: <em>split payment</em>, <em>cesta básica</em>, <em>2027</em>, <em>crédito</em>.</div>`;
    return;
  }
  const palavras = t.split(/\s+/).filter(Boolean);
  const achados = idx
    .map((item) => {
      const alvo = normalizar(item.titulo + " " + (item.resumo || "") + " " + (item.tags || []).join(" "));
      let score = 0;
      for (const p of palavras) {
        if (normalizar(item.titulo).includes(p)) score += 5;
        if (alvo.includes(p)) score += 2;
      }
      return { item, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  if (!achados.length) {
    resultados.innerHTML = `<div class="vazio">Nada encontrado para “${esc(termo)}”. Tente outro termo.</div>`;
    return;
  }
  resultados.innerHTML = achados
    .map(
      ({ item }) => `<a href="${esc(item.href)}" data-busca-link>
        <b>${esc(item.titulo)}</b>
        <span>${esc(item.rota)}${item.resumo ? " · " + esc(item.resumo).slice(0, 110) : ""}</span>
      </a>`
    )
    .join("");
}

function abrirBusca() {
  overlay.hidden = false;
  inputBusca.value = "";
  inputBusca.focus();
  buscar("");
}
function fecharBusca() {
  overlay.hidden = true;
}

$("#btn-busca").addEventListener("click", abrirBusca);
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) fecharBusca();
  if (e.target.closest("[data-busca-link]")) fecharBusca();
});
inputBusca.addEventListener("input", (e) => buscar(e.target.value));
inputBusca.addEventListener("keydown", (e) => {
  if (e.key === "Escape") fecharBusca();
  if (e.key === "Enter") {
    const primeiro = resultados.querySelector("a");
    if (primeiro) {
      location.href = primeiro.getAttribute("href");
      fecharBusca();
    }
  }
});

document.addEventListener("keydown", (e) => {
  const digitando = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || "");
  if (e.key === "/" && !digitando) {
    e.preventDefault();
    abrirBusca();
  }
  if (e.key === "Escape" && !overlay.hidden) fecharBusca();
});

/* ---------------- toast ---------------- */
let toastTimer;
export function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.hidden = true), 2600);
}

/* ---------------- inicialização ---------------- */
async function iniciar() {
  // status do cronograma no topo da sidebar
  try {
    const { situacaoEm, aliquotasDoAno } = await import("./motor.js");
    const s = situacaoEm(new Date());
    const a = aliquotasDoAno(s.ano);
    const rotulo = s.ano >= 2033
      ? `Regime pleno · IBS ${(a.ibs * 100).toLocaleString("pt-BR")}% + CBS ${(a.cbs * 100).toLocaleString("pt-BR")}%`
      : `${s.ano} · ${s.titulo}`;
    $("#status-chip-texto").textContent = rotulo;
    $("#status-chip").title = s.resumo;
  } catch { /* o chip é acessório */ }

  try {
    const { META } = await import("./dados.js");
    $("#foot-data").textContent = META.atualizadoEm;
  } catch { /* opcional */ }

  await navegar();
}

/** Recarrega a rota atual (usado por telas que mudam de estado). */
export function recarregar() {
  return navegar();
}

iniciar();
