// views/painel.js — visão geral: onde estamos, o que muda agora, o que está em aberto.
import { esc, brl, pct } from "../util.js";
import { stat, aviso, cartao, secao, badge } from "../ui.js";
import { RADAR, META, CRONOGRAMA } from "../dados.js";
import { aliquotasDoAno, situacaoEm, cenarioPadrao, CENARIOS, FASE_POR_ANO } from "../motor.js";

export function render(main) {
  const hoje = new Date();
  const s = situacaoEm(hoje);
  const a = aliquotasDoAno(s.ano);
  const cen = cenarioPadrao();
  const proximo = s.proximoAno ? aliquotasDoAno(s.proximoAno) : null;
  const diasPara2027 = Math.ceil((new Date("2027-01-01T00:00:00") - hoje) / 86400000);

  main.innerHTML = `
  <section class="page-head">
    <div class="eyebrow">Reforma Tributária · Base atualizada em ${esc(META.atualizadoEm)}</div>
    <h1>Onde a reforma está, em um só lugar</h1>
    <p class="lede">
      Você está em <strong>${s.ano}</strong> — ${esc(s.titulo.toLowerCase())}. Este é o painel de situação:
      o que já vigora, o que entra em ${s.proximoAno ?? "seguida"}, o que ainda depende de definição oficial
      e a calculadora para simular cada operação.
    </p>
  </section>

  <div class="grid g4" style="margin-bottom:1.6rem">
    ${stat("CBS hoje", pct(a.cbs, 2), a.obsCbs, true)}
    ${stat("IBS hoje", pct(a.ibs, 2), a.obsIbs)}
    ${stat("Total em vigor", pct(a.total, 2), "Alíquotas de teste em 2026")}
    ${stat("Faltam para 2027", `${diasPara2027} dias`, "CBS cheia, fim de PIS/Cofins e IPI zero")}
  </div>

  ${aviso(
    "lei",
    "Aviso de leitura",
    `<p><strong>2026 é ano de teste.</strong> As alíquotas de 0,1% (IBS) e 0,9% (CBS) têm caráter informativo nos documentos fiscais, o recolhimento é dispensado a quem cumpre as obrigações acessórias e o que for recolhido é compensado com PIS e Cofins. Não é, ainda, a reforma em plena operação.</p>`
  )}

  <div class="section">
    <div class="section-head">
      <h2>Radar regulatório</h2>
      <span class="muted small">O que mudou nos últimos meses</span>
    </div>
    <div class="grid g2">
      ${RADAR.map(
        (r) => `
        <article class="card">
          <div class="card-h">
            <div>
              <span class="badge ${r.status === "atencao" ? "warn" : r.status === "vigente" ? "ok" : "giro"}">${esc(r.tag)}</span>
              <span class="muted small" style="margin-left:.4rem">${esc(r.data)}</span>
            </div>
          </div>
          <h3 style="margin:.45rem 0 .4rem;font-size:1.02rem">${esc(r.titulo)}</h3>
          <p class="small" style="color:var(--ink-2)">${esc(r.texto)}</p>
          <p class="small" style="margin-bottom:.5rem"><strong>Impacto prático:</strong> ${esc(r.impacto)}</p>
          <a class="small" href="${esc(r.fonte)}" target="_blank" rel="noopener">Ver fonte ↗</a>
        </article>`
      ).join("")}
    </div>
  </div>

  <div class="section">
    <div class="section-head">
      <h2>A transição em uma imagem</h2>
      <a class="btn btn-ghost btn-sm" href="/reforma-tributaria/cronograma/">Ver cronograma completo</a>
    </div>
    <div class="card">
      <div class="table-wrap" style="border:0;box-shadow:none">
        <table>
          <thead>
            <tr><th>Ano</th><th class="num">CBS</th><th class="num">IBS</th><th class="num">ICMS</th><th class="num">ISS</th><th>Marco</th></tr>
          </thead>
          <tbody>
            ${CRONOGRAMA.map((c) => {
              const al = aliquotasDoAno(c.ano);
              const atual = c.ano === s.ano;
              return `<tr ${atual ? 'style="background:var(--accent-soft)"' : ""}>
                <td><strong>${c.ano}</strong> ${atual ? badge("você está aqui", "ok") : ""}</td>
                <td class="num">${pct(al.cbs, 2)}</td>
                <td class="num">${pct(al.ibs, 2)}</td>
                <td class="num">${esc(c.icms)}</td>
                <td class="num">${esc(c.iss)}</td>
                <td>${esc(c.titulo)}</td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
      <p class="hint" style="margin-top:.7rem">Cenário de referência em uso: <strong>${esc(cen.nome)}</strong> — CBS ${pct(cen.cbs, 2)} e IBS ${pct(cen.ibs, 2)}. ${esc(cen.status)}.</p>
    </div>
  </div>

  <div class="section">
    <div class="section-head"><h2>Por onde começar</h2></div>
    <div class="grid g3">
      ${[
        {
          t: "Simular uma operação",
          d: "Calcule IBS, CBS e IS com memória de cálculo e base legal por linha.",
          href: "/reforma-tributaria/calculadora/",
          cta: "Abrir calculadora",
        },
        {
          t: "Entender o modelo",
          d: "Os três tributos, os princípios e os regimes diferenciados.",
          href: "/reforma-tributaria/entenda/",
          cta: "Entender",
        },
        {
          t: "Documentos fiscais",
          d: "NF-e, NFS-e, CT-e, DERE, NF-e ABI, split payment e os novos campos.",
          href: "/reforma-tributaria/documentos/",
          cta: "Ver documentos",
        },
        {
          t: "Conformidade",
          d: "Checklist por perfil com prazos, para não perder a dispensa de 2026.",
          href: "/reforma-tributaria/conformidade/",
          cta: "Abrir checklist",
        },
        {
          t: "Divulgar com segurança",
          d: "Frases seguras, frases de risco e o que já está definido — com fonte.",
          href: "/reforma-tributaria/divulgacao/",
          cta: "Kit de divulgação",
        },
        {
          t: "Estudar",
          d: "Quiz com explicações e glossário de 24 termos essenciais.",
          href: "/reforma-tributaria/aprender/",
          cta: "Testar conhecimento",
        },
      ]
        .map(
          (x) => `<a class="card" href="${x.href}" style="text-decoration:none;color:inherit;display:block">
            <h3 style="margin:0 0 .35rem;font-size:1rem">${esc(x.t)}</h3>
            <p class="small muted" style="margin-bottom:.6rem">${esc(x.d)}</p>
            <span class="small" style="color:var(--accent-2);font-weight:650">${esc(x.cta)} →</span>
          </a>`
        )
        .join("")}
    </div>
  </div>

  <div class="section">
    <div class="section-head"><h2>O que ainda não está definido</h2></div>
    <div class="grid g2">
      ${cartao(
        "Alíquotas de referência",
        `<p class="small">O TCU calculou <strong>CBS de 11,3%</strong> para 2027 e encaminhou ao Senado, que fixa a alíquota por resolução até dezembro/2026 — e, se não deliberar, a alíquota do TCU vale mesmo assim em 1º/01/2027. O IBS segue com a estimativa de 17,7%. Até lá, todo número de 2027 em diante é premissa — e a calculadora mostra isso.</p>
         <p class="small muted" style="margin-bottom:0">Impacto: define a carga final do modelo.</p>`
      )}
      ${cartao(
        "Alíquotas do Imposto Seletivo",
        `<p class="small">A estrutura está pronta (Anexo XVII da LC 214/2025), mas as alíquotas dependem de lei ordinária e estão pendentes. Só a extração mineral tem alíquota definida: <strong>0,25%</strong> sobre o valor de referência.</p>
         <p class="small muted" style="margin-bottom:0">Impacto: cigarro, bebida, veículo e aeronave ainda sem preço tributário final.</p>`
      )}
    </div>
  </div>
  `;
}
