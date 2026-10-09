/**
 * ============================================================================
 *  ESQUEMA DO PAINEL DE EDIÇÃO
 * ============================================================================
 *  Descreve, em dados, quais campos aparecem em cada aba e onde cada um grava.
 *
 *  ORIGEM: cada campo aponta para um dos arquivos de conteúdo:
 *    "site"    → content/site.json    (dados do escritório)
 *    "paginas" → content/paginas.json (textos das páginas)
 *  O padrão é "site". A aba "Áreas" é tratada à parte, porque edita a lista de
 *  áreas (content/services.json) por índice.
 *
 *  Para incluir um campo no painel, basta acrescentar uma entrada aqui — a
 *  interface e o salvamento são genéricos.
 * ============================================================================
 */

export type Origem = "site" | "paginas";

export type CampoDeLista = {
  chave: string;
  rotulo: string;
  tipo?: "texto" | "texto-longo";
  exemplo?: string;
};

export type Campo =
  | {
      tipo: "texto";
      caminho: string;
      rotulo: string;
      ajuda?: string;
      exemplo?: string;
      origem?: Origem;
    }
  | {
      tipo: "texto-longo";
      caminho: string;
      rotulo: string;
      ajuda?: string;
      linhas?: number;
      exemplo?: string;
      origem?: Origem;
    }
  | {
      tipo: "selecao";
      caminho: string;
      rotulo: string;
      ajuda?: string;
      opcoes: string[];
      origem?: Origem;
    }
  | { tipo: "lista-textos"; caminho: string; rotulo: string; ajuda?: string; origem?: Origem }
  | {
      tipo: "lista-objetos";
      caminho: string;
      rotulo: string;
      ajuda?: string;
      campos: CampoDeLista[];
      origem?: Origem;
    }
  | {
      tipo: "json";
      caminho: string;
      rotulo: string;
      ajuda?: string;
      linhas?: number;
      origem?: Origem;
    };

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

/* ------------------------------------------------------- blocos reutilizados */

const secao = (base: string, origem: Origem = "paginas"): Campo[] => [
  { tipo: "texto", caminho: `${base}.selo`, rotulo: "Selo (texto pequeno acima do título)", origem },
  { tipo: "texto", caminho: `${base}.titulo`, rotulo: "Título da seção", origem },
  { tipo: "texto-longo", caminho: `${base}.descricao`, rotulo: "Descrição da seção", linhas: 3, origem },
];

