export type FaqItem = { question: string; answer: string };

export type ServiceContent = {
  slug: string;
  /** Nome da área, como o escritório a apresenta ao mercado. */
  name: string;
  shortName: string;
  tagline: string;
  summary: string;
  icon: "cpu" | "receipt" | "ledger" | "gavel" | "compass" | "shield";
  accent: string;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    highlights: string[];
  };
  intro: { title: string; paragraphs: string[] };
  audience: { title: string; lead: string; items: { title: string; description: string }[] };
  scope: { title: string; description: string; items: string[] }[];
  methodology: { step: string; title: string; description: string }[];
  deliverables: string[];
  faq: FaqItem[];
  cta: { title: string; description: string };
  seo: { title: string; description: string; keywords: string[] };
};

/**
 * As seis áreas do escritório. As páginas internas de serviço são geradas
 * automaticamente a partir desta lista por src/app/servicos/[slug]/page.tsx —
 * acrescentar, remover ou renomear uma área aqui atualiza sozinho a navegação,
 * o rodapé, os cards, o sitemap e a rota.
 */
export const services: ServiceContent[] = [
  /* ==========================================================================
   *  DEEP SYSTEMS — tecnologia e sistemas para a área fiscal
   * ======================================================================== */
  {
    slug: "deep-systems",
    name: "Deep Systems",
    shortName: "Deep Systems",
    tagline: "Tecnologia própria para a rotina fiscal e contábil",
    summary:
      "Desenvolvemos sistemas e automações para a área fiscal: integração de dados, conciliação automática, apuração assistida e painéis de acompanhamento sob medida.",
    icon: "cpu",
    accent: "from-violet-500 to-indigo-500",
    hero: {
      eyebrow: "Tecnologia",
      title: "Sistemas que tiram a operação fiscal do trabalho manual",
      subtitle:
        "A Deep Systems é a área de tecnologia do escritório. Desenvolvemos soluções sob medida para a rotina fiscal e contábil — do tratamento de arquivos à conciliação automática e aos painéis de acompanhamento.",
      highlights: [
        "Desenvolvimento de sistemas para a área fiscal",
        "Automação de conciliações e conferências",
        "Integração entre ERP, notas fiscais e contabilidade",
        "Painéis gerenciais sob medida para a sua operação",
      ],
    },
    intro: {
      title: "O que a tecnologia resolve na prática",
      paragraphs: [
        "Boa parte do tempo de uma equipe fiscal e contábil é consumido por trabalho repetitivo: baixar arquivo, conferir linha por linha, reconciliar planilha, refazer cálculo porque a origem mudou. É trabalho necessário, mas não é trabalho que exige julgamento humano — e é justamente aí que a automação rende mais.",
        "A Deep Systems existe para resolver essa camada. Desenhamos e desenvolvemos sistemas que leem os arquivos que a sua operação já gera, conferem o que precisa ser conferido e entregam a informação consolidada. O contador deixa de digitar e passa a analisar.",
        "Também integramos o que já existe: ERP, emissor de nota, sistema de folha, balanço. Em vez de trocar tudo, conectamos as pontas e eliminamos a redigitação e a divergência entre sistemas.",
      ],
    },
    audience: {
      title: "Para quem faz sentido",
      lead: "A área de tecnologia atende tanto clientes do escritório quanto operações que só precisam resolver um problema específico de dados fiscais.",
      items: [
        {
          title: "Operações com volume alto de documentos",
          description:
            "Empresas que emitem ou recebem milhares de notas por mês e não conseguem mais conferir tudo manualmente com segurança.",
        },
        {
          title: "Rotinas com muitos sistemas",
          description:
            "Negócios que usam ERP, sistema de vendas e folha separados e hoje redigitam informação entre eles.",
        },
        {
          title: "Grupos com várias unidades",
          description:
            "Operações com filiais em que consolidar o resultado exige juntar arquivos de origens diferentes.",
        },
        {
          title: "Escritórios e equipes fiscais",
          description:
            "Times que precisam ganhar produtividade sem aumentar o quadro, automatizando a conferência de obrigações.",
        },
      ],
    },
    scope: [
      {
        title: "Desenvolvimento de sistemas fiscais",
        description:
          "Soluções construídas sob medida para o processo real da sua empresa, e não o contrário.",
        items: [
          "Leitura e tratamento de arquivos fiscais (XML, SPED, EFD, retornos de sistema)",
          "Conferência automática entre nota, escrituração e apuração",
          "Apuração assistida de tributos com trilha de cálculo",
          "Geração de obrigações acessórias a partir dos dados tratados",
          "Controle de créditos e saldos a compensar",
          "Emissão de relatórios de divergência para tratamento",
        ],
      },
      {
        title: "Automação e integração",
        description:
          "Conectamos os sistemas que você já usa para acabar com a redigitação e a divergência.",
        items: [
          "Integração entre ERP, emissor de notas e a contabilidade",
          "Importação automática de extratos e conciliação bancária",
          "Rotinas agendadas de coleta e consolidação de dados",
          "Robôs para tarefas repetitivas de portais e sistemas",
          "Ambiente de validação antes de gravar na base contábil",
        ],
      },
      {
        title: "Painéis e informação gerencial",
        description:
          "Transformamos dado bruto em painel que a diretoria consegue ler sem depender de planilha montada à mão.",
        items: [
          "Painel de apuração e carga tributária por período",
          "Acompanhamento de indicadores fiscais e contábeis",
          "Alertas de vencimento e de divergência",
          "Visões por filial, centro de custo ou produto",
          "Exportação para conferência e auditoria",
        ],
      },
      {
        title: "Infraestrutura e segurança dos dados",
        description:
          "Cuidamos de onde a informação fiscal fica guardada e de quem consegue acessá-la.",
        items: [
          "Estruturação de repositório único de documentos fiscais",
          "Controle de acesso por perfil de usuário",
          "Rotina de backup e retenção conforme o prazo legal",
          "Trilha de auditoria das alterações",
          "Boas práticas de proteção de dados alinhadas à LGPD",
        ],
      },
    ],
    methodology: [
      {
        step: "01",
        title: "Mapeamento do processo atual",
        description:
          "Acompanhamos como o trabalho é feito hoje, com quem executa, quais arquivos entram e onde estão os gargalos e os retrabalhos.",
      },
      {
        step: "02",
        title: "Desenho da solução",
        description:
          "Definimos o que será automatizado, o que continua manual por exigir julgamento e qual o ganho esperado em horas e em confiabilidade.",
      },
      {
        step: "03",
        title: "Desenvolvimento e testes",
        description:
          "Construímos o sistema em etapas curtas, validando com dados reais do cliente antes de avançar para a próxima função.",
      },
      {
        step: "04",
        title: "Implantação assistida",
        description:
          "Colocamos em produção acompanhando a equipe, comparando o resultado automático com o manual até haver confiança total no processo.",
      },
      {
        step: "05",
        title: "Evolução contínua",
        description:
          "Ajustamos regras conforme a legislação e a operação mudam, com suporte para dúvidas e melhorias ao longo do uso.",
      },
    ],
    deliverables: [
      "Sistema ou automação funcionando no ambiente da empresa",
      "Documentação de uso e treinamento da equipe envolvida",
      "Trilha de cálculo conferível para cada apuração automatizada",
      "Relatórios de divergência e rotina de tratamento definida",
      "Painéis de acompanhamento publicados e acessíveis",
      "Suporte e manutenção evolutiva conforme contrato",
    ],
    faq: [
      {
        question: "Vocês desenvolvem sistema para qualquer tipo de empresa?",
        answer:
          "Atuamos com foco na área fiscal e contábil, que é onde temos conhecimento do domínio. O porte varia de operações com algumas centenas de notas por mês até indústrias com volume alto e múltiplas filiais.",
      },
      {
        question: "Preciso trocar meu ERP?",
        answer:
          "Não. Na maior parte dos casos integramos o que já existe. Trocar sistema é caro e demorado; conectar as pontas costuma resolver o problema com muito menos impacto na operação.",
      },
      {
        question: "O sistema fica hospedado onde?",
        answer:
          "Definimos junto com o cliente: pode rodar na infraestrutura dele, em nuvem contratada por ele ou em ambiente nosso, conforme a exigência de segurança e a política interna da empresa.",
      },
      {
        question: "Como funciona a cobrança de um desenvolvimento?",
        answer:
          "Depois do mapeamento apresentamos escopo fechado com etapas, prazo e valor. Projetos maiores podem ser divididos em fases, com entrega e validação a cada etapa.",
      },
      {
        question: "A automação substitui o contador?",
        answer:
          "Não, e não é esse o objetivo. A automação assume a conferência repetitiva e a digitação. O julgamento sobre o que fazer com a informação — classificação, tese aplicável, decisão — continua sendo trabalho de contador.",
      },
    ],
    cta: {
      title: "Sua rotina fiscal ainda depende de conferência manual?",
      description:
        "Conte como o processo funciona hoje. Avaliamos o que dá para automatizar, o ganho esperado e o esforço envolvido — sem compromisso.",
    },
    seo: {
      title: "Deep Systems — Tecnologia e sistemas para a área fiscal",
      description:
        "Desenvolvimento de sistemas fiscais, automação de conciliações, integração entre ERP e contabilidade e painéis gerenciais sob medida para a sua operação.",
      keywords: [
        "sistema fiscal",
        "automação fiscal",
        "tecnologia contábil",
        "integração ERP contabilidade",
        "conciliação automática",
      ],
    },
  },

  /* ==========================================================================
   *  DEEPTAX — tributário
   * ======================================================================== */
  {
    slug: "deep-tax",
    name: "DeepTax",
    shortName: "DeepTax",
    tagline: "Especialistas em tributos, revisão fiscal e créditos",
    summary:
      "Revisão fiscal completa, apuração e recuperação de créditos tributários, análise de enquadramento e defesa técnica em autuações — com especialistas dedicados à área tributária.",
    icon: "receipt",
    accent: "from-emerald-500 to-teal-400",
    hero: {
      eyebrow: "Tributário",
      title: "Revisão fiscal que encontra o que passou despercebido",
      subtitle:
        "A DeepTax reúne os especialistas em tributos do escritório. Revisamos a apuração, recuperamos créditos que a empresa deixou de aproveitar e sustentamos tecnicamente cada posição adotada.",
      highlights: [
        "Revisão fiscal dos últimos exercícios",
        "Apuração e recuperação de créditos tributários",
        "Análise e escolha de regime de tributação",
        "Defesa técnica em autuações e consultas fiscais",
      ],
    },
    intro: {
      title: "O que a revisão fiscal resolve na prática",
      paragraphs: [
        "Quase toda empresa carrega crédito tributário que não aproveitou. Não por má-fé, mas porque a apuração é feita no ritmo do mês: entra nota, sai guia, e ninguém sobra tempo para perguntar se aquele valor poderia ter sido creditado, se aquele produto tem alíquota menor ou se aquele período tinha direito a um benefício que ninguém aplicou.",
        "A DeepTax existe para fazer essa pergunta com método. Revisamos a apuração de períodos anteriores confrontando o que foi recolhido com o que a legislação efetivamente exigia, documento por documento, e quantificamos o que há a recuperar.",
        "Nosso compromisso é com a posição defensável. Toda conclusão vem acompanhada do fundamento legal e da análise de risco associada — porque crédito que não se sustenta em fiscalização não é economia, é contingência.",
      ],
    },
    audience: {
      title: "Para quem faz sentido",
      lead: "A revisão fiscal rende mais em operações com volume relevante de tributos e em empresas que cresceram sem revisar o enquadramento.",
      items: [
        {
          title: "Empresas com carga tributária relevante",
          description:
            "Negócios em que ICMS, PIS, COFINS, IPI, ISS ou IRPJ representam parcela significativa do faturamento.",
        },
        {
          title: "Operações que nunca fizeram revisão",
          description:
            "Empresas que apuram há anos do mesmo jeito e nunca confrontaram o recolhido com o devido.",
        },
        {
          title: "Empresas autuadas ou notificadas",
          description:
            "Casos em que é preciso responder ao fisco com sustentação técnica e prazo curto.",
        },
        {
          title: "Grupos em reestruturação",
          description:
            "Momentos de reorganização societária, em que a definição do regime e da estrutura muda a carga tributária.",
        },
      ],
    },
    scope: [
      {
        title: "Revisão fiscal e recuperação de créditos",
        description:
          "Confronto entre o tributo recolhido e o efetivamente devido, com quantificação do crédito e orientação para aproveitamento.",
        items: [
          "Revisão de ICMS, incluindo substituição tributária e antecipação",
          "Revisão de PIS e COFINS, regime cumulativo e não cumulativo",
          "Revisão de IPI, ISS e retenções na fonte",
          "Revisão de IRPJ e CSLL, incluindo adições e exclusões",
          "Levantamento de créditos não aproveitados e saldos a compensar",
          "Análise de prescrição e definição da estratégia de recuperação",
          "Elaboração de pedidos de restituição e compensação",
        ],
      },
      {
        title: "Apuração e enquadramento tributário",
        description:
          "Definição técnica de como a empresa deve apurar, com simulação de cenários antes de qualquer mudança.",
        items: [
          "Simulação comparativa de Simples Nacional, Presumido e Real",
          "Definição de regime com base em dados reais da operação",
          "Análise de benefícios fiscais e incentivos aplicáveis",
          "Revisão da tributação da folha e da remuneração de sócios",
          "Parecer técnico sobre operações específicas",
          "Orientação sobre o momento adequado de mudar de regime",
        ],
      },
      {
        title: "Contencioso e defesa técnica",
        description:
          "Resposta ao fisco sustentada em norma e em documento, dentro do prazo.",
        items: [
          "Defesa em autos de infração e notificações",
          "Impugnação e recurso em processo administrativo fiscal",
          "Elaboração de consultas formais ao fisco",
          "Parecer sobre risco de autuação em operações em curso",
          "Acompanhamento de fiscalizações e intimações",
          "Apoio técnico em discussão judicial com o advogado responsável",
        ],
      },
    ],
    methodology: [
      {
        step: "01",
        title: "Levantamento do histórico",
        description:
          "Coleta de escriturações, guias, declarações e notas dos períodos a revisar, delimitando o alcance do trabalho.",
      },
      {
        step: "02",
        title: "Reconstituição da apuração",
        description:
          "Recalculamos os tributos do período conforme a legislação aplicável, identificando divergências entre o devido e o recolhido.",
      },
      {
        step: "03",
        title: "Quantificação e análise de risco",
        description:
          "Mensuramos cada crédito encontrado, classificando por grau de segurança jurídica e por esforço necessário para aproveitamento.",
      },
      {
        step: "04",
        title: "Plano de aproveitamento",
        description:
          "Definimos a via mais adequada para cada crédito — compensação, restituição ou revisão de apuração futura — com cronograma.",
      },
      {
        step: "05",
        title: "Execução e acompanhamento",
        description:
          "Elaboramos e protocolamos os pedidos, acompanhamos a análise pelo fisco e monitoramos o aproveitamento efetivo.",
      },
    ],
    deliverables: [
      "Relatório de revisão fiscal com o crédito apurado em valores",
      "Memória de cálculo de cada divergência encontrada",
      "Parecer técnico com fundamentação legal e análise de risco",
      "Pedidos de restituição e compensação elaborados e protocolados",
      "Simulação comparativa de regime tributário, quando aplicável",
      "Acompanhamento do processo até o aproveitamento do crédito",
    ],
    faq: [
      {
        question: "Por quanto tempo atrás é possível revisar?",
        answer:
          "Em regra, alcançam-se os tributos sujeitos a lançamento por homologação nos últimos cinco anos contados do fato gerador. Existem exceções e particularidades por tributo, avaliadas no levantamento inicial.",
      },
      {
        question: "Quanto tempo leva uma revisão fiscal?",
        answer:
          "Depende do volume de documentos e do número de tributos envolvidos. Revisões focadas ficam prontas em três a seis semanas; trabalhos amplos, com vários exercícios e estabelecimentos, podem levar alguns meses.",
      },
      {
        question: "O crédito encontrado é dinheiro de volta?",
        answer:
          "Nem sempre em espécie. Na maioria dos casos o aproveitamento se dá por compensação com tributos vincendos, o que reduz o desembolso mensal. Restituição em dinheiro é possível em situações específicas e depende de análise do fisco.",
      },
      {
        question: "Vocês garantem que o crédito será reconhecido?",
        answer:
          "Não. Quem reconhece crédito é o fisco ou o Judiciário. O que garantimos é o trabalho técnico: apuramos com método, apresentamos a memória de cálculo e informamos com franqueza o grau de risco de cada tese antes de você decidir avançar.",
      },
      {
        question: "A revisão pode gerar problema com o fisco?",
        answer:
          "A revisão em si é um direito do contribuinte e não gera penalidade. O cuidado necessário é não aproveitar crédito sem sustentação: por isso classificamos cada tese por risco e recomendamos não avançar sobre as que não se sustentariam em fiscalização.",
      },
    ],
    cta: {
      title: "Sua empresa pode estar recolhendo mais do que deveria",
      description:
        "Uma análise inicial de apuração mostra, em valores, onde estão as oportunidades mais evidentes. Sem compromisso e sem custo.",
    },
    seo: {
      title: "DeepTax — Revisão fiscal e recuperação de créditos tributários",
      description:
        "Revisão fiscal, apuração e recuperação de créditos tributários, análise de regime e defesa técnica em autuações. Especialistas em tributos do escritório DeepTax.",
      keywords: [
        "revisão fiscal",
        "recuperação de créditos tributários",
        "planejamento tributário",
        "consultoria tributária",
        "defesa em autuação fiscal",
      ],
    },
  },

  /* ==========================================================================
   *  DEEPCONT — contabilidade
   * ======================================================================== */
  {
    slug: "deep-cont",
    name: "DeepCont",
    shortName: "DeepCont",
    tagline: "Toda a contabilidade da empresa em dia",
    summary:
      "A área contábil do escritório: folha de pagamento, escrituração contábil e fiscal, controle de estoque, ativo imobilizado, obrigações acessórias e relatórios gerenciais.",
    icon: "ledger",
    accent: "from-sky-500 to-cyan-400",
    hero: {
      eyebrow: "Contabilidade",
      title: "A contabilidade do mês fechada no prazo, com número em que se pode confiar",
      subtitle:
        "A DeepCont é a área contábil da DeepTax. Cuidamos da folha de pagamento, da escrituração contábil, do controle de estoque e do ativo imobilizado, da escrita fiscal e de todas as obrigações acessórias — para que a sua equipe cuide do negócio.",
      highlights: [
        "Folha de pagamento e departamento pessoal completos",
        "Escrituração contábil e escrita fiscal",
        "Controle de estoque e ativo imobilizado",
        "Todas as obrigações acessórias dentro do prazo",
      ],
    },
    intro: {
      title: "O que a contabilidade resolve na prática",
      paragraphs: [
        "Contabilidade bem feita é invisível: as guias chegam com o valor certo, os prazos são cumpridos, a folha fecha sem erro e ninguém recebe notificação. O problema é que muitos escritórios entregam apenas essa camada — e o empresário segue sem saber se o mês foi bom.",
        "A DeepCont opera a rotina com processo e tecnologia, o que libera tempo para a parte que interessa: traduzir os números. Todo mês você recebe o balancete, a apuração dos tributos e um resumo gerencial com a leitura do resultado, a variação de caixa e os pontos de atenção.",
        "Atendemos empresas de todos os regimes — MEI, Simples Nacional, Lucro Presumido e Lucro Real — com escopo dimensionado ao porte e ao setor, e com um responsável nomeado que conhece a sua operação pelo nome.",
      ],
    },
    audience: {
      title: "Para quem faz sentido",
      lead: "Atendemos do profissional autônomo que está abrindo CNPJ até indústrias de médio porte com folha relevante e estoque a controlar.",
      items: [
        {
          title: "Empresas em abertura",
          description:
            "Constituição da empresa, escolha do regime, alvarás e licenças, com a base contábil montada corretamente desde o primeiro dia.",
        },
        {
          title: "Prestadores de serviços",
          description:
            "Profissionais liberais, agências, consultorias e empresas de tecnologia, com atenção a retenções, ISS e tributos sobre serviços.",
        },
        {
          title: "Comércio e indústria",
          description:
            "Operações com estoque, créditos de ICMS e IPI, inventário e custo apurado com critério, além do controle do ativo imobilizado.",
        },
        {
          title: "Empresas trocando de contador",
          description:
            "Transição de histórico, conciliação de saldos de abertura e regularização de pendências sem interromper as obrigações.",
        },
      ],
    },
    scope: [
      {
        title: "Escrituração contábil",
        description:
          "Registro completo das operações, com conciliações e demonstrações elaboradas conforme as normas vigentes.",
        items: [
          "Classificação e lançamento de documentos fiscais",
          "Conciliação bancária, de clientes e de fornecedores",
          "Elaboração de balancete, DRE e balanço patrimonial",
          "Demonstrações do fluxo de caixa e do valor adicionado",
          "Escrituração do livro diário e razão",
          "Encerramento de exercício e destinação do resultado",
          "Notas explicativas e demonstrações consolidadas, quando aplicável",
        ],
      },
      {
        title: "Escrita fiscal e apuração de tributos",
        description:
          "Apuração mensal com reaproveitamento de créditos e controle dos benefícios aplicáveis à operação.",
        items: [
          "Apuração de ICMS, IPI, PIS, COFINS, ISS e Simples Nacional",
          "Apuração de IRPJ e CSLL nos regimes presumido e real",
          "Controle de créditos, compensações e saldos a recuperar",
          "Emissão e conferência de guias de recolhimento",
          "Escrituração fiscal digital (EFD ICMS/IPI e EFD Contribuições)",
          "Controle de substituição tributária e antecipação",
          "Revisão de retenções na fonte e contribuições",
        ],
      },
      {
        title: "Folha de pagamento e departamento pessoal",
        description:
          "Gestão completa da folha e das relações trabalhistas, com conformidade e prazos rigorosamente observados.",
        items: [
          "Admissão, demissão e controle de documentação",
          "Processamento de folha, férias, rescisões e 13º salário",
          "Cálculo de INSS, FGTS, IRRF e contribuições sindicais",
          "Envio de eventos ao eSocial e à DCTFWeb",
          "Controle de ponto, horas extras e banco de horas",
          "Gestão de benefícios, afastamentos e licenças",
          "Apoio em fiscalizações trabalhistas",
        ],
      },
      {
        title: "Estoque e ativo imobilizado",
        description:
          "Controle patrimonial e de inventário que sustenta o custo e o resultado da operação.",
        items: [
          "Controle e avaliação de estoques por critério definido",
          "Acompanhamento e conciliação de inventário físico",
          "Fichas de controle do ativo imobilizado",
          "Cálculo de depreciação, amortização e exaustão",
          "Baixas, transferências e reavaliação de bens",
          "Conciliação entre o controle patrimonial e a contabilidade",
        ],
      },
      {
        title: "Obrigações acessórias e regularização",
        description:
          "Calendário fiscal controlado, entregas no prazo e regularização de pendências junto aos órgãos.",
        items: [
          "SPED Fiscal, SPED Contribuições, ECD e ECF",
          "DCTFWeb, EFD-Reinf, DIRF e DEFIS",
          "Declaração do Simples Nacional e PGMEI",
          "Regularização de declarações em atraso",
          "Acompanhamento da caixa postal do e-CAC",
          "Gestão de certidões negativas e parcelamentos",
        ],
      },
    ],
    methodology: [
      {
        step: "01",
        title: "Onboarding e diagnóstico",
        description:
          "Levantamento da situação atual, conferência de pendências nos órgãos, análise do regime e definição do escopo mensal.",
      },
      {
        step: "02",
        title: "Migração do histórico",
        description:
          "Importação de saldos, cadastros e documentos, com conciliação de abertura e cronograma de transição acordado por escrito.",
      },
      {
        step: "03",
        title: "Rotina mensal controlada",
        description:
          "Calendário fiscal definido, coleta organizada de documentos e conferência interna antes do envio de qualquer guia.",
      },
      {
        step: "04",
        title: "Apuração e entrega",
        description:
          "Fechamento contábil, apuração dos tributos, envio das obrigações acessórias e disponibilização dos relatórios no prazo combinado.",
      },
      {
        step: "05",
        title: "Gestão e melhoria contínua",
        description:
          "Reunião periódica de resultado, revisão do enquadramento tributário e ajustes de processo conforme a operação evolui.",
      },
    ],
    deliverables: [
      "Balancete mensal, DRE e balanço patrimonial",
      "Guias de recolhimento apuradas e conferidas",
      "Folha de pagamento processada e informes trabalhistas",
      "Todas as obrigações acessórias entregues dentro do prazo",
      "Controle de estoque e de ativo imobilizado atualizados",
      "Resumo gerencial mensal com leitura do resultado e do caixa",
    ],
    faq: [
      {
        question: "Quanto custa a contabilidade mensal?",
        answer:
          "O honorário varia conforme o regime tributário, o volume de notas, o tamanho da folha e o nível de relatório gerencial contratado. Após o diagnóstico gratuito, apresentamos proposta fechada e sem taxa surpresa.",
      },
      {
        question: "Preciso levar documentos todos os meses ao escritório?",
        answer:
          "Não. A coleta é digital, com upload em ambiente controlado ou integração direta com o seu sistema de gestão. Documentos físicos podem ser enviados quando necessário, e clientes locais também são atendidos presencialmente com agendamento.",
      },
      {
        question: "Como é feita a troca de contador?",
        answer:
          "Cuidamos de todo o processo: solicitamos a documentação ao escritório anterior, conferimos saldos de abertura, regularizamos pendências e assumimos as obrigações seguintes sem interrupção. Em geral a transição leva de uma a duas semanas.",
      },
      {
        question: "Vocês controlam estoque e ativo imobilizado de verdade?",
        answer:
          "Sim, faz parte do escopo da DeepCont. Mantemos fichas de controle, conciliamos o inventário físico e calculamos depreciação. Empresas que vinham de uma contabilidade que só lançava nota costumam descobrir divergências relevantes nesses saldos.",
      },
      {
        question: "Atendem MEI e empresas do Simples Nacional?",
        answer:
          "Sim. Atendemos MEI, microempresas e empresas de pequeno porte, com escopo adequado ao porte. Também fazemos a análise periódica de quando passa a valer a pena mudar de regime conforme a empresa cresce.",
      },
    ],
    cta: {
      title: "Sua contabilidade está em dia e ainda assim você não sabe se o mês foi bom?",
      description:
        "Fale com a gente. Fazemos um diagnóstico gratuito da sua situação contábil e fiscal, sem compromisso e sem custo.",
    },
    seo: {
      title: "DeepCont — Contabilidade completa e departamento pessoal",
      description:
        "Escrituração contábil e fiscal, folha de pagamento, eSocial, controle de estoque, ativo imobilizado, obrigações acessórias e relatórios gerenciais mensais.",
      keywords: [
        "contabilidade",
        "escritório de contabilidade",
        "departamento pessoal",
        "folha de pagamento",
        "escrituração fiscal",
        "controle de estoque",
      ],
    },
  },

  /* ==========================================================================
   *  DEEPPERICIA — perícia contábil
   * ======================================================================== */
  {
    slug: "deep-pericia",
    name: "DeepPericia",
    shortName: "DeepPericia",
    tagline: "Perícia contábil e cálculos judiciais",
    summary:
      "Perícia contábil judicial e extrajudicial, cálculos judiciais, apuração de haveres e assistência técnica de parte, com laudos fundamentados nas normas do CFC.",
    icon: "gavel",
    accent: "from-amber-500 to-orange-400",
    hero: {
      eyebrow: "Perícia Contábil",
      title: "A prova técnica que esclarece o juízo e sustenta a tese",
      subtitle:
        "A DeepPericia atua onde a demanda exige perícia contábil: cálculos judiciais, apuração de haveres, análise por peritos e assistência técnica de parte em processos judiciais e arbitrais.",
      highlights: [
        "Perícia contábil judicial e extrajudicial",
        "Cálculos judiciais e atualização de valores",
        "Apuração de haveres e dissolução de sociedade",
        "Assistência técnica de parte com parecer crítico",
      ],
    },
    intro: {
      title: "O que a perícia resolve na prática",
      paragraphs: [
        "Em litígios que envolvem dinheiro, a decisão frequentemente depende de quem consegue demonstrar tecnicamente o que aconteceu. Números apresentados sem método viram disputa de narrativa; números apurados com metodologia, lastro documental e linguagem precisa se tornam prova.",
        "Atuamos nos dois lados da mesa. Como perito nomeado pelo juízo, conduzimos a apuração com imparcialidade e respondemos aos quesitos das partes. Como assistente técnico, examinamos criticamente o laudo oficial, apontamos divergências metodológicas e produzimos parecer que dá ao advogado material consistente para sustentar a tese em audiência.",
        "Cada trabalho parte da mesma disciplina: definição clara do objeto, delimitação do período, escolha justificada dos critérios de apuração e rastreabilidade total — toda cifra do laudo remete a um documento dos autos ou a uma fonte verificável.",
      ],
    },
    audience: {
      title: "Para quem faz sentido",
      lead: "Atuamos a pedido do juízo, de advogados, de empresas e de sócios em conflito.",
      items: [
        {
          title: "Escritórios de advocacia",
          description:
            "Assistência técnica em ações cíveis, trabalhistas, tributárias e empresariais, com parecer crítico sobre laudos e apoio em audiências.",
        },
        {
          title: "Sócios em dissolução",
          description:
            "Apuração de haveres, determinação do valor justo da participação e análise de movimentações suspeitas.",
        },
        {
          title: "Empresas em arbitragem",
          description:
            "Laudos técnicos e pareceres para procedimentos arbitrais e câmaras especializadas em disputas societárias e contratuais.",
        },
        {
          title: "Órgãos públicos e terceiro setor",
          description:
            "Prestação de contas de convênios, tomada de contas especial e verificação de aplicação de recursos vinculados.",
        },
      ],
    },
    scope: [
      {
        title: "Perícia contábil judicial",
        description:
          "Atuação como perito nomeado pelo juízo, com proposta de honorários, condução dos trabalhos e resposta aos quesitos formulados.",
        items: [
          "Elaboração de proposta de honorários periciais",
          "Análise da petição inicial, contestação e documentos dos autos",
          "Formulação e reformulação de quesitos",
          "Diligências, vistorias e entrevistas com as partes",
          "Exame de livros, registros e sistemas contábeis",
          "Elaboração do laudo pericial com respostas fundamentadas",
          "Prestação de esclarecimentos e participação em audiências",
        ],
      },
      {
        title: "Cálculos judiciais",
        description:
          "Apuração e atualização de valores para instruir a decisão, com memória de cálculo conferível.",
        items: [
          "Cálculo de créditos com correção monetária e juros",
          "Atualização de valores por índice definido na decisão",
          "Apuração de diferenças salariais e reflexos",
          "Cálculo de indenizações e lucros cessantes",
          "Demonstrativo de débito e de crédito em execução",
          "Planilhas de cálculo prontas para juntada aos autos",
        ],
      },
      {
        title: "Assistência técnica de parte",
        description:
          "Acompanhamento do trabalho pericial em defesa dos interesses do cliente, com parecer técnico crítico.",
        items: [
          "Acompanhamento das diligências do perito judicial",
          "Elaboração de quesitos ao perito nomeado",
          "Parecer técnico sobre o laudo oficial",
          "Identificação de inconsistências e divergências de critério",
          "Manifestação sobre esclarecimentos complementares",
          "Preparação do advogado para audiência de instrução",
        ],
      },
      {
        title: "Apuração de haveres e disputas societárias",
        description:
          "A frente especializada nas causas que mais dependem de técnica contábil para serem resolvidas.",
        items: [
          "Avaliação patrimonial a valor contábil e a valor de mercado",
          "Determinação de valor justo da participação societária",
          "Análise de retiradas, pró-labore e distribuições irregulares",
          "Identificação de desvio de caixa e movimentações atípicas",
          "Reconstituição de escrituração e recomposição de saldos",
          "Exame de operações com partes relacionadas",
        ],
      },
    ],
    methodology: [
      {
        step: "01",
        title: "Análise do objeto da lide",
        description:
          "Leitura integral dos autos, delimitação precisa do que deve ser apurado e identificação dos pontos técnicos controvertidos.",
      },
      {
        step: "02",
        title: "Plano de trabalho e quesitos",
        description:
          "Definição dos procedimentos, das fontes de dados e dos critérios de apuração, além da elaboração dos quesitos que orientarão as respostas.",
      },
      {
        step: "03",
        title: "Coleta e exame de evidências",
        description:
          "Diligências, requisição de documentos, exame de livros e sistemas, entrevistas e reconstituição de operações quando necessário.",
      },
      {
        step: "04",
        title: "Apuração e cálculo",
        description:
          "Aplicação dos critérios definidos, com planilhas de cálculo rastreáveis e correção monetária e juros conforme o caso.",
      },
      {
        step: "05",
        title: "Laudo, esclarecimentos e audiência",
        description:
          "Entrega do laudo ou parecer com conclusões objetivas, resposta aos quesitos e sustentação técnica em audiência de instrução.",
      },
    ],
    deliverables: [
      "Laudo pericial completo com respostas a todos os quesitos",
      "Parecer técnico crítico sobre laudo de perito nomeado",
      "Cálculos judiciais com memória de apuração rastreável",
      "Planilhas atualizadas com correção monetária e juros",
      "Proposta de honorários periciais",
      "Manifestações, esclarecimentos e suporte em audiências",
    ],
    faq: [
      {
        question: "Qual a diferença entre perito e assistente técnico?",
        answer:
          "O perito é nomeado pelo juízo e deve ser imparcial, produzindo o laudo que instrui a decisão. O assistente técnico é indicado por uma das partes, acompanha os trabalhos e elabora parecer que aponta divergências ou confirma o laudo, sempre na defesa técnica de quem o contratou.",
      },
      {
        question: "Vocês fazem apenas o cálculo judicial?",
        answer:
          "Sim, é possível contratar só o cálculo. É comum o advogado precisar apenas da apuração e atualização de valores, com memória de cálculo pronta para juntada, sem envolver a condução de uma perícia completa.",
      },
      {
        question: "Que documentos são necessários para iniciar a perícia?",
        answer:
          "Depende do objeto. Em apuração de haveres, tipicamente balanços, livros contábeis, extratos bancários, contratos sociais e alterações, declarações fiscais e comprovantes de movimentações societárias. O escopo é definido após a análise inicial dos autos.",
      },
      {
        question: "Qual o prazo para a entrega de um laudo?",
        answer:
          "O prazo é fixado pelo juízo ou acordado entre as partes. Na prática, perícias de complexidade média levam de 30 a 90 dias, considerando o tempo de resposta das partes e a disponibilidade da documentação.",
      },
      {
        question: "É possível atuar como perito de uma empresa da qual já somos contadores?",
        answer:
          "Não. As normas de perícia contábil vedam o acúmulo de funções que comprometam a independência e a imparcialidade do trabalho. Quando há impedimento, declinamos da nomeação e informamos o motivo.",
      },
    ],
    cta: {
      title: "Precisa de um laudo que resista ao contraditório?",
      description:
        "Envie o objeto da demanda. Avaliamos a viabilidade técnica, o prazo e o escopo do trabalho com sigilo total.",
    },
    seo: {
      title: "DeepPericia — Perícia contábil e cálculos judiciais",
      description:
        "Perícia contábil judicial e extrajudicial, cálculos judiciais, apuração de haveres e assistência técnica de parte. Laudos fundamentados nas normas do CFC.",
      keywords: [
        "perícia contábil",
        "perito judicial contábil",
        "cálculos judiciais",
        "assistente técnico",
        "apuração de haveres",
      ],
    },
  },

  /* ==========================================================================
   *  DEEPCONSULT — consultoria
   * ======================================================================== */
  {
    slug: "deep-consult",
    name: "DeepConsult",
    shortName: "DeepConsult",
    tagline: "Consultoria contábil e fiscal sob medida",
    summary:
      "Consultoria contábil, fiscal e de gestão desenhada conforme a necessidade do cliente: estruturação societária, indicadores, valuation, captação e apoio à decisão.",
    icon: "compass",
    accent: "from-fuchsia-500 to-pink-500",
    hero: {
      eyebrow: "Consultoria",
      title: "Decidir com números na mesa, não com achismo",
      subtitle:
        "A DeepConsult é a área de consultoria da DeepTax. Analisamos contabilidade, estrutura societária, precificação e fluxo de caixa para encontrar onde está o dinheiro que a sua empresa deixa na mesa todos os meses.",
      highlights: [
        "Consultoria contábil e fiscal conforme a necessidade",
        "Estruturação societária e planejamento sucessório",
        "Indicadores gerenciais, projeções e valuation",
        "Apoio à decisão em negociações e captação",
      ],
    },
    intro: {
      title: "O que a consultoria resolve na prática",
      paragraphs: [
        "Quase toda empresa de médio porte carrega dois problemas silenciosos: faz escolhas estruturais sem medir o efeito contábil e fiscal, e toma decisões de preço e investimento sem enxergar a margem real por produto, cliente ou canal.",
        "A DeepConsult ataca os dois. Começamos pelo entendimento do negócio e dos números que já existem, e a partir daí desenhamos o trabalho: pode ser uma reestruturação societária, a implantação de indicadores, um valuation para negociação ou o acompanhamento mensal da gestão.",
        "Não temos pacote fechado. O escopo é montado conforme a necessidade que você traz — e, quando o caminho recomendado envolve outra área do escritório, a DeepTax, a DeepCont, a DeepPericia ou a DeepCompliance entram na mesma conversa, sem você precisar coordenar fornecedores.",
      ],
    },
    audience: {
      title: "Para quem faz sentido",
      lead: "A consultoria rende mais em momentos de mudança — de patamar, de estrutura ou de mercado.",
      items: [
        {
          title: "Empresas em crescimento acelerado",
          description:
            "Negócios que dobraram de tamanho e cuja estrutura contábil e societária ficou para trás.",
        },
        {
          title: "Grupos com múltiplas empresas",
          description:
            "Holdings familiares e grupos com sócios, filiais ou atividades distintas que precisam de desenho coordenado.",
        },
        {
          title: "Negociações e transações",
          description:
            "Aquisições, fusões, entrada de investidor, venda de participação e reorganizações patrimoniais.",
        },
        {
          title: "Margem sob pressão",
          description:
            "Operações que faturam bem mas não convertem em caixa e precisam entender onde a rentabilidade se perde.",
        },
      ],
    },
    scope: [
      {
        title: "Consultoria contábil",
        description:
          "Apoio técnico sobre o tratamento contábil das operações, com parecer fundamentado nas normas vigentes.",
        items: [
          "Pareceres sobre tratamento contábil de operações específicas",
          "Avaliação de impacto das novas normas contábeis",
          "Revisão de critérios de reconhecimento de receita e de custo",
          "Orientação sobre provisões, contingências e estimativas",
          "Estruturação de demonstrações para fins societários e bancários",
          "Preparação de informações contábeis para sócios e conselho",
        ],
      },
      {
        title: "Consultoria fiscal e de estrutura",
        description:
          "Desenho da arquitetura societária e tributária mais eficiente para a operação e para a sucessão.",
        items: [
          "Constituição de holding e reorganização de participações",
          "Avaliação de incorporação, cisão e fusão",
          "Planejamento sucessório e doação de quotas",
          "Definição de pró-labore, distribuição de lucros e remuneração",
          "Revisão de acordo de sócios sob a ótica econômica",
          "Análise de risco fiscal das alternativas em estudo",
        ],
      },
      {
        title: "Gestão, indicadores e captação",
        description:
          "Informação gerencial que orienta preço, custo e investimento, além de base técnica para conversas com investidores.",
        items: [
          "Implantação de fluxo de caixa projetado e cenários",
          "Apuração de margem por produto, cliente e canal",
          "Custeio e formação de preço de venda",
          "Painel de indicadores com reuniões periódicas de resultado",
          "Valuation por fluxo de caixa descontado e múltiplos",
          "Data room contábil e apoio em due diligence",
        ],
      },
      {
        title: "Consultoria de processos e organização",
        description:
          "Organização da rotina financeira e contábil para reduzir retrabalho e ganhar confiabilidade.",
        items: [
          "Diagnóstico do ciclo financeiro e contábil",
          "Desenho de políticas internas e matriz de alçadas",
          "Estruturação de centro de custos e critérios de rateio",
          "Treinamento da equipe interna",
          "Apoio na escolha e implantação de sistemas de gestão",
        ],
      },
    ],
    methodology: [
      {
        step: "01",
        title: "Diagnóstico profundo",
        description:
          "Levantamento de dados contábeis, fiscais, societários e operacionais dos últimos exercícios, com entrevistas com a administração.",
      },
      {
        step: "02",
        title: "Identificação de oportunidades",
        description:
          "Mapeamento de alternativas aplicáveis, riscos existentes e pontos de ineficiência, priorizados por impacto e viabilidade.",
      },
      {
        step: "03",
        title: "Simulação de cenários",
        description:
          "Modelagem numérica de cada alternativa, com comparativo de resultado, fluxo de caixa e reflexo patrimonial ao longo de vários exercícios.",
      },
      {
        step: "04",
        title: "Recomendação fundamentada",
        description:
          "Relatório com a alternativa recomendada, a base legal, o risco envolvido e as condições necessárias para implementação segura.",
      },
      {
        step: "05",
        title: "Implementação e acompanhamento",
        description:
          "Apoio na execução das mudanças, revisão de contratos e registros, e monitoramento dos resultados obtidos contra o projetado.",
      },
    ],
    deliverables: [
      "Relatório de diagnóstico com prioridades por impacto financeiro",
      "Parecer técnico com fundamentação de cada recomendação",
      "Modelo de fluxo de caixa projetado e cenários",
      "Painel de indicadores gerenciais implantado",
      "Laudo de valuation com premissas e análise de sensibilidade",
      "Plano de implantação com etapas, responsáveis e prazos",
    ],
    faq: [
      {
        question: "A consultoria é fechada em pacote?",
        answer:
          "Não. O escopo é montado conforme a necessidade que você traz. Pode ser um trabalho pontual, como um valuation ou uma reestruturação, ou um acompanhamento contínuo de gestão com reuniões periódicas.",
      },
      {
        question: "Preciso ser cliente de contabilidade do escritório?",
        answer:
          "Não. Atendemos tanto clientes que já são nossos na contabilidade mensal quanto empresas que mantêm outro escritório e nos procuram para um projeto específico. Nesse caso, trabalhamos em conjunto com o contador responsável.",
      },
      {
        question: "Quanto tempo leva um projeto de consultoria?",
        answer:
          "Projetos focados, como a revisão de estrutura de um grupo, ficam prontos em duas a seis semanas. Reorganizações com múltiplas empresas e implementação exigem de seis a doze semanas.",
      },
      {
        question: "Como vocês cobram?",
        answer:
          "Projetos com escopo definido são cobrados por valor fechado, apresentado após o diagnóstico. Acompanhamentos contínuos são cobrados por período, com escopo e frequência de reuniões acordados de antemão.",
      },
      {
        question: "Vocês entregam a recomendação e implementam?",
        answer:
          "Sim, se você quiser. Muitos clientes contratam só o estudo e implementam com a própria equipe; outros preferem que acompanhemos a execução, incluindo os registros societários e os ajustes contábeis.",
      },
    ],
    cta: {
      title: "Tem uma decisão importante para tomar e quer números que a sustentem?",
      description:
        "Conte o cenário. Avaliamos o escopo do trabalho, o prazo e o investimento antes de qualquer compromisso.",
    },
    seo: {
      title: "DeepConsult — Consultoria contábil, fiscal e de gestão",
      description:
        "Consultoria contábil e fiscal sob medida: estruturação societária, planejamento sucessório, indicadores gerenciais, valuation e apoio à captação de recursos.",
      keywords: [
        "consultoria contábil",
        "consultoria fiscal",
        "holding familiar",
        "valuation",
        "planejamento sucessório",
        "indicadores gerenciais",
      ],
    },
  },

  /* ==========================================================================
   *  DEEPCOMPLIANCE — compliance
   * ======================================================================== */
  {
    slug: "deep-compliance",
    name: "DeepCompliance",
    shortName: "DeepCompliance",
    tagline: "Conformidade que protege a operação",
    summary:
      "Serviços de compliance para empresas: avaliação de riscos, políticas internas, due diligence de terceiros, integridade e adequação à LGPD.",
    icon: "shield",
    accent: "from-slate-600 to-brand-700",
    hero: {
      eyebrow: "Compliance",
      title: "Conformidade organizada antes que ela vire problema",
      subtitle:
        "A DeepCompliance cuida dos serviços de compliance do escritório: mapeamos riscos, organizamos políticas e controles e preparamos a empresa para responder a auditorias, bancos, investidores e órgãos públicos.",
      highlights: [
        "Mapeamento de riscos de conformidade",
        "Políticas internas, código de conduta e alçadas",
        "Due diligence e avaliação de terceiros",
        "Adequação à LGPD e programa de integridade",
      ],
    },
    intro: {
      title: "O que o compliance resolve na prática",
      paragraphs: [
        "Compliance costuma ser tratado como assunto de empresa grande. Na prática, qualquer negócio que dependa de crédito bancário, participe de licitação, receba investidor ou tenha sócios não envolvidos na gestão acaba precisando comprovar que opera de forma organizada e rastreável.",
        "A DeepCompliance organiza essa camada. Começamos pelo mapeamento dos riscos reais da operação — não uma lista genérica de boas práticas — e a partir deles definimos o que precisa de política, o que precisa de controle e o que precisa de registro.",
        "Nosso trabalho é deliberadamente prático: documento que ninguém lê, controle que ninguém executa e política que trava a operação não são compliance, são burocracia. Cada entrega é dimensionada ao porte da empresa e ao risco que ela efetivamente corre.",
      ],
    },
    audience: {
      title: "Para quem faz sentido",
      lead: "Compliance passa a ser exigência quando um terceiro precisa confiar na forma como a empresa opera.",
      items: [
        {
          title: "Empresas que buscam crédito ou investimento",
          description:
            "Operações em que o banco ou o investidor exige comprovação de organização, controles e integridade.",
        },
        {
          title: "Participantes de licitações",
          description:
            "Empresas que precisam demonstrar conformidade e manter programa de integridade para contratar com o poder público.",
        },
        {
          title: "Grupos familiares e sociedades",
          description:
            "Negócios em que sócios e herdeiros precisam de regras claras de alçada, decisão e prestação de contas.",
        },
        {
          title: "Organizações que tratam dados pessoais",
          description:
            "Empresas com base relevante de clientes ou colaboradores que precisam adequar o tratamento de dados à LGPD.",
        },
      ],
    },
    scope: [
      {
        title: "Mapeamento de riscos e diagnóstico",
        description:
          "Levantamento do que efetivamente expõe a empresa, com priorização por probabilidade e impacto.",
        items: [
          "Identificação de riscos fiscais, trabalhistas, societários e contratuais",
          "Matriz de riscos com probabilidade, impacto e responsável",
          "Avaliação da efetividade dos controles existentes",
          "Análise de pontos de fragilidade em processos críticos",
          "Priorização de tratamento conforme exposição real",
        ],
      },
      {
        title: "Políticas, controles e integridade",
        description:
          "Documentos e rotinas que tornam o funcionamento da empresa verificável por terceiros.",
        items: [
          "Código de conduta e política de conflito de interesses",
          "Política de alçadas e segregação de funções",
          "Canal de denúncias e rotina de apuração",
          "Política de brindes, presentes e hospitalidade",
          "Programa de integridade para contratação pública",
          "Rotina de treinamento e registro de adesão",
        ],
      },
      {
        title: "Due diligence e avaliação de terceiros",
        description:
          "Verificação de clientes, fornecedores e parceiros antes de fechar negócio.",
        items: [
          "Análise cadastral e reputacional de contrapartes",
          "Verificação de situação fiscal, trabalhista e cadastral",
          "Identificação de vínculos com pessoas politicamente expostas",
          "Avaliação de risco em contratos de valor relevante",
          "Relatório de due diligence para decisão e registro",
        ],
      },
      {
        title: "Adequação à LGPD",
        description:
          "Adequação prática ao tratamento de dados pessoais, sem transformar o escritório em um projeto interminável.",
        items: [
          "Mapeamento de dados pessoais e fluxos de tratamento",
          "Definição de base legal por finalidade",
          "Política de privacidade e avisos ao titular",
          "Contratos e cláusulas com operadores e fornecedores",
          "Procedimento de atendimento a titulares",
          "Plano de resposta a incidentes de segurança",
        ],
      },
    ],
    methodology: [
      {
        step: "01",
        title: "Diagnóstico de conformidade",
        description:
          "Entrevistas com as áreas, leitura de contratos e políticas existentes e levantamento do que já é cumprido e comprovado.",
      },
      {
        step: "02",
        title: "Matriz de riscos priorizada",
        description:
          "Consolidação dos riscos identificados com avaliação de probabilidade, impacto e urgência, aprovada pela administração.",
      },
      {
        step: "03",
        title: "Desenho de políticas e controles",
        description:
          "Elaboração dos documentos e das rotinas necessárias, dimensionados ao porte e à realidade operacional da empresa.",
      },
      {
        step: "04",
        title: "Implantação e treinamento",
        description:
          "Colocamos os controles em funcionamento, treinamos quem executa e definimos como a evidência fica registrada.",
      },
      {
        step: "05",
        title: "Monitoramento e revisão",
        description:
          "Acompanhamos a execução, testamos a efetividade dos controles e revisamos as políticas conforme a operação e a lei mudam.",
      },
    ],
    deliverables: [
      "Relatório de diagnóstico de conformidade",
      "Matriz de riscos com plano de ação e responsáveis",
      "Políticas internas e código de conduta redigidos",
      "Relatórios de due diligence de terceiros",
      "Documentação de adequação à LGPD",
      "Registros de treinamento e evidências de execução dos controles",
    ],
    faq: [
      {
        question: "Minha empresa é pequena. Compliance faz sentido?",
        answer:
          "Faz, desde que dimensionado. Uma empresa de 20 pessoas não precisa de uma estrutura de comitês; precisa de alçadas claras, um código de conduta enxuto e controles nos dois ou três processos que realmente concentram risco. É assim que trabalhamos.",
      },
      {
        question: "Compliance e LGPD são a mesma coisa?",
        answer:
          "Não. LGPD é um recorte específico, sobre tratamento de dados pessoais. Compliance é mais amplo: abrange riscos fiscais, trabalhistas, societários, contratuais e de integridade. A adequação à LGPD costuma ser um dos itens de um programa de conformidade.",
      },
      {
        question: "O que é exigido para participar de licitação?",
        answer:
          "Depende do edital e do porte do contrato. Em contratos de valor relevante, a lei de licitações exige programa de integridade efetivo. Avaliamos o edital e montamos a estrutura correspondente, com os registros que servem de evidência.",
      },
      {
        question: "Quanto tempo leva para implantar um programa de compliance?",
        answer:
          "Um diagnóstico com matriz de riscos fica pronto em três a quatro semanas. A implantação completa, com políticas, treinamento e monitoramento, leva de três a seis meses, dependendo do porte e do número de processos críticos.",
      },
      {
        question: "Vocês ficam responsáveis pela execução do compliance?",
        answer:
          "O programa pertence à empresa, que é quem responde por ele. Atuamos no desenho, na implantação, no treinamento e no monitoramento. Em casos específicos, assumimos rotinas operacionais de verificação, como a due diligence de terceiros.",
      },
    ],
    cta: {
      title: "Sua operação está pronta para ser auditada por um terceiro?",
      description:
        "Um diagnóstico de conformidade mostra, com prioridade, o que precisa ser organizado antes que vire exigência de banco, investidor ou órgão público.",
    },
    seo: {
      title: "DeepCompliance — Compliance, integridade e LGPD",
      description:
        "Serviços de compliance: mapeamento de riscos, políticas internas, programa de integridade, due diligence de terceiros e adequação à LGPD.",
      keywords: [
        "compliance",
        "programa de integridade",
        "due diligence",
        "adequação LGPD",
        "código de conduta",
        "conformidade empresarial",
      ],
    },
  },
];

export const getService = (slug: string) =>
  services.find((service) => service.slug === slug);

export const serviceSlugs = services.map((service) => service.slug);
