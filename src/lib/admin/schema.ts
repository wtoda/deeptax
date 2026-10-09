/**
 * ============================================================================
 *  ESQUEMA DO PAINEL DE EDIÇÃO
 * ============================================================================
 *  Descreve, em dados, quais campos aparecem em cada aba e onde cada um grava
 *  dentro de content/site.json e content/services.json.
 *
 *  Para incluir um novo campo no painel, basta acrescentar uma entrada aqui —
 *  a interface e o salvamento são genéricos. Os caminhos usam ponto
 *  ("contact.address.city") e são relativos ao objeto da aba.
 * ============================================================================
 */

export type CampoDeLista = {
  chave: string;
  rotulo: string;
  tipo?: "texto" | "texto-longo";
  exemplo?: string;
};

export type Campo =
  | { tipo: "texto"; caminho: string; rotulo: string; ajuda?: string; exemplo?: string }
  | {
      tipo: "texto-longo";
      caminho: string;
      rotulo: string;
      ajuda?: string;
      linhas?: number;
      exemplo?: string;
    }
  | { tipo: "selecao"; caminho: string; rotulo: string; ajuda?: string; opcoes: string[] }
  | { tipo: "lista-textos"; caminho: string; rotulo: string; ajuda?: string }
  | {
      tipo: "lista-objetos";
      caminho: string;
      rotulo: string;
      ajuda?: string;
      campos: CampoDeLista[];
    }
  | { tipo: "json"; caminho: string; rotulo: string; ajuda?: string; linhas?: number };

export type Aba = {
  id: string;
  titulo: string;
  descricao: string;
  campos: Campo[];
};

/** Gradientes disponíveis para o ícone de cada área. */
export const gradientes = [
  "from-violet-500 to-indigo-500",
  "from-emerald-500 to-teal-400",
  "from-sky-500 to-cyan-400",
  "from-amber-500 to-orange-400",
  "from-fuchsia-500 to-pink-500",
  "from-slate-600 to-brand-700",
  "from-indigo-500 to-violet-400",
  "from-rose-500 to-red-400",
];

