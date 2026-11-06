// views/fontes.js — base legal, fontes e como citar.
import { esc } from "../util.js";
import { cabecalho, aviso, tabela, badge, secao } from "../ui.js";
import { FONTES, NORMAS, META } from "../dados.js";

const CORES_TIPO = {
  Norma: "giro",
  Oficial: "ok",
  Notícia: "warn",
};

export function render(main) {
  main.innerHTML = `
  ${cabecalho(
    "Comunicar",
    "Fontes e base legal",
    "Toda afirmação deste produto tem origem identificável. Aqui está o mapa das normas, o que cada uma disciplina e onde conferir o texto vigente."
  )}

  ${aviso(
    "warn",
    "Antes de usar em peça oficial",
    `<p>Este é um produto de estudo e simulação. Para uso em parecer, peça processual ou material comercial, confira sempre o texto vigente na fonte primária (Planalto, Receita Federal, Comitê Gestor do IBS) e a data da consulta. Base atualizada em <strong>${esc(META.atualizadoEm)}</strong>.</p>`
  )}

  ${secao(
    "normas",
    "Mapa das normas",
    tabela({
      colunas: ["Norma", "Natureza", "O que disciplina"],
      linhas: NORMAS.map((n) => [
        `<strong>${esc(n.norma)}</strong>`,
        badge(n.tipo, n.tipo === "Constitucional" ? "giro" : n.tipo === "Complementar" ? "ok" : "warn"),
        esc(n.assunto),
      ]),
    }) +
      `<p class="hint" style="margin-top:.7rem">Hierarquia: a Constituição (EC 132/2023) cria os tributos e fixa a transição; a lei complementar (LC 214/2025) regulamenta; lei ordinária fixa as alíquotas do Imposto Seletivo; atos infralegais trazem os leiautes e prazos dos documentos fiscais.</p>
       <p class="small" style="margin-top:.6rem"><a href="/reforma-tributaria/legislacao/">Ver o catálogo completo de normas, com filtros por tipo e status →</a></p>`
  )}

  ${secao(
    "fontes",
    "Fontes consultadas",
    `<div class="grid g2">
      ${FONTES.map(
        (f) => `<article class="card tight">
          <div class="card-h">
            <span class="badge ${CORES_TIPO[f.tipo] ?? ""}">${esc(f.tipo)}</span>
          </div>
          <h3 style="font-size:.95rem;margin:.4rem 0 .25rem">${esc(f.titulo)}</h3>
          <p class="small muted" style="margin-bottom:.5rem">${esc(f.desc)}</p>
          <a class="small" href="${esc(f.url)}" target="_blank" rel="noopener">Abrir fonte ↗</a>
        </article>`
      ).join("")}
    </div>`
  )}

  ${secao(
    "como-citar",
    "Como citar este conteúdo",
    `<div class="card">
      <p class="small" style="margin-bottom:.6rem">Se for usar este material em apresentação, relatório ou post:</p>
      <blockquote class="quote" style="margin:0 0 .8rem">
        “Reforma Tributária — Deeptax. Base atualizada em ${esc(META.atualizadoEm)}. Fontes: EC 132/2023, LC 214/2025 e material oficial da Receita Federal do Brasil.”
      </blockquote>
      <p class="small muted" style="margin-bottom:0">Para números simulados, indique sempre o cenário de referência usado (por exemplo: “cenário TCU de outubro/2026, CBS 11,3%”). O número muda quando o Senado fixar a alíquota.</p>
    </div>`
  )}

  ${secao(
    "lacunas",
    "O que não está definido (e não deve ser afirmado como certo)",
    `<div class="grid g2">
      ${[
        ["Alíquota de referência definitiva", "O TCU calculou 11,3468% (11,3%) para a CBS; o Senado fixa por resolução até dezembro/2026 — e, se não fixar, a alíquota do TCU vigora em 1º/01/2027. O IBS segue com estimativa de 17,7%."],
        ["Alíquotas do Imposto Seletivo", "Estrutura definida no Anexo XVII, alíquotas pendentes de lei ordinária. Só a extração mineral tem 0,25%."],
        ["Data de início do split payment", "A lei o define como modalidade de extinção, mas a implementação e o calendário dependem de regulamentação."],
        ["Percentuais do cashback em regulamento", "Os critérios gerais estão na lei; o detalhamento operacional é objeto de ato específico."],
        ["Alíquotas dentro do DAS do Simples", "A forma de recolhimento está definida; os percentuais por anexo dependem de regulamentação."],
        ["Repartição estadual/municipal do IBS pós-2028", "Depende da resolução do Senado que fixar as alíquotas de referência."],
      ]
        .map(
          ([t, d]) => `<div class="card tight">
            <h3 style="font-size:.9rem;margin:0 0 .25rem">${esc(t)}</h3>
            <p class="small muted" style="margin:0">${esc(d)}</p>
          </div>`
        )
        .join("")}
    </div>`
  )}

  ${secao(
    "metodo",
    "Metodologia da calculadora",
    `<div class="card">
      <ul class="small" style="margin:0">
        <li>Alíquotas por ano seguem o ADCT: teste em 2026 (0,1% + 0,9%), CBS de referência reduzida em 0,1 p.p. em 2027-2028, e rampa do IBS de 10% a 100% entre 2029 e 2033.</li>
        <li>Reduções de alíquota aplicam o desconto sobre a referência: 60% de redução resulta em 40% da alíquota; 30% resulta em 70%.</li>
        <li>IBS e CBS são calculados “por fora”; na comparação com o modelo atual, os tributos antigos são calculados “por dentro”, partindo do mesmo valor líquido para o fornecedor.</li>
        <li>O Imposto Seletivo só é calculado a partir de 2027 e apenas quando há alíquota informada (exceto extração mineral, cuja alíquota é legal).</li>
        <li>Valores monetários são arredondados para centavos ao final de cada componente.</li>
      </ul>
    </div>`
  )}
  `;
}
