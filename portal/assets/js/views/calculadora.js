// views/calculadora.js — simulador de IBS/CBS/IS com memória de cálculo auditável.
import { brl, pct, num, esc, pt } from "../util.js";
import { cabecalho, aviso, tabela, badge } from "../ui.js";
import {
  CENARIOS,
  REGIMES,
  IS_CATEGORIAS,
  MODELO_ATUAL,
  ANOS,
  calcularOperacao,
  compararModelos,
  simularCadeia,
  aliquotasDoAno,
  cenarioPadrao,
} from "../motor.js";

const CHAVE = "deeptax-reforma:calculadora";

const ESTADO_PADRAO = {
  valor: 10000,
  ano: 2026,
  cenario: cenarioPadrao().id,
  tipo: "mercadoria",
  regime: "geral",
  exportacao: false,
  isCategoria: "nenhum",
  isAliquota: "",
  creditos: 0,
  split: false,
};

function carregarEstado() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE) || "null");
    return salvo ? { ...ESTADO_PADRAO, ...salvo } : { ...ESTADO_PADRAO };
  } catch {
    return { ...ESTADO_PADRAO };
  }
}

const opcoesAno = (atual) =>
  ANOS.map((a) => `<option value="${a}" ${a === Number(atual) ? "selected" : ""}>${a}</option>`).join("");

const opcoesCenario = (atual) =>
  Object.values(CENARIOS)
    .map(
      (c) =>
        `<option value="${c.id}" ${c.id === atual ? "selected" : ""}>${esc(c.curto)} — CBS ${pct(c.cbs, 2)} · IBS ${pct(c.ibs, 2)}</option>`
    )
    .join("");

const opcoesRegime = (atual) =>
  Object.values(REGIMES)
    .map(
      (r) =>
        `<option value="${r.id}" ${r.id === atual ? "selected" : ""}>${esc(r.nome)}${r.reducao && r.reducao < 100 ? ` (−${r.reducao}%)` : ""}</option>`
    )
    .join("");

const opcoesIS = (atual) =>
  IS_CATEGORIAS.map(
    (c) =>
      `<option value="${c.id}" ${c.id === atual ? "selected" : ""}>${esc(c.nome)}${c.aliquotaPadrao !== null && c.id !== "nenhum" ? ` (${pct(c.aliquotaPadrao, 2)})` : c.status === "pendente" ? " — alíquota pendente" : ""}</option>`
  ).join("");

