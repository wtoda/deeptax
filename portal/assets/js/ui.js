// ui.js — componentes reutilizáveis de interface, em HTML puro (sem framework).
import { esc } from "./util.js";

/** Cabeçalho padrão de página. */
export const cabecalho = (eyebrow, titulo, lede = "") => `
  <header class="page-head">
    ${eyebrow ? `<div class="eyebrow">${esc(eyebrow)}</div>` : ""}
    <h1>${titulo}</h1>
    ${lede ? `<p class="lede">${lede}</p>` : ""}
  </header>`;

/** Callout com tipo: info | lei | warn | danger. */
export const aviso = (tipo, titulo, html) => `
  <div class="callout ${tipo}">
    ${titulo ? `<span class="t">${esc(titulo)}</span>` : ""}
    ${html}
  </div>`;

/** Badge. */
export const badge = (texto, tipo = "") => `<span class="badge ${tipo}">${esc(texto)}</span>`;

/**
 * Tabela responsiva.
 * @param {object} p
 * @param {string[]} p.colunas  cabeçalhos
 * @param {Array<Array<string>>} p.linhas  células já em HTML
 * @param {string} [p.legenda]
 * @param {string} [p.rodape]  linha de <tfoot> (HTML)
 * @param {number[]} [p.numericas] índices de colunas alinhadas à direita
 */
export function tabela({ colunas, linhas, legenda = "", rodape = "", numericas = [] }) {
  const th = colunas
    .map((c, i) => `<th class="${numericas.includes(i) ? "num" : ""}">${c}</th>`)
    .join("");
  const tr = linhas
    .map(
      (l) =>
        `<tr>${l
          .map((c, i) => `<td class="${numericas.includes(i) ? "num" : ""}">${c}</td>`)
          .join("")}</tr>`
    )
    .join("");
  return `
  <div class="table-wrap">
    <table>
      ${legenda ? `<caption>${legenda}</caption>` : ""}
      <thead><tr>${th}</tr></thead>
      <tbody>${tr}</tbody>
      ${rodape ? `<tfoot>${rodape}</tfoot>` : ""}
    </table>
  </div>`;
}

/** Bloco de acordeão. items: [{p: pergunta, r: resposta HTML}] */
export const acordeao = (items, aberto = false) =>
  items
    .map(
      (it) => `
    <details class="acc" ${aberto ? "open" : ""}>
      <summary>${esc(it.p)}</summary>
      <div>${it.r}</div>
    </details>`
    )
    .join("");

/** Card simples com título e corpo. */
export const cartao = (titulo, corpo, extra = "") => `
  <div class="card">
    ${titulo ? `<div class="card-h"><h3>${titulo}</h3>${extra}</div>` : ""}
    ${corpo}
  </div>`;

/** Grade de cards. */
export const grade = (htmls, colunas = 2) => `<div class="grid g${colunas}">${htmls.join("")}</div>`;

/** Tile de estatística. */
export const stat = (rotulo, valor, detalhe = "", destaque = false) => `
  <div class="stat ${destaque ? "accent" : ""}">
    <div class="k">${esc(rotulo)}</div>
    <div class="v">${valor}</div>
    ${detalhe ? `<div class="d">${detalhe}</div>` : ""}
  </div>`;

/** Seção com título. */
export const secao = (id, titulo, html, sub = "") => `
  <section class="section" id="${esc(id)}">
    <div class="section-head"><h2>${titulo}</h2>${sub ? `<span class="muted small">${sub}</span>` : ""}</div>
    ${html}
  </section>`;
