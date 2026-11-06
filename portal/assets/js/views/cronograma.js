// views/cronograma.js — linha do tempo interativa da transição 2026-2033.
import { esc, pct, brl } from "../util.js";
import { cabecalho, aviso, tabela, badge } from "../ui.js";
import { CRONOGRAMA } from "../dados.js";
import { aliquotasDoAno, ANOS } from "../motor.js";

export function render(main) {
  const anoAtual = new Date().getFullYear();
  const ativoInicial = CRONOGRAMA.some((c) => c.ano === anoAtual) ? anoAtual : 2026;

  main.innerHTML = `
  ${cabecalho(
    "Visão geral",
    "Cronograma da transição",
    "A reforma não entra em vigor de uma vez: ela é implantada em etapas entre 2026 e 2033. Clique em cada ano para ver o que muda, com a base legal correspondente."
  )}

  <div class="card" style="padding-bottom:.8rem">
    <div class="timeline">
      <div class="tl-base"><div class="tl-fill" id="tl-fill"></div></div>
      <div class="tl-marks" id="tl-marks">
        ${ANOS.map((ano) => {
          const c = CRONOGRAMA.find((x) => x.ano === ano);
          const classe = ano < anoAtual ? "passado" : ano === anoAtual ? "ativo" : "futuro";
          return `<button type="button" class="m ${classe}" data-ano="${ano}">
            <span class="ponto"></span>
            <span class="ano">${ano}<small>${ano === ativoInicial ? "atual" : ano < anoAtual ? "vigorou" : "previsto"}</small></span>
          </button>`;
        }).join("")}
      </div>
    </div>

    <div id="ano-conteudo">
      ${CRONOGRAMA.map((c) => {
        const al = aliquotasDoAno(c.ano);
        return `
        <div class="ano-card ${c.ano === ativoInicial ? "ativo" : ""}" data-card="${c.ano}">
          <div class="ano-head">
            <div class="ano-num">${c.ano}</div>
            <div>
              <div class="ano-title">${esc(c.titulo)}</div>
              <div class="ano-sub">${esc(c.fase)} · ${esc(c.lei)}</div>
            </div>
          </div>
          <p>${esc(c.resumo)}</p>

          <div class="grid g4" style="margin:1rem 0">
            <div class="stat tight" style="box-shadow:none">
              <div class="k">CBS</div><div class="v" style="font-size:1.25rem">${pct(al.cbs, 2)}</div>
              <div class="d">${esc(c.cbs)}</div>
            </div>
            <div class="stat tight" style="box-shadow:none">
              <div class="k">IBS</div><div class="v" style="font-size:1.25rem">${pct(al.ibs, 2)}</div>
              <div class="d">${esc(c.ibs)}</div>
            </div>
            <div class="stat tight" style="box-shadow:none">
              <div class="k">ICMS</div><div class="v" style="font-size:1.25rem">${esc(c.icms)}</div>
              <div class="d">tributo substituído</div>
            </div>
            <div class="stat tight" style="box-shadow:none">
              <div class="k">ISS</div><div class="v" style="font-size:1.25rem">${esc(c.iss)}</div>
              <div class="d">tributo substituído</div>
            </div>
          </div>

          <h4 style="margin:.8rem 0 .4rem;font-size:.85rem;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-3)">O que acontece neste ano</h4>
          <ul style="margin-bottom:.8rem">
            ${c.marcos.map((m) => `<li>${esc(m)}</li>`).join("")}
          </ul>
          <p class="small muted" style="margin-bottom:0">Imposto Seletivo: ${esc(c.is)}.</p>
        </div>`;
      }).join("")}
    </div>
  </div>

  <div class="section">
    <div class="section-head"><h2>Comparativo ano a ano</h2></div>
    ${tabela({
      colunas: ["Ano", "CBS", "IBS", "ICMS", "ISS", "Imposto Seletivo", "Fase"],
      numericas: [1, 2, 3, 4],
      linhas: CRONOGRAMA.map((c) => {
        const al = aliquotasDoAno(c.ano);
        return [
          `<strong>${c.ano}</strong>`,
          pct(al.cbs, 3),
          pct(al.ibs, 3),
          esc(c.icms),
          esc(c.iss),
          esc(c.is),
          esc(c.fase),
        ];
      }),
      legenda: "Alíquotas calculadas com o cenário de referência padrão (TCU out/2026 para a CBS; estimativa de 2024 para o IBS).",
    })}
  </div>

  <div class="section">
    <div class="section-head"><h2>Regras que atravessam o período</h2></div>
    <div class="grid g2">
      ${aviso(
        "lei",
        "Sobre as alíquotas de 2027 e 2028",
        `<p>A CBS é fixada pela alíquota de referência <strong>reduzida em 0,1 ponto percentual</strong> nesses dois anos (ADCT, arts. 126 e 127). O IBS fica em 0,1%, dividido em 0,05% estadual e 0,05% municipal.</p>`
      )}
      ${aviso(
        "warn",
        "Sobre o Imposto Seletivo",
        `<p>Entra em vigor em 2027, mas as alíquotas dependem de lei ordinária ainda não publicada. Pela anterioridade nonagesimal, publicada depois de 02/10/2026, a cobrança não pode começar em 1º/01/2027 — o início fica deslocado em 90 dias após a publicação.</p>`
      )}
      ${aviso(
        "info",
        "Sobre os fundos",
        `<p>O <strong>FNDR</strong> começa em R$ 8 bi (2029) e chega a R$ 60 bi/ano a partir de 2043. O <strong>FCBF</strong> compensa benefícios de ICMS entre 2029 e 2032, em curva que vai de R$ 8 bi a R$ 32 bi e volta a R$ 8 bi.</p>`
      )}
      ${aviso(
        "info",
        "Sobre o IPI e a ZFM",
        `<p>O IPI é reduzido a zero em 2027 para a maioria dos produtos. Sobrevive apenas no perímetro da Zona Franca de Manaus, com crédito presumido de CBS de 6% ou 2% conforme a alíquota de IPI do produto.</p>`
      )}
    </div>
  </div>
  `;
}

export function bind(main) {
  const marcas = main.querySelectorAll("[data-ano]");
  const cards = main.querySelectorAll("[data-card]");
  const fill = main.querySelector("#tl-fill");
  const anos = Array.from(marcas).map((m) => Number(m.dataset.ano));

  function mostrar(ano) {
    cards.forEach((c) => c.classList.toggle("ativo", Number(c.dataset.card) === ano));
    marcas.forEach((m) => {
      const a = Number(m.dataset.ano);
      m.classList.toggle("ativo", a === ano);
      m.classList.toggle("passado", a < ano);
      m.classList.toggle("futuro", a > ano);
    });
    const idx = anos.indexOf(ano);
    if (fill && idx >= 0) fill.style.width = `${(idx / (anos.length - 1)) * 100}%`;
  }

  marcas.forEach((m) => m.addEventListener("click", () => mostrar(Number(m.dataset.ano))));

  const inicial = Array.from(cards).find((c) => c.classList.contains("ativo"));
  mostrar(inicial ? Number(inicial.dataset.card) : anos[0]);
}
