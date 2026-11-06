// views/legislacao.js — catálogo de normas da reforma + análise de impacto.
import { esc, pct, brl } from "../util.js";
import { cabecalho, aviso, badge, secao, tabela, cartao } from "../ui.js";
import {
  CATALOGO_NORMAS,
  NIVEIS_NORMATIVOS,
  NOTAS_LEGISLACAO,
  IMPACTO_SETORES,
  IMPACTO_POR_NORMA,
  IMPACTO_DIMENSOES,
  META,
} from "../dados.js";
import { compararModelos, cenarioPadrao, CENARIOS } from "../motor.js";

const CORES_NIVEL = { 1: "#0f6f5c", 2: "#2b8a76", 3: "#2b5a8c", 4: "#a8802a" };
const CORES_MAGNITUDE = { estrutural: "danger", alto: "warn", medio: "giro", operacional: "" };
const CORES_SENTIDO = {
  positivo: "ok",
  negativo: "danger",
  misto: "giro",
  compensatório: "ok",
  decisão: "warn",
};

const ESTADO = { nivel: null, status: "todos", q: "" };

function ordenar(lista) {
  return [...lista].sort((a, b) => {
    if (a.nivel !== b.nivel) return a.nivel - b.nivel;
    if (a.status !== b.status) return a.status === "pendente" ? 1 : -1;
    return String(b.data).localeCompare(String(a.data));
  });
}

function filtrar() {
  const q = ESTADO.q.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return ordenar(
    CATALOGO_NORMAS.filter((n) => {
      if (ESTADO.nivel && n.nivel !== ESTADO.nivel) return false;
      if (ESTADO.status !== "todos" && n.status !== ESTADO.status) return false;
      if (!q) return true;
      const alvo = [n.titulo, n.ementa, n.oQue, n.numero, n.tipo, ...(n.tags || [])]
        .join(" ")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return alvo.includes(q);
    })
  );
}

/* ---------------- catálogo ---------------- */

function cartaoNorma(n) {
  const nivel = NIVEIS_NORMATIVOS.find((x) => x.nivel === n.nivel);
  const pendente = n.status === "pendente";
  const imp = IMPACTO_POR_NORMA[n.id];
  return `
  <article class="card" data-norma="${esc(n.id)}" style="border-left:4px solid ${CORES_NIVEL[n.nivel]}">
    <div class="card-h" style="margin-bottom:.5rem">
      <div style="display:flex;gap:.4rem;flex-wrap:wrap;align-items:center">
        ${badge(`${n.tipo} ${n.numero}`, pendente ? "warn" : "ok")}
        <span class="chip">Nível ${n.nivel} · ${esc(nivel.nome)}</span>
        <span class="small muted">${esc(n.dataBR)}</span>
      </div>
      ${pendente ? badge("a publicar", "danger") : ""}
    </div>

    <h3 style="font-size:1.02rem;margin:.2rem 0 .4rem">${esc(n.titulo)}</h3>
    <p class="small" style="color:var(--ink-2);margin-bottom:.5rem">${esc(n.ementa)}</p>
    <p class="small" style="margin-bottom:.6rem">${esc(n.oQue)}</p>

    ${
      imp
        ? `<div class="callout ${imp.magnitude === "estrutural" ? "warn" : ""}" style="margin:.4rem 0 .6rem;padding:.55rem .7rem">
             <span class="t">Impacto · ${esc(imp.magnitude)}</span>
             <p class="small" style="margin:0">${esc(imp.resumo)}</p>
           </div>`
        : ""
    }

    ${
      n.destaques?.length
        ? `<details class="acc" style="box-shadow:none;margin-bottom:.6rem">
             <summary>O que ela estabelece (${n.destaques.length} pontos)</summary>
             <div><ul class="small" style="margin:0">${n.destaques.map((d) => `<li>${esc(d)}</li>`).join("")}</ul></div>
           </details>`
        : ""
    }

    <div style="display:flex;gap:.5rem;flex-wrap:wrap;align-items:center;margin-top:.4rem">
      ${(n.onde || [])
        .map((o) => `<a class="btn btn-ghost btn-sm" href="${esc(o.href)}">${esc(o.rotulo)}</a>`)
        .join("")}
      <a class="small" href="${esc(n.url)}" target="_blank" rel="noopener" style="margin-left:auto">
        Texto oficial ↗
      </a>
    </div>
  </article>`;
}

