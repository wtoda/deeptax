// views/aprender.js — quiz com correção e explicação.
import { esc } from "../util.js";
import { cabecalho, aviso } from "../ui.js";
import { QUIZ } from "../dados.js";

export function render(main) {
  main.innerHTML = `
  ${cabecalho(
    "Entender",
    "Aprender",
    "Oito perguntas para testar o que você já domina sobre a reforma. Cada resposta vem com explicação e base legal — é assim que se ganha segurança para divulgar."
  )}

  ${aviso(
    "info",
    "Como funciona",
    `<p>Responda todas as perguntas e clique em <strong>Corrigir</strong>. O resultado mostra quantas você acertou e o porquê de cada alternativa.</p>`
  )}

  <form id="quiz-form">
    ${QUIZ.map(
      (q, i) => `
      <div class="card" style="margin-bottom:1rem" data-q="${i}">
        <p class="small muted" style="margin:0 0 .2rem">Pergunta ${i + 1} de ${QUIZ.length}</p>
        <h3 style="font-size:1rem;margin:0 0 .7rem">${esc(q.p)}</h3>
        <div style="display:flex;flex-direction:column;gap:.35rem">
          ${q.a
            .map(
              (alt, j) => `
            <label class="switch" style="margin:0;padding:.35rem .1rem;align-items:flex-start">
              <input type="radio" name="q${i}" value="${j}" style="width:auto;margin-top:.3rem">
              <span>${esc(alt)}</span>
            </label>`
            )
            .join("")}
        </div>
        <div class="callout" data-exp="${i}" hidden style="margin-top:.7rem"></div>
      </div>`
    ).join("")}

    <div class="pill-row">
      <button class="btn" type="submit">Corrigir</button>
      <button class="btn btn-ghost" type="button" id="quiz-refazer">Refazer</button>
    </div>
    <div id="quiz-resultado" style="margin-top:1rem"></div>
  </form>

  <div class="section">
    ${aviso(
      "warn",
      "Sugestão de rotina de estudo",
      `<p>1) Leia o painel de situação (5 min). 2) Percorra o cronograma clicando em 2026 e 2027 (10 min). 3) Rode uma simulação na calculadora com o seu produto (10 min). 4) Faça o checklist do seu perfil (15 min). Repita a cada mudança normativa relevante.</p>`
    )}
  </div>
  `;
}

export function bind(main) {
  const form = main.querySelector("#quiz-form");
  const resultado = main.querySelector("#quiz-resultado");

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    let acertos = 0;
    let respondidas = 0;

    QUIZ.forEach((q, i) => {
      const marcada = form.querySelector(`input[name="q${i}"]:checked`);
      const bloco = form.querySelector(`[data-exp="${i}"]`);
      bloco.hidden = false;

      if (!marcada) {
        bloco.className = "callout warn";
        bloco.innerHTML = `<span class="t">Não respondida</span><p>${esc(q.exp)}</p>`;
        return;
      }
      respondidas++;
      const correta = Number(marcada.value) === q.correta;
      if (correta) acertos++;
      bloco.className = `callout ${correta ? "" : "danger"}`;
      bloco.innerHTML = `<span class="t">${correta ? "Correto" : "Resposta incorreta"}</span>
        <p><strong>${esc(q.a[q.correta])}</strong></p>
        <p>${esc(q.exp)}</p>`;
    });

    const pctAcerto = Math.round((acertos / QUIZ.length) * 100);
    const nivel =
      pctAcerto >= 88 ? ["Excelente", "Você tem base sólida para explicar a reforma com segurança."] :
      pctAcerto >= 63 ? ["Bom", "Bom domínio. Revise os pontos errados antes de divulgar."] :
      pctAcerto >= 38 ? ["Em construção", "Base inicial. Vale reler o cronograma e os regimes diferenciados."] :
      ["Começando", "Comece pelo painel e pelo cronograma; depois volte ao quiz."];

    resultado.innerHTML = `
      <div class="res-card">
        <div class="res-head">
          <div>
            <div class="t">Resultado</div>
            <div class="v">${acertos} de ${QUIZ.length}</div>
          </div>
          <div style="text-align:right">
            <div class="t">${esc(nivel[0])}</div>
            <div class="v" style="font-size:1.2rem">${pctAcerto}%</div>
          </div>
        </div>
        <div class="res-body"><div class="linha"><div class="rot">${esc(nivel[1])}</div></div></div>
      </div>`;
    resultado.scrollIntoView({ behavior: "smooth", block: "nearest" });
    if (respondidas === 0) resultado.innerHTML = `<div class="callout warn"><p>Responda ao menos uma pergunta para corrigir.</p></div>`;
  });

  main.querySelector("#quiz-refazer").addEventListener("click", () => {
    form.reset();
    form.querySelectorAll("[data-exp]").forEach((b) => (b.hidden = true));
    resultado.innerHTML = "";
  });
}
