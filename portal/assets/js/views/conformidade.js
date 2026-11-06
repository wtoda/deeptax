// views/conformidade.js — checklist de adequação por perfil, com progresso salvo.
import { esc } from "../util.js";
import { cabecalho, aviso, badge, secao } from "../ui.js";
import { PERFIS } from "../dados.js";

const CHAVE = "deeptax-reforma:checklist";

function carregar() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE) || "{}");
  } catch {
    return {};
  }
}
function salvar(estado) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado));
  } catch { /* ignora */ }
}

export function render(main) {
  const estado = carregar();

  main.innerHTML = `
  ${cabecalho(
    "Operar",
    "Plano de adequação",
    "O que fazer, em que ordem e até quando. Marque os itens concluídos — o progresso fica salvo no seu navegador. Os itens estão ordenados por peso: os críticos aparecem primeiro."
  )}

  ${aviso(
    "warn",
    "O prazo mais próximo é 2026",
    `<p>A dispensa de recolhimento do IBS/CBS de teste depende de <strong>cumprir as obrigações acessórias</strong> (ADCT, art. 125, § 4º; LC 214/2025, art. 348, § 1º). Quem trata 2026 como ano de teste de sistema chega em 2027 calibrado; quem deixa para depois vai calibrar sob alíquota cheia, com PIS e Cofins já extintos.</p>`
  )}

  <div class="grid g2">
    ${PERFIS.map((perfil) => {
      const itens = [...perfil.itens].sort((a, b) => b.peso - a.peso);
      const feitos = itens.filter((it) => estado[`${perfil.id}:${it.t}`]).length;
      const pctFeito = Math.round((feitos / itens.length) * 100);
      return `
      <section class="card" data-perfil="${esc(perfil.id)}">
        <div class="card-h">
          <h3 style="margin:0;font-size:1.05rem">${esc(perfil.nome)}</h3>
          <span class="badge ${pctFeito === 100 ? "ok" : ""}">${feitos}/${itens.length} · ${pctFeito}%</span>
        </div>
        <div class="barra" style="margin:.4rem 0 .9rem">
          <i style="width:${pctFeito}%;background:var(--accent)"></i>
        </div>
        <ul style="list-style:none;padding:0;margin:0">
          ${itens
            .map((it) => {
              const id = `${perfil.id}:${it.t}`;
              const marcado = !!estado[id];
              return `<li style="display:flex;gap:.6rem;align-items:flex-start;padding:.45rem 0;border-bottom:1px dashed var(--line-soft)">
                <input type="checkbox" id="c-${esc(id)}" data-item="${esc(id)}" ${marcado ? "checked" : ""} style="margin-top:.25rem;width:auto;flex:0 0 auto">
                <label for="c-${esc(id)}" style="cursor:pointer;font-size:.88rem;${marcado ? "color:var(--ink-3);text-decoration:line-through" : ""}">
                  ${esc(it.t)}
                  <span class="badge ${it.p === "2026" ? "warn" : it.p === "contínuo" ? "" : "giro"}" style="margin-left:.35rem">${esc(it.p)}</span>
                  ${it.peso === 3 ? badge("crítico", "danger") : ""}
                </label>
              </li>`;
            })
            .join("")}
        </ul>
      </section>`;
    }).join("")}
  </div>

  ${secao(
    "riscos",
    "Riscos de quem espera",
    `<div class="grid g3">
      ${[
        ["Perder a dispensa de 2026", "Sem emissão correta e escrituração, o contribuinte recolhe 1% em dinheiro no ano de teste."],
        ["Crédito do cliente", "Classificação errada de item reduz ou veda o crédito de quem compra de você — e isso vira disputa comercial."],
        ["Preço e contrato", "Contratos com cláusula de tributos podem gerar repasse indevido ou prejuízo se a alíquota mudar."],
        ["Caixa com split payment", "O tributo deixa de transitar pelo caixa entre a venda e o recolhimento."],
        ["Estoque de abertura", "Perder o prazo de 31/12/2026 significa perder crédito sobre o estoque existente."],
        ["Multas e retrabalho", "Leiautes mudam ao longo de 2026 e 2027; sem monitoramento, o retrabalho é recorrente."],
      ]
        .map(
          ([t, d]) => `<div class="card tight">
            <h3 style="font-size:.92rem;margin:0 0 .25rem;color:var(--danger)">${esc(t)}</h3>
            <p class="small muted" style="margin:0">${esc(d)}</p>
          </div>`
        )
        .join("")}
    </div>`
  )}
  `;
}

export function bind(main) {
  const caixas = main.querySelectorAll("[data-item]");
  caixas.forEach((c) =>
    c.addEventListener("change", () => {
      const estado = carregar();
      if (c.checked) estado[c.dataset.item] = true;
      else delete estado[c.dataset.item];
      salvar(estado);

      // atualiza contador e barra do perfil
      const perfil = c.closest("[data-perfil]");
      if (!perfil) return;
      const total = perfil.querySelectorAll("[data-item]").length;
      const feitos = perfil.querySelectorAll("[data-item]:checked").length;
      const pctFeito = Math.round((feitos / total) * 100);
      perfil.querySelector(".badge").textContent = `${feitos}/${total} · ${pctFeito}%`;
      perfil.querySelector(".barra i").style.width = `${pctFeito}%`;
      const label = perfil.querySelector(`label[for="${c.id}"]`);
      if (label) {
        label.style.color = c.checked ? "var(--ink-3)" : "";
        label.style.textDecoration = c.checked ? "line-through" : "";
      }
    })
  );
}
