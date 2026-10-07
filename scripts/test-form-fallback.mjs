// Testa o caminho de falha do formulário: quando a API não pode registrar o
// lead, o visitante precisa receber o handoff para o WhatsApp já preenchido.
import { chromium } from "playwright-core";

const BASE = process.argv[2] ?? "http://127.0.0.1:3201";
const EXECUTABLE =
  process.env.CHROME_PATH ??
  "/root/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome";

const browser = await chromium.launch({
  executablePath: EXECUTABLE,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

const apiStatus = [];
page.on("response", (r) => {
  if (r.url().includes("/api/leads")) apiStatus.push(r.status());
});

await page.goto(BASE, { waitUntil: "networkidle" });

// Preenche o formulário do hero (versão compacta).
await page.fill("#conteudo input[name='name']", "Joana Ribeiro");
await page.fill("#conteudo input[name='company']", "Ribeiro Logística LTDA");
await page.fill("#conteudo input[name='phone']", "(11) 98888-7777");
await page.check("#conteudo input[name='consent']");
await page.click("#conteudo form button[type='submit']");

// Espera o estado de erro aparecer.
await page.waitForSelector("[role='alert']", { timeout: 15000 });

const alerta = (await page.textContent("[role='alert']")) ?? "";
const waHref = await page.getAttribute("[role='alert'] a[href*='wa.me']", "href");
const waTexto = waHref ? decodeURIComponent(waHref.split("?text=")[1] ?? "") : "";

console.log("Status da API recebido:", apiStatus.join(", ") || "(nenhum)");
console.log("\nMensagem exibida ao visitante:\n ", alerta.trim().replace(/\s+/g, " "));

console.log("\nBotão de WhatsApp presente:", waHref ? "SIM ✓" : "NÃO ✗");
if (waHref) {
  console.log("Destino:", waHref.split("?")[0]);
  console.log("Mensagem pré-preenchida:");
  waTexto.split("\n").forEach((l) => console.log("   " + l));
}

const dadosPreservados =
  waTexto.includes("Joana Ribeiro") &&
  waTexto.includes("Ribeiro Logística LTDA") &&
  waTexto.includes("98888-7777");

console.log(
  "\nDados do lead preservados no handoff:",
  dadosPreservados ? "SIM ✓" : "NÃO ✗",
);

await page.screenshot({ path: "/root/Deeptax/.screenshots/form-falha-whatsapp.png", fullPage: false });
await browser.close();
