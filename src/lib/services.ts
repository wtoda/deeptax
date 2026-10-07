export type FaqItem = { question: string; answer: string };

export type ServiceContent = {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  summary: string;
  icon: "search" | "compass" | "ledger" | "gavel";
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

export const services: ServiceContent[] = [
  /* ==========================================================================
   *  1. AUDITORIA
   * ======================================================================== */
  {
    slug: "auditoria",
    name: "Auditoria Contábil",
    shortName: "Auditoria",
    tagline: "Confiança que se comprova com evidência",
    summary:
      "Auditoria independente das demonstrações contábeis, revisão de controles internos e auditoria de processos, com relatório técnico lastreado em evidências.",
    icon: "search",
    accent: "from-sky-500 to-cyan-400",
    hero: {
      eyebrow: "Auditoria",
      title: "Demonstrações contábeis em que sócios, bancos e investidores podem confiar",
      subtitle:
        "Examinamos seus números com metodologia de auditoria baseada em risco e normas do CFC/CPC. Você recebe não apenas uma opinião, mas o mapa das fragilidades e dos ajustes necessários.",
      highlights: [
        "Auditoria independente das demonstrações contábeis",
        "Revisão de controles internos e riscos de fraude",
        "Relatório com achados classificados por criticidade",
        "Suporte em due diligence, fusões e captação de crédito",
      ],
    },
    intro: {
      title: "O que a auditoria resolve na prática",
      paragraphs: [
        "A auditoria não existe para desconfiar de quem administra. Ela existe para dar à administração e aos terceiros interessados uma base confiável de decisão. É o que permite a um banco aprovar crédito sem trava, a um investidor aportar capital sem rediscutir o balanço e a um sócio sair da sociedade com o valor justo apurado.",
        "Nosso trabalho começa pela compreensão do negócio: como a receita é gerada, onde o caixa circula, quais estimativas exigem julgamento. A partir disso, desenhamos procedimentos direcionados aos riscos que realmente importam — em vez de aplicar uma lista genérica de testes que consome prazo e não encontra nada.",
        "O resultado é um relatório que separa o que é distorção relevante, o que é deficiência de controle e o que é oportunidade de melhoria, sempre com o impacto em valores quantificado e a evidência que sustenta cada conclusão.",
      ],
    },
    audience: {
      title: "Para quem faz sentido",
      lead: "A auditoria se aplica sempre que um terceiro precisa confiar nos números, ou quando a própria gestão perdeu a segurança sobre eles.",
      items: [
        {
          title: "Empresas com exigência estatutária ou contratual",
          description:
            "Sociedades anônimas, entidades do terceiro setor e companhias com cláusula de auditoria em acordo de sócios ou contrato de financiamento.",
        },
        {
          title: "Operações de crédito e investimento",
          description:
            "Empresas que buscam financiamento bancário, aporte de fundos, entrada de sócio ou venda parcial do negócio.",
        },
        {
          title: "Grupos com múltiplas unidades",
          description:
            "Operações com filiais, coligadas ou unidades de negócio em que a consolidação depende de critérios uniformes.",
        },
        {
          title: "Gestão que perdeu visibilidade",
          description:
            "Casos de crescimento rápido, troca de sistema, turnover na equipe financeira ou suspeita de desvio patrimonial.",
        },
      ],
    },
    scope: [
      {
        title: "Auditoria das demonstrações contábeis",
        description:
          "Exame do balanço patrimonial, da demonstração do resultado e das demais peças, com emissão de opinião formal.",
        items: [
          "Planejamento e avaliação de risco de auditoria",
          "Testes de observância de controles internos",
          "Procedimentos substantivos sobre saldos e transações",
          "Circularização de clientes, fornecedores e instituições financeiras",
          "Acompanhamento de inventário físico de estoques e imobilizado",
          "Avaliação de estimativas, provisões e contingências",
          "Revisão de eventos subsequentes e continuidade operacional",
          "Emissão de relatório de auditoria e carta de recomendações",
        ],
      },
      {
        title: "Revisão limitada e procedimentos acordados",
        description:
          "Escopos reduzidos para necessidades específicas, sem o custo e o prazo de uma auditoria completa.",
        items: [
          "Revisão limitada de demonstrações intermediárias",
          "Procedimentos previamente acordados com a administração e terceiros",
          "Conferência de obrigações acessórias e declarações fiscais",
          "Validação de base de cálculo de participações e bonificações",
          "Certificação de informações contratuais para editais e licitações",
        ],
      },
      {
        title: "Auditoria de controles internos",
        description:
          "Mapeamento de processos críticos, identificação de pontos de fragilidade e desenho de controles mitigadores.",
        items: [
          "Mapeamento de ciclos de receita, compras, folha e tesouraria",
          "Segregação de funções e matriz de alçadas",
          "Testes de efetividade operacional dos controles",
          "Matriz de riscos com probabilidade e impacto",
          "Plano de ação com responsáveis e prazos",
        ],
      },
      {
        title: "Auditoria para fins específicos",
        description:
          "Trabalhos desenhados para um destinatário ou uma decisão concreta.",
        items: [
          "Due diligence contábil em aquisições e fusões",
          "Apuração de haveres e revisão de preço de compra (M&A)",
          "Auditoria de convênios, subvenções e recursos de terceiros",
          "Revisão de contratos de concessão e prestação de contas regulatória",
          "Auditoria de sistemas e integridade de dados contábeis",
        ],
      },
    ],
    methodology: [
      {
        step: "01",
        title: "Planejamento e entendimento do negócio",
        description:
          "Reuniões com a administração, leitura de contratos, análise de demonstrações anteriores e definição do nível de materialidade.",
      },
      {
        step: "02",
        title: "Avaliação de riscos",
        description:
          "Identificação dos riscos de distorção relevante por conta e por ciclo, incluindo o risco de fraude, com o desenho dos procedimentos correspondentes.",
      },
      {
        step: "03",
        title: "Execução dos procedimentos",
        description:
          "Testes de controle e substantivos, inspeção documental, recálculo, circularização e acompanhamento físico, com papéis de trabalho organizados e revisados.",
      },
      {
        step: "04",
        title: "Avaliação dos achados",
        description:
          "Discussão de cada achado com o cliente, quantificação do impacto e definição do que é ajuste, o que é deficiência de controle e o que é recomendação.",
      },
      {
        step: "05",
        title: "Relatório e apresentação",
        description:
          "Emissão do relatório de auditoria, carta de recomendações à administração e apresentação dos resultados aos sócios ou ao conselho.",
      },
    ],
    deliverables: [
      "Relatório de auditoria com opinião formal sobre as demonstrações contábeis",
      "Carta de recomendações com achados classificados por criticidade",
      "Matriz de riscos e controles internos com plano de ação",
      "Papéis de trabalho organizados e disponíveis para revisão de terceiros",
      "Apresentação executiva dos resultados para sócios, conselho ou financiadores",
      "Suporte técnico na discussão dos ajustes com a administração",
    ],
    faq: [
      {
        question: "Qual a diferença entre auditoria e contabilidade mensal?",
        answer:
          "A contabilidade registra e apura os fatos do dia a dia; a auditoria examina de forma independente o resultado desse trabalho, buscando evidências de que os números refletem a realidade. São funções distintas e, por exigência de independência, não devem ser exercidas pelo mesmo responsável técnico sobre os mesmos fatos.",
      },
      {
        question: "Minha empresa é obrigada a auditar?",
        answer:
          "A obrigatoriedade depende da natureza jurídica, do porte e de exigências específicas — como sociedades anônimas de capital aberto, determinadas entidades reguladas e organizações que recebem recursos públicos. Muitas empresas auditam por exigência contratual de bancos ou por decisão dos próprios sócios.",
      },
      {
        question: "Quanto tempo dura uma auditoria?",
        answer:
          "Uma auditoria completa de demonstrações anuais costuma levar de quatro a dez semanas, dependendo do porte, da qualidade dos registros e da disponibilidade da equipe do cliente. Escopos específicos, como procedimentos acordados, podem ser concluídos em poucos dias.",
      },
      {
        question: "A auditoria encontra fraudes?",
        answer:
          "Nenhum trabalho de auditoria garante a detecção de toda fraude — essa é uma limitação inerente reconhecida pelas próprias normas. O que fazemos é desenhar procedimentos sensíveis ao risco de fraude, com foco em registros manuais, estimativas e transações fora do curso normal, aumentando substancialmente a probabilidade de identificação.",
      },
      {
        question: "Vocês assinam o relatório com registro no CRC?",
        answer:
          "Sim. Todos os relatórios são assinados por contador com registro ativo no Conselho Regional de Contabilidade e comprovada capacidade técnica, nos termos das normas de auditoria independente.",
      },
    ],
    cta: {
      title: "Precisa de números que sustentem uma decisão importante?",
      description:
        "Agende um diagnóstico gratuito. Avaliamos o escopo necessário, o prazo realista e o investimento antes de qualquer compromisso.",
    },
    seo: {
      title: "Auditoria Contábil Independente",
      description:
        "Auditoria independente das demonstrações contábeis, revisão de controles internos e due diligence contábil. Relatório técnico com achados classificados por criticidade.",
      keywords: [
        "auditoria contábil",
        "auditoria independente",
        "auditoria de demonstrações contábeis",
        "revisão de controles internos",
        "due diligence contábil",
      ],
    },
  },

  /* ==========================================================================
   *  2. CONSULTORIA
   * ======================================================================== */
  {
    slug: "consultoria",
    name: "Consultoria Contábil e Tributária",
    shortName: "Consultoria",
    tagline: "Menos imposto, mais margem, decisão fundamentada",
    summary:
      "Planejamento tributário, reestruturação societária, preparação para captação e apoio à gestão com indicadores e projeções que orientam a decisão.",
    icon: "compass",
    accent: "from-emerald-500 to-teal-400",
    hero: {
      eyebrow: "Consultoria",
      title: "Decidir com números na mesa, não com achismo",
      subtitle:
        "Analisamos regime tributário, estrutura societária, precificação e fluxo de caixa para encontrar onde está o dinheiro que sua empresa deixa na mesa todos os meses.",
      highlights: [
        "Planejamento tributário lícito e documentado",
        "Simulação de regimes e reorganização societária",
        "Valuation e preparação para captação de recursos",
        "Indicadores gerenciais e projeções de caixa",
      ],
    },
    intro: {
      title: "O que a consultoria resolve na prática",
      paragraphs: [
        "Quase toda empresa de médio porte carrega dois problemas silenciosos: paga mais imposto do que a lei exige e toma decisões de preço e investimento sem enxergar a margem real por produto, cliente ou canal.",
        "A consultoria ataca os dois. No lado tributário, estudamos o enquadramento atual, as alternativas lícitas e o custo de cada cenário antes de recomendar qualquer mudança — porque trocar de regime com base em regra de bolso costuma custar caro. No lado da gestão, montamos um conjunto enxuto de indicadores que caibam em uma reunião mensal e efetivamente mudem decisões.",
        "Nosso compromisso é com a recomendação defensável: cada posição que sugerimos vem acompanhada do fundamento legal, do cenário simulado e do risco associado, para que a administração decida com consciência e não por dependência.",
      ],
    },
    audience: {
      title: "Para quem faz sentido",
      lead: "A consultoria rende mais em momentos de mudança — de patamar, de estrutura ou de mercado.",
      items: [
        {
          title: "Empresas em crescimento acelerado",
          description:
            "Negócios que dobraram de tamanho e cuja estrutura tributária e societária ficou para trás.",
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
        title: "Planejamento tributário",
        description:
          "Estudo comparativo de cenários com quantificação de carga tributária, riscos e economia projetada.",
        items: [
          "Simulação de Simples Nacional, Lucro Presumido e Lucro Real",
          "Análise da folha e da desoneração aplicável ao setor",
          "Revisão de creditamento de ICMS, PIS, COFINS e IPI",
          "Planejamento de IRPJ e CSLL, incluindo JCP e incentivos",
          "Avaliação de benefícios fiscais estaduais e municipais",
          "Revisão de retenções e tributos sobre serviços",
          "Pareceres sobre operações específicas",
          "Apoio na defesa administrativa de autuações",
        ],
      },
      {
        title: "Estruturação societária e patrimonial",
        description:
          "Desenho da arquitetura jurídica mais eficiente para a operação e para a sucessão.",
        items: [
          "Constituição de holding e reorganização de participações",
          "Avaliação de incorporação, cisão e fusão",
          "Planejamento sucessório e doação de quotas",
          "Definição de pró-labore, distribuição de lucros e remuneração de sócios",
          "Revisão de acordo de sócios sob a ótica econômica",
        ],
      },
      {
        title: "Gestão, valuation e captação",
        description:
          "Informação gerencial que orienta preço, custo e investimento, além de base técnica para conversas com investidores.",
        items: [
          "Implantação de fluxo de caixa projetado e cenários",
          "Apuração de margem por produto, cliente e canal",
          "Custeio e formação de preço de venda",
          "Valuation por fluxo de caixa descontado e múltiplos",
          "Data room contábil e apoio em due diligence",
          "Business plan com premissas auditáveis",
        ],
      },
      {
        title: "Consultoria de processos e sistemas",
        description:
          "Organização da rotina financeira e contábil para reduzir retrabalho e ganhar confiabilidade.",
        items: [
          "Diagnóstico do ciclo financeiro e contábil",
          "Implantação e migração de sistemas de gestão",
          "Desenho de políticas internas e alçadas",
          "Estruturação de centro de custos e rateios",
          "Treinamento da equipe interna",
        ],
      },
    ],
    methodology: [
      {
        step: "01",
        title: "Diagnóstico profundo",
        description:
          "Levantamento de dados fiscais, contábeis, societários e operacionais dos últimos exercícios, com entrevistas com a administração.",
      },
      {
        step: "02",
        title: "Identificação de oportunidades",
        description:
          "Mapeamento de teses aplicáveis, riscos existentes e pontos de ineficiência, priorizados por impacto financeiro e viabilidade.",
      },
      {
        step: "03",
        title: "Simulação de cenários",
        description:
          "Modelagem numérica de cada alternativa, com comparativo de carga tributária, fluxo de caixa e reflexo patrimonial ao longo de vários exercícios.",
      },
      {
        step: "04",
        title: "Recomendação fundamentada",
        description:
          "Parecer com a alternativa recomendada, a base legal, o risco envolvido e as condições necessárias para implementação segura.",
      },
      {
        step: "05",
        title: "Implementação e acompanhamento",
        description:
          "Apoio na execução das mudanças, revisão de contratos e registros, e monitoramento dos resultados obtidos contra o projetado.",
      },
    ],
    deliverables: [
      "Relatório de planejamento tributário com comparativo de cenários em valores",
      "Parecer técnico com fundamentação legal de cada recomendação",
      "Modelo de fluxo de caixa projetado e painel de indicadores gerenciais",
      "Laudo de valuation com premissas e sensitividade",
      "Plano de implantação com etapas, responsáveis e prazos",
      "Reuniões periódicas de acompanhamento com a administração",
    ],
    faq: [
      {
        question: "Planejamento tributário é legal?",
        answer:
          "É, desde que respeite a legislação. A diferença entre planejamento lícito e sonegação está no fato gerador: planejar é organizar operações reais de forma menos onerosa, antes de elas ocorrerem. Simular efeitos de uma operação já realizada com documentos que não correspondem à realidade é outra coisa, e não é o que fazemos.",
      },
      {
        question: "Vocês garantem economia de imposto?",
        answer:
          "Não trabalhamos com percentual garantido, porque o resultado depende do perfil real de cada operação. O que garantimos é o estudo: você recebe os cenários quantificados e decide com números na mão. Só recomendamos mudança quando a economia projetada compensa o custo e o risco da transição.",
      },
      {
        question: "Preciso trocar de contador para contratar a consultoria?",
        answer:
          "Não necessariamente. Atendemos tanto clientes que já são nossos na contabilidade mensal quanto empresas que mantêm outro escritório e nos procuram para um projeto específico. Nesse caso, trabalhamos em conjunto com o contador responsável.",
      },
      {
        question: "Quanto tempo leva um projeto de planejamento tributário?",
        answer:
          "Projetos focados, como a revisão de regime de uma empresa, ficam prontos em duas a quatro semanas. Reorganizações societárias com múltiplas empresas exigem de seis a doze semanas, incluindo implementação e registros.",
      },
    ],
    cta: {
      title: "Descubra quanto sua empresa está pagando além do necessário",
      description:
        "Nossa análise inicial de enquadramento tributário é gratuita e aponta, em valores, onde estão as oportunidades mais evidentes.",
    },
    seo: {
      title: "Consultoria Contábil e Tributária",
      description:
        "Planejamento tributário, reestruturação societária, valuation e gestão por indicadores. Estudo comparativo de cenários com economia quantificada e fundamentação legal.",
      keywords: [
        "consultoria contábil",
        "planejamento tributário",
        "consultoria tributária",
        "holding familiar",
        "valuation",
      ],
    },
  },

  /* ==========================================================================
   *  3. SERVIÇOS CONTÁBEIS
   * ======================================================================== */
  {
    slug: "servicos-contabeis",
    name: "Serviços Contábeis",
    shortName: "Contabilidade",
    tagline: "A rotina fiscal em dia, sem susto no fim do mês",
    summary:
      "Escrituração contábil e fiscal, departamento pessoal, obrigações acessórias e relatórios gerenciais, com prazos controlados e atendimento direto.",
    icon: "ledger",
    accent: "from-indigo-500 to-violet-400",
    hero: {
      eyebrow: "Serviços Contábeis",
      title: "A contabilidade do mês fechada no prazo, com números que fazem sentido",
      subtitle:
        "Cuidamos da escrituração, da folha e de todas as obrigações acessórias para que sua equipe foque no negócio — e você receba informação gerencial de verdade, não apenas guias para pagar.",
      highlights: [
        "Escrituração contábil e fiscal completa",
        "Departamento pessoal, folha e eSocial",
        "Todas as obrigações acessórias sob controle",
        "Relatórios gerenciais mensais com leitura do resultado",
      ],
    },
    intro: {
      title: "O que a contabilidade resolve na prática",
      paragraphs: [
        "Contabilidade bem feita é invisível: as guias chegam no valor certo, os prazos são cumpridos, a folha fecha sem erro e ninguém recebe notificação fiscal. O problema é que a maioria dos escritórios entrega apenas essa camada — e o empresário segue sem saber se o mês foi bom.",
        "Nós operamos a rotina com processo e tecnologia, o que libera tempo para a parte que interessa: traduzir os números. Todo mês você recebe o balancete, a apuração dos impostos e um resumo gerencial com a leitura do resultado, variação de caixa e pontos de atenção.",
        "Atendemos empresas de todos os regimes — MEI, Simples Nacional, Lucro Presumido e Lucro Real — com escopo dimensionado ao porte e ao setor, e com um responsável nomeado que conhece a sua operação pelo nome.",
      ],
    },
    audience: {
      title: "Para quem faz sentido",
      lead: "Atendemos desde o profissional autônomo que está abrindo CNPJ até indústrias de médio porte com folha relevante.",
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
            "Operações com estoque, créditos de ICMS e IPI, inventário e custo de produção apurado com critério.",
        },
        {
          title: "Empresas trocando de contador",
          description:
            "Transição de histórico, conciliação de saldos de abertura e regularização de pendências sem interrupção das obrigações.",
        },
      ],
    },
    scope: [
      {
        title: "Escrituração contábil",
        description:
          "Registro completo das operações, com conciliações e demonstrações contábeis elaboradas conforme as normas vigentes.",
        items: [
          "Classificação e lançamento de documentos fiscais",
          "Conciliação bancária, de clientes e de fornecedores",
          "Controle patrimonial e depreciação do imobilizado",
          "Apuração de estoques e custo das mercadorias ou serviços",
          "Elaboração de balancete, DRE e balanço patrimonial",
          "Demonstrações do fluxo de caixa e do valor adicionado",
          "Escrituração do livro diário e razão",
          "Encerramento de exercício e destinação do resultado",
        ],
      },
      {
        title: "Escrituração fiscal e apuração de tributos",
        description:
          "Apuração mensal dos tributos com reaproveitamento de créditos e controle de benefícios aplicáveis.",
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
        title: "Departamento pessoal",
        description:
          "Gestão completa da folha e das relações trabalhistas, com conformidade e prazos rigorosamente observados.",
        items: [
          "Admissão, demissão e controle de documentação",
          "Processamento de folha, férias, rescisões e 13º",
          "Cálculo de INSS, FGTS, IRRF e contribuições sindicais",
          "Envio de eventos ao eSocial e à DCTFWeb",
          "Controle de ponto, horas extras e banco de horas",
          "Gestão de benefícios, afastamentos e licenças",
          "Apoio em fiscalizações trabalhistas",
        ],
      },
      {
        title: "Obrigações acessórias e compliance",
        description:
          "Calendário fiscal controlado, entregas dentro do prazo e regularização de pendências junto aos órgãos.",
        items: [
          "SPED Fiscal, SPED Contribuições e ECD/ECF",
          "DCTFWeb, DIRF, EFD-Reinf e DEFIS",
          "Declaração do Simples Nacional e PGMEI",
          "Relatórios anuais de blocos e livros fiscais",
          "Regularização de declarações em atraso",
          "Acompanhamento de caixa postal do e-CAC",
          "Gestão de certidões negativas",
        ],
      },
      {
        title: "Relatórios gerenciais e BPOM",
        description:
          "Informação de gestão entregue todo mês, com leitura do resultado e não apenas a demonstração contábil.",
        items: [
          "Resumo gerencial mensal com análise de variações",
          "Demonstração do fluxo de caixa realizado e projetado",
          "Indicadores de liquidez, endividamento e rentabilidade",
          "Relatório de margem por produto, cliente ou unidade",
          "Orçamento anual e acompanhamento orçamentário",
          "Reunião periódica de resultado com a administração",
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
          "Reunião mensal ou trimestral de resultado, revisão de enquadramento tributário e ajustes de processo conforme a operação evolui.",
      },
    ],
    deliverables: [
      "Balancete mensal, DRE e balanço patrimonial",
      "Guias de recolhimento apuradas e conferidas",
      "Folha de pagamento processada e informes trabalhistas",
      "Todas as obrigações acessórias entregues dentro do prazo",
      "Resumo gerencial mensal com leitura do resultado e do caixa",
      "Canal direto com contador responsável pela sua carteira",
    ],
    faq: [
      {
        question: "Quanto custa a contabilidade mensal?",
        answer:
          "O honorário varia conforme o regime tributário, o volume de notas, o tamanho da folha e o nível de relatório gerencial contratado. Após o diagnóstico gratuito, apresentamos uma proposta fechada e sem taxa surpresa.",
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
        question: "Vocês atendem MEI e empresas do Simples Nacional?",
        answer:
          "Sim. Atendemos MEI, microempresas e empresas de pequeno porte, com escopo adequado ao porte. Também fazemos a análise periódica de quando vale a pena mudar de regime conforme a empresa cresce.",
      },
      {
        question: "Meu contador atual está atrasado com obrigações. Vocês resolvem?",
        answer:
          "Sim. Fazemos o levantamento de tudo que está pendente, avaliamos multas e juros, regularizamos as entregas e, quando cabível, buscamos redução de penalidades por meio de retificação espontânea.",
      },
    ],
    cta: {
      title: "Sua contabilidade está em dia e ainda assim você não sabe se o mês foi bom?",
      description:
        "Fale com a gente. Fazemos um diagnóstico gratuito da sua situação contábil e fiscal, sem compromisso e sem custo.",
    },
    seo: {
      title: "Serviços Contábeis e Departamento Pessoal",
      description:
        "Escrituração contábil e fiscal, folha de pagamento, eSocial, obrigações acessórias e relatórios gerenciais mensais. Atendimento para MEI, Simples, Presumido e Real.",
      keywords: [
        "serviços contábeis",
        "escritório de contabilidade",
        "departamento pessoal",
        "abertura de empresa",
        "folha de pagamento",
      ],
    },
  },

  /* ==========================================================================
   *  4. PERÍCIA CONTÁBIL
   * ======================================================================== */
  {
    slug: "pericia-contabil",
    name: "Perícia Contábil",
    shortName: "Perícia",
    tagline: "Laudo técnico que se sustenta em juízo",
    summary:
      "Perícia judicial e extrajudicial, assistência técnica e arbitragem, com laudos e pareceres fundamentados em evidência documental e normas do CFC.",
    icon: "gavel",
    accent: "from-amber-500 to-orange-400",
    hero: {
      eyebrow: "Perícia Contábil",
      title: "A prova técnica que esclarece o juízo e sustenta a tese",
      subtitle:
        "Atuamos como peritos nomeados, peritos assistentes e assistentes técnicos em demandas que envolvem apuração de haveres, revisão de contratos, danos e prestação de contas.",
      highlights: [
        "Perícia judicial e extrajudicial",
        "Assistência técnica de parte com parecer crítico",
        "Apuração de haveres e dissolução de sociedade",
        "Laudos para arbitragem e processos administrativos",
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
        title: "Perícia extrajudicial e arbitragem",
        description:
          "Apurações técnicas fora do Judiciário, para subsidiar negociação, acordo ou procedimento arbitral.",
        items: [
          "Apuração consensual de haveres e acertos entre sócios",
          "Revisão de contratos com cláusula de reajuste financeiro",
          "Apuração de danos, lucros cessantes e perdas materiais",
          "Verificação de cumprimento de obrigações contratuais",
          "Laudos para câmaras arbitrais",
        ],
      },
      {
        title: "Apuração de haveres e disputas societárias",
        description:
          "Frente especializada nas causas que mais dependem de técnica contábil para serem resolvidas.",
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
      "Planilhas de cálculo rastreáveis, com memória de apuração",
      "Proposta de honorários periciais",
      "Manifestações, esclarecimentos e impugnações complementares",
      "Suporte técnico ao advogado em audiências e sustentações",
    ],
    faq: [
      {
        question: "Qual a diferença entre perito e assistente técnico?",
        answer:
          "O perito é nomeado pelo juízo e deve ser imparcial, produzindo o laudo que instrui a decisão. O assistente técnico é indicado por uma das partes, acompanha os trabalhos e elabora parecer que aponta divergências ou confirma o laudo, sempre na defesa técnica de quem o contratou.",
      },
      {
        question: "Vocês atuam em causas de qualquer valor?",
        answer:
          "Atuamos em causas de valores variados, mas a análise econômica precisa fazer sentido: em disputas menores, o custo do trabalho técnico pode superar o proveito esperado. Na primeira conversa indicamos com franqueza se vale a pena.",
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
      title: "Perícia Contábil Judicial e Extrajudicial",
      description:
        "Perícia contábil judicial, assistência técnica de parte, apuração de haveres e laudos para arbitragem. Trabalho técnico fundamentado nas normas do CFC.",
      keywords: [
        "perícia contábil",
        "perito judicial contábil",
        "assistente técnico",
        "apuração de haveres",
        "laudo pericial contábil",
      ],
    },
  },
];

export const getService = (slug: string) =>
  services.find((service) => service.slug === slug);

export const serviceSlugs = services.map((service) => service.slug);
