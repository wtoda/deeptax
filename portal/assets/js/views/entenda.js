// views/entenda.js — o modelo explicado: princípios, pilares e regimes.
import { esc, pct } from "../util.js";
import { cabecalho, aviso, cartao, secao, tabela, badge, acordeao } from "../ui.js";
import { PRINCIPIOS, PILARES, TEMAS, CAMPOS_FISCAIS } from "../dados.js";
import { REGIMES, IS_CATEGORIAS, IS_VEDACOES, CENARIOS, cenarioPadrao, aliquotasDoAno } from "../motor.js";

export function render(main) {
  const cen = cenarioPadrao();
  const a33 = aliquotasDoAno(2033);

  main.innerHTML = `
  ${cabecalho(
    "Entender",
    "Como funciona o novo modelo",
    "A reforma substitui cinco tributos sobre o consumo por um IVA dual — IBS e CBS — mais um imposto extrafiscal, o Imposto Seletivo. Aqui está o desenho, sem jargão e com a base legal de cada regra."
  )}

  ${aviso(
    "lei",
    "A troca, em uma frase",
    `<p><strong>ICMS + ISS → IBS</strong> (estadual e municipal) e <strong>PIS + Cofins → CBS</strong> (federal). O <strong>IPI</strong> é reduzido a zero em 2027, exceto na Zona Franca de Manaus. O <strong>Imposto Seletivo</strong> é criado para desestimular o consumo de bens nocivos à saúde e ao meio ambiente.</p>`
  )}

  ${secao(
    "pilares",
    "Os três tributos",
    `<div class="grid g3">
      ${PILARES.map(
        (p) => `
        <article class="card" style="border-top:4px solid ${p.cor}">
          <div class="card-h">
            <div>
              <h3 style="font-size:1.15rem;margin:0">${esc(p.sigla)}</h3>
              <p class="small muted" style="margin:.15rem 0 0">${esc(p.nome)}</p>
            </div>
          </div>
          <p class="small" style="margin:.6rem 0"><span class="chip">${esc(p.esfera)}</span></p>
          <p class="small" style="color:var(--ink-2)">${esc(p.resumo)}</p>
          <p class="small"><strong>Substitui:</strong> ${esc(p.substitui)}</p>
          <ul class="small" style="color:var(--ink-2)">
            ${p.detalhes.map((d) => `<li>${esc(d)}</li>`).join("")}
          </ul>
          <p class="hint" style="margin-bottom:0">${esc(p.lei)}</p>
        </article>`
      ).join("")}
    </div>`
  )}

  ${secao(
    "principios",
    "Os princípios que mudam tudo",
    `<div class="grid g2">
      ${PRINCIPIOS.map(
        (p) => `<div class="card tight">
          <h3 style="font-size:.98rem;margin:0 0 .3rem">${esc(p.titulo)}</h3>
          <p class="small muted" style="margin-bottom:.4rem">${esc(p.texto)}</p>
          <p class="hint" style="margin:0">${esc(p.lei)}</p>
        </div>`
      ).join("")}
    </div>`
  )}

  ${secao(
    "regimes",
    "Regimes diferenciados",
    `<p class="muted small" style="margin-bottom:1rem">Nem tudo é alíquota cheia. A lei prevê percentuais de tributação reduzida segundo a natureza do bem ou serviço. Atenção: <strong>redução de 60%</strong> significa pagar 40% da alíquota — o percentual indicado na lei é o desconto, não a alíquota final.</p>
     ${tabela({
       colunas: ["Regime", "O que paga", "Alcança", "Base legal"],
       linhas: Object.values(REGIMES).map((r) => [
         `<strong>${esc(r.nome)}</strong>`,
         r.fator === 0 ? "Isento / zero" : pct(r.fator, 0),
         esc(r.exemplos),
         `<span class="small">${esc(r.base)}</span>`,
       ]),
     })}`
  )}

  ${secao(
    "seletivo",
    "Imposto Seletivo em detalhe",
    `<div class="grid g2">
      <div>
        <p class="small">O IS é <strong>monofásico</strong>: incide uma única vez na cadeia, sobre o bem, e não gera crédito para o adquirente. É <strong>extrafiscal</strong> — existe para desestimular o consumo, não para arrecadar. O próprio material oficial observa que o sucesso do IS pode ser medido pela <em>queda</em> de arrecadação.</p>
        <p class="small"><strong>Vedações constitucionais:</strong></p>
        <div class="pill-row">${IS_VEDACOES.map((v) => `<span class="chip">${esc(v)}</span>`).join("")}</div>
        <p class="hint">CF, art. 153, § 6º, I; LC 214/2025, arts. 409 a 438.</p>
      </div>
      <div class="table-wrap">
        <table>
          <caption>Categorias do Anexo XVII</caption>
          <thead><tr><th>Categoria</th><th>NCM</th><th>Alíquota</th></tr></thead>
          <tbody>
            ${IS_CATEGORIAS.filter((c) => c.id !== "nenhum")
              .map(
                (c) => `<tr>
                  <td>${esc(c.nome)}</td>
                  <td class="small">${esc(c.ncm)}</td>
                  <td class="num">${c.aliquotaPadrao !== null ? pct(c.aliquotaPadrao, 2) : badge("pendente", "warn")}</td>
                </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
    <p class="hint" style="margin-top:.8rem">Somente a extração mineral tem alíquota definida em lei complementar (0,25% sobre o valor de referência). As demais dependem de lei ordinária, ainda não publicada.</p>`
  )}

  ${secao(
    "temas",
    "Temas que geram dúvida",
    `<div class="grid g2">
      ${TEMAS.map(
        (t) => `<div class="card">
          <h3 style="font-size:.98rem;margin:0 0 .4rem">${esc(t.titulo)}</h3>
          <p class="small" style="color:var(--ink-2)">${esc(t.texto)}</p>
          <p class="small" style="background:var(--gold-soft);padding:.5rem .6rem;border-radius:6px;margin-bottom:.4rem"><strong>Atenção:</strong> ${esc(t.atencao)}</p>
          <p class="hint" style="margin:0">${esc(t.lei)}</p>
        </div>`
      ).join("")}
    </div>`
  )}

  ${secao(
    "campos",
    "Como a operação é classificada",
    `<p class="muted small" style="margin-bottom:1rem">Cada item do documento fiscal precisa de uma classificação correta — é ela que determina alíquota, crédito e obrigação. É aqui que nascem os erros mais caros da transição.</p>
     ${tabela({
       colunas: ["Campo", "O que é", "Para que serve"],
       linhas: CAMPOS_FISCAIS.map((c) => [
         `<strong>${esc(c.campo)}</strong><br><span class="small muted">${esc(c.nome)}</span>`,
         esc(c.o_que),
         esc(c.onde),
       ]),
     })}`
  )}

  ${secao(
    "faq",
    "Perguntas frequentes",
    acordeao([
      {
        p: "Quem paga o IBS e a CBS?",
        r: `<p>Quem realiza a operação com bens e serviços: fabricantes, comerciantes e prestadores de serviços, com crédito do que pagaram nas etapas anteriores. O consumidor final é quem suporta a carga econômica.</p>`,
      },
      {
        p: "O imposto é cobrado no estado onde eu vendo ou onde o cliente está?",
        r: `<p>No <strong>destino</strong>. A tributação no consumo é um dos pilares do modelo e encerra a lógica de origem que gerou a guerra fiscal entre estados.</p>`,
      },
      {
        p: "O ICMS acaba quando?",
        r: `<p>Em <strong>2033</strong>. Entre 2029 e 2032 as alíquotas de ICMS e ISS caem 10 pontos percentuais por ano, enquanto o IBS sobe na mesma proporção.</p>`,
      },
      {
        p: "Posso comprar de quem é do Simples Nacional e ter crédito?",
        r: `<p>Sim, pelo valor destacado e efetivamente pago — desde que o fornecedor informe o IBS/CBS no documento. Se o optante escolher o regime regular (Simples híbrido), o crédito é ampliado.</p>`,
      },
      {
        p: "Exportação paga IBS e CBS?",
        r: `<p>Não. Exportações são imunes, com manutenção do crédito das etapas anteriores — o que preserva a competitividade do produto brasileiro no exterior.</p>`,
      },
      {
        p: "A cesta básica fica com alíquota zero?",
        r: `<p>Sim. A Cesta Básica Nacional de Alimentos tem alíquota zero de IBS e CBS, com a lista no Anexo I da LC 214/2025. Produtos hortícolas, frutas e ovos também têm alíquota zero.</p>`,
      },
      {
        p: "O que é o split payment e quando começa?",
        r: `<p>É o recolhimento do tributo no momento da liquidação financeira: o valor é separado automaticamente e o fornecedor recebe o líquido. A implementação é gradual e ainda não tem data de início divulgada — a lei a trata como modalidade de extinção do débito (art. 27, III).</p>`,
      },
      {
        p: "As alíquotas de 26,5% estão confirmadas?",
        r: `<p>Não. 26,5% foi a <strong>estimativa de 2024</strong>. Em outubro de 2026 o TCU calculou a CBS em <strong>11,3%</strong> para 2027, e o Senado fixa a alíquota por resolução até dezembro/2026 — sem decisão, vale a do TCU em 1º/01/2027. O IBS segue em 17,7% como estimativa. Na prática: CBS ${pct(cen.cbs, 2)} + IBS ${pct(cen.ibs, 2)} = ${pct(cen.cbs + cen.ibs, 2)} no cenário padrão, e ${pct(a33.cbs + a33.ibs, 2)} em 2033.</p>`,
      },
    ])
  )}
  `;
}