export const abas: Aba[] = [
  /* ------------------------------------------------------------- CONTATO -- */
  {
    id: "contato",
    titulo: "Contato e endereço",
    descricao:
      "Estes dados aparecem no topo, no rodapé, na página de contato e nos botões de WhatsApp. São os campos mais consultados — vale revisar antes de salvar.",
    campos: [
      { tipo: "texto", caminho: "contact.phone", rotulo: "Telefone exibido", exemplo: "(11) 93236-2770" },
      { tipo: "texto", caminho: "contact.whatsapp", rotulo: "WhatsApp exibido", exemplo: "(11) 93236-2770" },
      {
        tipo: "texto",
        caminho: "contact.whatsappNumber",
        rotulo: "Número do WhatsApp nos links",
        ajuda:
          "SOMENTE DÍGITOS, com 55 + DDD + número. É este campo que monta todos os botões de WhatsApp do site — se colocar parêntese, traço ou espaço, os botões param de funcionar.",
        exemplo: "5511932362770",
      },
      { tipo: "texto", caminho: "contact.email", rotulo: "E-mail", exemplo: "contato@deeptax.com.br" },
      { tipo: "texto", caminho: "contact.commercialEmail", rotulo: "E-mail comercial", ajuda: "Exibido na página de contato." },
      { tipo: "texto", caminho: "contact.hours", rotulo: "Horário de atendimento", exemplo: "Segunda a sexta, das 9h às 18h" },
      { tipo: "texto", caminho: "contact.address.street", rotulo: "Logradouro e número" },
      { tipo: "texto", caminho: "contact.address.complement", rotulo: "Complemento" },
      { tipo: "texto", caminho: "contact.address.district", rotulo: "Bairro" },
      { tipo: "texto", caminho: "contact.address.city", rotulo: "Cidade" },
      { tipo: "texto", caminho: "contact.address.state", rotulo: "UF" },
      { tipo: "texto", caminho: "contact.address.zip", rotulo: "CEP" },
      { tipo: "texto", caminho: "social.linkedin", rotulo: "LinkedIn", ajuda: "Deixe vazio para o ícone não aparecer no rodapé." },
      { tipo: "texto", caminho: "social.instagram", rotulo: "Instagram" },
      { tipo: "texto", caminho: "blogUrl", rotulo: "Endereço do blog", ajuda: "Link externo exibido no menu do topo e no rodapé." },
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
        ajuda: "Exibida no bloco de dados do escritório. Mantenha o registro vigente — troque quando a alteração do contrato social estiver averbada.",
      },
      { tipo: "texto", caminho: "tradeName", rotulo: "Nome fantasia" },
      { tipo: "texto", caminho: "cnpj", rotulo: "CNPJ" },
      { tipo: "texto", caminho: "crc", rotulo: "Registro no CRC", ajuda: "Deixe vazio para não exibir.", exemplo: "CRC-SP 2SP045819/O-4" },
      { tipo: "texto", caminho: "tagline", rotulo: "Assinatura da marca", ajuda: "Aparece no título das páginas e na descrição para buscadores." },
      { tipo: "texto-longo", caminho: "shortDescription", rotulo: "Descrição curta do escritório", ajuda: "Usada no rodapé e na descrição que aparece no Google.", linhas: 3 },
      {
        tipo: "texto",
        caminho: "url",
        rotulo: "Domínio padrão",
        ajuda: "Alimenta canonical, sitemap, robots e Open Graph. A variável NEXT_PUBLIC_SITE_URL na Vercel tem prioridade sobre este valor.",
      },
    ],
  },

  /* -------------------------------------------------------- PÁGINA INICIAL */
  {
    id: "home",
    titulo: "Página inicial",
    descricao:
      "A página mais visitada. O topo traz o formulário; abaixo vêm os blocos de conteúdo. Os marcadores {{nome}}, {{telefone}} e afins são substituídos pelos dados do escritório.",
    campos: [
      { tipo: "texto", caminho: "home.hero.selo", rotulo: "Selo do topo", origem: "paginas" },
      { tipo: "texto", caminho: "home.hero.titulo", rotulo: "Título principal (linha 1)", origem: "paginas" },
      { tipo: "texto", caminho: "home.hero.tituloDestaque", rotulo: "Título principal (linha 2, em destaque)", origem: "paginas" },
      { tipo: "texto-longo", caminho: "home.hero.subtitulo", rotulo: "Subtítulo", linhas: 3, origem: "paginas" },
      { tipo: "lista-textos", caminho: "home.hero.itens", rotulo: "Bullets do topo", origem: "paginas" },
      { tipo: "texto", caminho: "home.hero.botaoPrincipal", rotulo: "Botão principal", origem: "paginas" },
      { tipo: "texto", caminho: "home.hero.botaoWhatsapp", rotulo: "Botão do WhatsApp", origem: "paginas" },
      { tipo: "texto", caminho: "home.hero.formularioTitulo", rotulo: "Título do formulário no topo", origem: "paginas" },
      { tipo: "texto", caminho: "home.hero.formularioNota", rotulo: "Observação do formulário", origem: "paginas" },
      { tipo: "texto", caminho: "home.segmentos.titulo", rotulo: "Faixa de segmentos — título", origem: "paginas" },
      { tipo: "lista-textos", caminho: "home.segmentos.itens", rotulo: "Segmentos atendidos", origem: "paginas" },
      ...secao("home.secoes.servicos"),
      ...secao("home.secoes.diferenciais"),
      ...secao("home.secoes.processo"),
      ...secao("home.secoes.depoimentos"),
      ...secao("home.secoes.faq"),
      {
        tipo: "lista-objetos",
        caminho: "differentials",
        rotulo: "Diferenciais",
        ajuda: 'Os seis cards de "Por que a Deeptax". Ícones válidos: shield, chart, clock, users, lock, sparkles.',
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
        ajuda: "Deixe a lista vazia para a faixa de números não aparecer. Só publique números reais e verificáveis.",
        campos: [
          { chave: "value", rotulo: "Número", exemplo: "+15" },
          { chave: "label", rotulo: "Legenda", exemplo: "anos de experiência" },
        ],
      },
      {
        tipo: "lista-objetos",
        caminho: "testimonials",
        rotulo: "Depoimentos",
        ajuda: "Deixe a lista vazia para a seção não aparecer. Publique apenas depoimentos reais, com autorização do cliente.",
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

  /* --------------------------------------------------------------- SOBRE -- */
  {
    id: "sobre",
    titulo: "Sobre o escritório",
    descricao: "Textos da página /sobre: apresentação, história, princípios, time e chamadas.",
    campos: [
      { tipo: "texto", caminho: "sobre.hero.selo", rotulo: "Selo do topo", origem: "paginas" },
      { tipo: "texto-longo", caminho: "sobre.hero.titulo", rotulo: "Título principal", linhas: 2, origem: "paginas" },
      { tipo: "texto-longo", caminho: "sobre.hero.descricao", rotulo: "Parágrafo de abertura", linhas: 4, origem: "paginas" },
      { tipo: "texto", caminho: "sobre.historia.selo", rotulo: "História — selo", origem: "paginas" },
      { tipo: "texto", caminho: "sobre.historia.titulo", rotulo: "História — título", origem: "paginas" },
      { tipo: "lista-textos", caminho: "sobre.historia.paragrafos", rotulo: "História — parágrafos", ajuda: "Cada item é um parágrafo.", origem: "paginas" },
      { tipo: "texto", caminho: "sobre.historia.missaoTitulo", rotulo: "Missão — título", origem: "paginas" },
      { tipo: "texto-longo", caminho: "sobre.historia.missao", rotulo: "Missão — texto", linhas: 3, origem: "paginas" },
      { tipo: "texto", caminho: "sobre.historia.compromissoTitulo", rotulo: "Compromisso — título", origem: "paginas" },
      { tipo: "texto-longo", caminho: "sobre.historia.compromisso", rotulo: "Compromisso — texto", linhas: 3, origem: "paginas" },
      ...secao("sobre.valores"),
      {
        tipo: "lista-objetos",
        caminho: "sobre.valores.itens",
        rotulo: "Princípios",
        origem: "paginas",
        campos: [
          { chave: "title", rotulo: "Título" },
          { chave: "description", rotulo: "Descrição", tipo: "texto-longo" },
        ],
      },
      ...secao("sobre.time"),
      {
        tipo: "lista-objetos",
        caminho: "sobre.time.itens",
        rotulo: "Time — itens",
        origem: "paginas",
        campos: [
          { chave: "title", rotulo: "Título" },
          { chave: "description", rotulo: "Descrição", tipo: "texto-longo" },
        ],
      },
      { tipo: "texto", caminho: "sobre.time.dadosTitulo", rotulo: "Bloco de dados — título", origem: "paginas" },
      { tipo: "texto", caminho: "sobre.time.atendimento", rotulo: "Bloco de dados — forma de atendimento", origem: "paginas" },
      { tipo: "texto", caminho: "sobre.time.botao", rotulo: "Bloco de dados — botão", origem: "paginas" },
      { tipo: "texto", caminho: "sobre.porQue.selo", rotulo: '"Por que nos escolher" — selo', origem: "paginas" },
      { tipo: "texto", caminho: "sobre.porQue.titulo", rotulo: '"Por que nos escolher" — título', origem: "paginas" },
      { tipo: "texto", caminho: "sobre.ondeAtuamos.selo", rotulo: '"Onde atuamos" — selo', origem: "paginas" },
      { tipo: "texto", caminho: "sobre.ondeAtuamos.titulo", rotulo: '"Onde atuamos" — título', origem: "paginas" },
      { tipo: "texto-longo", caminho: "sobre.ondeAtuamos.descricao", rotulo: '"Onde atuamos" — descrição', linhas: 2, origem: "paginas" },
    ],
  },

  /* ---------------------------------------------- PÁGINA DE CONTATO ------ */
  {
    id: "pagina-contato",
    titulo: "Página de contato",
    descricao:
      "Textos da página /contato. O telefone e o e-mail em si ficam na aba \"Contato e endereço\".",
    campos: [
      { tipo: "texto", caminho: "contato.hero.selo", rotulo: "Selo do topo", origem: "paginas" },
      { tipo: "texto-longo", caminho: "contato.hero.titulo", rotulo: "Título principal", linhas: 2, origem: "paginas" },
      { tipo: "texto-longo", caminho: "contato.hero.descricao", rotulo: "Parágrafo de abertura", linhas: 3, origem: "paginas" },
      { tipo: "texto", caminho: "contato.canais.whatsapp", rotulo: "Cartão WhatsApp — observação", origem: "paginas" },
      { tipo: "texto", caminho: "contato.canais.telefone", rotulo: "Cartão Telefone — observação", origem: "paginas" },
      { tipo: "texto", caminho: "contato.canais.email", rotulo: "Cartão E-mail — observação", origem: "paginas" },
      { tipo: "texto", caminho: "contato.canais.escritorio", rotulo: "Cartão Escritório — observação", origem: "paginas" },
      { tipo: "texto", caminho: "contato.solicitar.selo", rotulo: "Formulário — selo", origem: "paginas" },
      { tipo: "texto-longo", caminho: "contato.solicitar.titulo", rotulo: "Formulário — título", linhas: 2, origem: "paginas" },
      { tipo: "texto-longo", caminho: "contato.solicitar.descricao", rotulo: "Formulário — descrição", linhas: 3, origem: "paginas" },
      { tipo: "lista-textos", caminho: "contato.solicitar.garantias", rotulo: "Formulário — itens de confiança", origem: "paginas" },
      { tipo: "texto", caminho: "contato.solicitar.horarioTitulo", rotulo: "Cartão de horário — título", origem: "paginas" },
      { tipo: "texto", caminho: "contato.solicitar.formularioTitulo", rotulo: "Formulário — cabeçalho", origem: "paginas" },
      { tipo: "texto", caminho: "contato.solicitar.formularioNota", rotulo: "Formulário — observação", origem: "paginas" },
      { tipo: "texto", caminho: "contato.faq.selo", rotulo: "FAQ — selo", origem: "paginas" },
      { tipo: "texto", caminho: "contato.faq.titulo", rotulo: "FAQ — título", origem: "paginas" },
      { tipo: "texto", caminho: "contato.botaoServicos", rotulo: "Botão para a página de serviços", origem: "paginas" },
    ],
  },

  /* -------------------------------------------- PÁGINA DE SERVIÇOS ------- */
  {
    id: "pagina-servicos",
    titulo: "Página de serviços",
    descricao:
      "Textos de /servicos: apresentação, títulos das seções e as combinações de áreas. O conteúdo de cada área fica na aba \"Áreas\".",
    campos: [
      { tipo: "texto", caminho: "servicos.hero.selo", rotulo: "Selo do topo", origem: "paginas" },
      { tipo: "texto-longo", caminho: "servicos.hero.titulo", rotulo: "Título principal", linhas: 2, origem: "paginas" },
      { tipo: "texto-longo", caminho: "servicos.hero.descricao", rotulo: "Parágrafo de abertura", linhas: 4, origem: "paginas" },
      ...secao("servicos.secoes.areas"),
      ...secao("servicos.secoes.resumo"),
      { tipo: "texto", caminho: "servicos.secoes.resumo.colunaServico", rotulo: "Tabela — 1ª coluna", origem: "paginas" },
      { tipo: "texto", caminho: "servicos.secoes.resumo.colunaQuando", rotulo: "Tabela — 2ª coluna", origem: "paginas" },
      { tipo: "texto", caminho: "servicos.secoes.resumo.botaoDetalhes", rotulo: "Tabela — botão", origem: "paginas" },
      ...secao("servicos.secoes.combinacoes"),
      {
        tipo: "lista-objetos",
        caminho: "servicos.secoes.combinacoes.itens",
        rotulo: "Combinações de áreas",
        ajuda: "Arranjos que costumam ser contratados juntos.",
        origem: "paginas",
        campos: [
          { chave: "title", rotulo: "Título" },
          { chave: "description", rotulo: "Descrição", tipo: "texto-longo" },
        ],
      },
      { tipo: "texto", caminho: "servicos.ajuda.titulo", rotulo: "Bloco final — título", origem: "paginas" },
      { tipo: "texto-longo", caminho: "servicos.ajuda.descricao", rotulo: "Bloco final — texto", linhas: 4, origem: "paginas" },
      { tipo: "lista-textos", caminho: "servicos.ajuda.itens", rotulo: "Bloco final — itens", origem: "paginas" },
      { tipo: "texto", caminho: "servicos.ajuda.botao", rotulo: "Bloco final — botão", origem: "paginas" },
      { tipo: "texto", caminho: "servicos.cta.titulo", rotulo: "Chamada final — título", origem: "paginas" },
      { tipo: "texto-longo", caminho: "servicos.cta.descricao", rotulo: "Chamada final — texto", linhas: 2, origem: "paginas" },
    ],
  },

  /* -------------------------------------------------------- PRIVACIDADE -- */
  {
    id: "privacidade",
    titulo: "Política de Privacidade",
    descricao:
      "Texto da página /politica-de-privacidade. Recomendamos revisão pelo responsável jurídico antes de publicar alterações.",
    campos: [
      { tipo: "texto", caminho: "privacidade.hero.selo", rotulo: "Selo do topo", origem: "paginas" },
      { tipo: "texto-longo", caminho: "privacidade.hero.titulo", rotulo: "Título principal", linhas: 2, origem: "paginas" },
      { tipo: "texto-longo", caminho: "privacidade.hero.descricao", rotulo: "Parágrafo de abertura", linhas: 3, origem: "paginas" },
      { tipo: "texto-longo", caminho: "privacidade.avisoAtualizacao", rotulo: "Aviso de última atualização", linhas: 3, origem: "paginas" },
      {
        tipo: "json",
        caminho: "privacidade.blocos",
        rotulo: "Itens da política",
        ajuda:
          'Lista de { title, paragraphs: [], list: [] }. Os marcadores {{razaoSocial}}, {{cnpj}}, {{crc}} e {{endereco}} são substituídos automaticamente.',
        linhas: 26,
        origem: "paginas",
      },
      { tipo: "texto", caminho: "privacidade.contatoBloco.titulo", rotulo: "Bloco final — título", origem: "paginas" },
      { tipo: "texto-longo", caminho: "privacidade.contatoBloco.antesWhatsapp", rotulo: "Bloco final — texto antes do WhatsApp", linhas: 2, origem: "paginas" },
      { tipo: "texto", caminho: "privacidade.contatoBloco.entre", rotulo: "Bloco final — texto entre WhatsApp e e-mail", origem: "paginas" },
      { tipo: "texto", caminho: "privacidade.contatoBloco.depois", rotulo: "Bloco final — texto final", origem: "paginas" },
      { tipo: "texto", caminho: "privacidade.botao", rotulo: "Botão para a página de contato", origem: "paginas" },
    ],
  },

  /* ------------------------------------------------------- CHAMADA FINAL -- */
  {
    id: "cta",
    titulo: "Chamada final (padrão)",
    descricao:
      "Bloco de contato que aparece no fim da maioria das páginas. Páginas que trazem título próprio, como Serviços, têm o texto na própria aba.",
    campos: [
      { tipo: "texto", caminho: "ctaPadrao.selo", rotulo: "Selo", origem: "paginas" },
      { tipo: "texto-longo", caminho: "ctaPadrao.titulo", rotulo: "Título", linhas: 2, origem: "paginas" },
      { tipo: "texto-longo", caminho: "ctaPadrao.descricao", rotulo: "Descrição", linhas: 3, origem: "paginas" },
      { tipo: "lista-textos", caminho: "ctaPadrao.garantias", rotulo: "Itens de confiança", ajuda: "Máximo de três ícones são exibidos.", origem: "paginas" },
      { tipo: "texto", caminho: "ctaPadrao.tituloFormulario", rotulo: "Cartão do formulário — título", origem: "paginas" },
      { tipo: "texto", caminho: "ctaPadrao.notaFormulario", rotulo: "Cartão do formulário — observação", origem: "paginas" },
    ],
  },
];

/* ------------------------------------------------------------------ ÁREAS -- */

/** Campos editáveis por formulário em cada área. */
export const camposDaArea: Campo[] = [
  { tipo: "texto", caminho: "name", rotulo: "Nome da área", ajuda: "Como aparece no menu, nos cards e no título da página." },
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
  { tipo: "texto", caminho: "audience.title", rotulo: 'Título de "Para quem é"' },
  { tipo: "texto-longo", caminho: "audience.lead", rotulo: 'Texto de "Para quem é"', linhas: 2 },
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
  { tipo: "json", caminho: "audience.items", rotulo: "Para quem é (itens)", linhas: 12, ajuda: "Lista de { title, description }." },
  { tipo: "json", caminho: "scope", rotulo: "Escopo", linhas: 18, ajuda: "Lista de { title, description, items: [] }." },
  { tipo: "json", caminho: "methodology", rotulo: "Metodologia", linhas: 12, ajuda: "Lista de { step, title, description }." },
  { tipo: "json", caminho: "deliverables", rotulo: "Entregáveis", linhas: 8, ajuda: "Lista de textos." },
  { tipo: "json", caminho: "faq", rotulo: "Perguntas frequentes", linhas: 12, ajuda: "Lista de { question, answer }." },
  { tipo: "json", caminho: "seo.keywords", rotulo: "Palavras-chave", linhas: 6, ajuda: "Lista de textos." },
];
