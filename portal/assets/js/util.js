// util.js — utilitários de formatação e DOM compartilhados por todas as telas.

/** Formata número em Real brasileiro. */
export const brl = (n, casas = 2) =>
  (n === null || n === undefined || Number.isNaN(n))
    ? "—"
    : new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: casas,
        maximumFractionDigits: casas,
      }).format(n);

/** Formata número com separador de milhar pt-BR. */
export const num = (n, casas = 2) =>
  (n === null || n === undefined || Number.isNaN(n))
    ? "—"
    : new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: casas }).format(n);

/**
 * Formata alíquota: aceita fração (0.265) ou percentual (26.5).
 * Sempre exibe com vírgula decimal e símbolo %.
 */
export const pct = (n, casas = 2) => {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  const v = Math.abs(n) <= 1 ? n * 100 : n;
  return `${num(v, casas)}%`;
};

/** Percentual já em pontos (ex.: 60) → "60%". */
export const pt = (n, casas = 0) => `${num(n, casas)}%`;

/** Escapa texto para inserção segura em HTML. */
export const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/** Cria um elemento a partir de HTML. */
export function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

/** Soma segura de listas. */
export const soma = (arr) => arr.reduce((a, b) => a + (Number(b) || 0), 0);

/** Limita valor entre mínimo e máximo. */
export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/** Arredonda para centavos (evita erro de ponto flutuante). */
export const cent = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

/** Data ISO → "30/10/2026". */
export function dataBR(iso) {
  if (!iso) return "—";
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

/** Mês por extenso abreviado. */
export const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** Diferença em dias entre hoje e uma data ISO. */
export function diasAte(iso) {
  const hoje = new Date();
  const alvo = new Date(iso + "T00:00:00");
  return Math.ceil((alvo - hoje) / 86400000);
}

/** Atalho para querySelector. */
export const $ = (sel, raiz = document) => raiz.querySelector(sel);
export const $$ = (sel, raiz = document) => Array.from(raiz.querySelectorAll(sel));