export function render(main) {
  const e = carregarEstado();

  main.innerHTML = `
  ${cabecalho(
    "Operar",
    "Calculadora de IBS, CBS e Imposto Seletivo",
    "Simule a carga de uma operação no novo modelo, veja a memória de cálculo linha a linha — cada uma com sua base legal — e compare com o sistema atual."
  )}

  ${aviso(
    "warn",
    "Como usar com segurança",
    `<p>O resultado depende de três premissas: a <strong>alíquota de referência</strong> (que será fixada por resolução do Senado), o <strong>enquadramento da operação</strong> (regime geral, reduzido ou zero) e o <strong>ano</strong> escolhido. Troque o cenário e o ano para ver o impacto. Nenhum número aqui substitui a análise do caso concreto.</p>`
  )}

  <div class="calc-grid">
    <form class="card" id="form-calc" autocomplete="off">
      <h3 style="margin-bottom:1rem">Dados da operação</h3>

      <div class="field">
        <label for="f-valor">Valor da operação (base de cálculo)</label>
        <input type="number" id="f-valor" min="0" step="0.01" value="${e.valor}" inputmode="decimal">
        <span class="hint">Valor do bem, serviço ou direito, sem os tributos do novo modelo.</span>
      </div>

      <div class="grid" style="grid-template-columns:1fr 1fr;gap:.75rem">
        <div class="field" style="margin-bottom:.5rem">
          <label for="f-ano">Ano de referência</label>
          <select id="f-ano">${opcoesAno(e.ano)}</select>
        </div>
        <div class="field" style="margin-bottom:.5rem">
          <label for="f-creditos">Créditos nas entradas (R$)</label>
          <input type="number" id="f-creditos" min="0" step="0.01" value="${e.creditos}" inputmode="decimal">
        </div>
      </div>

      <div class="field">
        <span class="lbl-sm">Cenário de alíquota de referência</span>
        <select id="f-cenario">${opcoesCenario(e.cenario)}</select>
        <span class="hint" id="hint-cenario"></span>
      </div>

      <div class="field">
        <span class="lbl-sm">Tipo de operação</span>
        <div class="segmented">
          <label><input type="radio" name="tipo" value="mercadoria" ${e.tipo === "mercadoria" ? "checked" : ""}><span>Mercadoria</span></label>
          <label><input type="radio" name="tipo" value="servico" ${e.tipo === "servico" ? "checked" : ""}><span>Serviço</span></label>
        </div>
      </div>

      <div class="field">
        <label for="f-regime">Enquadramento no novo modelo</label>
        <select id="f-regime">${opcoesRegime(e.regime)}</select>
        <span class="hint" id="hint-regime"></span>
      </div>

      <div class="field">
        <label for="f-is">Imposto Seletivo</label>
        <select id="f-is">${opcoesIS(e.isCategoria)}</select>
        <div id="campo-is-aliq" style="margin-top:.5rem;display:none">
          <input type="number" id="f-is-aliq" min="0" step="0.01" placeholder="Alíquota do IS em %" value="${e.isAliquota}" inputmode="decimal">
          <span class="hint">A alíquota do IS será fixada por lei ordinária. Informe a sua premissa em % para simular.</span>
        </div>
        <span class="hint" id="hint-is"></span>
      </div>

      <label class="switch"><input type="checkbox" id="f-exportacao" ${e.exportacao ? "checked" : ""}> Operação de exportação (imune)</label>
      <label class="switch"><input type="checkbox" id="f-split" ${e.split ? "checked" : ""}> Considerar split payment na liquidação</label>

      <div class="pill-row" style="margin-top:1rem">
        <button class="btn" type="submit">Calcular</button>
        <button class="btn btn-ghost" type="button" id="btn-limpar">Restaurar</button>
        <button class="btn btn-ghost" type="button" id="btn-copiar">Copiar resumo</button>
      </div>
    </form>

    <div id="resultado" aria-live="polite"></div>
  </div>

  <div class="section">
    <div class="section-head"><h2>Entenda o resultado</h2></div>
    <div class="grid g3">
      <div class="card tight"><h3 style="font-size:.95rem">Por fora x por dentro</h3><p class="small muted">No novo modelo, IBS e CBS são calculados <strong>sobre</strong> o valor da operação, sem compor a própria base. No modelo atual, ICMS, ISS, PIS e Cofins são calculados “por dentro”, compondo a base. Por isso a comparação é feita pelo preço final ao consumidor.</p></div>
      <div class="card tight"><h3 style="font-size:.95rem">Crédito na entrada</h3><p class="small muted">A não cumulatividade é plena: o crédito das aquisições é apropriado pelo adquirente, inclusive sobre bens de capital. Só o uso e consumo pessoal não gera crédito.</p></div>
      <div class="card tight"><h3 style="font-size:.95rem">Split payment</h3><p class="small muted">Não muda o valor devido: segrega o tributo na liquidação financeira da operação. O que muda é o fluxo de caixa — o fornecedor recebe o líquido.</p></div>
    </div>
  </div>
  `;

  return null;
}