function atualizarLista(main) {
  const alvo = main.querySelector("#lista-normas");
  const contagem = main.querySelector("#contagem");
  if (!alvo) return;

  const lista = filtrar();
  alvo.innerHTML = lista.length
    ? lista.map(cartaoNorma).join("")
    : `<div class="card"><p class="muted" style="margin:0">Nenhuma norma encontrada com esses filtros.</p></div>`;

  if (contagem) {
    const filtros = [];
    if (ESTADO.nivel) filtros.push(`nível ${ESTADO.nivel}`);
    if (ESTADO.status !== "todos") filtros.push(ESTADO.status === "pendente" ? "a publicar" : "vigentes");
    if (ESTADO.q) filtros.push(`“${ESTADO.q}”`);
    contagem.textContent = `${lista.length} de ${CATALOGO_NORMAS.length} normas${filtros.length ? " · filtros: " + filtros.join(", ") : ""}`;
  }

  main.querySelectorAll("[data-nivel]").forEach((b) => {
    const ativo = Number(b.dataset.nivel) === ESTADO.nivel;
    b.style.background = ativo ? "var(--accent-soft)" : "";
    b.style.outline = ativo ? "2px solid var(--accent)" : "";
  });
}

/* ---------------- análise de impacto ---------------- */

function tabelaSetores() {
  const calculaveis = IMPACTO_SETORES.filter((s) => s.calculavel);
  const naoCalculaveis = IMPACTO_SETORES.filter((s) => !s.calculavel);

  const linhas = calculaveis.map((s) => {
    const c27 = compararModelos({ valorLiquido: 1000, ano: 2027, regime: s.regime, tipo: s.tipo, atual: s.atual });
    const c33 = compararModelos({ valorLiquido: 1000, ano: 2033, regime: s.regime, tipo: s.tipo, atual: s.atual });
    const atual = c33.atual.aliquotas.total;
    const novo = c33.novo.aliquotas.total;
    const delta = novo - atual;
    const seta = delta > 0.0005 ? "▲" : delta < -0.0005 ? "▼" : "＝";
    const cor = delta > 0.0005 ? "var(--danger)" : delta < -0.0005 ? "var(--accent-2)" : "var(--ink-3)";
    return [
      `<strong>${esc(s.nome)}</strong><br><span class="small muted">${esc(s.premissa)}</span>`,
      pct(atual, 2),
      pct(novo, 2),
      `<span style="color:${cor};font-weight:650">${seta} ${delta > 0 ? "+" : ""}${(delta * 100).toFixed(2)} p.p.</span>`,
      pct(c27.novo.aliquotas.total, 2),
    ];
  });

  return `
    ${tabela({
      colunas: ["Setor", "Carga atual (referência)", "Carga 2033 (regime pleno)", "Variação", "Carga 2027"],
      numericas: [1, 2, 3, 4],
      linhas,
      legenda:
        "Premissas declaradas por setor. Não é a carga real de uma empresa específica: ICMS varia por estado, ISS por município, e créditos mudam o resultado.",
    })}
    <div class="grid g2" style="margin-top:1rem">
      ${naoCalculaveis
        .map(
          (s) => `<div class="card tight">
            <div style="display:flex;justify-content:space-between;gap:.5rem;align-items:baseline">
              <h3 style="font-size:.92rem;margin:0">${esc(s.nome)}</h3>
              ${badge("não comparável", "warn")}
            </div>
            <p class="small muted" style="margin:.3rem 0 0"><strong>Regra:</strong> ${esc(s.premissa)}</p>
            <p class="small muted" style="margin:.3rem 0 0">${esc(s.obs)}</p>
          </div>`
        )
        .join("")}
    </div>`;
}

