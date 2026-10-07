// Testa o caminho de SUCESSO dos dois formulários da home, no navegador real.
// Este é o teste que pega quebra de captura de lead de ponta a ponta.
//
// IMPORTANTE: o endpoint /api/leads limita 5 envios por IP a cada 10 minutos.
// Para rodar este teste, suba o servidor com o limite alto:
//   LEAD_RATE_LIMIT_MAX=1000 npx next start -p 3200
import { chromium } from "playwright-core";

const BASE = process.argv[2] ?? "http://127.0.0.1:3200";
const EXECUTABLE =
  process.env.CHROME_PATH ??
  "/root/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome";

const browser = await chromium.launch({
  executablePath: EXECUTABLE,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

let apiStatus = [];
page.on("response", (r) => {
  if (r.url().includes("/api/leads")) apiStatus.push(r.status());
});

const falhas = [];
const check = (nome, cond, detalhe = "") => {
  console.log(`  ${cond ? "✓" : "✗"} ${nome}${detalhe ? ` — ${detalhe}` : ""}`);
  if (!cond) falhas.push(nome);
};

await page.goto(BASE, { waitUntil: "networkidle" });

/* ------------------------------------------------ 1. formulário do hero --- */
console.log("=== 1. Formulário do hero (compacto: nome, empresa, telefone) ===");
await page.fill("#conteudo input[name='name']", "Joana Ribeiro");
await page.fill("#conteudo input[name='company']", "Ribeiro Logística LTDA");
await page.fill("#conteudo input[name='phone']", "(11) 98888-7777");
await page.check("#conteudo input[name='consent']");

apiStatus = [];
await page.click("#conteudo form button[type='submit']");
await page.waitForTimeout(2500);

check("API respondeu 200", apiStatus.includes(200), `status: ${apiStatus.join(", ") || "nenhum"}`);
if (apiStatus.includes(429)) {
  console.log("  ! limite de taxa atingido — rode com LEAD_RATE_LIMIT_MAX=1000");
}
check("tela de sucesso exibida", (await page.locator("text=Solicitação enviada").count()) > 0);

/* --------------------------------------- 2. formulário completo do rodapé -- */
console.log("\n=== 2. Formulário completo (CTA do fim da página) ===");
await page.reload({ waitUntil: "networkidle" });

const cta = page.locator("#proposta form");
await cta.locator("input[name='name']").fill("Marcos Alves");
await cta.locator("input[name='company']").fill("Alves Comércio ME");
await cta.locator("input[name='email']").fill("marcos@alves.com.br");
await cta.locator("input[name='phone']").fill("(11) 97777-6666");
await cta.locator("select[name='service']").selectOption("Perícia Contábil");
await cta.locator("textarea[name='message']").fill("Preciso de laudo para processo trabalhista.");
await cta.locator("input[name='consent']").check();

apiStatus = [];
await cta.locator("button[type='submit']").click();
await page.waitForTimeout(2500);

check("API respondeu 200", apiStatus.includes(200), `status: ${apiStatus.join(", ") || "nenhum"}`);
check("tela de sucesso exibida", (await page.locator("#proposta >> text=Solicitação enviada").count()) > 0);

/* ------------------------------------------ 3. e-mail inválido é rejeitado -- */
console.log("\n=== 3. Validação: e-mail inválido deve ser barrado antes do envio ===");
await page.reload({ waitUntil: "networkidle" });
const cta2 = page.locator("#proposta form");
await cta2.locator("input[name='name']").fill("Teste Email Ruim");
await cta2.locator("input[name='company']").fill("Empresa Teste");
await cta2.locator("input[name='email']").fill("isso-nao-e-email");
await cta2.locator("input[name='phone']").fill("(11) 96666-5555");
await cta2.locator("input[name='consent']").check();
apiStatus = [];
await cta2.locator("button[type='submit']").click();
await page.waitForTimeout(2000);
check("e-mail inválido barrado no cliente", (await page.locator("text=Informe um e-mail válido").count()) > 0);
check("nenhuma chamada à API", apiStatus.length === 0, `status: ${apiStatus.join(", ") || "nenhum"}`);

await browser.close();

console.log(
  "\n" + (falhas.length === 0 ? "TODOS OS CENÁRIOS PASSARAM ✓" : `FALHAS: ${falhas.join("; ")}`),
);
process.exit(falhas.length === 0 ? 0 : 1);
