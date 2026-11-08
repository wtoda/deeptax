/**
 * ============================================================================
 *  BUILD DO PORTAL — pré-renderização para SEO
 * ============================================================================
 *  O app é uma SPA: o conteúdo é montado por JavaScript. Para o Google, uma
 *  SPA com rota por hash é uma página só, e o rastreador vê HTML vazio.
 *
 *  Este script abre cada tela num navegador real, captura o HTML já renderizado
 *  e grava uma página estática por rota, com título, descrição e canonical
 *  próprios. Resultado: 13 URLs distintas, cada uma com conteúdo no HTML.
 *
 *  O app continua funcionando normalmente sobre a página pré-renderizada.
 *
 *  Uso:  node build.mjs
 *  Saída: dist/
 * ========================================================================== */

import { chromium } from "playwright-core";
import { readFile, writeFile, mkdir, cp, rm } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";

const RAIZ = path.dirname(new URL(import.meta.url).pathname);
const DIST = path.join(RAIZ, "dist");
const BASE = "/reforma-tributaria";
const SITE = "https://www.deeptax.com.br";
const PORTA = 4187;
/** Imagem de compartilhamento do portal (1200×630), servida junto com o dist. */
const IMAGEM_SOCIAL = `${SITE}${BASE}/assets/img/og-reforma-tributaria.png`;

const EXECUTAVEL =
  process.env.CHROME_PATH ??
  "/root/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome";

const seo = JSON.parse(await readFile(path.join(RAIZ, "seo.json"), "utf8"));
const seoExtra = JSON.parse(await readFile(path.join(RAIZ, "seo-extra.json"), "utf8"));
delete seoExtra._leiaMe;

const rotas = Object.keys(seo).filter((k) => !k.startsWith("_"));

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".png": "image/png",
  ".webp": "image/webp",
};

/* ------------------------------------------------ servidor local de origem -- */