function secaoImpacto() {
  return `
  ${aviso(
    "warn",
    "Como este impacto foi calculado",
    `<p>As comparações usam o <strong>mesmo motor da calculadora</strong> e partem de premissas declaradas de ICMS, ISS e PIS/Cofins por setor. O resultado mostra o efeito da alíquota — não a carga final de uma empresa, que depende de crédito efetivo, benefícios e regime. Onde a lei não permite comparação (regime específico, Simples), o produto informa em vez de estimar.</p>
     <p class="small" style="margin-bottom:0">Cenário de referência: <strong>${esc(cenarioPadrao().nome)}</strong> — CBS ${pct(cenarioPadrao().cbs, 2)} e IBS ${pct(cenarioPadrao().ibs, 2)}.</p>`
  )}

  ${secao(
    "setores",
    "Quem paga mais, quem paga menos",
    `<p class="muted small" style="margin-bottom:.8rem">A alíquota efetiva de 2033 comparada à carga atual de referência de cada setor. A coluna de variação é o que realmente importa: a reforma não aumenta nem reduz carga uniformemente — ela <strong>redistribui</strong>.</p>
     ${aviso(
       "lei",
       "O que a tabela mede — e o que não mede",
       `<p>As colunas mostram a <strong>alíquota sobre a operação</strong>, não o custo final da empresa. Para quem toma crédito integral, a carga relevante é a que incide sobre o <strong>valor agregado</strong>: uma indústria com 40% de margem sofre muito menos que os 29% nominais sugerem. A leitura correta é comparar <em>entre setores</em>, e não tratar a diferença como conta final.</p>`
     )}
     ${tabelaSetores()}`
  )}

  ${secao(
    "dimensoes",
    "O impacto por área de decisão",
    `<div class="grid g2">
      ${IMPACTO_DIMENSOES.map(
        (d) => `<div class="card">
          <div class="card-h">
            <h3 style="font-size:.95rem;margin:0">${esc(d.dimensao)}</h3>
            ${badge(d.sentido, CORES_SENTIDO[d.sentido] ?? "")}
          </div>
          <p class="small muted" style="margin:.2rem 0 .5rem">Quem sente: <strong>${esc(d.quem)}</strong></p>
          <p class="small" style="color:var(--ink-2);margin-bottom:.4rem">${esc(d.efeito)}</p>
          <p class="hint" style="margin:0">${esc(d.base)}</p>
        </div>`
      ).join("")}
    </div>`
  )}

  ${secao(
    "por-norma",
    "O peso de cada norma",
    `<p class="muted small" style="margin-bottom:1rem">Nem toda norma pesa igual. Esta escala mostra onde está a decisão de verdade e onde está apenas a operação do dia a dia.</p>
     ${tabela({
       colunas: ["Norma", "Peso", "O que muda na prática"],
       linhas: CATALOGO_NORMAS.filter((n) => IMPACTO_POR_NORMA[n.id]).map((n) => {
         const imp = IMPACTO_POR_NORMA[n.id];
         return [
           `<strong>${esc(n.tipo)} ${esc(n.numero)}</strong><br><span class="small muted">${esc(n.titulo)}</span>`,
           badge(imp.magnitude, CORES_MAGNITUDE[imp.magnitude] ?? ""),
           esc(imp.resumo),
         ];
       }),
     })}`
  )}

  ${secao(
    "efeito-cadeia",
    "Efeito na cadeia: por que a conta muda sem a alíquota mudar",
    `<div class="grid g2">
      ${cartao(
        "Exemplo numérico",
        `<p class="small">Numa operação de R$ 1.000 no regime geral, o tributo apurado em cadeia é o mesmo em qualquer número de etapas — desde que todos os elos sejam contribuintes e tomem crédito. É isso que a não cumulatividade plena garante, e o que hoje se perde com PIS/Cofins e com benefícios estaduais.</p>
         <p class="small muted" style="margin-bottom:0">Use a aba <a href="/reforma-tributaria/calculadora/">Cadeia econômica</a> da calculadora para ver a comparação com números reais do seu caso.</p>`
      )}
      ${cartao(
        "Onde o impacto aparece primeiro",
        `<ul class="small" style="margin:0">
          <li><strong>2026</strong> — custo de adaptação de sistemas e classificação de itens.</li>
          <li><strong>2027</strong> — fim do PIS/Cofins e CBS cheia: efeito direto no preço de serviços.</li>
          <li><strong>2029-2032</strong> — convivência de dois sistemas: maior custo de conformidade do período.</li>
          <li><strong>2033</strong> — carga final do modelo, sem ICMS nem ISS.</li>
        </ul>`
      )}
    </div>`
  )}`;
}

/* ---------------- render ---------------- */

