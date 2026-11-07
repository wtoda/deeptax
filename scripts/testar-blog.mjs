/**
 * Teste de ponta a ponta do editor de blog no painel.
 *
 * Sobe contra um servidor local já rodando (next start) e percorre o caminho
 * real de quem escreve: entrar, abrir a aba Blog, criar um artigo, montar o
 * corpo em blocos, salvar e conferir o que foi gravado em content/posts.json.
 *
 * Uso:  BASE=http://127.0.0.1:3210 SENHA=... node scripts/testar-blog.mjs
 */
import { chromium } from "playwright-core";
import { readFile } from "node:fs/promises";

const BASE = process.env.BASE ?? "http://127.0.0.1:3210";
const SENHA = process.env.SENHA ?? "senha-de-teste-123";
const CHROME = "/root/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome";

let falhas = 0;
const ok = (cond, msg) => {
  console.log(`  ${cond ? "✓" : "✗"} ${msg}`);
  if (!cond) falhas++;
};

const navegador = await chromium.launch({
  executablePath: CHROME,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const ctx = await navegador.newContext({ viewport: { width: 1440, height: 1000 }, locale: "pt-BR" });
const pag = await ctx.newPage();

const erros = [];
pag.on("pageerror", (e) => erros.push(e.message));

try {
  await pag.goto(`${BASE}/admin/login`, { waitUntil: "domcontentloaded" });
  // A tela faz uma chamada a /api/admin/sessao antes de mostrar o formulário,
  // então esperamos o campo aparecer em vez de esperar a rede sossegar.
  await pag.waitForSelector('input[type="password"]', { timeout: 20000 });
  await pag.fill('input[type="password"]', SENHA);
  await pag.click('button[type="submit"]');
  await pag.waitForURL("**/admin", { timeout: 20000 });
  ok(true, "login no painel");

  await pag.click('button:has-text("Blog")');
  await pag.waitForTimeout(1200);
  ok(
    (await pag.locator('text=Artigos (').count()) > 0,
    "aba Blog abriu com a lista de artigos",
  );

  const slugTitulo = pag.locator("#post-titulo");
  const slugEndereco = pag.locator("#post-slug");

  // Já existe um post da etapa anterior; começamos um novo do zero.
  await pag.click('button:has-text("+ Novo")');
  await pag.waitForTimeout(400);
  ok(await slugTitulo.isVisible(), "formulário de artigo aberto");

  await slugTitulo.fill("Reforma tributária na prática: teste do editor");
  await slugEndereco.click();
  await slugEndereco.blur();
  await pag.waitForTimeout(300);
  ok(
    (await slugEndereco.inputValue()) === "reforma-tributaria-na-pratica-teste-do-editor",
    `endereço gerado do título (${await slugEndereco.inputValue()})`,
  );

  await pag.fill("#post-resumo", "Resumo curto criado pelo teste automatizado do editor.");
  await pag.fill("#post-tags", "teste, editor");

  // ---- corpo em blocos
  await pag.click('button:has-text("+ Parágrafo")');
  await pag.waitForTimeout(300);
  await pag.fill('textarea[placeholder="Escreva o parágrafo."]', "Primeiro parágrafo do teste.");

  await pag.click('button:has-text("+ Título")');
  await pag.waitForTimeout(300);
  await pag.fill('input[placeholder="Título da seção"]', "Seção criada pelo teste");

  await pag.click('button:has-text("+ Lista")');
  await pag.waitForTimeout(300);
  await pag.fill('input[placeholder="Item 1"]', "Primeiro item");
  await pag.click('button:has-text("+ item")');
  await pag.waitForTimeout(200);

  const blocos = await pag.locator('select[aria-label="Tipo do bloco"]').count();
  ok(blocos === 3, `três blocos no corpo (${blocos})`);

  // ---- salvar
  await pag.click('button:has-text("Salvar")');
  await pag.waitForTimeout(2500);

  const mensagem = await pag.locator("text=Blog salvo").count();
  ok(mensagem > 0, "painel confirmou o salvamento");

  // ---- conferir o arquivo gravado
  const gravado = JSON.parse(await readFile("/root/Deeptax/content/posts.json", "utf8"));
  const novo = gravado.posts.find(
    (p) => p.slug === "reforma-tributaria-na-pratica-teste-do-editor",
  );
  ok(Boolean(novo), "artigo gravado em content/posts.json");
  if (novo) {
    ok(novo.blocos.length === 3, `blocos gravados (${novo.blocos.length})`);
    ok(
      novo.blocos.map((b) => b.tipo).join(",") === "paragrafo,titulo,lista",
      `tipos na ordem (${novo.blocos.map((b) => b.tipo).join(",")})`,
    );
    ok(novo.tags.length === 2, `temas gravados (${novo.tags.join(", ")})`);
    ok(novo.rascunho === false, "artigo nasce publicado (rascunho desmarcado)");
  }

  // ---- marcar como rascunho e salvar de novo
  await pag.click('input[type="checkbox"]');
  await pag.waitForTimeout(200);
  await pag.click('button:has-text("Salvar rascunho")');
  await pag.waitForTimeout(2500);
  const depois = JSON.parse(await readFile("/root/Deeptax/content/posts.json", "utf8"));
  const comoRascunho = depois.posts.find(
    (p) => p.slug === "reforma-tributaria-na-pratica-teste-do-editor",
  );
  ok(comoRascunho?.rascunho === true, "marcar como rascunho grava rascunho=true");
} catch (erro) {
  falhas++;
  console.log(`  ✗ erro no teste: ${erro.message}`);
  await pag.screenshot({ path: "/tmp/blog-editor-falha.png" }).catch(() => {});
}

ok(erros.length === 0, erros.length ? `erros de página: ${erros[0]}` : "nenhum erro de página");

await navegador.close();
console.log(falhas ? `\n${falhas} falha(s)` : "\nTodas as verificações passaram");
process.exit(falhas ? 1 : 0);