const servidor = createServer(async (req, res) => {
  const caminho = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let p = caminho.replace(/^\/reforma-tributaria\//, "/");
  if (p === "/" || /^\/[a-z-]+\/?$/.test(p)) p = "/index.html";
  try {
    const dados = await readFile(path.join(RAIZ, p));
    res.writeHead(200, { "Content-Type": TIPOS[path.extname(p)] ?? "application/octet-stream" });
    res.end(dados);
  } catch {
    res.writeHead(404);
    res.end("404");
  }
});

await new Promise((ok) => servidor.listen(PORTA, "127.0.0.1", ok));
console.log(`  servidor de origem em :${PORTA}`);

/* ------------------------------------------------------------- renderização */

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

const navegador = await chromium.launch({
  executablePath: EXECUTAVEL,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const contexto = await navegador.newContext({ viewport: { width: 1440, height: 1200 }, locale: "pt-BR" });
const pagina = await contexto.newPage();

const erros = [];
pagina.on("pageerror", (e) => erros.push(`${e.message}`));

const geradas = [];
const problemas = [];

for (const rota of rotas) {
  const meta = seo[rota];
  const url = `http://127.0.0.1:${PORTA}${BASE}/${rota === "painel" ? "" : rota + "/"}`;

  await pagina.goto(url, { waitUntil: "networkidle" });
  // Dá tempo para os módulos das telas terminarem de montar (imports dinâmicos).
  await pagina.waitForTimeout(900);

  const conteudo = await pagina.evaluate(() => {
    const main = document.querySelector("main");
    return main ? main.innerHTML : "";
  });

  const shell = await readFile(path.join(RAIZ, "index.html"), "utf8");

  // ATENÇÃO: toda substituição que injeta conteúdo da página usa FUNÇÃO, nunca
  // string. O conteúdo contém valores como "R$&nbsp;374,57", e em
  // String.replace um "$&" literal na string de substituição é interpretado
  // como "o match inteiro" — o que corrompia o HTML das tabelas de valores.
  const html = shell
    // remove metadados genéricos do shell
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${meta.titulo} | Deeptax</title>`)
    .replace(
      /<meta name="description"[^>]*>/,
      () => `<meta name="description" content="${meta.descricao}">`,
    )
    .replace(
      /<link rel="canonical"[^>]*>/,
      () => `<link rel="canonical" href="${SITE}${meta.canonico}">`,
    )
    .replace(/<meta property="og:title"[^>]*>/, () => `<meta property="og:title" content="${meta.titulo}">`)
    .replace(
      /<meta property="og:description"[^>]*>/,
      () => `<meta property="og:description" content="${meta.descricao}">`,
    )
    .replace(
      /<meta property="og:url"[^>]*>/,
      () => `<meta property="og:url" content="${SITE}${meta.canonico}">`,
    )
    // Card social: sem imagem, o compartilhamento sai como retângulo vazio.
    .replace(
      /<meta name="twitter:card"[^>]*>/,
      () =>
        `<meta name="twitter:card" content="summary_large_image">` +
        `<meta property="og:image" content="${IMAGEM_SOCIAL}">` +
        `<meta property="og:image:width" content="1200">` +
        `<meta property="og:image:height" content="630">` +
        `<meta property="og:image:alt" content="${escHtml(meta.titulo)}">` +
        `<meta name="twitter:image" content="${IMAGEM_SOCIAL}">`,
    )
    // conteúdo pré-renderizado entra no lugar do <main> vazio
    .replace(
      /<main id="conteudo"([^>]*)>[\s\S]*?<\/main>/,
      (_m, atributos) => `<main id="conteudo"${atributos}>${conteudo}</main>`,
    )
    // bloco de apoio ANTES do rodapé — fora do <main>, porque o app limpa o main
    .replace('<footer class="foot">', () => `${htmlApoio(rota)}<footer class="foot">`)
    .replace(
      "</body>",
      () => `${dadosApoio()}\n${jsonLd(rota, meta)}\n${jsonLdApoio(rota, meta)}\n</body>`,
    );

  const destino = rota === "painel" ? DIST : path.join(DIST, rota);
  await mkdir(destino, { recursive: true });
  await writeFile(path.join(destino, "index.html"), html, "utf8");
  geradas.push({ rota, bytes: html.length });

  // Integridade: a página deve ter exatamente um <main> e um </main>. Se a
  // injeção de conteúdo escapar de novo (padrões "$&" do String.replace), cai aqui.
  const abertos = (html.match(/<main[ >]/g) ?? []).length;
  const fechados = (html.match(/<\/main>/g) ?? []).length;
  if (abertos !== 1 || fechados !== 1) {
    problemas.push(`${rota}: ${abertos} <main> e ${fechados} </main> (esperado 1 e 1)`);
  }
  if (html.includes("R<main")) {
    problemas.push(`${rota}: valor monetário corrompido por "$&" na substituição`);
  }
}

await navegador.close();
servidor.close();

/* ------------------------------------------------------------ assets e SEO */

await cp(path.join(RAIZ, "assets"), path.join(DIST, "assets"), { recursive: true });

console.log("");
for (const g of geradas) {
  console.log(`  ✓ ${g.rota.padEnd(15)} ${String(g.bytes).padStart(7)} bytes`);
}
if (erros.length) {
  console.log(`\n  ⚠ erros de página durante o build: ${[...new Set(erros)].slice(0, 3).join(" | ")}`);
}
if (problemas.length) {
  console.log(`\n  ✗ problemas de integridade:`);
  for (const p of problemas) console.log(`    - ${p}`);
  process.exitCode = 1;
}
console.log(`\n  ${geradas.length} páginas em dist/ (as URLs entram no sitemap do site)`);

/* ----------------------------------------------------- dados estruturados -- */

function jsonLd(rota, meta) {
  const dados = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: meta.titulo,
    description: meta.descricao,
    url: `${SITE}${meta.canonico}`,
    inLanguage: "pt-BR",
    isPartOf: {
      "@type": "WebSite",
      name: "Reforma Tributária — Deeptax",
      url: `${SITE}${BASE}/`,
    },
    publisher: {
      "@type": "AccountingService",
      name: "Deeptax",
      url: SITE,
    },
  };
  return `<script type="application/ld+json">${JSON.stringify(dados)}</script>`;
}

/* ------------------------------------------ conteúdo de apoio (SEO) -- */

function escHtml(s) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]),
  );
}

/**
 * Mesma marcação que app.js monta em htmlApoio(). Precisa ficar idêntica para
 * que a primeira renderização do app não recrie o bloco à toa.
 */
function htmlApoio(rota) {
  const dados = seoExtra[rota];
  if (!dados) return "";

  const paragrafos = (dados.paragrafos ?? []).map((t) => `<p>${escHtml(t)}</p>`).join("");

  const faq = (dados.faq ?? []).length
    ? `<h3>Perguntas frequentes</h3><div class="apoio-faq">${dados.faq
        .map((f) => `<details><summary>${escHtml(f.q)}</summary><p>${escHtml(f.a)}</p></details>`)
        .join("")}</div>`
    : "";

  const rel = (dados.relacionados ?? []).length
    ? `<h3>Continue por aqui</h3><nav class="apoio-rel" aria-label="Páginas relacionadas"><ul>${dados.relacionados
        .map((r) => `<li><a href="${escHtml(r.href)}">${escHtml(r.texto)}</a></li>`)
        .join("")}</ul></nav>`
    : "";

  return `\n<section class="apoio" id="conteudo-apoio"><h2>${escHtml(dados.titulo)}</h2>${paragrafos}${faq}${rel}</section>`;
}

/** Dados que o router usa para trocar o bloco ao navegar sem recarregar. */
function dadosApoio() {
  return `<script type="application/json" id="apoio-dados">${JSON.stringify(seoExtra).replace(
    /</g,
    "\\u003c",
  )}</script>`;
}

/** FAQPage + BreadcrumbList — o que dá chance de rich result nas buscas. */
function jsonLdApoio(rota, meta) {
  const blocos = [];

  const dados = seoExtra[rota];
  if (dados?.faq?.length) {
    blocos.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: dados.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  blocos.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Deeptax", item: `${SITE}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Reforma Tributária",
        item: `${SITE}${BASE}/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: meta.titulo,
        item: `${SITE}${meta.canonico}`,
      },
    ],
  });

  return blocos
    .map((b) => `<script type="application/ld+json">${JSON.stringify(b).replace(/</g, "\\u003c")}</script>`)
    .join("\n");
}
