/**
 * Teste de ponta a ponta do editor de blog.
 *
 * Percorre o caminho real de quem escreve: entrar, abrir a aba Blog, criar um
 * artigo, montar o corpo em blocos, salvar e conferir o que foi gravado.
 *
 * O artigo é criado como RASCUNHO e apagado no fim: mesmo rodando contra
 * produção, nada aparece no site público.
 *
 * Uso:  BASE=https://www.deeptax.com.br EMAIL=... SENHA=... node scripts/testar-blog.mjs
 */
import { chromium } from "playwright-core";

const BASE = process.env.BASE ?? "http://127.0.0.1:3210";
const EMAIL = process.env.EMAIL ?? "newton@deeptax.com.br";
const SENHA = process.env.SENHA ?? "deeptax-teste";
const CHROME = "/root/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome";
const SLUG = "rascunho-de-teste-automatizado";

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

/** Lê a lista de posts usando a sessão do próprio navegador. */
const listarPosts = () =>
  pag.evaluate(async () => {
    const r = await fetch("/api/admin/posts", { cache: "no-store" });
    return (await r.json()).posts ?? [];
  });

let criado = false;
let slugDoTeste = SLUG;

try {
  /* ---- login ---- */
  await pag.goto(`${BASE}/admin/login`, { waitUntil: "domcontentloaded" });
  await pag.waitForSelector("#usuario", { timeout: 20000 });
  await pag.fill("#usuario", EMAIL);
  await pag.fill("#senha", SENHA);
  await pag.click('button[type="submit"]');
  await pag.waitForURL("**/admin", { timeout: 25000 });
  ok(true, "login no painel");

  await pag.click('button:has-text("Blog")');
  await pag.waitForTimeout(1200);
  ok((await pag.locator("text=Artigos (").count()) > 0, "aba Blog abriu com a lista de artigos");

  /* ---- artigo novo, como rascunho ---- */
  await pag.click('button:has-text("+ Novo")');
  await pag.waitForTimeout(500);
  ok(await pag.locator("#post-titulo").isVisible(), "formulário de artigo aberto");

  await pag.fill("#post-titulo", "Rascunho de teste automatizado");
  await pag.locator("#post-slug").click();
  await pag.locator("#post-slug").blur();
  await pag.waitForTimeout(300);
  const slugGerado = await pag.locator("#post-slug").inputValue();
  if (slugGerado) slugDoTeste = slugGerado;
  ok(slugGerado.length > 0, `endereço gerado do título (${slugGerado})`);

  await pag.fill("#post-resumo", "Rascunho criado por teste automatizado. Pode ser apagado.");
  await pag.fill("#post-tags", "teste");

  // Marca como rascunho ANTES de salvar: nada vai para o site público.
  await pag.locator('input[type="checkbox"]').first().check();
  await pag.waitForTimeout(200);

  /* ---- corpo em blocos ---- */
  await pag.click('button:has-text("+ Parágrafo")');
  await pag.waitForTimeout(300);
  await pag.fill('textarea[placeholder="Escreva o parágrafo."]', "Parágrafo do teste.");

  await pag.click('button:has-text("+ Título")');
  await pag.waitForTimeout(300);
  await pag.fill('input[placeholder="Título da seção"]', "Seção do teste");

  await pag.click('button:has-text("+ Lista")');
  await pag.waitForTimeout(300);
  await pag.fill('input[placeholder="Item 1"]', "Primeiro item");

  const blocos = await pag.locator('select[aria-label="Tipo do bloco"]').count();
  ok(blocos === 3, `três blocos no corpo (${blocos})`);

  /* ---- salvar ---- */
  await pag.click('button:has-text("Salvar rascunho")');
  await pag.waitForTimeout(2500);
  ok((await pag.locator("text=Blog salvo").count()) > 0, "painel confirmou o salvamento");
  criado = true;

  /* ---- conferir o que ficou gravado ---- */
  const posts = await listarPosts();
  const novo = posts.find((p) => p.slug === slugGerado);
  ok(Boolean(novo), "artigo gravado e devolvido pela API");
  if (novo) {
    ok(novo.blocos.length === 3, `blocos gravados (${novo.blocos.length})`);
    ok(
      novo.blocos.map((b) => b.tipo).join(",") === "paragrafo,titulo,lista",
      `tipos na ordem (${novo.blocos.map((b) => b.tipo).join(",")})`,
    );
    ok(novo.rascunho === true, "nasceu como rascunho, fora do site público");
  }

  /* ---- o rascunho não aparece no site ---- */
  const r = await pag.request.get(`${BASE}/blog/${slugGerado}`);
  ok(r.status() === 404, `rascunho responde 404 no site (${r.status()})`);
} catch (erro) {
  falhas++;
  console.log(`  ✗ erro no teste: ${erro.message.split("\n")[0]}`);
  await pag.screenshot({ path: "/tmp/blog-editor-falha.png" }).catch(() => {});
} finally {
  /* ---- limpeza: apaga o rascunho criado, para não deixar lixo ---- */
  if (criado) {
    try {
      const restantes = (await listarPosts()).filter((p) => p.slug !== slugDoTeste);
      await pag.evaluate(async (lista) => {
        await fetch("/api/admin/posts", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ posts: lista, observacao: "limpeza de teste automatizado" }),
        });
      }, restantes);
      const sobrou = (await listarPosts()).some((p) => p.slug === slugDoTeste);
      ok(!sobrou, "rascunho de teste removido");
    } catch {
      console.log("  ⚠ não consegui limpar o rascunho de teste");
    }
  }
}

ok(erros.length === 0, erros.length ? `erros de página: ${erros[0]}` : "nenhum erro de página");

await navegador.close();
console.log(falhas ? `\n${falhas} falha(s)` : "\nTodas as verificações passaram");
process.exit(falhas ? 1 : 0);
