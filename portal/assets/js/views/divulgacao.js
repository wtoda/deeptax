// views/divulgacao.js — kit para comunicar a reforma com segurança.
import { esc, pct } from "../util.js";
import { cabecalho, aviso, tabela, badge, secao } from "../ui.js";
import { KIT_FRASES, KIT_FORMATOS, META, RADAR } from "../dados.js";
import { aliquotasDoAno, CENARIOS, cenarioPadrao } from "../motor.js";

export function render(main) {
  const cen = cenarioPadrao();
  const a26 = aliquotasDoAno(2026);
  const a27 = aliquotasDoAno(2027);
  const a33 = aliquotasDoAno(2033);

  main.innerHTML = `
  ${cabecalho(
    "Comunicar",
    "Kit de divulgação",
    "Falar de reforma tributária com segurança exige três disciplinas: separar o que é lei do que é estimativa, citar a data da informação e nunca afirmar o que ainda não foi decidido. Este é o material de apoio."
  )}

  ${aviso(
    "danger",
    "As três regras de ouro",
    `<p><strong>1.</strong> Nunca apresente estimativa como alíquota definida — a de referência depende de resolução do Senado (prazo: dezembro/2026).</p>
     <p><strong>2.</strong> Sempre diga a data da informação: o material de 2024 dizia 26,5%; o cálculo do TCU de out/2026 aponta CBS de 11,3%.</p>
     <p><strong>3.</strong> Distinga o que já vigora (alíquotas de teste de 2026) do que é cronograma futuro.</p>`
  )}

  ${secao(
    "numeros",
    "Os números que você pode afirmar hoje",
    `<div class="grid g4">
      ${[
        { k: "IBS 2026", v: pct(a26.ibs, 2), d: "alíquota de teste, estadual" },
        { k: "CBS 2026", v: pct(a26.cbs, 2), d: "alíquota de teste, federal" },
        { k: "CBS 2027", v: pct(a27.cbs, 2), d: "referência − 0,1 p.p. (cenário TCU)" },
        { k: "Total 2033", v: pct(a33.cbs + a33.ibs, 2), d: "regime pleno no cenário padrão" },
      ]
        .map(
          (x) => `<div class="stat">
            <div class="k">${esc(x.k)}</div>
            <div class="v">${x.v}</div>
            <div class="d">${esc(x.d)}</div>
          </div>`
        )
        .join("")}
    </div>
    <p class="hint" style="margin-top:.8rem">Cenário: ${esc(cen.nome)}. ${esc(cen.status)}.</p>`
  )}

  ${secao(
    "gerador",
    "Gerar um resumo para divulgar",
    `<div class="card">
      <div class="grid g3" style="margin-bottom:.8rem">
        <div class="field" style="margin:0">
          <label for="d-publico">Público</label>
          <select id="d-publico">
            <option value="cliente">Cliente / empresa</option>
            <option value="equipe">Equipe interna</option>
            <option value="redes">Redes sociais</option>
          </select>
        </div>
        <div class="field" style="margin:0">
          <label for="d-ano">Foco</label>
          <select id="d-ano">
            <option value="2026">O que muda em 2026</option>
            <option value="2027">O que muda em 2027</option>
            <option value="2033">Para onde vai o modelo</option>
          </select>
        </div>
        <div class="field" style="margin:0">
          <label for="d-tom">Tom</label>
          <select id="d-tom">
            <option value="direto">Direto ao ponto</option>
            <option value="didatico">Didático</option>
          </select>
        </div>
      </div>
      <div class="pill-row" style="margin-bottom:.8rem">
        <button class="btn" type="button" id="btn-gerar">Gerar resumo</button>
        <button class="btn btn-ghost" type="button" id="btn-copiar-resumo">Copiar texto</button>
      </div>
      <textarea id="d-saida" rows="12" style="font-family:var(--mono);font-size:.82rem;line-height:1.5" readonly placeholder="O resumo gerado aparecerá aqui…"></textarea>
      <p class="hint" style="margin-top:.4rem">O texto sai pronto para uso, com a ressalva de fonte e data — não remova esse trecho.</p>
    </div>`
  )}

  ${secao(
    "frases",
    "Frases seguras x frases de risco",
    `<p class="muted small" style="margin-bottom:1rem">Frases que resistem a qualquer auditoria e o que evitar para não propagar erro.</p>
     <div class="grid g2">
      ${KIT_FRASES.map(
        (f) => `<div class="card">
          <p class="small" style="margin:0 0 .4rem"><span class="badge ok">seguro</span> ${esc(f.segura)}</p>
          <p class="small" style="margin:0 0 .4rem"><span class="badge danger">evite</span> ${esc(f.evite)}</p>
          <p class="hint" style="margin:0">${esc(f.porque)}</p>
        </div>`
      ).join("")}
     </div>`
  )}

  ${secao(
    "formatos",
    "Formatos de comunicação",
    `<div class="grid g4">
      ${KIT_FORMATOS.map(
        (f) => `<div class="card tight">
          <h3 style="font-size:.92rem;margin:0 0 .25rem">${esc(f.nome)}</h3>
          <p class="small muted" style="margin:0">${esc(f.desc)}</p>
        </div>`
      ).join("")}
    </div>`
  )}

  ${secao(
    "checklist",
    "Checklist antes de publicar",
    `<div class="card">
      <ul style="margin:0">
        <li>Todo número tem fonte e data?</li>
        <li>Você separou o que é <strong>lei vigente</strong> do que é <strong>estimativa</strong>?</li>
        <li>Você disse que a alíquota de referência depende de resolução do Senado?</li>
        <li>Você deixou claro que 2026 é ano de teste e que a substituição só se completa em 2033?</li>
        <li>Você mencionou que as alíquotas do Imposto Seletivo estão pendentes?</li>
        <li>Você incluiu a ressalva de que o conteúdo é informativo e não substitui consultoria?</li>
      </ul>
    </div>`
  )}
  `;
}

