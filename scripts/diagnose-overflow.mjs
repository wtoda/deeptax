import { chromium } from "playwright-core";

const BASE = "http://127.0.0.1:3200";
const EXECUTABLE =
  process.env.CHROME_PATH ??
  "/root/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome";
const route = process.argv[2] ?? "/servicos/auditoria";

const browser = await chromium.launch({
  executablePath: EXECUTABLE,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: 360, height: 800 } });
await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });

const info = await page.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  const rows = [];

  const describe = (el) => {
    const cls = (el.getAttribute("class") || "").slice(0, 70);
    return `<${el.tagName.toLowerCase()} class="${cls}">`;
  };

  // Elementos cujo conteúdo é mais largo que a própria caixa (causa raiz)
  for (const el of document.querySelectorAll("body *")) {
    if (el.scrollWidth > el.clientWidth + 1) {
      const style = getComputedStyle(el);
      if (style.position === "absolute" || style.position === "fixed") continue;
      rows.push({
        tipo: "conteúdo-mais-largo",
        el: describe(el),
        clientWidth: el.clientWidth,
        scrollWidth: el.scrollWidth,
        overflowX: style.overflowX,
      });
    }
  }

  // Elementos que ultrapassam a viewport
  const beyond = [];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.right > vw + 2) {
      const style = getComputedStyle(el);
      if (style.position === "absolute" || style.position === "fixed") continue;
      beyond.push({
        el: describe(el),
        left: Math.round(r.left),
        right: Math.round(r.right),
        width: Math.round(r.width),
        texto: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 60),
      });
    }
  }

  // Menor elemento que ainda ultrapassa (o mais próximo da causa)
  beyond.sort((a, b) => a.width - b.width);

  return { vw, scrollWidthDoc: document.documentElement.scrollWidth, rows: rows.slice(0, 12), beyond: beyond.slice(0, 10) };
});

console.log("Rota:", route, "| viewport:", info.vw, "| scrollWidth do documento:", info.scrollWidthDoc);
console.log("\n=== Elementos com conteúdo mais largo que a caixa ===");
info.rows.forEach((r) =>
  console.log(`- ${r.el}\n    client=${r.clientWidth} scroll=${r.scrollWidth} overflowX=${r.overflowX}`),
);
console.log("\n=== Menores elementos que ultrapassam a viewport ===");
info.beyond.forEach((r) =>
  console.log(`- ${r.el}\n    left=${r.left} right=${r.right} width=${r.width}\n    texto="${r.texto}"`),
);

await browser.close();
