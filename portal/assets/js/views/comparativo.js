// views/comparativo.js — modelo atual x novo modelo, lado a lado.
import { esc, brl, pct, num } from "../util.js";
import { cabecalho, aviso, tabela, badge, secao, cartao } from "../ui.js";
import { compararModelos, MODELO_ATUAL, aliquotasDoAno, cenarioPadrao, CENARIOS } from "../motor.js";

export function render(main) {
  const cen = cenarioPadrao();
  const merc = compararModelos({ valorLiquido: 1000, ano: 2033, tipo: "mercadoria" });
  const serv = compararModelos({ valorLiquido: 1000, ano: 2033, tipo: "servico" });

  main.innerHTML = `
  ${cabecalho(
    "Entender",
    "Antes e depois",
    "O que cada tributo substitui, como muda a base de cálculo e o que acontece com o preço final. A comparação mais honesta entre os dois modelos é feita pelo preço que o consumidor paga — não pela alíquota nominal."
  )}

  ${aviso(
    "warn",
    "A armadilha da comparação direta",
    `<p>ICMS, ISS, PIS e Cofins são calculados <strong>“por dentro”</strong>: compõem a própria base. IBS e CBS são calculados <strong>“por fora”</strong>: incidem sobre o valor da operação. Por isso uma alíquota de 28% no novo modelo não é comparável, de imediato, com uma alíquota de 18% de ICMS. A comparação correta parte do mesmo valor líquido para o fornecedor e mede o preço final.</p>`
  )}

  ${secao(
    "substituicoes",
    "Quem substitui quem",
    tabela({
      colunas: ["Tributo hoje", "Esfera", "Substituído por", "Quando"],
      linhas: [
        ["ICMS", "Estadual", "IBS (parcela estadual)", "Rampa 2029-2032; extinto em 2033"],
        ["ISS", "Municipal", "IBS (parcela municipal)", "Rampa 2029-2032; extinto em 2033"],
        ["PIS", "Federal", "CBS", "Extinto em 2027"],
        ["Cofins", "Federal", "CBS", "Extinto em 2027"],
        ["IPI", "Federal", "Reduzido a zero", "2027 (exceto ZFM)"],
        ["—", "Federal", "Imposto Seletivo", "Novo tributo, a partir de 2027"],
      ],
    })
  )}

  ${secao(
    "preco",
    "O efeito no preço final",
    `<p class="muted small" style="margin-bottom:1rem">Simulação com valor líquido de R$ 1.000 para o fornecedor, no regime geral, em 2033.</p>
     <div class="grid g2">
      ${cartao(
        "Mercadoria",
        `${tabela({
          colunas: ["", "Hoje", "Novo modelo"],
          numericas: [1, 2],
          linhas: [
            ["Alíquota total", pct(merc.atual.aliquotas.total, 2), pct(merc.novo.aliquotas.total, 2)],
            ["Carga sobre a operação", brl(merc.atual.carga), brl(merc.novo.carga)],
            ["Preço final", brl(merc.atual.precoFinal), brl(merc.novo.precoFinal)],
          ],
        })}
        <p class="small" style="margin-top:.6rem">Diferença de <strong>${brl(merc.diferenca.preco)}</strong> (${pct(merc.diferenca.percentual, 1)}) no preço final.</p>`
      )}
      ${cartao(
        "Serviço",
        `${tabela({
          colunas: ["", "Hoje", "Novo modelo"],
          numericas: [1, 2],
          linhas: [
            ["Alíquota total", pct(serv.atual.aliquotas.total, 2), pct(serv.novo.aliquotas.total, 2)],
            ["Carga sobre a operação", brl(serv.atual.carga), brl(serv.novo.carga)],
            ["Preço final", brl(serv.atual.precoFinal), brl(serv.novo.precoFinal)],
          ],
        })}
        <p class="small" style="margin-top:.6rem">Diferença de <strong>${brl(serv.diferenca.preco)}</strong> (${pct(serv.diferenca.percentual, 1)}) no preço final.</p>`
      )}
     </div>
     <p class="hint" style="margin-top:.8rem">Premissas do modelo atual: ICMS 18%, ISS 5%, PIS 1,65%, Cofins 7,6% e IPI 0. Cenário novo: ${esc(cen.nome)} — CBS ${pct(cen.cbs, 2)} e IBS ${pct(cen.ibs, 2)}.</p>`
  )}

  ${secao(
    "cadeia",
    "Por que a não cumulatividade importa",
    `<div class="grid g2">
      <div class="card">
        <h3 style="font-size:.98rem">No modelo atual</h3>
        <p class="small muted">O ICMS é não cumulativo, mas PIS e Cofins ainda se acumulam em parte das cadeias, e benefícios estaduais distorcem o crédito. O resultado é que a mesma mercadoria pode chegar ao consumidor com cargas muito diferentes conforme a rota e o regime.</p>
      </div>
      <div class="card">
        <h3 style="font-size:.98rem">No IVA dual</h3>
        <p class="small muted">O crédito é amplo e uniforme: alcança insumos, serviços e bens de capital, com a vedação restrita ao uso e consumo pessoal. A carga deixa de depender do caminho e passa a depender só do valor agregado.</p>
      </div>
     </div>
     <p class="small" style="margin-top:.8rem">Use a aba <a href="/reforma-tributaria/calculadora/">Cadeia econômica</a> na calculadora para ver a comparação com números.</p>`
  )}

  ${secao(
    "basica",
    "O que continua existindo",
    `<div class="grid g3">
      ${[
        ["Contribuições sobre folha e lucro", "IRPJ, CSLL e contribuições previdenciárias não são alterados pela reforma do consumo."],
        ["Impostos patrimoniais e de renda", "IPTU, IPVA, ITBI, ITR, IR e IPI (na ZFM) seguem na estrutura atual."],
        ["Substituição tributária do ICMS", "Segue existindo durante a transição, até a extinção em 2033."],
        ["Incentivos regionais", "Zona Franca de Manaus e áreas de livre comércio mantidas até 2073."],
        ["Simples Nacional", "Preservado, com o IBS/CBS dentro do DAS ou no regime regular (híbrido)."],
        ["Guerra fiscal", "Encerrada: vedação a benefícios fiscais de IBS e CBS e tributação no destino."],
      ]
        .map(
          ([t, d]) => `<div class="card tight">
            <h3 style="font-size:.92rem;margin:0 0 .25rem">${esc(t)}</h3>
            <p class="small muted" style="margin:0">${esc(d)}</p>
          </div>`
        )
        .join("")}
    </div>`
  )}
  `;
}