export function render(main) {
  const total = CATALOGO_NORMAS.length;
  const pendentes = CATALOGO_NORMAS.filter((n) => n.status === "pendente").length;

  main.innerHTML = `
  ${cabecalho(
    "Entender",
    "Legislação e impacto",
    "As normas que sustentam a reforma — da Constituição ao leiaute do documento fiscal — e a análise do impacto que elas produzem, calculada com o mesmo motor da calculadora."
  )}

  <div class="grid g4" style="margin-bottom:1.4rem">
    <div class="stat"><div class="k">Normas catalogadas</div><div class="v">${total}</div><div class="d">4 níveis hierárquicos</div></div>
    <div class="stat accent"><div class="k">Vigentes</div><div class="v">${total - pendentes}</div><div class="d">publicadas e aplicáveis</div></div>
    <div class="stat"><div class="k">A publicar</div><div class="v" style="color:var(--danger)">${pendentes}</div><div class="d">travam os números de 2027</div></div>
    <div class="stat"><div class="k">Setores analisados</div><div class="v">${IMPACTO_SETORES.length}</div><div class="d">premissas declaradas</div></div>
  </div>

  <div class="tabs" id="tabs-leg">
    <button class="ativo" data-aba="catalogo">Catálogo de normas</button>
    <button data-aba="impacto">Análise de impacto</button>
  </div>

  <div class="tab-panel ativo" data-painel="catalogo">
    ${aviso(
      "warn",
      "Como ler esta área",
      `<p>Nenhuma norma aqui foi resumida “de memória”: números, datas e dispositivos vêm da EC 132/2023, da LC 214/2025 e de material oficial da Receita Federal, conferidos em <strong>${esc(META.atualizadoEm)}</strong>. As peças marcadas como <strong>a publicar</strong> ainda não existem — e é por isso que todo número de 2027 em diante é premissa.</p>`
    )}

    ${secao(
      "hierarquia",
      "A pirâmide normativa",
      `<p class="muted small" style="margin-bottom:1rem">O material oficial da Receita descreve a reforma como um organismo: a Constituição é o coração, as leis complementares são as artérias principais, os regulamentos são as veias médias e as notas técnicas são os capilares. Clique em um nível para filtrar.</p>
       <div class="grid g2" id="niveis">
        ${NIVEIS_NORMATIVOS.map((n) => {
          const qtd = CATALOGO_NORMAS.filter((x) => x.nivel === n.nivel).length;
          return `<button type="button" class="card tight" data-nivel="${n.nivel}"
            style="text-align:left;cursor:pointer;font:inherit;border-left:4px solid ${CORES_NIVEL[n.nivel]}">
            <div style="display:flex;justify-content:space-between;align-items:baseline;gap:.5rem">
              <strong style="font-family:var(--serif);font-size:1rem">${esc(n.nome)}</strong>
              <span class="badge">${qtd} norma${qtd === 1 ? "" : "s"}</span>
            </div>
            <p class="small muted" style="margin:.3rem 0 0"><em>${esc(n.analogia)}</em> — ${esc(n.explica)}</p>
            <p class="hint" style="margin:.35rem 0 0">${esc(n.exemplo)}</p>
          </button>`;
        }).join("")}
      </div>`
    )}

    ${secao(
      "catalogo",
      "Catálogo de normas",
      `<div class="card tight" style="margin-bottom:1rem">
        <div style="display:flex;gap:.6rem;flex-wrap:wrap;align-items:center">
          <input type="search" id="busca-norma" placeholder="Buscar por número, tema ou dispositivo… ex.: 214, split, Simples" style="flex:1;min-width:220px">
          <div class="segmented" id="filtro-status">
            <label><input type="radio" name="status" value="todos" checked><span>Todas</span></label>
            <label><input type="radio" name="status" value="vigente"><span>Vigentes</span></label>
            <label><input type="radio" name="status" value="pendente"><span>A publicar</span></label>
          </div>
          <button class="btn btn-ghost btn-sm" type="button" id="limpar-filtros">Limpar</button>
        </div>
        <p class="hint" id="contagem" style="margin:.6rem 0 0"></p>
      </div>
      <div class="grid g2" id="lista-normas"></div>`
    )}

    ${secao(
      "notas",
      "Três coisas que costumam confundir",
      `<div class="grid g3">
        ${NOTAS_LEGISLACAO.map(
          (x) => `<div class="card tight">
            <h3 style="font-size:.92rem;margin:0 0 .3rem">${esc(x.titulo)}</h3>
            <p class="small muted" style="margin:0">${esc(x.texto)}</p>
          </div>`
        ).join("")}
      </div>`
    )}
  </div>

  <div class="tab-panel" data-painel="impacto">
    ${secaoImpacto()}
  </div>
  `;

  atualizarLista(main);
}

export function bind(main) {
  // abas
  main.querySelectorAll("#tabs-leg [data-aba]").forEach((b) =>
    b.addEventListener("click", () => {
      main.querySelectorAll("#tabs-leg [data-aba]").forEach((x) => x.classList.toggle("ativo", x === b));
      main
        .querySelectorAll("[data-painel]")
        .forEach((p) => p.classList.toggle("ativo", p.dataset.painel === b.dataset.aba));
      main.querySelector("#conteudo")?.scrollIntoView?.({ block: "start" });
    })
  );

  main.querySelectorAll("[data-nivel]").forEach((b) =>
    b.addEventListener("click", () => {
      const n = Number(b.dataset.nivel);
      ESTADO.nivel = ESTADO.nivel === n ? null : n;
      atualizarLista(main);
      main.querySelector("#catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" });
    })
  );

  const busca = main.querySelector("#busca-norma");
  busca?.addEventListener("input", () => {
    ESTADO.q = busca.value;
    atualizarLista(main);
  });

  main.querySelectorAll('input[name="status"]').forEach((r) =>
    r.addEventListener("change", () => {
      ESTADO.status = r.value;
      atualizarLista(main);
    })
  );

  main.querySelector("#limpar-filtros")?.addEventListener("click", () => {
    ESTADO.nivel = null;
    ESTADO.status = "todos";
    ESTADO.q = "";
    if (busca) busca.value = "";
    const todos = main.querySelector('input[name="status"][value="todos"]');
    if (todos) todos.checked = true;
    atualizarLista(main);
  });
}
