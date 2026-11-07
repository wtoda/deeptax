/**
 * Teste da camada de acesso do painel: login por conta, identidade na sessão,
 * aba "Minha conta" e telas de recuperação.
 *
 * Uso:  BASE=http://127.0.0.1:3210 SENHA=... node scripts/testar-acesso.mjs
 */
import { chromium } from "playwright-core";

const BASE = process.env.BASE ?? "http://127.0.0.1:3210";
const EMAIL = process.env.EMAIL ?? "newton@deeptax.com.br";
const SENHA = process.env.SENHA ?? "Deeptax@2026$";
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
const ctx = await navegador.newContext({ viewport: { width: 1280, height: 900 }, locale: "pt-BR" });
const pag = await ctx.newPage();
const erros = [];
pag.on("pageerror", (e) => erros.push(e.message));

try {
  /* ---- tela de login tem dois campos ---- */
  await pag.goto(`${BASE}/admin/login`, { waitUntil: "domcontentloaded" });
  await pag.waitForSelector("#usuario", { timeout: 20000 });
  ok(await pag.locator("#usuario").isVisible(), "campo de e-mail presente");
  ok(await pag.locator("#senha").isVisible(), "campo de senha presente");
  ok(
    (await pag.locator('a[href="/admin/recuperar"]').count()) > 0,
    "link “Esqueci a senha” presente",
  );

  /* ---- credencial errada não entra ---- */
  await pag.fill("#usuario", EMAIL);
  await pag.fill("#senha", "senha-errada-de-teste");
  await pag.click('button:has-text("Entrar")');
  await pag.waitForTimeout(1800);
  const erroNaTela = await pag.locator("text=E-mail ou senha incorretos").count();
  ok(erroNaTela > 0, "senha errada é recusada com mensagem genérica");
  ok(!pag.url().endsWith("/admin"), "continua fora do painel");

  /* ---- credencial correta entra ---- */
  await pag.fill("#senha", SENHA);
  await pag.click('button:has-text("Entrar")');
  await pag.waitForURL("**/admin", { timeout: 25000 });
  await pag.waitForTimeout(1500);
  ok(true, "login com e-mail e senha");

  /* ---- identidade aparece ---- */
  const textoCabecalho = await pag.locator("body").innerText();
  ok(textoCabecalho.includes(EMAIL), "cabeçalho mostra o e-mail de quem entrou");

  /* ---- aba Minha conta ---- */
  await pag.click('button:has-text("Minha conta")');
  await pag.waitForTimeout(900);
  ok((await pag.locator("#senha-atual").count()) > 0, "aba Minha conta tem troca de senha");
  ok((await pag.locator("text=Alterar senha").count()) > 0, "formulário de alteração presente");

  /* ---- recuperação ---- */
  await pag.goto(`${BASE}/admin/recuperar`, { waitUntil: "domcontentloaded" });
  await pag.waitForSelector("#recuperar-email", { timeout: 20000 });
  await pag.fill("#recuperar-email", EMAIL);
  await pag.click('button:has-text("Enviar link")');
  await pag.waitForTimeout(2000);
  const corpoRecuperar = await pag.locator("body").innerText();
  ok(
    /registrado no servidor|enviamos as instruções/i.test(corpoRecuperar),
    "pedido de recuperação responde sem revelar se a conta existe",
  );

  /* ---- link inválido ---- */
  await pag.goto(`${BASE}/admin/redefinir?token=inventado`, { waitUntil: "domcontentloaded" });
  await pag.waitForTimeout(2000);
  const corpoRedefinir = await pag.locator("body").innerText();
  ok(/inválido|vencido|expirou/i.test(corpoRedefinir), "link inválido é recusado na tela");
} catch (erro) {
  falhas++;
  console.log(`  ✗ erro no teste: ${erro.message}`);
  await pag.screenshot({ path: "/tmp/acesso-falha.png" }).catch(() => {});
}

ok(erros.length === 0, erros.length ? `erros de página: ${erros[0]}` : "nenhum erro de página");

await navegador.close();
console.log(falhas ? `\n${falhas} falha(s)` : "\nTodas as verificações passaram");
process.exit(falhas ? 1 : 0);