export function bind(main) {
  const form = main.querySelector("#form-calc");
  const saida = main.querySelector("#resultado");
  if (!form || !saida) return;

  const el = (id) => form.querySelector(id);

  function lerEstado() {
    const tipo = form.querySelector('input[name="tipo"]:checked')?.value || "mercadoria";
    const isAliquotaTxt = el("#f-is-aliq")?.value ?? "";
    const st = {
      valor: Number(el("#f-valor").value) || 0,
      ano: Number(el("#f-ano").value) || 2026,
      cenario: el("#f-cenario").value,
      tipo,
      regime: el("#f-regime").value,
      exportacao: el("#f-exportacao").checked,
      isCategoria: el("#f-is").value,
      isAliquota: isAliquotaTxt === "" ? "" : Number(isAliquotaTxt),
      creditos: Number(el("#f-creditos").value) || 0,
      split: el("#f-split").checked,
    };
    try {
      localStorage.setItem(CHAVE, JSON.stringify(st));
    } catch { /* modo privado */ }
    return st;
  }

  function atualizarHints(st) {
    const reg = REGIMES[st.regime] ?? REGIMES.geral;
    main.querySelector("#hint-regime").textContent = reg.descricao;
    const cen = CENARIOS[st.cenario] ?? cenarioPadrao();
    main.querySelector("#hint-cenario").textContent = cen.status;

    const cat = IS_CATEGORIAS.find((c) => c.id === st.isCategoria);
    const campo = main.querySelector("#campo-is-aliq");
    const hint = main.querySelector("#hint-is");
    if (cat && cat.id !== "nenhum") {
      hint.textContent = cat.obs;
      const pendente = cat.aliquotaPadrao === null;
      campo.style.display = pendente ? "block" : "none";
    } else {
      hint.textContent = "";
      campo.style.display = "none";
    }
  }

  function renderResultado(st) {
    const r = calcularOperacao({
      valor: st.valor,
      ano: st.ano,
      cenario: st.cenario,
      regime: st.regime,
      exportacao: st.exportacao,
      isCategoria: st.isCategoria,
      isAliquota: st.isAliquota === "" ? null : st.isAliquota / 100,
      creditos: st.creditos,
      split: st.split,
    });

    const a = r.aliquotas;
    const v = r.valores;
    const comparacao = compararModelos({
      valorLiquido: st.valor,
      ano: st.ano,
      cenario: st.cenario,
      regime: st.regime,
      tipo: st.tipo,
      exportacao: st.exportacao,
    });
    const cadeia = simularCadeia({ valorFinal: st.valor, etapas: 3, ano: st.ano, cenario: st.cenario, regime: st.regime });

    // composição em barra
    const totalBarra = Math.max(v.tributos, 1);
    const seg = [
      { cor: "#0f6f5c", valor: v.cbs, rot: "CBS" },
      { cor: "#2b8c78", valor: v.ibs, rot: "IBS" },
      { cor: "#a8802a", valor: v.is, rot: "IS" },
    ].filter((s) => s.valor > 0);

    saida.innerHTML = `
      <div class="res-card">
        <div class="res-head">
          <div>
            <div class="t">Total a recolher · ${esc(String(a.ano))}</div>
            <div class="v">${brl(v.aRecolher)}</div>
          </div>
          <div style="text-align:right">
            <div class="t">Alíquota efetiva</div>
            <div class="v" style="font-size:1.3rem">${pct(a.total, 3)}</div>
          </div>
        </div>

        <div class="res-body">
          <div class="linha">
            <div class="rot">Base de cálculo</div>
            <div class="val">${brl(v.precoFinal - v.tributos)}</div>
          </div>
          <div class="linha"><div class="rot">CBS <small>${pct(a.cbs, 3)} sobre a base</small></div><div class="val">${brl(v.cbs)}</div></div>
          <div class="linha"><div class="rot">IBS <small>${pct(a.ibs, 3)} sobre a base${a.divisaoConhecida ? ` · ${pct(a.ibsUf, 3)} UF + ${pct(a.ibsMun, 3)} município` : ""}</small></div><div class="val">${brl(v.ibs)}</div></div>
          ${v.is > 0 ? `<div class="linha"><div class="rot">Imposto Seletivo <small>${esc(r.is.categoria.nome)} · ${pct(a.is, 3)}</small></div><div class="val">${brl(v.is)}</div></div>` : ""}
          <div class="linha sub"><div class="rot">Total dos tributos</div><div class="val">${brl(v.tributos)}</div></div>
          ${v.credito > 0 ? `<div class="linha neg"><div class="rot">(−) Créditos nas entradas</div><div class="val">${brl(v.credito)}</div></div>` : ""}
          ${v.saldoCredor > 0 ? `<div class="linha pos"><div class="rot">Saldo credor a transportar</div><div class="val">${brl(v.saldoCredor)}</div></div>` : ""}
          <div class="linha total"><div class="rot">Preço final ao consumidor</div><div class="val">${brl(v.precoFinal)}</div></div>
        </div>

        <div style="padding:0 1.15rem 1.1rem">
          <div class="barra">${seg.map((s) => `<i style="width:${(s.valor / totalBarra) * 100}%;background:${s.cor}"></i>`).join("")}</div>
          <div class="legenda">${seg.map((s) => `<span><b style="background:${s.cor}"></b>${s.rot} ${pct(s.valor / totalBarra, 1)}</span>`).join("")}</div>
        </div>
      </div>

      ${r.is.pendente ? aviso("warn", "Alíquota do Imposto Seletivo pendente", `<p>${esc(r.is.categoria.nome)} está no Anexo XVII da LC 214/2025, mas a alíquota depende de lei ordinária. Informe uma premissa no campo de alíquota para simular.</p>`) : ""}

      <details class="memoria" open>
        <summary>Memória de cálculo (com base legal)</summary>
        <ol>
          ${r.linhas
            .map(
              (l) => `<li>
              <strong>${esc(l.rot)}</strong> — ${brl(l.val)}
              ${l.base ? `<div class="base">Base legal: ${esc(l.base)}</div>` : ""}
              ${l.nota ? `<div class="base">${esc(l.nota)}</div>` : ""}
            </li>`
            )
            .join("")}
        </ol>
      </details>

      <div class="tabs" style="margin-top:1.4rem">
        <button type="button" class="ativo" data-aba="cmp">Comparar com o modelo atual</button>
        <button type="button" data-aba="cad">Cadeia econômica</button>
        <button type="button" data-aba="fases">Fases da transição</button>
      </div>

      <div class="tab-panel ativo" data-painel="cmp">
        <div class="grid g3" style="margin-bottom:1rem">
          <div class="stat"><div class="k">Preço final hoje</div><div class="v">${brl(comparacao.atual.precoFinal)}</div><div class="d">ICMS/ISS + PIS/Cofins, calculados “por dentro”</div></div>
          <div class="stat accent"><div class="k">Preço final no novo modelo</div><div class="v">${brl(comparacao.novo.precoFinal)}</div><div class="d">IBS + CBS, calculados “por fora”</div></div>
          <div class="stat"><div class="k">Diferença</div><div class="v" style="color:${comparacao.diferenca.preco > 0 ? "#a8321f" : "#0f6f5c"}">${comparacao.diferenca.preco > 0 ? "+" : ""}${brl(comparacao.diferenca.preco)}</div><div class="d">${comparacao.diferenca.percentual > 0 ? "+" : ""}${pct(comparacao.diferenca.percentual, 1)} sobre a carga atual</div></div>
        </div>
        <div class="table-wrap" style="margin-top:.2rem">
          <table>
            <thead><tr><th>Componente</th><th class="num">Alíquota</th><th class="num">Base de cálculo</th></tr></thead>
            <tbody>
              <tr><td>ICMS ${st.tipo === "servico" ? badge("não incide") : ""}</td><td class="num">${pct(comparacao.atual.aliquotas.icms, 2)}</td><td class="num">por dentro</td></tr>
              <tr><td>ISS ${st.tipo === "mercadoria" ? badge("não incide") : ""}</td><td class="num">${pct(comparacao.atual.aliquotas.iss, 2)}</td><td class="num">por dentro</td></tr>
              <tr><td>PIS</td><td class="num">${pct(MODELO_ATUAL.pis, 2)}</td><td class="num">por dentro</td></tr>
              <tr><td>Cofins</td><td class="num">${pct(MODELO_ATUAL.cofins, 2)}</td><td class="num">por dentro</td></tr>
              <tr><td><strong>Total atual</strong></td><td class="num"><strong>${pct(comparacao.atual.aliquotas.total, 2)}</strong></td><td class="num">—</td></tr>
              <tr><td>CBS + IBS</td><td class="num">${pct(comparacao.novo.aliquotas.total, 2)}</td><td class="num">por fora</td></tr>
            </tbody>
          </table>
        </div>
        <p class="hint" style="margin-top:.6rem">Alíquotas do modelo atual configuradas como referência de mercado (ICMS 18%, ISS 5%, PIS 1,65%, Cofins 7,6%). A carga real varia por UF, município e atividade.</p>
      </div>

      <div class="tab-panel" data-painel="cad">
        <p class="small muted">Uma cadeia de três etapas partindo do mesmo valor final. No modelo atual, parte da carga se acumula porque PIS e Cofins não geram crédito amplo; no IVA dual a não cumulatividade é plena.</p>
        ${tabela({
          colunas: ["Etapa", "Valor agregado", "Débito IVA", "Crédito", "A pagar (novo)", "A pagar (atual)"],
          numericas: [1, 2, 3, 4, 5],
          linhas: cadeia.novo.passos.map((p, i) => [
            `Etapa ${p.etapa}`,
            brl(p.valor),
            brl(p.debito),
            brl(p.credito),
            brl(p.aPagar),
            brl(cadeia.atual.passos[i].aPagar),
          ]),
          rodape: `<tr><td><strong>Total da cadeia</strong></td><td class="num">—</td><td class="num">—</td><td class="num">—</td><td class="num"><strong>${brl(cadeia.novo.total)}</strong></td><td class="num"><strong>${brl(cadeia.atual.total)}</strong></td></tr>`,
        })}
        ${cadeia.economia > 0
          ? aviso("info", "Efeito da não cumulatividade", `<p>Na simulação, a cadeia paga <strong>${brl(cadeia.economia)} a menos</strong> no novo modelo do que no atual para o mesmo valor final. É o efeito da não cumulatividade plena sobre o investimento e o encadeamento produtivo.</p>`)
          : aviso("warn", "Atenção ao comparativo", `<p>Nesta configuração a cadeia não apresenta economia. Isso pode ocorrer quando o valor agregado se concentra em etapas com pouco crédito — vale revisar as premissas.</p>`)}
      </div>

      <div class="tab-panel" data-painel="fases">
        ${tabela({
          colunas: ["Ano", "Fase", "CBS", "IBS", "Total"],
          numericas: [2, 3, 4],
          linhas: ANOS.map((ano) => {
            const al = aliquotasDoAno(ano, st.cenario);
            const atual = ano === st.ano;
            return [
              atual ? `<strong>${ano}</strong> ${badge("selecionado", "ok")}` : String(ano),
              esc(al.fase),
              pct(al.cbs, 3),
              pct(al.ibs, 3),
              `<strong>${pct(al.total, 3)}</strong>`,
            ];
          }),
        })}
        <p class="hint" style="margin-top:.6rem">Cenário: ${esc((CENARIOS[st.cenario] ?? cenarioPadrao()).nome)}. ${esc((CENARIOS[st.cenario] ?? cenarioPadrao()).status)}.</p>
      </div>
    `;

    // abas
    saida.querySelectorAll("[data-aba]").forEach((b) => {
      b.addEventListener("click", () => {
        saida.querySelectorAll("[data-aba]").forEach((x) => x.classList.toggle("ativo", x === b));
        saida.querySelectorAll("[data-painel]").forEach((p) =>
          p.classList.toggle("ativo", p.dataset.painel === b.dataset.aba)
        );
      });
    });

    // resumo para cópia
    saida.dataset.resumo = [
      `Reforma Tributária — simulação ${a.ano}`,
      `Operação: ${brl(st.valor)} · ${REGIMES[st.regime]?.nome ?? st.regime}`,
      `CBS ${pct(a.cbs, 3)} = ${brl(v.cbs)}`,
      `IBS ${pct(a.ibs, 3)} = ${brl(v.ibs)}`,
      v.is > 0 ? `IS ${pct(a.is, 3)} = ${brl(v.is)}` : null,
      `Total dos tributos: ${brl(v.tributos)}`,
      v.credito > 0 ? `Créditos: ${brl(v.credito)}` : null,
      `A recolher: ${brl(v.aRecolher)}`,
      `Preço final: ${brl(v.precoFinal)}`,
      `Cenário de referência: ${(CENARIOS[st.cenario] ?? cenarioPadrao()).nome}`,
      `Premissas: alíquota de referência sujeita a resolução do Senado; conteúdo informativo.`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  function atualizar() {
    const st = lerEstado();
    atualizarHints(st);
    renderResultado(st);
  }

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    atualizar();
  });
  form.addEventListener("input", (ev) => {
    if (ev.target.id === "f-is") return; // recalculado no change
    atualizar();
  });
  form.addEventListener("change", atualizar);

  main.querySelector("#btn-limpar").addEventListener("click", () => {
    try {
      localStorage.removeItem(CHAVE);
    } catch { /* ignora */ }
    form.querySelector("#f-valor").value = ESTADO_PADRAO.valor;
    form.querySelector("#f-ano").value = ESTADO_PADRAO.ano;
    form.querySelector("#f-cenario").value = ESTADO_PADRAO.cenario;
    form.querySelector("#f-regime").value = ESTADO_PADRAO.regime;
    form.querySelector("#f-creditos").value = ESTADO_PADRAO.creditos;
    form.querySelector("#f-is").value = ESTADO_PADRAO.isCategoria;
    form.querySelector("#f-is-aliq").value = "";
    form.querySelector("#f-exportacao").checked = false;
    form.querySelector("#f-split").checked = false;
    atualizar();
  });

  main.querySelector("#btn-copiar").addEventListener("click", async () => {
    const resumo = saida.dataset.resumo || "";
    try {
      await navigator.clipboard.writeText(resumo);
      const btn = main.querySelector("#btn-copiar");
      const original = btn.textContent;
      btn.textContent = "Copiado!";
      setTimeout(() => (btn.textContent = original), 1800);
    } catch {
      alert(resumo);
    }
  });

  atualizar();
}
