// Script auxiliar de verificação visual (não faz parte do site).
// Uso: node scripts/screenshot.mjs [baseUrl]
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";

const BASE = process.argv[2] ?? "http://127.0.0.1:3200";
const EXECUTABLE =
  process.env.CHROME_PATH ??
  "/root/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome";
const OUT = "/root/Deeptax/.screenshots";

const pages = [
  { name: "01-home-hero", path: "/", full: false },
  { name: "02-home-full", path: "/", full: true },
  { name: "03-servicos", path: "/servicos", full: false },
  { name: "04-servico-auditoria", path: "/servicos/auditoria", full: true },
  { name: "05-servico-pericia", path: "/servicos/pericia-contabil", full: true },
  { name: "06-sobre", path: "/sobre", full: false },
  { name: "07-contato", path: "/contato", full: true },
  { name: "08-privacidade", path: "/politica-de-privacidade", full: false },
  { name: "09-404", path: "/pagina-inexistente", full: false },
];

const viewports = [
  { label: "desktop", width: 1440, height: 900 },
  { label: "mobile", width: 390, height: 844 },
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: EXECUTABLE,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const problems = [];

for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    locale: "pt-BR",
  });
  const page = await context.newPage();

  // Qualquer erro de console ou requisição falha é registrado.
  page.on("console", (msg) => {
    if (msg.type() === "error") problems.push(`[console][${vp.label}] ${msg.text()}`);
  });
  page.on("pageerror", (err) => problems.push(`[pageerror][${vp.label}] ${err.message}`));
  page.on("requestfailed", (req) =>
    problems.push(`[requestfailed][${vp.label}] ${req.url()} ${req.failure()?.errorText}`),
  );

  for (const target of pages) {
    // No mobile, só as páginas principais para não gerar arquivo demais.
    if (vp.label === "mobile" && !["01-home-hero", "04-servico-auditoria", "07-contato"].includes(target.name)) {
      continue;
    }

    await page.goto(`${BASE}${target.path}`, { waitUntil: "networkidle", timeout: 30000 });

    // Dispara as animações de scroll para revelar todo o conteúdo.
    if (target.full) {
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.8;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 90));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(600);
    }

    await page.screenshot({
      path: `${OUT}/${target.name}-${vp.label}.png`,
      fullPage: target.full,
    });
  }

  await context.close();
}

await browser.close();

console.log("Screenshots em", OUT);
if (problems.length) {
  console.log("\n=== PROBLEMAS ENCONTRADOS ===");
  [...new Set(problems)].forEach((p) => console.log(p));
} else {
  console.log("\nNenhum erro de console, pageerror ou requisição falha.");
}