export function bind(main) {
  const saida = main.querySelector("#d-saida");

  function gerar() {
    const publico = main.querySelector("#d-publico").value;
    const foco = main.querySelector("#d-ano").value;
    const tom = main.querySelector("#d-tom").value;
    const cen = cenarioPadrao();
    const a = aliquotasDoAno(Number(foco));
    const a26 = aliquotasDoAno(2026);
    const a27 = aliquotasDoAno(2027);
    const a33 = aliquotasDoAno(2033);

    const abertura =
      publico === "cliente"
        ? "O que sua empresa precisa saber sobre a Reforma Tributária do Consumo"
        : publico === "equipe"
        ? "Alinhamento interno: situação da reforma tributária"
        : "Reforma Tributária: o que muda de verdade";

    const corpoPorFoco = {
      "2026": [
        `2026 é o ano de TESTE do novo sistema. As alíquotas em vigor são de ${pct(a26.ibs, 2)} para o IBS (parcela estadual) e ${pct(a26.cbs, 2)} para a CBS, com caráter informativo nos documentos fiscais.`,
        `ICMS, ISS, IPI, PIS e Cofins continuam integralmente em vigor. O valor destacado de IBS/CBS é compensado com PIS e Cofins do mesmo período de apuração.`,
        `Quem cumprir as obrigações acessórias pode ser dispensado do recolhimento. Quem não cumprir recolhe 1% em dinheiro.`,
        `Dado atualizado em ${META.atualizadoEm}.`,
      ],
      "2027": [
        `Em 2027 o PIS e a Cofins deixam de existir e a CBS passa a ser cobrada com alíquota própria — no cenário mais recente (TCU, out/2026), de ${pct(a27.cbs, 2)}.`,
        `O IBS segue em ${pct(a27.ibs, 2)}, agora dividido entre 0,05% estadual e 0,05% municipal.`,
        `O Imposto Seletivo entra em vigor sobre bens prejudiciais à saúde e ao meio ambiente — mas as alíquotas dependem de lei ordinária ainda pendente.`,
        `O IPI é reduzido a zero para a maioria dos produtos, exceto no perímetro da Zona Franca de Manaus.`,
        `Atenção: as alíquotas de referência dependem de resolução do Senado (prazo: dezembro/2026).`,
      ],
      "2033": [
        `Em 2033 o modelo está completo: IBS e CBS integrais, ICMS e ISS extintos, e o Imposto Seletivo incorporado ao diferencial de produtos como fumígenos e bebidas alcoólicas.`,
        `No cenário padrão de referência, a carga combinada chega a ${pct(a33.cbs + a33.ibs, 2)} — CBS ${pct(a33.cbs, 2)} e IBS ${pct(a33.ibs, 2)}.`,
        `A transição do ICMS e do ISS ocorre entre 2029 e 2032, com redução de 10 pontos percentuais por ano nos tributos antigos.`,
      ],
    };

    const tomTexto =
      tom === "direto"
        ? corpoPorFoco[foco].map((l) => `• ${l}`).join("\n")
        : corpoPorFoco[foco].map((l, i) => `${i + 1}. ${l}`).join("\n");

    const fechamento =
      `\n\nFonte: EC 132/2023, LC 214/2025 e material oficial da Receita Federal. ` +
      `Conteúdo informativo, atualizado em ${META.atualizadoEm}; não substitui consultoria tributária individualizada.`;

    saida.value = `# ${abertura}\n\n${tomTexto}${fechamento}`;
  }

  main.querySelector("#btn-gerar").addEventListener("click", gerar);

  main.querySelector("#btn-copiar-resumo").addEventListener("click", async () => {
    if (!saida.value) gerar();
    try {
      await navigator.clipboard.writeText(saida.value);
      const b = main.querySelector("#btn-copiar-resumo");
      const t = b.textContent;
      b.textContent = "Copiado!";
      setTimeout(() => (b.textContent = t), 1800);
    } catch {
      saida.select();
      document.execCommand?.("copy");
    }
  });

  gerar();
}
