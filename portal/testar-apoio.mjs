/**
 * Confere o bloco de apoio no portal pré-renderizado:
 *   - carga direta mostra o bloco certo
 *   - navegação pelo app troca o bloco
 *   - rota sem bloco remove o bloco
 *   - nenhum erro de página
 */
import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";

const DIST = "/root/Deeptax/portal/dist";
const PORTA = 4193;
const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json",
};

const servidor = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  p = p.replace(/^\/reforma-tributaria/, "") || "/";
  if (p.endsWith("/") || p === "/") p += "index.html";
  if (!path.extname(p)) p += "/index.html";
  try {
    const dados = await readFile(path.join(DIST, p));
    res.writeHead(200, { "Content-Type": TIPOS[path.extname(p)] ?? "application/octet-stream" });
    res.end(dados);
  } catch {
    res.writeHead(404);
    res.end("404");
  }
});
await new Promise((ok) => servidor.listen(PORTA, "127.0.0.1", ok));

const navegador = await chromium.launch({
  executablePath: "/root/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const ctx = await navegador.newContext({ viewport: { width: 1280, height: 900 } });
const pag = await ctx.newPage();

const erros = [];
pag.on("pageerror", (e) => erros.push(e.message));
pag.on("console", (m) => m.type() === "error" && erros.push(`console: ${m.text()}`));

const tituloApoio = () =>
  pag.$eval("#conteudo-apoio h2", (el) => el.textContent.trim()).catch(() => null);
const existe = () => pag.$("#conteudo-apoio").then((e) => !!e);
const tituloMain = () =>
  pag.$eval("#conteudo h1", (el) => el.textContent.trim()).catch(() => "(sem h1)");

let falhas = 0;
const ok = (cond, msg) => {
  console.log(`  ${cond ? "✓" : "✗"} ${msg}`);
  if (!cond) falhas++;
};

/* 1 — carga direta */
await pag.goto(`http://127.0.0.1:${PORTA}/reforma-tributaria/calculadora/`, { waitUntil: "networkidle" });
await pag.waitForTimeout(500);
ok((await tituloApoio()) === "Como usar a calculadora de IBS e CBS", "carga direta de /calculadora/ mostra o bloco certo");
ok((await pag.$$("#conteudo-apoio")).length === 1, "bloco aparece uma única vez (sem duplicar)");
ok(await pag.$eval("#conteudo-apoio", (e) => e.previousElementSibling.tagName === "MAIN"), "bloco fica logo após o <main>");
ok(
  await pag.$eval("#conteudo-apoio", (e) => e.nextElementSibling.className.includes("foot")),
  "bloco fica antes do rodapé",
);

/* 2 — navegação pelo app */
await pag.click('a[data-rota="comparativo"]');
await pag.waitForTimeout(700);
ok((await tituloApoio()) === "O que muda do modelo atual para o novo", "navegar para /comparativo/ troca o bloco");
ok((await tituloMain()).length > 0, `conteúdo do app renderizou (${await tituloMain()})`);
ok(pag.url().endsWith("/comparativo/"), "URL atualizada para /comparativo/");

/* 3 — rota sem bloco de apoio */
await pag.click('a[data-rota="cronograma"]');
await pag.waitForTimeout(700);
ok(!(await existe()), "rota sem conteúdo de apoio remove o bloco (/cronograma/)");

/* 4 — volta para rota com bloco */
await pag.click('a[data-rota="calculadora"]');
await pag.waitForTimeout(700);
ok((await tituloApoio()) === "Como usar a calculadora de IBS e CBS", "bloco volta ao retornar para /calculadora/");

/* 5 — botão voltar do navegador */
await pag.goBack();
await pag.waitForTimeout(700);
ok(!(await existe()), "botão voltar respeita a rota (sem bloco em /cronograma/)");

/* 6 — FAQ abre e fecha */
await pag.goto(`http://127.0.0.1:${PORTA}/reforma-tributaria/comparativo/`, { waitUntil: "networkidle" });
await pag.waitForTimeout(400);
const fechado = await pag.$eval("#conteudo-apoio details", (d) => d.open);
await pag.click("#conteudo-apoio details summary");
const aberto = await pag.$eval("#conteudo-apoio details", (d) => d.open);
ok(!fechado && aberto, "perguntas frequentes abrem ao clicar");

/* 7 — links relacionados navegam */
const hrefRel = await pag.$eval("#conteudo-apoio .apoio-rel a", (a) => a.getAttribute("href"));
ok(/^\/reforma-tributaria\/[a-z-]+\/$/.test(hrefRel), `link relacionado aponta para rota real (${hrefRel})`);

console.log("");
ok(erros.length === 0, erros.length ? `erros de página: ${erros.slice(0, 3).join(" | ")}` : "nenhum erro de página");

await navegador.close();
servidor.close();
console.log(falhas ? `\n${falhas} verificação(ões) falharam` : "\nTodas as verificações passaram");
process.exit(falhas ? 1 : 0);
