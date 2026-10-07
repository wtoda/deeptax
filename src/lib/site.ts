/**
 * ============================================================================
 *  CONFIGURAÇÃO CENTRAL DA DEEPTAX
 * ============================================================================
 *  Este é o ÚNICO arquivo que você precisa editar para publicar o site.
 *
 *  CONVENÇÃO: campos que ainda não têm dado real ficam como string vazia ("")
 *  e a interface simplesmente NÃO os exibe. Nada de dado inventado no ar.
 *  Procure por  PENDENTE  para achar o que falta.
 * ============================================================================
 */

export type Stat = { value: string; label: string };
export type Testimonial = { quote: string; author: string; company: string };

export const site = {
  /* ---------------------------------------------------------------- MARCA */
  name: "Deeptax",
  /**
   * Razão social exibida no site. Por decisão do escritório, a marca DeepTax
   * passa a ser também o nome apresentado — antes constava o registro
   * "FORTY FIVE CONSULTORIA FISCAL CONTABILIDADE TECNOLOGIA LTDA".
   *
   * CONFERIR: se a nova razão social registrada (Junta Comercial / CRC) for a
   * forma completa, no padrão do CNPJ — "Deeptax Consultoria Fiscal
   * Contabilidade Tecnologia Ltda" —, basta trocar o valor abaixo. Hoje exibe
   * apenas "Deeptax", que também alimenta a linha de copyright do rodapé.
   */
  legalName: "Deeptax",
  // CONFERIR: nome fantasia informado antes pelo escritório. Não consta no
  // registro consultado — confirmar se deve mesmo ser exibido.
  tradeName: "DeepAdvisory Estratégia Empresarial",
  cnpj: "45.691.496/0001-25",
  crc: "CRC-SP 2SP045819/O-4",
  tagline: "Contabilidade, tributos e tecnologia com visão de negócio",
  shortDescription:
    "Escritório que reúne contabilidade, especialistas em tributos, tecnologia fiscal, perícia contábil, consultoria e compliance em um só lugar — com rigor técnico e leitura estratégica.",
  // Domínio canônico do site. Controla canonical, sitemap, robots e Open Graph.
  //
  // O apex deeptax.com.br responde 308 e redireciona para www, então o endereço
  // oficial é o com www. NEXT_PUBLIC_SITE_URL pode sobrescrever este valor.
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.deeptax.com.br").replace(
    /\/+$/,
    "",
  ),

  /* -------------------------------------------------------------- CONTATO */
  contact: {
    // Número informado é móvel: (11) 9-3236-2770 -> formato correto (11) 93236-2770
    phone: "(11) 93236-2770",
    whatsapp: "(11) 93236-2770",
    // SOMENTE DÍGITOS, com 55 + DDD. É este campo que monta os links wa.me.
    whatsappNumber: "5511932362770",
    email: "atendimento@deeptax.com.br",
    commercialEmail: "atendimento@deeptax.com.br",
    address: {
      street: "Avenida Paulista, 1636",
      complement: "Conjunto 1504",
      district: "Bela Vista",
      city: "São Paulo",
      state: "SP",
      zip: "01310-200",
      country: "Brasil",
    },
    hours: "Segunda a sexta, das 9h às 18h",
  },

  /* ------------------------------------------------------------- REDES/EXTRA */
  // PENDENTE: URLs dos perfis. Enquanto vazios, os ícones não aparecem.
  social: {
    linkedin: "",
    instagram: "",
  },

  /* ------------------------------------------------------------- NÚMEROS */
  // PENDENTE: publique apenas números reais e verificáveis. Enquanto o array
  // estiver vazio, a faixa de números desaparece do site inteiro.
  // Formato esperado:
  //   { value: "+15", label: "anos de experiência" },
  //   { value: "+400", label: "empresas atendidas" },
  //   { value: "100%", label: "prazos cumpridos" },
  stats: [] as Stat[],

  /* --------------------------------------------------------- DIFERENCIAIS */
  differentials: [
    {
      icon: "shield",
      title: "Rigor técnico",
      description:
        "Trabalho conduzido conforme as normas brasileiras de contabilidade e os pronunciamentos do CPC, com documentação de cada conclusão.",
    },
    {
      icon: "chart",
      title: "Leitura estratégica",
      description:
        "Não entregamos apenas números: traduzimos o resultado contábil em decisões práticas de caixa, preço, imposto e crescimento.",
    },
    {
      icon: "clock",
      title: "Prazos previsíveis",
      description:
        "Calendário fiscal definido no início do ano e um contato direto que responde quando você precisa, não quando sobra tempo.",
    },
    {
      icon: "users",
      title: "Time sênior dedicado",
      description:
        "Você fala com quem executa. Sócios e especialistas acompanham pessoalmente cada cliente da carteira.",
    },
    {
      icon: "lock",
      title: "Segurança e sigilo",
      description:
        "Dados tratados em ambiente controlado, com política de sigilo e conformidade com a LGPD em todos os processos.",
    },
    {
      icon: "sparkles",
      title: "Tecnologia aplicada",
      description:
        "Integração com sistemas de gestão, conciliação automatizada e relatórios em painel, sem planilha perdida em e-mail.",
    },
  ],

  /* ------------------------------------------------------------ COMO FUNCIONA */
  process: [
    {
      step: "01",
      title: "Diagnóstico gratuito",
      description:
        "Uma conversa de 30 minutos para entender o momento da empresa, o regime tributário e as dores do dia a dia.",
    },
    {
      step: "02",
      title: "Proposta sob medida",
      description:
        "Você recebe escopo, entregáveis e honorários por escrito. Sem surpresa e sem taxa escondida.",
    },
    {
      step: "03",
      title: "Implantação organizada",
      description:
        "Migramos documentos, sistemas e histórico com cronograma definido e responsáveis nomeados.",
    },
    {
      step: "04",
      title: "Acompanhamento contínuo",
      description:
        "Rotina mensal de obrigações somada a reuniões periódicas de resultado e planejamento tributário.",
    },
  ],

  /* -------------------------------------------------------------- DEPOIMENTOS */
  // PENDENTE: depoimentos reais, com autorização escrita do cliente. Enquanto
  // o array estiver vazio, a seção de depoimentos não é renderizada.
  // Formato esperado:
  //   { quote: "texto do depoimento", author: "Diretora Financeira", company: "Indústria — SP" },
  testimonials: [] as Testimonial[],

  /* ------------------------------------------------------------------- FAQ */
  faq: [
    {
      question: "Vocês atendem empresas de qual porte?",
      answer:
        "Atendemos do MEI e Simples Nacional até indústrias de médio porte com faturamento na casa das centenas de milhões. O escopo e o time são dimensionados para cada operação.",
    },
    {
      question: "É possível trocar de contador no meio do ano?",
      answer:
        "Sim, e é mais comum do que parece. Fazemos a transição do histórico, conciliamos saldos de abertura e assumimos as obrigações sem interrupção nem multa por atraso.",
    },
    {
      question: "Como funciona o atendimento remoto?",
      answer:
        "A maior parte da nossa carteira é atendida de forma remota, com reuniões por vídeo e canal direto com o time. Também recebemos clientes presencialmente em nosso escritório, com agendamento.",
    },
    {
      question: "Quanto custa uma perícia ou um projeto de consultoria?",
      answer:
        "Depende do escopo, do volume de documentos e do prazo. Após uma conversa inicial de diagnóstico, enviamos uma proposta fechada com etapas de entrega bem definidas.",
    },
    {
      question: "Vocês emitem laudo para uso judicial?",
      answer:
        "Sim. Elaboramos laudos e pareceres técnicos assinados por contador com registro ativo no CRC, aptos a instruir processos judiciais, arbitragens e procedimentos administrativos.",
    },
  ],
};

