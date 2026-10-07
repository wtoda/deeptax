// Verificação automatizada de layout e acessibilidade básica.
// Uso: node scripts/check-layout.mjs [baseUrl]
import { chromium } from "playwright-core";

const BASE = process.argv[2] ?? "http://127.0.0.1:3200";
const EXECUTABLE =
  process.env.CHROME_PATH ??
  "/root/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome";

const routes = [
  "/",
  "/servicos",
  "/servicos/auditoria",
  "/servicos/consultoria",
  "/servicos/servicos-contabeis",
  "/servicos/pericia-contabil",
  "/sobre",
  "/contato",
  "/politica-de-privacidade",
];

const viewports = [
  { label: "mobile-360", width: 360, height: 800 },
  { label: "tablet-768", width: 768, height: 1024 },
  { label: "desktop-1440", width: 1440, height: 900 },
  { label: "wide-1920", width: 1920, height: 1080 },
];

const browser = await chromium.launch({
  executablePath: EXECUTABLE,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const problems = [];
const results = [];

for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    locale: "pt-BR",
  });
  const page = await context.newPage();

  for (const route of routes) {
    const response = await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
    if (response.status() !== 200) {
      problems.push(`${route} [${vp.label}] status ${response.status()}`);
    }

    const report = await page.evaluate(() => {
      const out = { overflowX: 0, offenders: [], missingAlt: 0, emptyLinks: 0, h1: 0, dupIds: [] };

      // Rolagem horizontal indesejada
      out.overflowX = Math.max(
        0,
        document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );

      // Elementos que ultrapassam a largura da viewport
      const vw = document.documentElement.clientWidth;
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && (r.right > vw + 2 || r.left < -2)) {
          const style = getComputedStyle(el);
          // Ignora elementos decorativos posicionados de propósito.
          if (style.position === "absolute" || style.position === "fixed") continue;
          if (el.closest("[aria-hidden='true']")) continue;
          out.offenders.push(
            `${el.tagName.toLowerCase()}.${(el.className || "").toString().slice(0, 45)}`,
          );
        }
      }
      out.offenders = [...new Set(out.offenders)].slice(0, 4);

      // Imagens sem alt
      out.missingAlt = [...document.querySelectorAll("img")].filter(
        (i) => !i.hasAttribute("alt"),
      ).length;

      // Links/botões sem texto acessível
      out.emptyLinks = [...document.querySelectorAll("a, button")].filter((el) => {
        const text = (el.textContent || "").trim();
        return !text && !el.getAttribute("aria-label") && !el.getAttribute("title");
      }).length;

      // Um único h1 por página
      out.h1 = document.querySelectorAll("h1").length;

      // IDs duplicados
      const seen = new Map();
      for (const el of document.querySelectorAll("[id]")) {
        seen.set(el.id, (seen.get(el.id) || 0) + 1);
      }
      out.dupIds = [...seen.entries()].filter(([, n]) => n > 1).map(([id]) => id);

      return out;
    });

    results.push({ route, vp: vp.label, ...report });

    if (report.overflowX > 0) {
      problems.push(
        `${route} [${vp.label}] rolagem horizontal de ${report.overflowX}px — ${report.offenders.join(", ")}`,
      );
    }
    if (report.missingAlt > 0) problems.push(`${route} [${vp.label}] ${report.missingAlt} img sem alt`);
    if (report.emptyLinks > 0)
      problems.push(`${route} [${vp.label}] ${report.emptyLinks} link/botão sem texto acessível`);
    if (report.h1 !== 1) problems.push(`${route} [${vp.label}] ${report.h1} elementos h1`);
    if (report.dupIds.length)
      problems.push(`${route} [${vp.label}] ids duplicados: ${report.dupIds.join(", ")}`);
  }

  await context.close();
}

await browser.close();

console.log("Rota                        Viewport      h1  overflow  imgs-sem-alt  links-vazios");
console.log("-".repeat(84));
for (const r of results) {
  console.log(
    `${r.route.padEnd(27)} ${r.vp.padEnd(13)} ${String(r.h1).padEnd(3)} ${String(r.overflowX).padEnd(9)} ${String(r.missingAlt).padEnd(13)} ${r.emptyLinks}`,
  );
}

console.log("");
if (problems.length) {
  console.log("=== PROBLEMAS ===");
  problems.forEach((p) => console.log("• " + p));
} else {
  console.log("Nenhum problema de layout ou acessibilidade básica encontrado.");
}
