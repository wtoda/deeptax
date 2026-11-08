/**
 * ============================================================================
 *  LIGAÇÕES ENTRE AS ÁREAS E O PORTAL DA REFORMA
 * ============================================================================
 *  O portal (/reforma-tributaria) tem 13 telas de conteúdo profundo sobre
 *  IBS, CBS, cronograma, documentos fiscais e conformidade — e é o ativo de
 *  busca orgânica mais forte do domínio.
 *
 *  O problema que este arquivo resolve: até aqui o portal era alcançado quase
 *  só pelo menu e pelo rodapé, iguais em todas as páginas. Link de menu não diz
 *  ao Google sobre o que trata a página de destino; link dentro do corpo, com
 *  texto que descreve o assunto, diz — e é isso que transfere autoridade e
 *  conecta "revisão fiscal" a "cronograma da reforma".
 *
 *  A curadoria é por assunto: cada área aponta para as telas que respondem à
 *  dúvida de quem procura aquele serviço.
 * ========================================================================== */

export type MaterialDoPortal = {
  /** Caminho da tela do portal. */
  href: string;
  /** Nome curto da tela, usado como selo. */
  tela: string;
  descricao: string;
};

export const materiaisPorArea: Record<string, MaterialDoPortal[]> = {
  "deep-tax": [
    {
      href: "/reforma-tributaria/cronograma/",
      tela: "Cronograma",
      descricao: "O que já vale em 2026, o que entra em 2027 e o que só muda em 2033.",
    },
    {
      href: "/reforma-tributaria/calculadora/",
      tela: "Calculadora",
      descricao: "Simule IBS, CBS e Imposto Seletivo com memória de cálculo e base legal.",
    },
    {
      href: "/reforma-tributaria/legislacao/",
      tela: "Legislação",
      descricao: "A EC 132/2023, a LC 214/2025 e as resoluções que ainda faltam publicar.",
    },
  ],
  "deep-cont": [
    {
      href: "/reforma-tributaria/conformidade/",
      tela: "Conformidade",
      descricao: "Checklist de adequação por perfil, com o que depende de norma e o que já dá para fazer.",
    },
    {
      href: "/reforma-tributaria/documentos/",
      tela: "Documentos fiscais",
      descricao: "Os campos novos de IBS e CBS que entram na nota e mudam a escrituração.",
    },
    {
      href: "/reforma-tributaria/entenda/",
      tela: "Entenda o modelo",
      descricao: "Como funcionam os três tributos que substituem cinco — em texto corrido.",
    },
  ],
  "deep-systems": [
    {
      href: "/reforma-tributaria/documentos/",
      tela: "Documentos fiscais",
      descricao: "NF-e, NFS-e e CT-e: CST, cClassTrib, split payment e os schemas para download.",
    },
    {
      href: "/reforma-tributaria/dere/",
      tela: "DeRE",
      descricao: "A declaração dos regimes específicos, leiautes D-1000 e D-9000 e o que o ERP precisa enviar.",
    },
    {
      href: "/reforma-tributaria/conformidade/",
      tela: "Conformidade",
      descricao: "O que verificar no sistema antes do período de teste.",
    },
  ],
  "deep-pericia": [
    {
      href: "/reforma-tributaria/dere/",
      tela: "DeRE",
      descricao: "A declaração que reúne as informações dos regimes específicos.",
    },
    {
      href: "/reforma-tributaria/documentos/",
      tela: "Documentos fiscais",
      descricao: "Onde os novos campos aparecem e o que muda na prova documental.",
    },
    {
      href: "/reforma-tributaria/fontes/",
      tela: "Fontes",
      descricao: "As normas oficiais e como citar cada uma em laudo ou parecer.",
    },
  ],
  "deep-consult": [
    {
      href: "/reforma-tributaria/comparativo/",
      tela: "Antes e depois",
      descricao: "O modelo atual e o novo lado a lado, com o efeito no preço e na cadeia.",
    },
    {
      href: "/reforma-tributaria/calculadora/",
      tela: "Calculadora",
      descricao: "Compare a carga de uma operação nos dois regimes antes de decidir.",
    },
    {
      href: "/reforma-tributaria/entenda/",
      tela: "Entenda o modelo",
      descricao: "Crédito amplo, tributação no destino e regimes diferenciados, sem jargão.",
    },
  ],
  "deep-compliance": [
    {
      href: "/reforma-tributaria/conformidade/",
      tela: "Conformidade",
      descricao: "Checklist por perfil: empresa, Simples Nacional e MEI, contador e cidadão.",
    },
    {
      href: "/reforma-tributaria/divulgacao/",
      tela: "Kit de divulgação",
      descricao: "Frases seguras e frases de risco para comunicar a reforma sem afirmar o que é estimativa.",
    },
    {
      href: "/reforma-tributaria/legislacao/",
      tela: "Legislação",
      descricao: "O que é lei hoje e o que ainda depende de regulamentação.",
    },
  ],
};

export const materiaisDaArea = (slug: string): MaterialDoPortal[] =>
  materiaisPorArea[slug] ?? [];
