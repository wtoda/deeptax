// views/glossario.js — busca rápida por termos da reforma.
import { esc } from "../util.js";
import { cabecalho, aviso } from "../ui.js";
import { GLOSSARIO } from "../dados.js";

export function render(main) {
  main.innerHTML = `
  ${cabecalho(
    "Entender",
    "Glossário",
    "Os termos que aparecem em toda conversa sobre a reforma — com definição em português claro e a base legal quando existe."
  )}

  <div class="card tight" style="margin-bottom:1.2rem">
    <input type="search" id="busca-gloss" placeholder="Filtrar termos… ex.: crédito, destino, split" aria-label="Filtrar termos do glossário">
  </div>

  <div id="lista-gloss">
    ${GLOSSARIO.map(
      (g) => `
      <dl class="gloss-item" data-termo="${esc((g.termo + " " + g.def).toLowerCase())}">
        <dt>${esc(g.termo)}</dt>
        <dd>${esc(g.def)}${g.lei ? `<br><span class="hint">${esc(g.lei)}</span>` : ""}</dd>
      </dl>`
    ).join("")}
  </div>
  <p class="hint" id="vazio-gloss" hidden>Nenhum termo encontrado.</p>

  <div class="section">
    ${aviso(
      "info",
      "Sobre as definições",
      `<p>Onde a lei traz definição expressa, ela está indicada. Nos demais casos, a definição é uma síntese do funcionamento do tributo segundo a EC 132/2023 e a LC 214/2025. Termos cuja regulamentação ainda está pendente aparecem com a ressalva correspondente.</p>`
    )}
  </div>
  `;
}

export function bind(main) {
  const input = main.querySelector("#busca-gloss");
  const itens = main.querySelectorAll("[data-termo]");
  const vazio = main.querySelector("#vazio-gloss");

  input.addEventListener("input", () => {
    const t = input.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let visiveis = 0;
    itens.forEach((it) => {
      const alvo = it.dataset.termo.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const mostra = alvo.includes(t);
      it.style.display = mostra ? "" : "none";
      if (mostra) visiveis++;
    });
    vazio.hidden = visiveis > 0;
  });
}
