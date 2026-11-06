/**
 * Verifica se todo link interno do portal resolve.
 *
 * Nasceu de um 404 real: o menu apontava para /reforma-tributaria/painel/, que
 * não existe (o painel é a raiz do portal). Clique no app passava, mas nova aba
 * e rastreador recebiam 404. Este teste percorre dist/ e confere cada href
 * contra os arquivos publicados.
 *
 * Uso:  node verificar-links.mjs
 */
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const DIST = path.join(path.dirname(new URL(import.meta.url).pathname), "dist");
const BASE = "/reforma-tributaria";
const SITE = "https://www.deeptax.com.br";

/** Páginas publicadas (diretórios com index.html + a raiz). */
async function paginas() {
  const saida = ["index.html"];
  for (const d of await readdir(DIST, { withFileTypes: true })) {
    if (!d.isDirectory() || d.name === "assets") continue;
    try {
      await stat(path.join(DIST, d.name, "index.html"));
      saida.push(path.join(d.name, "index.html"));
    } catch {
      /* diretório sem index — ignora */
    }
  }
  return saida;
}

/** Um caminho é servível se o arquivo existe (e diretório → index.html). */
async function existe(caminho) {
  const rel = caminho.replace(new RegExp(`^${BASE}`), "") || "/";
  const alvo = path.join(DIST, rel.endsWith("/") ? `${rel}index.html` : rel);
  try {
    await stat(alvo);
    return true;
  } catch {
    return false;
  }
}

const arquivos = await paginas();
const vistos = new Map(); // href → [páginas de origem]
let externos = 0;
let ancoras = 0;

for (const arq of arquivos) {
  const html = await readFile(path.join(DIST, arq), "utf8");
  const origem = arq === "index.html" ? `${BASE}/` : `${BASE}/${path.dirname(arq)}/`;
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (href.startsWith("#")) {
      ancoras++;
      continue;
    }
    if (!href.startsWith("/")) {
      if (/^https?:\/\//.test(href)) externos++;
      continue;
    }
    // só interessam links do próprio portal
    if (!href.startsWith(BASE)) continue;
    const limpo = href.split("#")[0].split("?")[0];
    if (!vistos.has(limpo)) vistos.set(limpo, new Set());
    vistos.get(limpo).add(origem);
  }
}

console.log(`  ${arquivos.length} páginas, ${vistos.size} links internos distintos`);
console.log(`  (${externos} links externos e ${ancoras} âncoras ignorados)\n`);

let quebrados = 0;
for (const [href, origens] of [...vistos].sort()) {
  if (await existe(href)) {
    console.log(`  ✓ ${href}`);
  } else {
    quebrados++;
    console.log(`  ✗ ${href}  ← apontado por ${[...origens].join(", ")}`);
  }
}

console.log(
  quebrados
    ? `\n${quebrados} link(s) interno(s) quebrado(s)`
    : `\nTodos os ${vistos.size} links internos resolvem`,
);

/* Referência final: as URLs publicadas precisam bater com o sitemap do site. */
const sitemap = await readFile(
  path.join(DIST, "..", "..", "src", "app", "sitemap.ts"),
  "utf8",
).catch(() => null);
if (sitemap) {
  const noSitemap = [...sitemap.matchAll(/\["([a-z-]*)",\s*[\d.]+\]/g)].map((m) => m[1]);
  const faltando = noSitemap.filter((c) => !vistos.has(`${BASE}/${c}${c ? "/" : ""}`));
  if (faltando.length) {
    console.log(`\n  ⚠ no sitemap mas sem link interno: ${faltando.join(", ")}`);
  } else {
    console.log(`  ✓ ${noSitemap.length} URLs do sitemap têm link interno`);
  }
}

process.exit(quebrados ? 1 : 0);