/* --------------------------------------------------------------- DERIVADOS */

/**
 * Monta o endereço completo ignorando as partes ainda não preenchidas.
 * O CEP entra após a cidade/UF separado por vírgula — usar outro travessão
 * aqui deixaria a linha com duas quebras e leitura confusa.
 * Resultado: "Avenida Paulista, 1636, Conjunto 1504 — Bela Vista,
 * São Paulo/SP, 01310-200"
 */
export const fullAddress = [
  [site.contact.address.street, site.contact.address.complement]
    .filter(Boolean)
    .join(", "),
  [
    site.contact.address.district,
    `${site.contact.address.city}/${site.contact.address.state}${
      site.contact.address.zip ? `, ${site.contact.address.zip}` : ""
    }`,
  ]
    .filter(Boolean)
    .join(", "),
]
  .filter(Boolean)
  .join(" — ");

/** Endereço curto, usado em consultas de mapa. */
export const mapAddress = fullAddress;

export const whatsappLink = (message?: string) =>
  `https://wa.me/${site.contact.whatsappNumber}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;

export const defaultWhatsappMessage =
  `Olá! Vim pelo site da ${site.name} e gostaria de falar sobre os serviços contábeis.`;

export const navigation = [
  { label: "Início", href: "/" },
  { label: "Serviços", href: "/servicos" },
  { label: "Sobre", href: "/sobre" },
  { label: "Contato", href: "/contato" },
] as const;
