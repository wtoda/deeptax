// views/dere.js — seção própria da DeRE (Declaração de Regimes Específicos).
import { esc } from "../util.js";
import { cabecalho, aviso, secao, tabela, badge, cartao } from "../ui.js";
import { DERE, META } from "../dados.js";

const ROTULO_FORMATO = { PDF: "PDF", Planilha: "XLSX", XSD: "XSD" };
const ROTULO_LINK = { portal: "Portal", manual: "Manual" };

export function render(main) {
  main.innerHTML = `
  ${cabecalho(
    "Operar",
    "DeRE — Declaração de Regimes Específicos",
    DERE.resumo
  )}

  <div class="grid g4" style="margin-bottom:1.4rem">
    <div class="stat accent"><div class="k">O que é</div><div class="v" style="font-size:1.05rem">Documento fiscal eletrônico</div><div class="d">não é só declaração: alimenta o cálculo</div></div>
    <div class="stat"><div class="k">Setores</div><div class="v">${DERE.setores.length}</div><div class="d">financeiro, saúde, prognósticos</div></div>
    <div class="stat"><div class="k">Pacote técnico</div><div class="v" style="font-size:1.25rem">v1.0.0</div><div class="d">publicado em 12/12/2025</div></div>
    <div class="stat"><div class="k">Base legal</div><div class="v" style="font-size:1.25rem">LC 214 + LC 227</div><div class="d">2025 e 2026</div></div>
  </div>

  ${aviso(
    "lei",
    "A ideia em uma frase",
    `<p>${esc(DERE.porque)}</p>`
  )}

  ${secao(
    "papel",
    "Por que a DeRE existe",
    `<div class="grid g2">
      ${cartao(
        "O problema que ela resolve",
        `<p class="small" style="color:var(--ink-2)">${esc(DERE.oQue)}</p>
         <p class="small muted" style="margin-bottom:0">Fonte: ${esc(META.atualizadoEm === "30/10/2026" ? "páginas oficiais da RFB/SPED e do CGIBS" : "páginas oficiais")}.</p>`
      )}
      ${cartao(
        "O que ela viabiliza",
        `<ul class="small" style="margin:0;color:var(--ink-2)">
          <li>a incidência correta sobre a <strong>margem</strong>, quando for o caso;</li>
          <li>a <strong>não cumulatividade</strong> para os adquirentes;</li>
          <li>o <strong>cashback</strong> para a população de baixa renda;</li>
          <li>a <strong>apuração assistida</strong>, com o Fisco calculando a partir dos dados.</li>
        </ul>`
      )}
    </div>`
  )}

  ${secao(
    "setores",
    "Quem é alcançado",
    `<p class="muted small" style="margin-bottom:1rem">Os três regimes específicos citados pela documentação oficial da DeRE.</p>
     ${tabela({
       colunas: ["Setor", "Particularidade da apuração"],
       linhas: DERE.setores.map((s) => [`<strong>${esc(s.nome)}</strong>`, esc(s.nota)]),
     })}
     <p class="hint" style="margin-top:.7rem">Confira no comunicado oficial o alcance por setor antes de concluir que a sua empresa está dispensada.</p>`
  )}

  ${secao(
    "fluxo",
    "Como a informação circula",
    `<div class="grid g3">
      <div class="card tight">
        <h3 style="font-size:.92rem;margin:0 0 .3rem">1. Contribuinte transmite</h3>
        <p class="small muted" style="margin:0">Os eventos são enviados por <strong>Web Service</strong>, com XML validado contra o schema.</p>
      </div>
      <div class="card tight">
        <h3 style="font-size:.92rem;margin:0 0 .3rem">2. Ambiente processa</h3>
        <p class="small muted" style="margin:0">O ambiente da DeRE aplica as <strong>regras de validação</strong> e devolve erros e alertas.</p>
      </div>
      <div class="card tight">
        <h3 style="font-size:.92rem;margin:0 0 .3rem">3. Motor calcula</h3>
        <p class="small muted" style="margin:0">Os dados alimentam o <strong>Motor de Cálculo</strong> e a apuração assistida de IBS e CBS.</p>
      </div>
    </div>
    <p class="small" style="margin-top:.9rem">Para o time de sistemas, a consequência prática: <strong>a DeRE não é um relatório que se entrega no fim do mês</strong> — ela é a fonte do cálculo. Erro no leiaute vira erro de apuração.</p>`
  )}

  ${secao(
    "pacote",
    "O pacote técnico",
    `<p class="muted small" style="margin-bottom:.5rem">${esc(DERE.versao)}</p>
     ${tabela({
       colunas: ["Componente", "O que traz", "Formato"],
       numericas: [],
       linhas: DERE.pacote.map((c) => [
         `<strong>${esc(c.item)}</strong>`,
         esc(c.detalhe),
         badge(ROTULO_FORMATO[c.formato] || c.formato, "giro"),
       ]),
     })}
     <div class="grid g2" style="margin-top:1rem">
       ${cartao(
         "Eventos estruturantes",
         `<ul class="small" style="margin:0;color:var(--ink-2)">
           ${DERE.eventos.map((e) => `<li><strong>${esc(e.nome)}</strong> — ${esc(e.nota)}</li>`).join("")}
         </ul>`
       )}
       ${cartao(
         "Séries de leiaute",
         `<p class="small" style="color:var(--ink-2)">A especificação dos eventos vem nas <strong>séries D-1000 e D-9000</strong> — é ali que está a estrutura do XML que o seu sistema precisa gerar.</p>
          <p class="small muted" style="margin-bottom:0">O <strong>codTrib</strong> do Anexo I é o elo entre o plano de contas societário e a apuração fiscal: sem ele, a margem não fecha.</p>`
       )}
     </div>`
  )}

  ${secao(
    "checklist",
    "Checklist de implementação",
    `<div class="card">
      <ol class="small" style="margin:0;color:var(--ink-2)">
        ${DERE.checklist.map((c) => `<li>${esc(c)}</li>`).join("")}
      </ol>
    </div>`
  )}

  ${secao(
    "links",
    "Documentação oficial",
    `<div class="grid g2">
      ${DERE.links.map(
        (l) => `<a class="card tight" href="${esc(l.url)}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit">
          <div style="display:flex;justify-content:space-between;gap:.5rem;align-items:baseline">
            <strong style="font-size:.92rem">${esc(l.rotulo)}</strong>
            ${badge(ROTULO_LINK[l.tipo] || "Link", "ok")}
          </div>
          <p class="small muted" style="margin:.35rem 0 0">${esc(l.url.replace("https://", "").replace("http://", "").slice(0, 62))}… ↗</p>
        </a>`
      ).join("")}
    </div>
    <div class="grid g1" style="margin-top:1rem">
      ${aviso(
        "warn",
        "Antes de implementar",
        `<ul class="small" style="margin:0">
          ${DERE.ressalvas.map((r) => `<li>${esc(r)}</li>`).join("")}
        </ul>`
      )}
    </div>`
  )}

  ${secao(
    "relacao",
    "Como isso se liga ao resto",
    `<div class="grid g3">
      <a class="card tight" href="/reforma-tributaria/documentos/" style="text-decoration:none;color:inherit">
        <h3 style="font-size:.92rem;margin:0 0 .25rem">Documentos fiscais</h3>
        <p class="small muted" style="margin:0">A DeRE no ecossistema dos demais DF-e, com CST, cClassTrib e split payment.</p>
      </a>
      <a class="card tight" href="/reforma-tributaria/legislacao/" style="text-decoration:none;color:inherit">
        <h3 style="font-size:.92rem;margin:0 0 .25rem">Legislação</h3>
        <p class="small muted" style="margin:0">LC 214/2025 e LC 227/2026 — as normas que sustentam a DeRE.</p>
      </a>
      <a class="card tight" href="/reforma-tributaria/calculadora/" style="text-decoration:none;color:inherit">
        <h3 style="font-size:.92rem;margin:0 0 .25rem">Calculadora</h3>
        <p class="small muted" style="margin:0">Simule a operação e veja a memória de cálculo com base legal.</p>
      </a>
    </div>`
  )}
  `;
}
