// views/documentos.js — ecossistema de DF-e, novos campos e obrigações acessórias.
import { esc } from "../util.js";
import { cabecalho, aviso, tabela, badge, secao, acordeao } from "../ui.js";
import { DOCUMENTOS, CAMPOS_FISCAIS, OBRIGACOES, EXEMPLO_XML, INTEROPERABILIDADE } from "../dados.js";

const FORMATO_ROTULO = {
  pdf: "PDF",
  xlsx: "XLSX",
  schema: "Schema",
  manual: "Manual",
  portal: "Portal",
};

const CORES_STATUS = {
  "Em produção": "ok",
  "Grupo IBS/CBS em produção": "ok",
  "Novo": "giro",
  "Em adaptação": "warn",
  "Implantação gradual": "warn",
  "Em operação": "ok",
};

export function render(main) {
  const familias = [...new Set(DOCUMENTOS.map((d) => d.familia))];

  main.innerHTML = `
  ${cabecalho(
    "Operar",
    "Documentos fiscais",
    "O documento fiscal deixa de ser base para escrituração e passa a ser a própria confissão do valor devido. Isso muda o papel da nota, os campos, os eventos e as obrigações acessórias."
  )}

  ${aviso(
    "lei",
    "A mudança de paradigma",
    `<p>Na LC 214/2025 (art. 60, § 1º), os documentos fiscais eletrônicos <strong>“possuem caráter declaratório e constituem confissão do valor devido”</strong> de IBS e CBS. A escrituração de ICMS, PIS e Cofins é substituída pela <strong>apuração assistida</strong>: o Fisco calcula a partir dos documentos e entrega a declaração pré-preenchida.</p>`
  )}

  ${secao(
    "ecossistema",
    "Ecossistema de documentos",
    `<div class="tabs" id="tabs-doc">
      <button class="ativo" data-familia="todos">Todos</button>
      ${familias.map((f) => `<button data-familia="${esc(f)}">${esc(f)}</button>`).join("")}
    </div>
    <div class="grid g2" id="lista-doc">
      ${DOCUMENTOS.map(
        (d) => `
        <article class="card tight" data-familia="${esc(d.familia)}">
          <div class="card-h">
            <div>
              <h3 style="margin:0;font-size:1rem">${esc(d.nome)}</h3>
              <span class="small muted">${d.modelo !== "—" ? `modelo ${esc(d.modelo)} · ` : ""}${esc(d.familia)}</span>
            </div>
            ${badge(d.status, CORES_STATUS[d.status] ?? "")}
          </div>
          <p class="small" style="margin:.5rem 0 .35rem"><strong>Uso:</strong> ${esc(d.uso)}</p>
          <p class="small" style="color:var(--ink-2);margin-bottom:.35rem"><strong>Novidade na RTC:</strong> ${esc(d.novidade)}</p>
          <p class="hint" style="margin:.2rem 0 .5rem">Autorização: ${esc(d.autoriza)}</p>

          ${
            d.documentacao?.length
              ? `<div style="border-top:1px dashed var(--line);padding-top:.5rem">
                   <p class="lbl-sm" style="margin:0 0 .35rem">Baixar e integrar</p>
                   <div style="display:flex;flex-wrap:wrap;gap:.3rem">
                     ${d.documentacao
                       .map(
                         (l) => `<a class="chip" href="${esc(l.url)}" target="_blank" rel="noopener"
                            title="${esc(l.rotulo)}" style="text-decoration:none">
                            ${esc(FORMATO_ROTULO[l.formato] || "portal")} · ${esc(l.rotulo.length > 34 ? l.rotulo.slice(0, 33) + "…" : l.rotulo)}
                          </a>`
                       )
                       .join("")}
                   </div>
                 </div>`
              : ""
          }
        </article>`
      ).join("")}
    </div>`
  )}

  ${secao(
    "campos",
    "Os campos que você vai preencher",
    `<p class="muted small" style="margin-bottom:1rem">CST e cClassTrib não são a mesma coisa — e confundi-los é o erro mais comum. O cClassTrib contém o CST nos três primeiros dígitos e acrescenta a base legal específica e os indicadores de crédito.</p>
     ${tabela({
       colunas: ["Campo", "O que é", "Onde aparece / para que serve"],
       linhas: CAMPOS_FISCAIS.map((c) => [
         `<strong>${esc(c.campo)}</strong><br><span class="small muted">${esc(c.nome)}</span>`,
         esc(c.o_que),
         esc(c.onde),
       ]),
     })}
     <div class="grid g2" style="margin-top:1rem">
       <div class="card tight">
         <h3 style="font-size:.92rem;margin:0 0 .3rem">Exemplo prático</h3>
         <p class="small muted" style="margin:0">CST <code>200</code> + cClassTrib <code>200031</code> indicam redução de 60% — suficiente para o sistema aplicar a alíquota efetiva correta e liberar (ou vedar) o crédito ao adquirente.</p>
       </div>
       <div class="card tight">
         <h3 style="font-size:.92rem;margin:0 0 .3rem">Onde conferir</h3>
         <p class="small muted" style="margin:0">A Calculadora de Tributos oficial valida NCM/NBS, aplica reduções e devolve a memória de cálculo e os blocos de XML prontos.</p>
       </div>
     </div>`
  )}

  ${secao(
    "obrigacoes",
    "Obrigações acessórias e mudanças operacionais",
    `<div class="grid g2">
      ${OBRIGACOES.map(
        (o) => `<div class="card">
          <div class="card-h"><h3 style="font-size:.95rem;margin:0">${esc(o.titulo)}</h3>${badge(o.status, "giro")}</div>
          <p class="small muted" style="margin:0">${esc(o.texto)}</p>
        </div>`
      ).join("")}
    </div>`
  )}

  ${secao(
    "split",
    "Split payment",
    `<div class="grid g2">
      <div>
        <p class="small">O split payment é uma das formas de <strong>extinção do débito</strong> previstas na lei: o recolhimento acontece na liquidação financeira da operação. O prestador de serviço de pagamento segrega o valor e recolhe o tributo no momento do pagamento.</p>
        <p class="small"><strong>Exemplo:</strong> numa operação de R$ 100 com R$ 25 de IBS/CBS, o adquirente paga R$ 125; o fornecedor recebe o valor líquido; a instituição de pagamento retém e recolhe a parcela do tributo.</p>
        <p class="small muted">Não altera o valor devido. Altera o <strong>fluxo de caixa</strong> — e é aí que está o impacto real para o capital de giro.</p>
      </div>
      <div>${acordeao([
        { p: "Modalidades", r: "<p>Split <strong>inteligente</strong> (online e offline) e split <strong>simplificado</strong>. A definição operacional de cada modalidade e a data de início dependem de regulamentação.</p>" },
        { p: "Enquanto não estiver implementado", r: "<p>A lei dispensa o requisito de extinção do débito para o adquirente apropriar crédito (art. 48, I). Ou seja: a ausência do split não bloqueia o crédito.</p>" },
        { p: "Efeito no caixa", r: "<p>O fornecedor deixa de ter o tributo disponível entre a venda e o recolhimento. Empresas com margem apertada precisam redesenhar o fluxo de recebíveis.</p>" },
      ])}</div>
    </div>`
  )}

  ${secao(
    "exemplo",
    "Exemplo: como o grupo IBSCBS aparece",
    `<div class="grid g2">
      <div>
        ${aviso("warn", "Exemplo didático, não é schema", `<p>${esc(EXEMPLO_XML.aviso)}</p>`)}
        <div class="card tight" style="padding:0">
          <pre style="margin:0;padding:1rem;overflow-x:auto;font-family:var(--mono);font-size:.76rem;line-height:1.55;color:var(--ink-2)"><code>${esc(EXEMPLO_XML.codigo)}</code></pre>
        </div>
        <div class="pill-row" style="margin-top:.6rem">
          <button class="btn btn-ghost btn-sm" type="button" id="btn-copiar-xml">Copiar exemplo</button>
          <a class="btn btn-ghost btn-sm" href="https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/rtc/anexovi-leiautesrn_rtc_ibscbs-v1-04-01-nt009.xlsx" target="_blank" rel="noopener">Anexo VI oficial (XLSX)</a>
        </div>
      </div>
      <div>
        <h3 style="font-size:.95rem;margin:0 0 .5rem">${esc(EXEMPLO_XML.titulo)}</h3>
        <ul class="small" style="color:var(--ink-2)">
          ${EXEMPLO_XML.leitura.map((l) => `<li>${esc(l)}</li>`).join("")}
        </ul>
      </div>
    </div>`
  )}

  ${secao(
    "interop",
    "Onde a adaptação costuma travar",
    `<p class="muted small" style="margin-bottom:1rem">Seis passos, na ordem em que os problemas aparecem. Cada um com o material oficial para resolver.</p>
     <div class="grid g2">
      ${INTEROPERABILIDADE.map(
        (i) => `<div class="card">
          <h3 style="font-size:.95rem;margin:0 0 .35rem">${esc(i.titulo)}</h3>
          <p class="small" style="color:var(--ink-2);margin-bottom:.5rem">${esc(i.texto)}</p>
          <div class="pill-row" style="margin:0">
            ${(i.links || []).map((l) => `<a class="chip" href="${esc(l.url)}" target="_blank" rel="noopener" style="text-decoration:none">${esc(l.rotulo)} ↗</a>`).join("")}
          </div>
        </div>`
      ).join("")}
    </div>`
  )}

  ${secao(
    "prazos",
    "Cronologia da implantação",
    `${tabela({
      colunas: ["Data", "Marco"],
      linhas: [
        ["10/12/2025", "NFS-e: produção restrita com o grupo IBSCBS"],
        ["05/01/2026", "NFS-e: grupo IBSCBS em produção (emissão por API)"],
        ["jan/2026", "NFS-e Via em produção (pedágio)"],
        ["jul/2026", "Início da implantação controlada do CNPJ alfanumérico"],
        ["ago/2026", "Emissor web da NFS-e passa a suportar o grupo IBSCBS"],
        ["31/12/2026", "Data de referência do estoque de abertura"],
        ["17/02/2027", "Prazo de entrega da EFD-Contribuições de dez/2026 com os saldos credores"],
        ["1º/01/2027", "Início da tributação efetiva pela CBS; IBS em alíquota de teste; IS em vigor"],
        ["até 30/06/2027", "Apropriação e início do uso do crédito de estoque de abertura (12 parcelas)"],
        ["31/12/2032", "Último prazo do regime de transição de ICMS e ISS"],
      ],
    })}
    <p class="hint" style="margin-top:.7rem">Datas de notas técnicas e leiautes mudam com frequência: confira o portal nacional da NFS-e e o portal da NF-e antes de fechar o cronograma do seu projeto.</p>`
  )}
  `;
}

export function bind(main) {
  main.querySelector("#btn-copiar-xml")?.addEventListener("click", async (ev) => {
    const btn = ev.currentTarget;
    try {
      await navigator.clipboard.writeText(EXEMPLO_XML.codigo);
      const original = btn.textContent;
      btn.textContent = "Copiado!";
      setTimeout(() => (btn.textContent = original), 1800);
    } catch {
      /* sem permissão de área de transferência: o texto continua visível */
    }
  });

  const tabs = main.querySelectorAll("#tabs-doc button");
  const cards = main.querySelectorAll("#lista-doc [data-familia]");
  tabs.forEach((b) =>
    b.addEventListener("click", () => {
      tabs.forEach((x) => x.classList.toggle("ativo", x === b));
      const f = b.dataset.familia;
      cards.forEach((c) => {
        c.style.display = f === "todos" || c.dataset.familia === f ? "" : "none";
      });
    })
  );
}