export const abas: Aba[] = [
  /* ------------------------------------------------------------- CONTATO -- */
  {
    id: "contato",
    titulo: "Contato e endereço",
    descricao:
      "Estes dados aparecem no topo, no rodapé, na página de contato e nos botões de WhatsApp. São os campos mais consultados — vale revisar antes de salvar.",
    campos: [
      {
        tipo: "texto",
        caminho: "contact.phone",
        rotulo: "Telefone exibido",
        exemplo: "(11) 93236-2770",
      },
      {
        tipo: "texto",
        caminho: "contact.whatsapp",
        rotulo: "WhatsApp exibido",
        exemplo: "(11) 93236-2770",
      },
      {
        tipo: "texto",
        caminho: "contact.whatsappNumber",
        rotulo: "Número do WhatsApp nos links",
        ajuda:
          "SOMENTE DÍGITOS, com 55 + DDD + número. É este campo que monta todos os botões de WhatsApp do site — se colocar parêntese, traço ou espaço, os botões param de funcionar.",
        exemplo: "5511932362770",
      },
      { tipo: "texto", caminho: "contact.email", rotulo: "E-mail", exemplo: "atendimento@deeptax.com.br" },
      {
        tipo: "texto",
        caminho: "contact.commercialEmail",
        rotulo: "E-mail comercial",
        ajuda: "Exibido na página de contato.",
      },
      {
        tipo: "texto",
        caminho: "contact.hours",
        rotulo: "Horário de atendimento",
        exemplo: "Segunda a sexta, das 9h às 18h",
      },
      { tipo: "texto", caminho: "contact.address.street", rotulo: "Logradouro e número" },
      { tipo: "texto", caminho: "contact.address.complement", rotulo: "Complemento" },
      { tipo: "texto", caminho: "contact.address.district", rotulo: "Bairro" },
      { tipo: "texto", caminho: "contact.address.city", rotulo: "Cidade" },
      { tipo: "texto", caminho: "contact.address.state", rotulo: "UF" },
      { tipo: "texto", caminho: "contact.address.zip", rotulo: "CEP" },
      {
        tipo: "texto",
        caminho: "social.linkedin",
        rotulo: "LinkedIn",
        ajuda: "Deixe vazio para o ícone não aparecer no rodapé.",
      },
      { tipo: "texto", caminho: "social.instagram", rotulo: "Instagram" },
      {
        tipo: "texto",
        caminho: "blogUrl",
        rotulo: "Endereço do blog",
        ajuda: "Link externo exibido no menu do topo e no rodapé.",
      },
    ],
  },

  /* ------------------------------------------------------- IDENTIFICAÇÃO -- */
  {
    id: "identificacao",
    titulo: "Identificação e SEO",
    descricao:
      "Marca, dados de registro e os textos que aparecem no Google. O domínio canônico é controlado pela variável NEXT_PUBLIC_SITE_URL na Vercel — o campo abaixo é só o padrão.",
    campos: [
      { tipo: "texto", caminho: "name", rotulo: "Marca", exemplo: "Deeptax" },
      {
        tipo: "texto",
        caminho: "legalName",
        rotulo: "Razão social",
        ajuda:
          "Exibida no bloco de dados do escritório. Mantenha o registro vigente — troque quando a alteração do contrato social estiver averbada.",
      },
      { tipo: "texto", caminho: "tradeName", rotulo: "Nome fantasia" },
      { tipo: "texto", caminho: "cnpj", rotulo: "CNPJ" },
      {
        tipo: "texto",
        caminho: "crc",
        rotulo: "Registro no CRC",
        ajuda: "Deixe vazio para não exibir.",
        exemplo: "CRC-SP 2SP045819/O-4",
      },
      {
        tipo: "texto",
        caminho: "tagline",
        rotulo: "Assinatura da marca",
        ajuda: "Aparece no título das páginas e na descrição para buscadores.",
      },
      {
        tipo: "texto-longo",
        caminho: "shortDescription",
        rotulo: "Descrição curta do escritório",
        ajuda: "Usada no rodapé e na descrição que aparece no Google.",
        linhas: 3,
      },
      {
        tipo: "texto",
        caminho: "url",
        rotulo: "Domínio padrão",
        ajuda:
          "Alimenta canonical, sitemap, robots e Open Graph. A variável NEXT_PUBLIC_SITE_URL na Vercel tem prioridade sobre este valor.",
      },
    ],
  },

  /* ---------------------------------------------------------------- HOME -- */
  {
    id: "home",
    titulo: "Página inicial",
    descricao:
      "Blocos que aparecem abaixo do formulário. Os diferenciais e as etapas aceitam reordenação pelos botões ao lado de cada item.",
    campos: [
      {
        tipo: "lista-objetos",
        caminho: "differentials",
        rotulo: "Diferenciais",
        ajuda: "Os seis cards de \"Por que a Deeptax\".",
        campos: [
          { chave: "title", rotulo: "Título" },
          { chave: "description", rotulo: "Descrição", tipo: "texto-longo" },
          { chave: "icon", rotulo: "Ícone", exemplo: "shield" },
        ],
      },
      {
        tipo: "lista-objetos",
        caminho: "process",
        rotulo: "Como trabalhamos",
        ajuda: "As etapas do atendimento, na ordem em que aparecem.",
        campos: [
          { chave: "step", rotulo: "Número", exemplo: "01" },
          { chave: "title", rotulo: "Título" },
          { chave: "description", rotulo: "Descrição", tipo: "texto-longo" },
        ],
      },
      {
        tipo: "lista-objetos",
        caminho: "stats",
        rotulo: "Números do escritório",
        ajuda:
          "Deixe a lista vazia para a faixa de números não aparecer. Só publique números reais e verificáveis.",
        campos: [
          { chave: "value", rotulo: "Número", exemplo: "+15" },
          { chave: "label", rotulo: "Legenda", exemplo: "anos de experiência" },
        ],
      },
      {
        tipo: "lista-objetos",
        caminho: "testimonials",
        rotulo: "Depoimentos",
        ajuda:
          "Deixe a lista vazia para a seção não aparecer. Publique apenas depoimentos reais, com autorização do cliente.",
        campos: [
          { chave: "quote", rotulo: "Depoimento", tipo: "texto-longo" },
          { chave: "author", rotulo: "Autor" },
          { chave: "company", rotulo: "Empresa / cidade" },
        ],
      },
      {
        tipo: "lista-objetos",
        caminho: "faq",
        rotulo: "Perguntas frequentes",
        ajuda: "Aparecem na página inicial e na página de contato.",
        campos: [
          { chave: "question", rotulo: "Pergunta" },
          { chave: "answer", rotulo: "Resposta", tipo: "texto-longo" },
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ ÁREAS -- */

/** Campos editáveis por formulário em cada área. */
export const camposDaArea: Campo[] = [
  {
    tipo: "texto",
    caminho: "name",
    rotulo: "Nome da área",
    ajuda: "Como aparece no menu, nos cards e no título da página.",
  },
  { tipo: "texto", caminho: "shortName", rotulo: "Nome curto", ajuda: "Usado no menu e no rodapé." },
  { tipo: "texto", caminho: "slug", rotulo: "Endereço (slug)", ajuda: "Vira /servicos/<slug>. Só letras minúsculas, números e hífen." },
  { tipo: "texto", caminho: "tagline", rotulo: "Assinatura" },
  { tipo: "texto-longo", caminho: "summary", rotulo: "Resumo", linhas: 3, ajuda: "Texto do card na página inicial." },
  { tipo: "selecao", caminho: "icon", rotulo: "Ícone", opcoes: ["cpu", "receipt", "ledger", "gavel", "compass", "shield"] },
  { tipo: "selecao", caminho: "accent", rotulo: "Cor", opcoes: gradientes },
  { tipo: "texto", caminho: "hero.eyebrow", rotulo: "Selo do topo" },
  { tipo: "texto-longo", caminho: "hero.title", rotulo: "Título principal", linhas: 2 },
  { tipo: "texto-longo", caminho: "hero.subtitle", rotulo: "Subtítulo", linhas: 3 },
  { tipo: "lista-textos", caminho: "hero.highlights", rotulo: "Destaques do topo", ajuda: "A lista ao lado do formulário." },
  { tipo: "texto", caminho: "intro.title", rotulo: "Título da introdução" },
  { tipo: "lista-textos", caminho: "intro.paragraphs", rotulo: "Parágrafos da introdução" },
  { tipo: "texto", caminho: "audience.title", rotulo: "Título de \"Para quem é\"" },
  { tipo: "texto-longo", caminho: "audience.lead", rotulo: "Texto de \"Para quem é\"", linhas: 2 },
  { tipo: "texto", caminho: "cta.title", rotulo: "Título da chamada final" },
  { tipo: "texto-longo", caminho: "cta.description", rotulo: "Texto da chamada final", linhas: 2 },
  { tipo: "texto", caminho: "seo.title", rotulo: "Título no Google" },
  { tipo: "texto-longo", caminho: "seo.description", rotulo: "Descrição no Google", linhas: 2 },
];

/**
 * Conteúdo profundo de cada área: escopo, metodologia, entregáveis, FAQ e
 * público. Editado em JSON porque são listas aninhadas — um formulário para
 * isso ficaria mais confuso do que o próprio dado.
 */
export const camposJsonDaArea: Campo[] = [
  {
    tipo: "json",
    caminho: "audience.items",
    rotulo: "Para quem é (itens)",
    linhas: 12,
    ajuda: "Lista de { title, description }.",
  },
  {
    tipo: "json",
    caminho: "scope",
    rotulo: "Escopo",
    linhas: 18,
    ajuda: "Lista de { title, description, items: [] }.",
  },
  {
    tipo: "json",
    caminho: "methodology",
    rotulo: "Metodologia",
    linhas: 12,
    ajuda: "Lista de { step, title, description }.",
  },
  {
    tipo: "json",
    caminho: "deliverables",
    rotulo: "Entregáveis",
    linhas: 8,
    ajuda: "Lista de textos.",
  },
  {
    tipo: "json",
    caminho: "faq",
    rotulo: "Perguntas frequentes",
    linhas: 12,
    ajuda: "Lista de { question, answer }.",
  },
  {
    tipo: "json",
    caminho: "seo.keywords",
    rotulo: "Palavras-chave",
    linhas: 6,
    ajuda: "Lista de textos.",
  },
];
