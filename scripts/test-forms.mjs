// Testa a captura de lead nos DOIS formulários da home, no navegador real.
//
// Com o envio via WhatsApp não existe backend: o teste verifica (1) que a
// validação bloqueia dados incompletos e (2) que o envio abre o wa.me com a
// mensagem montada contendo todos os campos digitados.
import { chromium } from "playwright-core";

const BASE = process.argv[2] ?? "http://127.0.0.1:3200";
const EXECUTABLE =
  process.env.CHROME_PATH ??
  "/root/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome";

const browser = await chromium.launch({
  executablePath: EXECUTABLE,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  locale: "pt-BR",
});
const page = await context.newPage();

const falhas = [];
const check = (nome, cond, detalhe = "") => {
  console.log(`  ${cond ? "✓" : "✗"} ${nome}${detalhe ? ` — ${detalhe}` : ""}`);
  if (!cond) falhas.push(nome);
};

/** Captura a URL do wa.me aberta em nova aba. */
async function capturarWhatsapp(acao) {
  const popupPromise = context.waitForEvent("page", { timeout: 15000 }).catch(() => null);
  await acao();
  const popup = await popupPromise;
  if (!popup) return null;
  const url = popup.url();
  await popup.close();
  return url;
}

const decodificar = (url) => {
  const m = url.match(/[?&]text=([^&]*)/);
  if (!m) return "";
  // O WhatsApp redireciona wa.me -> api.whatsapp.com/send e reescreve os
  // espaços como "+" (application/x-www-form-urlencoded). decodeURIComponent
  // sozinho não converte "+" em espaço, por isso a troca vem antes.
  return decodeURIComponent(m[1].replace(/\+/g, " "));
};

/** O telefone pode aparecer no caminho (wa.me/55...) ou na query (phone=55...). */
const destinoCorreto = (url) =>
  url.includes("wa.me/5511932362770") || url.includes("phone=5511932362770");

await page.goto(BASE, { waitUntil: "networkidle" });

/* ------------------------------------------------- 1. validação bloqueia --- */
console.log("=== 1. Validação: dados incompletos não devem abrir o WhatsApp ===");
const nenhumaAba = await capturarWhatsapp(async () => {
  await page.click("#conteudo form button[type='submit']");
  await page.waitForTimeout(1200);
});
check("não abriu o WhatsApp com o formulário vazio", nenhumaAba === null);
check("mostrou o alerta de validação", (await page.locator("[role='alert']").count()) > 0);

/* ------------------------------------------- 2. hero (compacto) envia ----- */
console.log("\n=== 2. Formulário do hero: envio abre o WhatsApp montado ===");
await page.fill("#conteudo input[name='name']", "Joana Ribeiro");
await page.fill("#conteudo input[name='company']", "Ribeiro Logística LTDA");
await page.fill("#conteudo input[name='phone']", "(11) 98888-7777");
await page.check("#conteudo input[name='consent']");

const urlHero = await capturarWhatsapp(async () => {
  await page.click("#conteudo form button[type='submit']");
});
check("abriu uma conversa no WhatsApp", Boolean(urlHero), urlHero ? urlHero.split("?")[0] : "nenhuma");
if (urlHero) {
  const texto = decodificar(urlHero);
  console.log(`    URL final: ${urlHero}`);
  console.log("    mensagem montada:");
  texto.split("\n").forEach((l) => console.log("      " + l));
  check("destino é o WhatsApp do escritório", destinoCorreto(urlHero));
  check("contém o nome", texto.includes("Joana Ribeiro"));
  check("contém a empresa", texto.includes("Ribeiro Logística LTDA"));
  check("contém o telefone", texto.includes("98888-7777"));
}
check("exibiu a tela de confirmação", (await page.locator("text=WhatsApp").count()) > 0);

/* ------------------------------------- 3. formulário completo do rodapé ---- */
console.log("\n=== 3. Formulário completo (CTA do fim da página) ===");
await page.reload({ waitUntil: "networkidle" });
const cta = page.locator("#proposta form");
await cta.locator("input[name='name']").fill("Marcos Alves");
await cta.locator("input[name='company']").fill("Alves Comércio ME");
await cta.locator("input[name='email']").fill("marcos@alves.com.br");
await cta.locator("input[name='phone']").fill("(11) 97777-6666");
await cta.locator("select[name='service']").selectOption("DeepPericia");
await cta.locator("textarea[name='message']").fill("Preciso de laudo para processo trabalhista.");
await cta.locator("input[name='consent']").check();

const urlCta = await capturarWhatsapp(async () => {
  await cta.locator("button[type='submit']").click();
});
check("abriu uma conversa no WhatsApp", Boolean(urlCta));
if (urlCta) {
  console.log(`    URL final: ${urlCta}`);
  const texto = decodificar(urlCta);
  console.log(`    URL final: ${urlHero}`);
  console.log("    mensagem montada:");
  texto.split("\n").forEach((l) => console.log("      " + l));
  check("contém e-mail", texto.includes("marcos@alves.com.br"));
  check("contém o serviço", texto.includes("DeepPericia"));
  check("contém a mensagem", texto.includes("processo trabalhista"));
  check("identifica a origem (rodapé da home)", texto.includes("final da página inicial"));
}

/* ------------------------------------------------- 4. nenhuma chamada API -- */
console.log("\n=== 4. O site não faz chamada de rede ao enviar ===");
const chamadas = [];
page.on("request", (r) => {
  const u = r.url();
  if (u.includes("/api/") && !u.includes("/api/version")) chamadas.push(u);
});
await page.reload({ waitUntil: "networkidle" });
const cta2 = page.locator("#proposta form");
await cta2.locator("input[name='name']").fill("Teste Sem API");
await cta2.locator("input[name='company']").fill("Empresa Teste");
await cta2.locator("input[name='phone']").fill("(11) 96666-5555");
await cta2.locator("input[name='consent']").check();
await capturarWhatsapp(async () => {
  await cta2.locator("button[type='submit']").click();
});
await page.waitForTimeout(1000);
check("nenhuma requisição para API de leads", chamadas.length === 0, chamadas.join(", "));

await browser.close();

console.log(
  "\n" + (falhas.length === 0 ? "TODOS OS CENÁRIOS PASSARAM ✓" : `FALHAS: ${falhas.join("; ")}`),
);
process.exit(falhas.length === 0 ? 0 : 1);
