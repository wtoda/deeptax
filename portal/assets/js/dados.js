// dados.js — base de conteúdo editorial do Reforma Tributária.
// Toda afirmação regulatória carrega fonte. O que é estimativa está marcado como tal.

export const META = {
  produto: "Reforma Tributária",
  subtitulo: "Reforma Tributária do Consumo",
  atualizadoEm: "30/10/2026",
  versao: "1.0",
  aviso:
    "Conteúdo informativo e educacional, elaborado a partir da EC 132/2023, da LC 214/2025 e de material oficial da Receita Federal e do CFC. Não substitui consultoria tributária individualizada.",
};

/* ------------------------------------------------------------------ *
 * RADAR REGULATÓRIO — o que está em movimento agora
 * ------------------------------------------------------------------ */
export const RADAR = [
  {
    data: "28/10/2026",
    tag: "Alíquota de referência",
    status: "andamento",
    titulo: "TCU aprova CBS de 11,3% para 2027 e envia ao Senado",
    texto:
      "O plenário do TCU aprovou em 28/10/2026 o cálculo da alíquota de referência da CBS em 11,3468% (arredondado para 11,3%) — acima da estimativa de 8,8% do Ministério da Fazenda (2024). O mesmo acórdão fixou redutor de 44,16% nas compras da administração pública direta, autarquias e fundações. O cálculo segue para o Senado, que fixa a alíquota por resolução; a Agência Senado informa prazo até 22/12/2026, enquanto parte da imprensa econômica citou 15/12 — o prazo exato está no texto da resolução.",
    impacto:
      "Muda o centro da simulação de 2027 em diante. E há uma regra que quase ninguém cita: segundo a Agência Senado, se o Senado não fixar a alíquota, a do TCU passa a valer em 1º/01/2027 — ou seja, a ausência de resolução não adia a cobrança.",
    fonte: "https://www12.senado.leg.br/noticias/materias/2026/10/28/reforma-tributaria-tcu-calcula-aliquota-da-cbs-em-11-3-para-2027",
  },
  {
    data: "out/2026",
    tag: "Imposto Seletivo",
    status: "atencao",
    titulo: "Regulamentação das alíquotas do IS está postergada",
    texto:
      "A medida provisória que fixaria as alíquotas do Imposto Seletivo não foi publicada até 02/10/2026. Como o tributo se sujeita à anterioridade nonagesimal, a cobrança não pode começar em 1º/01/2027: o início depende da publicação e do prazo de 90 dias.",
    impacto:
      "Não congele projetos por causa disso. A estrutura do IS está na LC 214/2025; o que falta é a alíquota. A PLOA 2027 estimava R$ 41,9 bi de arrecadação, com perda de cerca de R$ 3,8 bi pelo atraso.",
    fonte: "https://grm.com.br/imposto-seletivo-2027-aliquotas-ficam-para-depois/",
  },
  {
    data: "jul/2026",
    tag: "Alíquota de referência",
    status: "informativo",
    titulo: "CGIBS estimou alíquota combinada de 27,91%",
    texto:
      "O Comitê Gestor do IBS estimou alíquota de referência combinada de 27,91%, com CBS de 9,21% e IBS de 18,7%. O cálculo posterior do TCU para a CBS foi mais alto.",
    impacto: "Comparação útil de cenários — disponível no seletor da calculadora.",
    fonte: "https://www.taxgroup.com.br/intelligence/aliquota-ibs-cbs/",
  },
  {
    data: "2026",
    tag: "Ano de teste",
    status: "vigente",
    titulo: "2026 é ano de teste: dados informativos e dispensa de recolhimento",
    texto:
      "Os dados de IBS e CBS nos documentos fiscais têm caráter informativo. O contribuinte que cumprir as obrigações acessórias pode ser dispensado do recolhimento (ADCT, art. 125, § 4º; LC 214/2025, art. 348, § 1º). Havendo recolhimento, o valor é compensado com PIS e Cofins do mesmo período.",
    impacto: "É o ano de calibrar sistemas. Quem não emitir corretamente perde a dispensa e recolhe 1% em dinheiro.",
    fonte: "https://www.taxgroup.com.br/intelligence/aliquota-ibs-cbs/",
  },
];

/* ------------------------------------------------------------------ *
 * PRINCÍPIOS DO NOVO MODELO
 * ------------------------------------------------------------------ */
export const PRINCIPIOS = [
  {
    titulo: "Tributação no destino",
    texto:
      "O imposto é devido no local de consumo, não no de produção. Acaba a guerra fiscal e a tributação na origem das mercadorias.",
    lei: "CF, art. 156-A, § 1º (EC 132/2023)",
  },
  {
    titulo: "Não cumulatividade plena",
    texto:
      "O crédito é amplo: alcança insumos, bens de capital e serviços, com poucas exceções (como uso e consumo pessoal). A carga deixa de se acumular ao longo da cadeia.",
    lei: "LC 214/2025, arts. 28 a 45",
  },
  {
    titulo: "Alíquota única por ente, sem benefícios",
    texto:
      "Cada ente fixa sua alíquota de forma uniforme para todos os bens e serviços, vedada a concessão de benefícios fiscais para evitar distorções.",
    lei: "CF, art. 156-A, §§ 1º e 3º",
  },
  {
    titulo: "Legislação única nacional",
    texto:
      "IBS e CBS têm uma só lei geral aplicável a todos os entes, o que reduz litígio e simplifica o cumprimento.",
    lei: "LC 214/2025",
  },
  {
    titulo: "Base ampla e tributação “por fora”",
    texto:
      "Incide sobre bens, serviços e direitos, calculado sobre o valor da operação — não compõe a própria base, diferentemente do ICMS atual.",
    lei: "LC 214/2025, arts. 10 a 13",
  },
  {
    titulo: "Cobrança no documento fiscal",
    texto:
      "O documento fiscal passa a ter caráter de confissão do valor devido, com cálculo assistido pelo motor oficial. A escrituração de ICMS, PIS e Cofins dá lugar à apuração assistida.",
    lei: "LC 214/2025, art. 60, § 1º",
  },
];

/* ------------------------------------------------------------------ *
 * PILARES: IBS, CBS, IS
 * ------------------------------------------------------------------ */
export const PILARES = [
  {
    sigla: "IBS",
    nome: "Imposto sobre Bens e Serviços",
    esfera: "Estadual e municipal",
    substitui: "ICMS + ISS",
    cor: "#2b8c78",
    resumo:
      "Tributo subnacional que unifica o ICMS estadual e o ISS municipal em um único imposto, não cumulativo, cobrado no destino.",
    detalhes: [
      "Administrado por um Comitê Gestor (CGIBS), com arrecadação distribuída a estados e municípios.",
      "Substitui gradualmente ICMS e ISS entre 2029 e 2032, com alíquotas dos tributos antigos caindo 10 p.p. ao ano.",
      "Em 2026 é cobrado a 0,1% (somente estadual); em 2027 e 2028, 0,05% estadual + 0,05% municipal.",
    ],
    lei: "CF, art. 156-A; LC 214/2025, arts. 17 a 26",
  },
  {
    sigla: "CBS",
    nome: "Contribuição sobre Bens e Serviços",
    esfera: "Federal",
    substitui: "PIS + Cofins",
    cor: "#0f6f5c",
    resumo:
      "Contribuição federal que substitui PIS e Cofins, com a mesma lógica de base ampla e não cumulatividade plena.",
    detalhes: [
      "Administrada pela Receita Federal.",
      "PIS e Cofins são extintos em 2027, quando a CBS passa a ter alíquota própria.",
      "Em 2026 é cobrada a 0,9%, em caráter de teste, com compensação contra PIS/Cofins.",
    ],
    lei: "CF, art. 195, V; LC 214/2025, arts. 1º a 16",
  },
  {
    sigla: "IS",
    nome: "Imposto Seletivo",
    esfera: "Federal",
    substitui: "Função extrafiscal — não substitui tributo específico",
    cor: "#a8802a",
    resumo:
      "Tributo extrafiscal, monofásico, que incide sobre bens e serviços prejudiciais à saúde ou ao meio ambiente. Conhecido como “imposto do pecado”.",
    detalhes: [
      "Alcança, por NCM do Anexo XVII: veículos, embarcações, aeronaves, fumígenos, bebidas alcoólicas, bebidas açucaradas, bens minerais e concursos de prognósticos.",
      "Não incide sobre exportações, energia elétrica e telecomunicações.",
      "Também não incidem sobre caminhões, veículos de uso operacional das Forças Armadas e segurança pública e veículos espaciais; PCD/TEA e táxi têm alíquota zero. A incidência é monofásica: acontece uma única vez na cadeia e não gera crédito ao adquirente.",
      "Alíquotas dependem de lei ordinária — pendentes em out/2026. A extração mineral já tem alíquota definida em lei complementar: 0,25% sobre o valor de referência, respeitado o teto constitucional de 1%.",
    ],
    lei: "CF, art. 153, VIII; LC 214/2025, arts. 409 a 438 e Anexo XVII",
  },
];

/* ------------------------------------------------------------------ *
 * CRONOGRAMA
 * ------------------------------------------------------------------ */
export const CRONOGRAMA = [
  {
    ano: 2026,
    titulo: "Ano de teste",
    fase: "Transição",
    resumo:
      "IBS e CBS passam a ser destacados nos documentos fiscais, em caráter informativo. Os tributos atuais continuam integralmente em vigor.",
    cbs: "0,9% (teste)",
    ibs: "0,1% (estadual)",
    icms: "100%",
    iss: "100%",
    is: "Não incide",
    marcos: [
      "Documentos fiscais passam a ter os grupos de IBS e CBS (campos informativos).",
      "Recolhimento dispensado a quem cumprir as obrigações acessórias.",
      "Havendo recolhimento, o valor é compensado com PIS/Cofins do mesmo período.",
      "Início da implantação controlada do CNPJ alfanumérico (jul/2026).",
    ],
    lei: "ADCT, art. 125; LC 214/2025, art. 348",
  },
  {
    ano: 2027,
    titulo: "CBS cheia e início do Imposto Seletivo",
    fase: "Transição",
    resumo:
      "PIS e Cofins são extintos e a CBS passa a ser cobrada com alíquota própria. O IBS mantém 0,1%, agora dividido entre estado e município. O IS entra em vigor e o IPI é reduzido a zero para a maioria dos produtos.",
    cbs: "Referência − 0,1 p.p.",
    ibs: "0,05% estadual + 0,05% municipal",
    icms: "100%",
    iss: "100%",
    is: "Em vigor (sujeito à anterioridade nonagesimal)",
    marcos: [
      "Extinção do PIS e da Cofins; CBS com alíquota própria (ADCT, art. 126).",
      "IPI reduzido a zero, exceto para produtos da Zona Franca de Manaus.",
      "Início da tributação efetiva pelo IBS, ainda em alíquota reduzida.",
      "Estoque de abertura: crédito sobre bens existentes em 31/12/2026, apropriado em 12 parcelas.",
      "EFD-Contribuições com registro F150 para o crédito de estoque de abertura.",
    ],
    lei: "ADCT, arts. 126 e 127; LC 214/2025, arts. 378 a 382",
  },
  {
    ano: 2028,
    titulo: "Consolidação",
    fase: "Transição",
    resumo:
      "CBS e IBS mantêm o mesmo desenho de 2027. Começa a correção anual das alíquotas específicas do Imposto Seletivo pelo IPCA.",
    cbs: "Referência − 0,1 p.p.",
    ibs: "0,05% + 0,05%",
    icms: "100%",
    iss: "100%",
    is: "Correção pelo IPCA",
    marcos: [
      "Primeira atualização anual das alíquotas específicas do IS pelo IPCA.",
      "Preparação dos sistemas para a rampa do IBS a partir de 2029.",
    ],
    lei: "ADCT, art. 127",
  },
  {
    ano: 2029,
    titulo: "Começa a substituição de ICMS e ISS",
    fase: "Transição",
    resumo:
      "O IBS entra em rampa: passa a valer 10% da alíquota de referência. ICMS e ISS caem para 90% das alíquotas originais.",
    cbs: "Referência (100%)",
    ibs: "10% da referência",
    icms: "90%",
    iss: "90%",
    is: "Em vigor",
    marcos: [
      "Início da redução anual de 10% nas alíquotas de ICMS e ISS.",
      "Convivência de dois sistemas: convém manter controles paralelos.",
    ],
    lei: "ADCT, arts. 126 a 128",
  },
  {
    ano: 2030,
    titulo: "Rampa do IBS",
    fase: "Transição",
    resumo: "IBS a 20% da referência; ICMS e ISS a 80%.",
    cbs: "Referência",
    ibs: "20% da referência",
    icms: "80%",
    iss: "80%",
    is: "Em vigor",
    marcos: ["Redução de mais 10% nas alíquotas de ICMS e ISS."],
    lei: "ADCT, art. 128",
  },
  {
    ano: 2031,
    titulo: "Rampa do IBS",
    fase: "Transição",
    resumo: "IBS a 30% da referência; ICMS e ISS a 70%.",
    cbs: "Referência",
    ibs: "30% da referência",
    icms: "70%",
    iss: "70%",
    is: "Em vigor",
    marcos: ["Redução de mais 10% nas alíquotas de ICMS e ISS."],
    lei: "ADCT, art. 128",
  },
  {
    ano: 2032,
    titulo: "Último ano de convivência",
    fase: "Transição",
    resumo: "IBS a 40% da referência; ICMS e ISS a 60%. Último ano dos tributos antigos.",
    cbs: "Referência",
    ibs: "40% da referência",
    icms: "60%",
    iss: "60%",
    is: "Em vigor",
    marcos: [
      "Aquisições de bens usados para o regime do art. 406 até 31/12/2032.",
      "Encerramento das alíquotas remanescentes de ICMS e ISS.",
    ],
    lei: "ADCT, art. 128",
  },
  {
    ano: 2033,
    titulo: "Regime pleno",
    fase: "Pleno",
    resumo:
      "IBS e CBS são cobrados integralmente e ICMS e ISS deixam de existir. O modelo IVA dual opera em plenitude.",
    cbs: "Referência (100%)",
    ibs: "Referência (100%)",
    icms: "Extinto",
    iss: "Extinto",
    is: "Em vigor",
    marcos: [
      "Fim da transição: apenas IBS, CBS e IS sobre o consumo.",
      "O IS incorpora por completo o diferencial de ICMS de fumígenos e bebidas alcoólicas.",
    ],
    lei: "ADCT, arts. 125 a 133",
  },
];

/* ------------------------------------------------------------------ *
 * DOCUMENTOS FISCAIS
 * ------------------------------------------------------------------ */
export const DOCUMENTOS = [
  {
    nome: "NF-e",
    documentacao: [
      { rotulo: "Portal NF-e — downloads (manual, schemas, notas técnicas)", url: "https://www.nfe.fazenda.gov.br/portal/downloads.aspx", formato: "portal", verificado: "30/10/2026" },
    ],
    modelo: "55",
    familia: "Mercadorias",
    autoriza: "SEFAZ estaduais",
    uso: "Operações B2B, B2G e comércio eletrônico com mercadorias.",
    novidade:
      "Recebe o grupo IBSCBS com CST, cClassTrib e indicadores de crédito. Os eventos passam a registrar pagamento, crédito presumido e imobilização.",
    status: "Em adaptação",
  },
  {
    nome: "NFC-e",
    documentacao: [
      { rotulo: "Portal NF-e/NFC-e — downloads", url: "https://www.nfe.fazenda.gov.br/portal/downloads.aspx", formato: "portal", verificado: "30/10/2026" },
    ],
    modelo: "65",
    familia: "Mercadorias",
    autoriza: "SEFAZ estaduais",
    uso: "Varejo presencial, no lugar do cupom fiscal.",
    novidade: "Também recebe os grupos de IBS e CBS; o consumidor passa a ver o tributo destacado.",
    status: "Em adaptação",
  },
  {
    nome: "CT-e / CT-e OS",
    documentacao: [
      { rotulo: "Portal CT-e", url: "https://www.cte.fazenda.gov.br/portal/", formato: "portal", verificado: "30/10/2026" },
      { rotulo: "Esquemas XML do CT-e", url: "https://www.cte.fazenda.gov.br/portal/listaConteudo.aspx?tipoConteudo=0xlG1bdBass=", formato: "schema", verificado: "30/10/2026" },
      { rotulo: "Portal SVRS — CT-e", url: "https://dfe-portal.svrs.rs.gov.br/Cte", formato: "portal", verificado: "30/10/2026" },
    ],
    modelo: "57",
    familia: "Transportes",
    autoriza: "SEFAZ estaduais",
    uso: "Transporte de cargas e de pessoas; CT-e OS para outros serviços de transporte.",
    novidade: "Transporte é serviço tributado pelo IBS/CBS no destino, com crédito para o tomador.",
    status: "Em adaptação",
  },
  {
    nome: "BP-e",
    documentacao: [
      { rotulo: "Portal BP-e (SVRS)", url: "https://dfe-portal.svrs.rs.gov.br/Bpe", formato: "portal", verificado: "30/10/2026" },
    ],
    modelo: "63",
    familia: "Transportes",
    autoriza: "SEFAZ estaduais",
    uso: "Bilhete de passagem eletrônico (rodoviário, aéreo, aquaviário).",
    novidade: "Variantes TM e TA convivem com o BP-e tradicional na nova modelagem.",
    status: "Em adaptação",
  },
  {
    nome: "NFS-e (padrão nacional)",
    documentacao: [
      { rotulo: "Documentação técnica da NFS-e", url: "https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica", formato: "portal", verificado: "30/10/2026" },
      { rotulo: "Documentação atual (leiautes e esquemas)", url: "https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/documentacao-atual", formato: "schema", verificado: "30/10/2026" },
      { rotulo: "Grupos IBSCBS — página RTC", url: "https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/rtc", formato: "manual", verificado: "30/10/2026" },
      { rotulo: "NT 004 — novo layout RTC (PDF)", url: "https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/producao-restrita/nt-004-se-cgnfse-novo-layout-rtc-v2-00-20251210.pdf", formato: "pdf", verificado: "30/10/2026" },
      { rotulo: "NT 009 v1.01 (PDF)", url: "https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/rtc/nota-tecnica-009-se-cgnfs-e-v-1-01.pdf", formato: "pdf", verificado: "30/10/2026" },
      { rotulo: "Anexo VI — leiautes IBS/CBS (XLSX)", url: "https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/rtc/anexovi-leiautesrn_rtc_ibscbs-v1-04-01-nt009.xlsx", formato: "xlsx", verificado: "30/10/2026" },
      { rotulo: "Anexo VII — indicadores de operação (XLSX)", url: "https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/rtc/anexovii-indop_ibscbs_v1-03-00-nt009.xlsx", formato: "xlsx", verificado: "30/10/2026" },
      { rotulo: "Anexo VIII — correlação NBS × cClassTrib × cIndOp (XLSX, 26/10/2026)", url: "https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/rtc/anexo_viii-tabela-correlacao-v01-02-00-20261026.xlsx", formato: "xlsx", verificado: "30/10/2026" },
      { rotulo: "API de integração da NFS-e", url: "https://www.gov.br/nfse/pt-br/municipios/produtos-disponiveis/api-de-integracao", formato: "portal", verificado: "30/10/2026" },
    ],
    modelo: "—",
    familia: "Serviços",
    autoriza: "Secretarias de Finanças municipais + RFB",
    uso: "Prestação de serviços em todo o país, com padrão único nacional.",
    novidade:
      "Grupo IBSCBS em produção desde 05/01/2026 (NT SE/CGNFS-e 004), com CST, cClassTrib e cIndOp. Emissor web recebe o grupo a partir de agosto/2026 (NT 009).",
    status: "Grupo IBS/CBS em produção",
  },
  {
    nome: "NFS-e Via",
    documentacao: [
      { rotulo: "Documentação técnica da NFS-e Via", url: "https://www.gov.br/nfse/pt-br/nfs-e-via/documentacao-tecnica", formato: "portal", verificado: "30/10/2026" },
      { rotulo: "Manuais e anexos", url: "https://www.gov.br/nfse/pt-br/nfs-e-via/documentacao-tecnica/manuais-e-anexos", formato: "manual", verificado: "30/10/2026" },
      { rotulo: "Arquivos dos esquemas XSD", url: "https://www.gov.br/nfse/pt-br/nfs-e-via/documentacao-tecnica/arquivos-dos-esquemas-xsd", formato: "schema", verificado: "30/10/2026" },
      { rotulo: "Notas técnicas", url: "https://www.gov.br/nfse/pt-br/nfs-e-via/documentacao-tecnica/notas-tecnicas", formato: "manual", verificado: "30/10/2026" },
    ],
    modelo: "—",
    familia: "Serviços",
    autoriza: "Receita Federal",
    uso: "Arrecadação de pedágio por concessionárias de rodovias.",
    novidade: "Documento novo, em produção desde janeiro/2026 (NT SE/CGNFS-e 006).",
    status: "Em produção",
  },
  {
    nome: "NFCom",
    documentacao: [
      { rotulo: "Portal NFCom (SVRS)", url: "https://dfe-portal.svrs.rs.gov.br/Nfcom", formato: "portal", verificado: "30/10/2026" },
    ],
    modelo: "62",
    familia: "Faturas",
    autoriza: "SEFAZ estaduais",
    uso: "Serviços de comunicação (telefonia, internet, TV).",
    novidade: "Substitui os modelos 21 e 22 das concessionárias.",
    status: "Em adaptação",
  },
  {
    nome: "NF3-e",
    documentacao: [
      { rotulo: "Portal NF3-e (SVRS)", url: "https://dfe-portal.svrs.rs.gov.br/NF3e", formato: "portal", verificado: "30/10/2026" },
    ],
    modelo: "66",
    familia: "Faturas",
    autoriza: "SEFAZ estaduais",
    uso: "Fornecimento de energia elétrica.",
    novidade: "Substitui o modelo 6; energia é vedada à incidência do Imposto Seletivo.",
    status: "Em adaptação",
  },
  {
    nome: "NF Água (NFAg)",
    documentacao: [
      { rotulo: "Portal NF Água (SVRS)", url: "https://dfe-portal.svrs.rs.gov.br/Nfag", formato: "portal", verificado: "30/10/2026" },
    ],
    modelo: "—",
    familia: "Faturas",
    autoriza: "SEFAZ estaduais",
    uso: "Fornecimento de água e saneamento.",
    novidade: "Em implantação gradual pelos estados, sem massificação nacional.",
    status: "Implantação gradual",
  },
  {
    nome: "NF Gás (NFGas)",
    documentacao: [
      { rotulo: "Portal NF Gás (SVRS)", url: "https://dfe-portal.svrs.rs.gov.br/Nfgas", formato: "portal", verificado: "30/10/2026" },
    ],
    modelo: "—",
    familia: "Faturas",
    autoriza: "SEFAZ estaduais",
    uso: "Fornecimento de gás canalizado.",
    novidade: "Substitui os modelos antigos das concessionárias.",
    status: "Implantação gradual",
  },
  {
    nome: "DERE",
    documentacao: [
      { rotulo: "Portal da Reforma Tributária (RFB)", url: "https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/programas-e-atividades/reforma-tributaria-do-consumo", formato: "portal", verificado: "30/10/2026" },
    ],
    modelo: "—",
    familia: "Especiais",
    autoriza: "Receita Federal",
    uso: "Apuração da CBS por margem em regimes específicos (financeiro, planos de saúde, jogos).",
    novidade: "Documento novo do ecossistema: substitui a lógica de apuração por declaração.",
    status: "Novo",
  },
  {
    nome: "NF-e ABI",
    documentacao: [
      { rotulo: "Portal da Reforma Tributária (RFB)", url: "https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/programas-e-atividades/reforma-tributaria-do-consumo", formato: "portal", verificado: "30/10/2026" },
    ],
    modelo: "—",
    familia: "Especiais",
    autoriza: "Receita Federal",
    uso: "Alienação de bens imóveis, inclusive por pessoa física.",
    novidade: "Documento novo; a locação de imóvel usa a NFS-e.",
    status: "Novo",
  },
  {
    nome: "Duimp / DIR",
    documentacao: [
      { rotulo: "Portal Único de Comércio Exterior", url: "https://www.gov.br/siscomex/pt-br", formato: "portal", verificado: "30/10/2026" },
    ],
    modelo: "—",
    familia: "Comércio exterior",
    autoriza: "Receita Federal",
    uso: "Importação — regime comum (Duimp) e simplificado (DIR, remessas até US$ 3.000).",
    novidade: "Importação recolhe CBS integralmente; o IS alcança bens do Anexo XVII.",
    status: "Em operação",
  },
  {
    nome: "eDBV",
    documentacao: [
      { rotulo: "Portal da Reforma Tributária (RFB)", url: "https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/programas-e-atividades/reforma-tributaria-do-consumo", formato: "portal", verificado: "30/10/2026" },
    ],
    modelo: "—",
    familia: "Comércio exterior",
    autoriza: "Receita Federal",
    uso: "Bagagem de viajantes (regime especial de viajantes).",
    novidade: "Sem CBS na bagagem; IS isento em bagagens e remessas internacionais.",
    status: "Em operação",
  },
];

export const CAMPOS_FISCAIS = [
  {
    campo: "CST",
    nome: "Código de Situação Tributária",
    o_que:
      "Três dígitos que indicam a essência do tratamento tributário (ex.: 000 = tributação integral; 200 = redução de alíquota).",
    onde: "Primeiro nível de classificação do item no documento.",
  },
  {
    campo: "cClassTrib",
    nome: "Classificação Tributária",
    o_que:
      "Identificador estruturado que contém a base legal unívoca da operação. Os três primeiros dígitos são sempre o CST.",
    onde: "Individualiza a regra: se há crédito presumido, ressarcimento, estorno ou redução.",
  },
  {
    campo: "cIndOp",
    nome: "Indicador de operação",
    o_que: "Sinaliza o tipo de operação nos padrões da NFS-e, junto com CST e cClassTrib.",
    onde: "Documentos de serviço (NFS-e).",
  },
  {
    campo: "gRedBC",
    nome: "Grupo de redução de base de cálculo",
    o_que: "Registra reduções de base de cálculo previstas em lei, como bens do ativo imobilizado.",
    onde: "Itens do documento fiscal.",
  },
  {
    campo: "Indicadores de crédito",
    nome: "Apropriação de crédito",
    o_que:
      "Sinalizadores que informam se o adquirente pode apropriar crédito, se a operação antecedente gera crédito e se há crédito presumido.",
    onde: "Derivados do cClassTrib e validados pelo motor oficial.",
  },
];

export const OBRIGACOES = [
  {
    titulo: "Fim da escrituração clássica",
    texto:
      "A escrituração de ICMS, PIS e Cofins é substituída pela apuração assistida: o próprio documento fiscal é a confissão do valor devido, e o cálculo é feito a partir deles.",
    status: "Transição a partir de 2026",
  },
  {
    titulo: "Apuração assistida e declaração pré-preenchida",
    texto:
      "O Fisco calcula o tributo a partir dos DF-e e entrega a declaração pré-preenchida. A lógica muda de “contribuinte calcula” para “contribuinte declara, administração calcula”.",
    status: "Em implantação",
  },
  {
    titulo: "Calculadora de Tributos (motor oficial)",
    texto:
      "Motor de cálculo de código aberto que embarca o conteúdo normativo. Faz identificação de alíquota, reduções, memória de cálculo, validação de NCM/NBS e geração de XML, com API e componente para embarcar no ERP.",
    status: "Disponível",
  },
  {
    titulo: "Split payment",
    texto:
      "Na liquidação financeira, o PSP segrega o IBS/CBS e recolhe o tributo no momento do pagamento. Modalidades: inteligente (online/offline) e simplificado. Altera o fluxo de caixa, não o valor devido.",
    status: "Implementação futura",
  },
  {
    titulo: "Estoque de abertura",
    texto:
      "Bens existentes em 31/12/2026 geram crédito de IBS/CBS, apropriado em 12 parcelas mensais a partir de 2027. Na EFD-Contribuições, o crédito vai no registro F150.",
    status: "Prazo: 2027",
  },
  {
    titulo: "Notas de ajuste",
    texto:
      "Notas de crédito e de débito passam a registrar ajustes de IBS/CBS, com leiaute definido na NT SE/CGNFS-e 009.",
    status: "Novo",
  },
];

/* ------------------------------------------------------------------ *
 * CONFORMIDADE — checklist por perfil
 * ------------------------------------------------------------------ */
export const PERFIS = [
  {
    id: "empresa",
    nome: "Empresa (regime regular)",
    itens: [
      { t: "Atualizar o emissor de DF-e para o leiaute com os grupos de IBS e CBS", p: "2026", peso: 3 },
      { t: "Revisar o cadastro de produtos e serviços e classificar cada item por CST/cClassTrib", p: "2026", peso: 3 },
      { t: "Parametrizar o ERP para calcular e destacar IBS/CBS por item", p: "2026", peso: 3 },
      { t: "Integrar ou validar cálculos com a Calculadora de Tributos oficial", p: "2026", peso: 2 },
      { t: "Montar a rotina de compensação do IBS/CBS de teste contra PIS/Cofins", p: "2026", peso: 2 },
      { t: "Levantar o estoque em 31/12/2026 para o crédito de abertura", p: "2027", peso: 3 },
      { t: "Redesenhar o fluxo de caixa para o split payment", p: "2027", peso: 2 },
      { t: "Revisar contratos de longo prazo com cláusulas de tributos", p: "contínuo", peso: 2 },
      { t: "Capacitar as equipes fiscal, contábil, TI e comercial", p: "contínuo", peso: 2 },
    ],
  },
  {
    id: "simples",
    nome: "Simples Nacional e MEI",
    itens: [
      { t: "Simular a permanência no Simples x migração para o regime regular", p: "2026", peso: 3 },
      { t: "Entender o crédito que o seu cliente terá ao comprar de você", p: "2026", peso: 3 },
      { t: "Verificar a obrigatoriedade do emissor nacional de NFS-e", p: "2026", peso: 2 },
      { t: "Acompanhar o PGDAS-D assistido e a extinção da DEFIS", p: "2027", peso: 2 },
    ],
  },
  {
    id: "contador",
    nome: "Contador e consultor",
    itens: [
      { t: "Dominar a diferença entre CST e cClassTrib", p: "2026", peso: 3 },
      { t: "Estudar a Calculadora de Tributos e sua memória de cálculo", p: "2026", peso: 3 },
      { t: "Mapear clientes por regime (geral, reduzido 60%, reduzido 30%, zero)", p: "2026", peso: 3 },
      { t: "Preparar a apuração do estoque de abertura na EFD-Contribuições", p: "2027", peso: 2 },
      { t: "Acompanhar as notas técnicas do DF-e e as resoluções do Senado", p: "contínuo", peso: 2 },
    ],
  },
  {
    id: "cidadao",
    nome: "Cidadão e consumidor",
    itens: [
      { t: "Entender que o tributo passa a aparecer destacado na nota", p: "2026", peso: 2 },
      { t: "Conhecer a cesta básica com alíquota zero", p: "2026", peso: 2 },
      { t: "Verificar se você tem direito ao cashback", p: "2027", peso: 2 },
      { t: "Saber que o imposto é do destino: onde você consome, ali é arrecadado", p: "2026", peso: 1 },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * CASHBACK, SIMPLES, REGIMES ESPECÍFICOS
 * ------------------------------------------------------------------ */
export const TEMAS = [
  {
    titulo: "Cashback para famílias de baixa renda",
    texto:
      "Mecanismo de devolução de parte do IBS e da CBS para famílias de baixa renda. O direito alcança quem está no CadÚnico e tem renda familiar mensal per capita de até meio salário mínimo. A devolução de CBS é de 100% no botijão de até 13 kg e nas contas de energia elétrica, água, esgoto, gás canalizado e telecomunicações, e de 20% nos demais produtos — com IBS de 20%. Produtos sujeitos ao Imposto Seletivo não geram cashback.",
    atencao:
      "O cashback foi desenhado para o consumo domiciliar a partir de janeiro de 2027, com operação pelo sistema financeiro. Percentuais maiores podem ser fixados pelo ente, até 100%.",
    lei: "CF, art. 156-A, § 5º, VIII; LC 214/2025, arts. 114 a 116; Decreto 12.955/2026, arts. 492 e seguintes",
  },
  {
    titulo: "Simples Nacional",
    texto:
      "O optante recolhe IBS e CBS dentro do DAS, como parte do regime unificado. Existe também o “Simples híbrido”: a opção por recolher IBS e CBS pelo regime regular, preservando o crédito para o adquirente. A opção tem efeitos semestrais — pedidos em setembro (para o semestre que começa em janeiro) e em março (para o que começa em julho).",
    atencao:
      "Quem compra de optante que permaneceu no regime unificado credita pelo valor destacado e efetivamente pago. Por isso a decisão depende do perfil da carteira: vender para outras empresas favorece o regime regular.",
    lei: "LC 123/2006 (com as alterações da LC 227/2026); Resoluções CGSN 186/2026, 190/2026 e 191/2026",
  },
  {
    titulo: "Regimes específicos",
    texto:
      "Combustíveis, serviços financeiros, planos de saúde, bens imóveis, cooperativas, agronegócio, economia digital, concursos de prognósticos e missões diplomáticas têm regras próprias de base de cálculo, alíquota ou apuração. Nos serviços financeiros, a base é a margem (spread e tarifas), com carga combinada de 10,85% em 2027-2028 evoluindo até 12,50% em 2033.",
    atencao:
      "Regime específico não significa carga menor automaticamente: muda a base, a mecânica de apuração e, em vários casos, veda o crédito ao adquirente.",
    lei: "CF, art. 156-A, § 6º; LC 214/2025, arts. 182 e seguintes",
  },
  {
    titulo: "Zona Franca de Manaus e áreas de livre comércio",
    texto:
      "O regime da ZFM é preservado até 2073, com habilitação via Suframa e projeto técnico-econômico. O IPI é reduzido a zero em 2027, exceto para produtos da Zona Franca de Manaus, e há crédito presumido de CBS nas operações do polo. As áreas de livre comércio (Tabatinga, Guajará-Mirim, Boa Vista/Bonfim, Macapá/Santana, Brasiléia/Epitaciolândia/Cruzeiro do Sul) também são mantidas.",
    atencao:
      "Bens como armas, fumo, bebidas alcoólicas, automóveis de passageiros, combustíveis e cosméticos não são contemplados pelos benefícios da ZFM.",
    lei: "LC 214/2025, arts. 439 a 460; ADCT, arts. 92-A e 92-B",
  },
  {
    titulo: "Crédito: quando nasce e como se aproveita",
    texto:
      "O crédito nasce com a extinção do débito do fornecedor — por compensação, pagamento, split payment, recolhimento pelo adquirente ou responsável. Aproveita-se por compensação com débitos do período ou seguintes e, alternativamente, por ressarcimento. Bens de capital geram crédito integral e imediato quando incorporados ao ativo.",
    atencao:
      "A vedação central é o uso e consumo pessoal. O CGIBS retém o saldo de créditos não compensados e não ressarcidos antes de distribuir a arrecadação, o que preserva a neutralidade do sistema.",
    lei: "CF, art. 156-A, § 1º, VIII; LC 214/2025, arts. 47, 53 e 57",
  },
];

/* ------------------------------------------------------------------ *
 * KIT DE DIVULGAÇÃO — frases seguras x frases de risco
 * ------------------------------------------------------------------ */
export const KIT_FRASES = [
  {
    segura: "“O IBS e a CBS substituem ICMS, ISS, PIS e Cofins, com transição entre 2026 e 2033.”",
    evite: "“A reforma já acabou com o ICMS em 2026.”",
    porque: "Em 2026 os tributos antigos seguem integrais; a substituição é gradual e se completa em 2033.",
  },
  {
    segura: "“Em 2026 as alíquotas de IBS e CBS são de teste: 0,1% e 0,9%.”",
    evite: "“Em 2026 o imposto novo já é cobrado valendo.”",
    porque: "O ano é de teste: os dados têm caráter informativo e há dispensa de recolhimento para quem cumpre as obrigações acessórias.",
  },
  {
    segura: "“A alíquota de referência ainda será fixada pelo Senado; o TCU calculou 11,3% para a CBS em 2027.”",
    evite: "“A alíquota final da reforma é de 26,5%.”",
    porque: "26,5% foi a estimativa de 2024; o cálculo do TCU (out/2026) aponta 11,3% só para a CBS.",
  },
  {
    segura: "“O Imposto Seletivo alcança bens prejudiciais à saúde e ao meio ambiente, como cigarros, bebidas e veículos.”",
    evite: "“O imposto do pecado já tem alíquotas definidas.”",
    porque: "A estrutura está na LC 214/2025, mas as alíquotas dependem de lei ordinária e estão pendentes.",
  },
  {
    segura: "“O imposto é devido no destino, onde o bem ou serviço é consumido.”",
    evite: "“O imposto continua sendo arrecadado na origem.”",
    porque: "A tributação no destino é um dos pilares do novo modelo e acaba com a guerra fiscal.",
  },
  {
    segura: "“A não cumulatividade é plena, com crédito amplo nas aquisições.”",
    evite: "“Todo crédito acaba.”",
    porque: "A reforma amplia o crédito; a vedação se limita a hipóteses como uso e consumo pessoal.",
  },
];

export const KIT_FORMATOS = [
  { nome: "Resumo de 1 minuto", desc: "O que muda em 2026, o que muda em 2027 e o que ainda está pendente." },
  { nome: "Card para redes sociais", desc: "Uma frase segura + um número verificável + a fonte." },
  { nome: "Roteiro de palestra", desc: "Cronograma, pilares, documentos e simulação ao vivo na calculadora." },
  { nome: "Checklist de adequação", desc: "O que a empresa precisa fazer antes de 2027." },
];

/* ------------------------------------------------------------------ *
 * GLOSSÁRIO
 * ------------------------------------------------------------------ */
export const GLOSSARIO = [
  { termo: "IBS", def: "Imposto sobre Bens e Serviços — tributo subnacional que unifica ICMS e ISS, cobrado no destino.", lei: "CF, art. 156-A; LC 214/2025" },
  { termo: "CBS", def: "Contribuição sobre Bens e Serviços — tributo federal que substitui PIS e Cofins.", lei: "CF, art. 195, V; LC 214/2025" },
  { termo: "IS", def: "Imposto Seletivo — tributo extrafiscal e monofásico sobre bens prejudiciais à saúde ou ao meio ambiente.", lei: "CF, art. 153, VIII; LC 214/2025, arts. 409-438" },
  { termo: "IVA dual", def: "Modelo com dois tributos sobre o consumo (um federal, um subnacional), somando a mesma base ampla.", lei: "EC 132/2023" },
  { termo: "Princípio do destino", def: "O tributo é devido onde o bem ou serviço é consumido, e não onde é produzido.", lei: "CF, art. 156-A, § 1º" },
  { termo: "Não cumulatividade plena", def: "Crédito amplo sobre as aquisições, alcançando insumos, bens de capital e serviços, com poucas vedações.", lei: "LC 214/2025, arts. 28 a 45" },
  { termo: "Alíquota de referência", def: "Alíquota calculada pelo TCU e fixada por resolução do Senado, usada como parâmetro nacional.", lei: "ADCT, art. 130" },
  { termo: "Alíquota efetiva", def: "Alíquota final após aplicar reduções e regimes (ex.: referência com redução de 60% resulta em 40% da alíquota).", lei: "LC 214/2025, Anexos I, IV e V" },
  { termo: "Cesta Básica Nacional", def: "Conjunto de alimentos com alíquota zero e manutenção do crédito ao longo da cadeia.", lei: "EC 132/2023, art. 8º do ADCT; LC 214/2025, Anexo I" },
  { termo: "Split payment", def: "Segregação e recolhimento do IBS/CBS no momento da liquidação financeira da operação.", lei: "LC 214/2025, arts. 27, III, 31 e 32" },
  { termo: "CST", def: "Código de Situação Tributária — três dígitos que indicam a essência do tratamento tributário.", lei: "Padrões dos DF-e" },
  { termo: "cClassTrib", def: "Classificação Tributária — identificador que contém a base legal específica da operação e seus indicadores.", lei: "Padrões dos DF-e" },
  { termo: "cIndOp", def: "Indicador de operação nos padrões da NFS-e.", lei: "NT SE/CGNFS-e" },
  { termo: "Apuração assistida", def: "Modelo em que o Fisco calcula o tributo a partir dos documentos fiscais e entrega a declaração pré-preenchida.", lei: "LC 214/2025" },
  { termo: "DERE", def: "Declaração de regimes específicos — apuração da CBS por margem em setores como financeiro e saúde.", lei: "LC 214/2025" },
  { termo: "NF-e ABI", def: "Nota fiscal para alienação de bens imóveis, inclusive por pessoa física.", lei: "Regulamento da CBS" },
  { termo: "Cashback", def: "Devolução de parte do IBS e da CBS para famílias de baixa renda.", lei: "LC 214/2025" },
  { termo: "CGIBS", def: "Comitê Gestor do IBS — administra o imposto subnacional e distribui a arrecadação.", lei: "EC 132/2023" },
  { termo: "FCBF", def: "Fundo de Compensação de Benefícios Fiscais — compensa benefícios extintos pela reforma.", lei: "EC 132/2023, ADCT" },
  { termo: "FNDR", def: "Fundo Nacional de Desenvolvimento Regional — instrumento de redução das desigualdades regionais.", lei: "EC 132/2023, ADCT" },
  { termo: "Zona Franca de Manaus", def: "Regime incentivado preservado pela reforma, com tratamento próprio de IPI e crédito.", lei: "EC 132/2023" },
  { termo: "Estoque de abertura", def: "Crédito sobre bens existentes em 31/12/2026, apropriado em 12 parcelas a partir de 2027.", lei: "LC 214/2025, arts. 378 a 382" },
  { termo: "Regime regular", def: "Regime geral do IBS/CBS, com alíquota integral ou com as reduções previstas em lei.", lei: "LC 214/2025" },
  { termo: "Simples híbrido", def: "Opção do optante do Simples de recolher IBS e CBS pelo regime regular, preservando crédito ao cliente.", lei: "LC 214/2025" },
];

/* ------------------------------------------------------------------ *
 * QUIZ DE APRENDIZADO
 * ------------------------------------------------------------------ */
export const QUIZ = [
  {
    p: "Em 2026, quais são as alíquotas de IBS e CBS?",
    a: ["IBS 0,1% e CBS 0,9%", "IBS 8,8% e CBS 17,7%", "IBS 0% e CBS 0%", "IBS 17,7% e CBS 11,3%"],
    correta: 0,
    exp: "2026 é o ano de teste: IBS de 0,1% (estadual) e CBS de 0,9%, com caráter informativo e compensação contra PIS/Cofins (ADCT, art. 125).",
  },
  {
    p: "Quando o PIS e a Cofins deixam de existir?",
    a: ["Em 2026", "Em 2027", "Em 2033", "Em 2029"],
    a2: null,
    correta: 1,
    exp: "Em 2027 a CBS passa a ser cobrada com alíquota própria e PIS/Cofins são extintos (ADCT, art. 126).",
  },
  {
    p: "A partir de que ano o IBS começa a substituir efetivamente o ICMS e o ISS, ano a ano?",
    a: ["2026", "2027", "2029", "2033"],
    correta: 2,
    exp: "A rampa começa em 2029, com IBS a 10% da referência e ICMS/ISS a 90%, avançando 10 p.p. por ano (ADCT, art. 128).",
  },
  {
    p: "O que significa redução de 60% das alíquotas?",
    a: ["Paga-se 60% da alíquota", "Paga-se 40% da alíquota", "A alíquota é zerada", "Paga-se 6% da alíquota"],
    correta: 1,
    exp: "A redução é aplicada sobre a alíquota de referência: reduzir 60% significa pagar 40% dela.",
  },
  {
    p: "Sobre o que o Imposto Seletivo NÃO pode incidir?",
    a: ["Cigarros e bebidas", "Veículos", "Energia elétrica e telecomunicações", "Extração mineral"],
    correta: 2,
    exp: "A Constituição veda a incidência do IS sobre energia elétrica, telecomunicações e exportações.",
  },
  {
    p: "O que é o split payment?",
    a: ["Um novo documento fiscal", "O recolhimento do tributo na liquidação financeira", "Uma alíquota reduzida", "Um regime especial de exportação"],
    correta: 1,
    exp: "O split payment segrega e recolhe IBS/CBS no momento da liquidação financeira, alterando o fluxo de caixa (LC 214/2025, arts. 31 e 32).",
  },
  {
    p: "Quem fixa a alíquota de referência do IBS e da CBS?",
    a: ["O Comitê Gestor do IBS", "A Receita Federal", "O Senado Federal, a partir do cálculo do TCU", "Cada estado e município isoladamente"],
    correta: 2,
    exp: "O TCU calcula e o Senado fixa por resolução (ADCT, art. 130). O prazo para 2027 é dezembro/2026 (a Agência Senado indica 22/12).",
  },
  {
    p: "O que é o cClassTrib?",
    a: ["Um tipo de nota fiscal", "A classificação que traz a base legal específica da operação", "Uma alíquota estadual", "Um regime do Simples Nacional"],
    correta: 1,
    exp: "O cClassTrib individualiza a regra aplicável — seus três primeiros dígitos correspondem ao CST.",
  },
];

/* ------------------------------------------------------------------ *
 * FONTES
 * ------------------------------------------------------------------ */
export const FONTES = [
  {
    tipo: "Norma",
    titulo: "Emenda Constitucional nº 132/2023",
    desc: "Institui a reforma tributária do consumo e altera o ADCT (arts. 125 a 133).",
    url: "https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc132.htm",
  },
  {
    tipo: "Norma",
    titulo: "Lei Complementar nº 214/2025",
    desc: "Regulamenta o IBS, a CBS e o Imposto Seletivo, com os Anexos I, IV, V e XVII.",
    url: "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214.htm",
  },
  {
    tipo: "Oficial",
    titulo: "Receita Federal — Reforma Tributária do Consumo",
    desc: "Página oficial com o curso RTC/CFC, materiais de apoio e módulos por tema.",
    url: "https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/programas-e-atividades/reforma-tributaria-do-consumo",
  },
  {
    tipo: "Oficial",
    titulo: "Calculadora de Tributos (motor oficial)",
    desc: "Motor de cálculo de código aberto com memória de cálculo, API e guia de integração.",
    url: "https://consumo.tributos.gov.br/servico/calcular-tributos-consumo/calculadora/documentacao/guia-integracao",
  },
  {
    tipo: "Oficial",
    titulo: "Portal Nacional da NFS-e",
    desc: "Documentação, notas técnicas e emissores públicos da NFS-e padrão nacional.",
    url: "https://www.gov.br/nfse",
  },
  {
    tipo: "Oficial",
    titulo: "Agência Senado — TCU calcula a CBS em 11,3% para 2027",
    desc: "Fonte institucional do prazo da resolução e da regra de vigência automática caso o Senado não delibere.",
    url: "https://www12.senado.leg.br/noticias/materias/2026/10/28/reforma-tributaria-tcu-calcula-aliquota-da-cbs-em-11-3-para-2027",
  },
  {
    tipo: "Notícia",
    titulo: "TCU aprova CBS de 11,3% para 2027 (28/10/2026)",
    desc: "Cálculo da alíquota de referência encaminhado ao Senado, com prazo até 22/12/2026.",
    url: "https://www.infomoney.com.br/economia/tcu-propoe-aliquota-de-113-para-a-cbs-em-2027-acima-do-previsto-pelo-governo/",
  },
  {
    tipo: "Notícia",
    titulo: "Alíquota do IBS e da CBS: 2026 e o que muda até 2033",
    desc: "Detalhamento artigo por artigo do ADCT, incluindo a parcela municipal a partir de 2027.",
    url: "https://www.taxgroup.com.br/intelligence/aliquota-ibs-cbs/",
  },
  {
    tipo: "Notícia",
    titulo: "Imposto Seletivo 2027: alíquotas ficam para depois",
    desc: "Postergação da MP de alíquotas e efeito da anterioridade nonagesimal.",
    url: "https://grm.com.br/imposto-seletivo-2027-aliquotas-ficam-para-depois/",
  },
];

export const NORMAS = [
  { norma: "EC 132/2023", tipo: "Constitucional", assunto: "Criação do IBS, CBS e IS; regras de transição (ADCT, arts. 125-133)." },
  { norma: "LC 214/2025", tipo: "Complementar", assunto: "Regulamentação: arts. 1º-27 (CBS), 28-45 (créditos), 409-438 e Anexo XVII (IS), Anexos I, IV e V (regimes)." },
  { norma: "ADCT, arts. 125-128", tipo: "Constitucional", assunto: "Alíquotas de teste, entrada da CBS, parcela municipal do IBS e rampa de ICMS/ISS." },
  { norma: "ADCT, art. 130", tipo: "Constitucional", assunto: "Cálculo pelo TCU e fixação por resolução do Senado." },
  { norma: "Notas Técnicas do DF-e", tipo: "Infralegal", assunto: "Leiautes e prazos de implantação dos grupos de IBS/CBS (NT SE/CGNFS-e 004, 006, 009)." },
  { norma: "Lei ordinária do IS", tipo: "Ordinária", assunto: "Alíquotas do Imposto Seletivo — pendente de publicação." },
];

/* ------------------------------------------------------------------ *
 * LEGISLAÇÃO — catálogo de normas da Reforma Tributária do Consumo
 * ------------------------------------------------------------------ *
 * Cada norma carrega: hierarquia (1 = Constituição … 4 = atos técnicos),
 * status (vigente | pendente | tecnico), ementa, o que regula na prática,
 * link para a fonte oficial e onde o tema aparece dentro do Reforma Tributária.
 * Nenhum número de norma aqui foi inferido: todos vêm da EC 132/2023, da
 * LC 214/2025 ou de material oficial da RFB, conferidos em out/2026.
 * ------------------------------------------------------------------ */
export const NIVEIS_NORMATIVOS = [
  {
    nivel: 1,
    nome: "Constituição",
    analogia: "Coração e pulmão",
    explica:
      "Cria os tributos, define a repartição de competências e fixa o cronograma de transição. Nada abaixo pode contrariá-la.",
    exemplo: "EC 132/2023 — arts. 149-B, 153, VIII, 156-A, 195, V e ADCT 125-133.",
  },
  {
    nivel: 2,
    nome: "Lei complementar",
    analogia: "Veias e artérias principais",
    explica:
      "Regulamenta o que a Constituição criou: fato gerador, base, crédito, regimes diferenciados, obrigações acessórias.",
    exemplo: "LC 214/2025 (o corpo da reforma) e LC 227/2026 (ajustes, inclusive Simples Nacional).",
  },
  {
    nivel: 3,
    nome: "Regulamentos",
    analogia: "Veias e artérias médias",
    explica:
      "Operacionalizam a lei complementar: um regulamento para a CBS (federal) e um para o IBS (subnacional).",
    exemplo: "Decreto 12.955/2026 (RCBS) e Resolução CGIBS nº 6/2026 (RIBS).",
  },
  {
    nivel: 4,
    nome: "Atos técnicos",
    analogia: "Vasos capilares",
    explica:
      "Leiautes, campos, eventos e prazos dos documentos fiscais. Sem força de lei, mas é o que o sistema precisa implementar.",
    exemplo: "Notas Técnicas do DF-e (SE/CGNFS-e), portarias e resoluções do CGSN.",
  },
];

export const CATALOGO_NORMAS = [
  {
    id: "ec132",
    nivel: 1,
    tipo: "Emenda Constitucional",
    numero: "132",
    ano: 2023,
    data: "2023-12-20",
    dataBR: "20/12/2023",
    titulo: "Emenda Constitucional nº 132/2023",
    ementa:
      "Institui a reforma tributária do consumo: cria o IBS, a CBS e o Imposto Seletivo, e fixa o cronograma de transição até 2033.",
    oQue:
      "É a norma-mãe. Cria o IBS (art. 156-A), a CBS (art. 195, V) e o Imposto Seletivo (art. 153, VIII), insere o princípio do destino e a não cumulatividade plena, e escreve a transição no ADCT (arts. 125-133): alíquotas de teste em 2026, entrada da CBS em 2027, rampa do IBS de 2029 a 2032 e regime pleno em 2033.",
    status: "vigente",
    url: "https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc132.htm",
    tags: ["cronograma", "transição", "IBS", "CBS", "IS", "destino"],
    onde: [
      { rotulo: "Cronograma", href: "/reforma-tributaria/cronograma/" },
      { rotulo: "Entenda o modelo", href: "/reforma-tributaria/entenda/" },
    ],
    destaques: [
      "ADCT, art. 125: em 2026, IBS de 0,1% (estadual) e CBS de 0,9%, com dispensa de recolhimento a quem cumpre obrigações acessórias.",
      "ADCT, art. 126: em 2027 a CBS passa a ter alíquota própria e PIS/Cofins são extintos; o IPI é reduzido a zero, salvo ZFM.",
      "ADCT, art. 127: em 2027-2028 o IBS é cobrado a 0,05% estadual + 0,05% municipal.",
      "ADCT, art. 128: ICMS e ISS caem para 9/10, 8/10, 7/10 e 6/10 entre 2029 e 2032.",
      "ADCT, art. 130: o TCU calcula e o Senado fixa as alíquotas de referência por resolução.",
    ],
  },
  {
    id: "lc214",
    nivel: 2,
    tipo: "Lei Complementar",
    numero: "214",
    ano: 2025,
    data: "2025-01-16",
    dataBR: "16/01/2025",
    titulo: "Lei Complementar nº 214/2025",
    ementa:
      "Regulamenta o IBS, a CBS e o Imposto Seletivo, disciplina créditos, regimes diferenciados e obrigações acessórias.",
    oQue:
      "É o corpo da reforma — a norma que se consulta no dia a dia. Define fato gerador, base de cálculo, contribuinte, crédito e extinção do débito; trata de regimes diferenciados e específicos; traz o Imposto Seletivo (arts. 409-438) e os Anexos com as listas (I — cesta básica; II a XI — reduções; XVII — bens sujeitos ao IS por NCM).",
    status: "vigente",
    url: "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214.htm",
    tags: ["regulamentação", "crédito", "regimes", "IS", "anexos", "cesta básica"],
    onde: [
      { rotulo: "Entenda o modelo", href: "/reforma-tributaria/entenda/" },
      { rotulo: "Calculadora", href: "/reforma-tributaria/calculadora/" },
      { rotulo: "Documentos fiscais", href: "/reforma-tributaria/documentos/" },
    ],
    destaques: [
      "Arts. 1º a 27: regras gerais da CBS e do IBS; art. 27 lista as modalidades de extinção do débito, incluindo o split payment.",
      "Arts. 28 a 45: não cumulatividade; art. 57 veda o crédito em uso e consumo pessoal.",
      "Arts. 409 a 438 e Anexo XVII: Imposto Seletivo, com alíquotas dependentes de lei ordinária.",
      "Anexo I: Cesta Básica Nacional de Alimentos, com alíquota zero (EC 132/2023, art. 8º do ADCT).",
      "Arts. 378 a 382: estoque de abertura, com crédito sobre bens existentes em 31/12/2026.",
    ],
  },
  {
    id: "lc227",
    nivel: 2,
    tipo: "Lei Complementar",
    numero: "227",
    ano: 2026,
    data: "2026-01-13",
    dataBR: "13/01/2026",
    titulo: "Lei Complementar nº 227/2026",
    ementa:
      "Altera a LC 214/2025 e a LC 123/2006, incorporando IBS e CBS ao Simples Nacional.",
    oQue:
      "Faz os ajustes de segunda rodada: adapta o Simples Nacional ao novo modelo e altera dispositivos da LC 214/2025 — entre eles o art. 16, para deixar expresso que as reduções de regime incidem sobre a alíquota de cada ente federativo.",
    status: "vigente",
    url: "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp227.htm",
    tags: ["Simples Nacional", "ajustes", "reduções"],
    onde: [
      { rotulo: "Entenda o modelo", href: "/reforma-tributaria/entenda/" },
      { rotulo: "Conformidade", href: "/reforma-tributaria/conformidade/" },
    ],
    destaques: [
      "Altera a LC 123/2006 para que o optante recolha IBS e CBS dentro do DAS.",
      "Cria a base legal do chamado “Simples híbrido”: opção por recolher IBS/CBS pelo regime regular, com efeitos semestrais.",
      "Ajusta a LC 214/2025 quanto à incidência das reduções sobre a alíquota de cada ente.",
    ],
  },
  {
    id: "lc123",
    nivel: 2,
    tipo: "Lei Complementar",
    numero: "123",
    ano: 2006,
    data: "2006-12-14",
    dataBR: "14/12/2006",
    titulo: "Lei Complementar nº 123/2006 (Estatuto da MPE)",
    ementa:
      "Instituiu o Simples Nacional. Alterada pela LC 227/2026 para incorporar o IBS e a CBS.",
    oQue:
      "A norma que criou o Simples Nacional, agora alterada pela LC 227/2026. É nela que estão os anexos com as faixas e os percentuais do regime unificado — a base do cálculo do DAS, que passa a incluir IBS e CBS.",
    status: "vigente",
    url: "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm",
    tags: ["Simples Nacional", "MEI", "DAS"],
    onde: [
      { rotulo: "Conformidade", href: "/reforma-tributaria/conformidade/" },
      { rotulo: "Entenda o modelo", href: "/reforma-tributaria/entenda/" },
    ],
    destaques: [
      "Anexos I a V trazem as faixas de receita bruta e os percentuais de repartição.",
      "O sublimite de R$ 3,6 milhões permanece para o IBS; o sublimite de R$ 1,8 milhão deixa de existir.",
      "Quem compra de optante credita pelo valor destacado e efetivamente pago.",
    ],
  },
  {
    id: "dec12955",
    nivel: 3,
    tipo: "Decreto",
    numero: "12.955",
    ano: 2026,
    data: "2026-04-29",
    dataBR: "29/04/2026",
    titulo: "Decreto nº 12.955/2026 — Regulamento da CBS (RCBS)",
    ementa:
      "Regulamenta a CBS, em Livro 1 (Parte Comum, compartilhada com o IBS) e Livro 2 (Parte Especial).",
    oQue:
      "É o regulamento federal que operacionaliza a LC 214/2025 para a CBS. Traz as regras de apuração, crédito, regimes diferenciados e específicos, cashback, Zona Franca de Manaus e obrigações acessórias. Sua parte comum é compartilhada com o regulamento do IBS.",
    status: "vigente",
    url: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/decreto/d12955.htm",
    tags: ["CBS", "regulamento", "RCBS", "parte comum", "cashback"],
    onde: [
      { rotulo: "Entenda o modelo", href: "/reforma-tributaria/entenda/" },
      { rotulo: "Calculadora", href: "/reforma-tributaria/calculadora/" },
    ],
    destaques: [
      "Livro 1 — Parte Comum: regras compartilhadas por CBS e IBS.",
      "Livro 2 — Parte Especial: disciplina própria da CBS.",
      "Arts. 203 e seguintes: regimes diferenciados e os anexos com as listas de redução.",
      "Arts. 492 a 508: cashback para famílias de baixa renda.",
    ],
  },
  {
    id: "rescgibs6",
    nivel: 3,
    tipo: "Resolução",
    numero: "CGIBS nº 6",
    ano: 2026,
    data: "2026-04-30",
    dataBR: "30/04/2026",
    titulo: "Resolução CGIBS nº 6/2026 — Regulamento do IBS (RIBS)",
    ementa: "Institui o Regulamento do IBS, espelhando para o imposto subnacional o que o Decreto 12.955/2026 faz pela CBS.",
    oQue:
      "É o regulamento do IBS, editado pelo Comitê Gestor do IBS. Espelha a parte comum do RCBS e acrescenta as regras próprias do imposto estadual/municipal. Toda a operação com IBS — inclusive a repartição entre estado e município — se lê aqui combinada com a LC 214/2025.",
    status: "vigente",
    url: "https://www.cgibs.gov.br/",
    tags: ["IBS", "regulamento", "RIBS", "CGIBS"],
    onde: [
      { rotulo: "Entenda o modelo", href: "/reforma-tributaria/entenda/" },
      { rotulo: "Cronograma", href: "/reforma-tributaria/cronograma/" },
    ],
    destaques: [
      "Regulamento editado pelo Comitê Gestor do IBS (CGIBS).",
      "Reproduz a Parte Comum e detalha as regras exclusivas do IBS.",
      "Consulta obrigatória junto com a LC 214/2025 na análise de qualquer operação com IBS.",
    ],
  },
  {
    id: "rescamara",
    nivel: 4,
    tipo: "Resolução",
    numero: "CGSN",
    ano: 2026,
    data: "2026-09-01",
    dataBR: "2025-2026",
    titulo: "Resoluções do CGSN — Simples Nacional na RTC",
    ementa:
      "Adaptam o Simples Nacional ao novo modelo: opção, híbrido, emissor nacional de NFS-e e integração com IBS/CBS.",
    oQue:
      "Conjunto de resoluções do Comitê Gestor do Simples Nacional que tratam da operação do regime: janela de opção, regras do Simples híbrido com efeitos semestrais, obrigatoriedade do emissor nacional de NFS-e e integração do PGDAS-D com IBS e CBS.",
    status: "vigente",
    url: "https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/legislacao/resolucoes-cgsn",
    tags: ["Simples Nacional", "CGSN", "opção", "NFS-e", "PGDAS-D"],
    onde: [
      { rotulo: "Conformidade", href: "/reforma-tributaria/conformidade/" },
      { rotulo: "Documentos fiscais", href: "/reforma-tributaria/documentos/" },
    ],
    destaques: [
      "Res. CGSN 183/2025: primeira adaptação do Simples à reforma (base no art. 516 da LC 214/2025).",
      "Res. CGSN 186/2026: regras de opção.",
      "Res. CGSN 189/2026 e 191/2026: emissor nacional de NFS-e para optantes.",
      "Res. CGSN 190/2026: recolhimento de IBS/CBS no DAS e opção semestral pelo regime regular.",
    ],
  },
  {
    id: "port635",
    nivel: 4,
    tipo: "Portaria",
    numero: "RFB nº 635",
    ano: 2025,
    data: "2025-12-31",
    dataBR: "31/12/2025",
    titulo: "Portaria RFB nº 635/2025 — Fundo de Compensação (FCBF)",
    ementa:
      "Disciplina o Fundo de Compensação de Benefícios Fiscais ou Financeiro-Fiscais do ICMS.",
    oQue:
      "Regulamenta o FCBF, que compensa entre 2029 e 2032 a redução de benefícios de ICMS concedidos por prazo certo e sob condição. Os valores anuais vão de R$ 8 bilhões a R$ 32 bilhões em curva de sino, com complementação da União se insuficientes e saldo remanescente transferido ao FNDR.",
    status: "vigente",
    url: "https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/legislacao",
    tags: ["FCBF", "fundos", "ICMS", "benefícios fiscais"],
    onde: [
      { rotulo: "Cronograma", href: "/reforma-tributaria/cronograma/" },
      { rotulo: "Antes e depois", href: "/reforma-tributaria/comparativo/" },
    ],
    destaques: [
      "Base: EC 132/2023, art. 12; ADCT, art. 128; LC 214/2025, arts. 384 a 405.",
      "Janela de compensação: 1º/01/2029 a 31/12/2032.",
      "Saldo existente em 31/12/2032 é transferido ao FNDR.",
    ],
  },
  {
    id: "ntesc004",
    nivel: 4,
    tipo: "Nota Técnica",
    numero: "SE/CGNFS-e 004",
    ano: 2025,
    data: "2025-12-10",
    dataBR: "10/12/2025",
    titulo: "NT SE/CGNFS-e nº 004 — grupo IBSCBS na NFS-e",
    ementa: "Adequa o leiaute da NFS-e à reforma, introduzindo o grupo de campos de IBS e CBS.",
    oQue:
      "É a nota técnica que colocou o IBS e a CBS dentro do documento de serviço. Criou o grupo IBSCBS com CST, cClassTrib e cIndOp — inicialmente como campos facultativos — com produção restrita em 10/12/2025 e produção em 05/01/2026 na emissão por API.",
    status: "vigente",
    url: "https://www.gov.br/nfse/pt-br",
    tags: ["NFS-e", "leiaute", "IBSCBS", "CST", "cClassTrib"],
    onde: [{ rotulo: "Documentos fiscais", href: "/reforma-tributaria/documentos/" }],
    destaques: [
      "Introduz o grupo IBSCBS na NFS-e.",
      "Produção restrita em 10/12/2025; produção em 05/01/2026 para emissão por API.",
      "Introduz CST, cClassTrib e cIndOp nos padrões do documento.",
    ],
  },
  {
    id: "ntesc006",
    nivel: 4,
    tipo: "Nota Técnica",
    numero: "SE/CGNFS-e 006",
    ano: 2026,
    data: "2026-01-15",
    dataBR: "jan/2026",
    titulo: "NT SE/CGNFS-e nº 006 — NFS-e Via (pedágio)",
    ementa: "Define o leiaute da NFS-e Via, documento de arrecadação de pedágio por concessionárias.",
    oQue:
      "Cria o documento fiscal do pedágio, que entrou em produção em janeiro de 2026 e alcança cerca de 90 concessionárias. É um dos documentos novos do ecossistema da reforma.",
    status: "vigente",
    url: "https://www.gov.br/nfse/pt-br",
    tags: ["NFS-e Via", "pedágio", "documento novo"],
    onde: [{ rotulo: "Documentos fiscais", href: "/reforma-tributaria/documentos/" }],
    destaques: ["Documento novo, em produção desde janeiro de 2026.", "Uso: arrecadação de pedágio por concessionárias de rodovias."],
  },
  {
    id: "ntesc009",
    nivel: 4,
    tipo: "Nota Técnica",
    numero: "SE/CGNFS-e 009",
    ano: 2026,
    data: "2026-08-01",
    dataBR: "ago/2026",
    titulo: "NT SE/CGNFS-e nº 009 — notas de ajuste e novos fatos geradores",
    ementa:
      "Complementa as NT 004, 005 e 007, substitui anexos de leiaute e define as notas de crédito e de débito.",
    oQue:
      "Atualiza o leiaute da NFS-e e traz as notas de ajuste (crédito e débito), além dos novos fatos geradores — bens imateriais, imóveis (locação, cessão, arrendamento) e móveis. Também levou o grupo IBSCBS ao emissor web.",
    status: "vigente",
    url: "https://www.gov.br/nfse/pt-br",
    tags: ["NFS-e", "nota de crédito", "nota de débito", "leiaute", "imóveis"],
    onde: [{ rotulo: "Documentos fiscais", href: "/reforma-tributaria/documentos/" }],
    destaques: [
      "Define o leiaute das notas de ajuste (crédito e débito).",
      "Trata dos novos fatos geradores com bens imóveis e imateriais.",
      "Grupo IBSCBS no emissor web a partir de agosto/2026.",
    ],
  },
  {
    id: "nt2026005",
    nivel: 4,
    tipo: "Nota Técnica",
    numero: "2026.005",
    ano: 2026,
    data: "2026-06-01",
    dataBR: "2026",
    titulo: "NT 2026.005 — adequações da NF-e e NFC-e para o Simples Nacional",
    ementa:
      "Cria o evento 412140 (tributação do Simples Nacional) na NF-e e na NFC-e.",
    oQue:
      "Ajusta os documentos de mercadoria para refletir a tributação do optante do Simples Nacional no novo modelo. É a nota técnica que liga o Simples ao DF-e de mercadorias, ao lado do que a NT SE/CGNFS-e faz no lado dos serviços.",
    status: "vigente",
    url: "https://www.nfe.fazenda.gov.br/portal/principal.aspx",
    tags: ["NF-e", "NFC-e", "Simples Nacional", "evento 412140"],
    onde: [{ rotulo: "Documentos fiscais", href: "/reforma-tributaria/documentos/" }],
    destaques: [
      "Evento 412140: tributação do Simples Nacional.",
      "Complementa o conjunto de eventos de IBS/CBS da NF-e.",
    ],
  },
  {
    id: "port1429",
    nivel: 4,
    tipo: "Portaria",
    numero: "Conjunta RFB/SCS 1.429",
    ano: 2018,
    data: "2018-12-20",
    dataBR: "2018",
    titulo: "Portaria Conjunta RFB/SCS nº 1.429/2018 — NBS 2.0",
    ementa:
      "Institui a Nomenclatura Brasileira de Serviços, intangíveis e outras operações que produzam variações no patrimônio.",
    oQue:
      "A NBS é a chave de classificação dos serviços, equivalente à NCM para mercadorias. Os anexos da LC 214/2025 que tratam de serviços (educação, saúde, cultura) são organizados por código NBS.",
    status: "vigente",
    url: "https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/legislacao",
    tags: ["NBS", "nomenclatura", "serviços", "classificação"],
    onde: [
      { rotulo: "Documentos fiscais", href: "/reforma-tributaria/documentos/" },
      { rotulo: "Calculadora", href: "/reforma-tributaria/calculadora/" },
    ],
    destaques: [
      "NBS 2.0, com Comitê Gestor da NBS e NEBS.",
      "Base dos anexos de serviços da LC 214/2025.",
      "É o que a Calculadora de Tributos valida junto com a NCM.",
    ],
  },
  /* ---------------- pendentes de publicação ---------------- */
  {
    id: "lei-is",
    nivel: 3,
    tipo: "Lei ordinária",
    numero: "IS — a publicar",
    ano: 2026,
    data: "2026-12-31",
    dataBR: "pendente",
    titulo: "Lei ordinária do Imposto Seletivo",
    ementa:
      "Definirá as alíquotas e os critérios operacionais do Imposto Seletivo. Ainda não publicada.",
    oQue:
      "A LC 214/2025 deixou a estrutura pronta (arts. 409-438 e Anexo XVII), mas as alíquotas dependem de lei ordinária. Em outubro de 2026 a regulamentação estava postergada: como o tributo se sujeita à anterioridade nonagésima, a publicação posterior a 02/10/2026 impede a cobrança em 1º/01/2027.",
    status: "pendente",
    url: "https://www.gov.br/fazenda/pt-br",
    tags: ["Imposto Seletivo", "alíquotas", "pendente", "anterioridade"],
    onde: [
      { rotulo: "Entenda o modelo", href: "/reforma-tributaria/entenda/" },
      { rotulo: "Calculadora", href: "/reforma-tributaria/calculadora/" },
    ],
    destaques: [
      "Enquanto não publicada, só a extração mineral tem alíquota definida: 0,25% sobre o valor de referência.",
      "Efeito da anterioridade: 90 dias entre a publicação e a cobrança.",
      "A calculadora trata o IS como premissa, nunca como valor certo.",
    ],
  },
  {
    id: "res-senado",
    nivel: 3,
    tipo: "Resolução do Senado",
    numero: "alíquotas de referência",
    ano: 2026,
    data: "2026-12-15",
    dataBR: "prazo dez/2026",
    titulo: "Resolução do Senado Federal — alíquotas de referência",
    ementa:
      "Fixará as alíquotas de referência do IBS e da CBS. O TCU calcula e o Senado delibera.",
    oQue:
      "É a norma que transforma o cálculo técnico em alíquota oficial. Em 28/10/2026 o TCU aprovou o cálculo da CBS em 11,3468% (11,3%) para 2027 e encaminhou ao Senado, que fixa a alíquota por resolução até dezembro. Ponto que costuma passar batido: se o Senado não deliberar, a alíquota do TCU vigora mesmo assim a partir de 1º/01/2027. Até a publicação, todo número de 2027 em diante é premissa — por isso o Reforma Tributária trabalha com cenários.",
    status: "pendente",
    url: "https://www12.senado.leg.br/",
    tags: ["alíquota de referência", "Senado", "TCU", "pendente", "2027"],
    onde: [
      { rotulo: "Painel", href: "/reforma-tributaria/painel/" },
      { rotulo: "Calculadora", href: "/reforma-tributaria/calculadora/" },
    ],
    destaques: [
      "ADCT, art. 130: cabe ao Senado fixar as alíquotas de referência.",
      "TCU aprovou 11,3468% (arredondado para 11,3%) para a CBS em 28/10/2026, com redutor de 44,16% nas compras públicas.",
      "Se o Senado não fixar a alíquota, a do TCU vigora a partir de 1º/01/2027 — não há prorrogação automática.",
      "Prazo para 2027: dezembro de 2026 (Agência Senado indica 22/12).",
      "Enquanto pendente, o produto exibe cenários declarados (TCU, Fazenda, CGIBS).",
    ],
  },
];

export const NOTAS_LEGISLACAO = [
  {
    titulo: "Por que duas normas de regulamento",
    texto:
      "A CBS é federal e a IBS é subnacional, então cada uma tem seu regulamento — mas existe uma Parte Comum, para que a mesma operação não receba dois tratamentos. O Decreto 12.955/2026 e a Resolução CGIBS nº 6/2026 devem ser lidos em conjunto.",
  },
  {
    titulo: "O que ainda falta",
    texto:
      "Duas peças essenciais não estão publicadas: a lei ordinária com as alíquotas do Imposto Seletivo e a resolução do Senado com as alíquotas de referência. Sem elas, nenhum número de 2027 em diante é definitivo.",
  },
  {
    titulo: "Nota técnica não é lei",
    texto:
      "As NT definem leiaute, campos e prazos — não criam tributo nem alíquota. Elas mudam com frequência e são o principal motivo de retrabalho em sistemas. Acompanhe o portal do DF-e antes de fechar cronograma de projeto.",
  },
];

/* ------------------------------------------------------------------ *
 * ANÁLISE DE IMPACTO DA LEGISLAÇÃO
 * ------------------------------------------------------------------ *
 * Setores com premissas DECLARADAS. As colunas "atual" são referências de
 * mercado (ICMS estadual, ISS municipal, PIS/Cofins não cumulativo) e não a
 * carga real de cada empresa — que depende de UF, município, benefícios e
 * creditamento efetivo. Onde a lei não permite comparar (regime específico,
 * Simples), o produto diz isso em vez de estimar.
 * ------------------------------------------------------------------ */
export const IMPACTO_SETORES = [
  {
    id: "industria",
    nome: "Indústria (venda entre empresas)",
    regime: "geral",
    tipo: "mercadoria",
    atual: { icms: 0.12 },
    premissa: "ICMS interestadual de 12% + PIS/Cofins 9,25%",
    obs: "Cadeia longa e muito crédito: tende a ser o setor mais beneficiado pela não cumulatividade plena.",
    calculavel: true,
  },
  {
    id: "varejo",
    nome: "Comércio varejista",
    regime: "geral",
    tipo: "mercadoria",
    atual: { icms: 0.18 },
    premissa: "ICMS interno de 18% + PIS/Cofins 9,25%",
    obs: "Venda final ao consumidor: o crédito de entrada importa menos e o preço final sente a alíquota cheia.",
    calculavel: true,
  },
  {
    id: "servicos",
    nome: "Serviços em geral",
    regime: "geral",
    tipo: "servico",
    atual: { iss: 0.05 },
    premissa: "ISS de 5% + PIS/Cofins 9,25%",
    obs: "É o setor com maior salto de alíquota nominal: sai de ~14% para a alíquota cheia do IVA dual.",
    calculavel: true,
  },
  {
    id: "saude",
    nome: "Saúde e planos de saúde",
    regime: "reduzido60",
    tipo: "servico",
    atual: { iss: 0.05 },
    premissa: "Redução de 60% sobre a alíquota de referência",
    obs: "Regime diferenciado compensa parte do salto. Planos de saúde têm base e crédito próprios no regulamento.",
    calculavel: true,
  },
  {
    id: "educacao",
    nome: "Educação",
    regime: "reduzido60",
    tipo: "servico",
    atual: { iss: 0.05 },
    premissa: "Redução de 60% (Anexo II, por NBS)",
    obs: "O benefício alcança a contraprestação dos serviços educacionais, não outras receitas da instituição.",
    calculavel: true,
  },
  {
    id: "liberais",
    nome: "Profissões regulamentadas",
    regime: "reduzido30",
    tipo: "servico",
    atual: { iss: 0.05 },
    premissa: "Redução de 30% (advocacia, contabilidade, engenharia e outras)",
    obs: "Pessoa jurídica precisa cumprir requisitos próprios para fruir a redução.",
    calculavel: true,
  },
  {
    id: "alimentos",
    nome: "Cesta básica e alimentos essenciais",
    regime: "zero",
    tipo: "mercadoria",
    atual: { icms: 0.07 },
    premissa: "Alíquota zero de IBS/CBS; ICMS atual de 7% como referência de cesta básica (varia por estado)",
    obs: "Alíquota zero preserva o crédito da cadeia — efeito diferente da isenção clássica.",
    calculavel: true,
  },
  {
    id: "bares",
    nome: "Bares, restaurantes e hotelaria",
    regime: "reduzido40",
    tipo: "servico",
    atual: { iss: 0.05 },
    premissa: "Redução de 40% da alíquota",
    obs: "O adquirente, em regra, não apropria crédito nessas operações — o que muda a conta de quem vende para empresas.",
    calculavel: true,
  },
  {
    id: "transporte",
    nome: "Transporte coletivo urbano",
    regime: "isento",
    tipo: "servico",
    atual: { iss: 0.05 },
    premissa: "Isenção de IBS/CBS para ônibus, metrô, VLT, monotrilho e trem urbano",
    obs: "É isenção, não alíquota zero: a lei anula os créditos das operações anteriores.",
    calculavel: true,
  },
  {
    id: "agro",
    nome: "Agronegócio (produtos in natura)",
    regime: "reduzido60",
    tipo: "mercadoria",
    atual: { icms: 0.12 },
    premissa: "Redução de 60% para produtos agropecuários in natura",
    obs: "Produtor rural não contribuinte gera crédito presumido ao adquirente, com percentual fixado anualmente.",
    calculavel: true,
  },
  {
    id: "veiculos",
    nome: "Veículos, bebidas e fumígenos",
    regime: "geral",
    tipo: "mercadoria",
    atual: { icms: 0.18, ipi: 0.10 },
    premissa: "Alíquota cheia + Imposto Seletivo (percentual pendente de lei ordinária)",
    obs: "Aqui a carga total não é calculável: falta a alíquota do IS. O produto trata como premissa na calculadora.",
    calculavel: true,
  },
  {
    id: "financeiro",
    nome: "Serviços financeiros",
    regime: "especifico",
    tipo: "servico",
    premissa: "Regime específico com base por margem (spread e tarifas)",
    obs: "Carga combinada documentada: 10,85% em 2027-2028, subindo até 12,50% em 2033. Não é comparável com a alíquota cheia porque a base é a margem, não a receita.",
    calculavel: false,
  },
  {
    id: "combustiveis",
    nome: "Combustíveis",
    regime: "especifico",
    tipo: "mercadoria",
    premissa: "Regime específico monofásico, com alíquota ad rem por produto",
    obs: "Não há alíquotas ad rem publicadas: dependem de regulamentação. Monofasia dispensa a vinculação crédito/débito na aquisição.",
    calculavel: false,
  },
  {
    id: "imoveis",
    nome: "Construção e bens imóveis",
    regime: "especifico",
    tipo: "servico",
    premissa: "Regime específico com reduções de 50% e 70% e redutores de ajuste",
    obs: "Operações com imóveis têm regras próprias (além do cadastro CIB): o detalhamento por operação está no regulamento.",
    calculavel: false,
  },
  {
    id: "simples",
    nome: "Optantes do Simples Nacional",
    regime: "simples",
    tipo: "mercadoria",
    premissa: "IBS e CBS recolhidos dentro do DAS",
    obs: "A carga não se compara com o regime regular item a item: o que decide é o crédito que o cliente consegue tomar.",
    calculavel: false,
  },
];

/** Impacto qualitativo por norma (chave = id em CATALOGO_NORMAS). */
export const IMPACTO_POR_NORMA = {
  ec132: { magnitude: "estrutural", resumo: "Redesenha o sistema: cria os três tributos, muda a competência e escreve a transição até 2033." },
  lc214: { magnitude: "estrutural", resumo: "Define como se calcula, quem paga, o que gera crédito e quais setores têm tratamento diferente." },
  lc227: { magnitude: "alto", resumo: "Decide a conta de mais de 5 milhões de optantes do Simples: ficar no DAS ou migrar para gerar crédito." },
  lc123: { magnitude: "alto", resumo: "Onde vivem as faixas e percentuais do Simples, agora com IBS e CBS dentro do DAS." },
  dec12955: { magnitude: "alto", resumo: "É o texto que a operação consulta no dia a dia da CBS: apuração, crédito, regimes e cashback." },
  rescgibs6: { magnitude: "alto", resumo: "Mesmo papel do RCBS, para o IBS — e define a repartição entre estado e município." },
  rescamara: { magnitude: "medio", resumo: "Define a mecânica do Simples no novo modelo: opção, híbrido e emissor nacional de NFS-e." },
  port635: { magnitude: "medio", resumo: "Move bilhões em compensação de benefícios de ICMS entre 2029 e 2032." },
  ntesc004: { magnitude: "operacional", resumo: "Coloca IBS e CBS dentro da NFS-e: sem isso, não há crédito nem apuração assistida no setor de serviços." },
  ntesc006: { magnitude: "operacional", resumo: "Cria o documento do pedágio, setor com arrecadação pulverizada em concessões." },
  ntesc009: { magnitude: "operacional", resumo: "Define notas de crédito e débito e os novos fatos geradores com imóveis e intangíveis." },
  nt2026005: { magnitude: "operacional", resumo: "Liga o Simples ao documento de mercadorias, via evento 412140." },
  port1429: { magnitude: "operacional", resumo: "É a chave de classificação dos serviços — sem NBS correta, a redução de alíquota não é aplicada." },
  "lei-is": { magnitude: "alto", resumo: "Sem ela, cigarro, bebida, veículo e aeronave não têm preço tributário final — e a arrecadação de 2027 fica indefinida." },
  "res-senado": { magnitude: "estrutural", resumo: "Transforma o cálculo do TCU em alíquota oficial: é o número que define a carga de todo o modelo." },
};

/** Dimensões qualitativas do impacto, por área de decisão. */
export const IMPACTO_DIMENSOES = [
  {
    dimensao: "Caixa e capital de giro",
    sentido: "negativo",
    quem: "Quem vende para consumidor final",
    efeito:
      "O split payment segrega o tributo no momento da liquidação: o fornecedor recebe o líquido e o valor não transita pelo caixa entre a venda e o recolhimento.",
    base: "LC 214/2025, arts. 27, III, 31 e 32",
  },
  {
    dimensao: "Crédito tributário",
    sentido: "positivo",
    quem: "Indústria e cadeias longas",
    efeito:
      "A não cumulatividade passa a ser plena, alcançando insumos, serviços e bens de capital. A vedação se restringe ao uso e consumo pessoal.",
    base: "CF, art. 156-A, § 1º, VIII; LC 214/2025, arts. 28 a 45 e 57",
  },
  {
    dimensao: "Preço ao consumidor",
    sentido: "misto",
    quem: "Todos os setores",
    efeito:
      "Serviços, tributados hoje por ISS de 2% a 5%, tendem a subir. Bens com cadeia longa tendem a cair, pela eliminação da cumulatividade e da guerra fiscal.",
    base: "ADCT, arts. 126 a 128",
  },
  {
    dimensao: "Custo de conformidade",
    sentido: "misto",
    quem: "Empresas com ERP e emissão fiscal",
    efeito:
      "Cai no médio prazo, com apuração assistida e declaração pré-preenchida. Sobe no curto prazo: adaptação de sistemas, classificação de itens e treinamento.",
    base: "LC 214/2025, art. 60; NT do DF-e",
  },
  {
    dimensao: "Competitividade externa",
    sentido: "positivo",
    quem: "Exportadores",
    efeito:
      "Exportações são imunes com manutenção integral dos créditos — o que hoje não acontece com ICMS em todos os estados.",
    base: "CF, art. 149, § 2º, I; LC 214/2025, art. 6º",
  },
  {
    dimensao: "Autonomia dos entes",
    sentido: "misto",
    quem: "Estados e municípios",
    efeito:
      "Acaba a guerra fiscal por benefícios de ICMS. Em troca, os entes passam a depender de alíquota uniforme e de repartição pelo destino.",
    base: "CF, art. 156-A, §§ 1º e 3º; ADCT, art. 130",
  },
  {
    dimensao: "Decisão do Simples",
    sentido: "decisão",
    quem: "Optantes e quem compra deles",
    efeito:
      "Permanecer no DAS simplifica, mas reduz o crédito do cliente. O Simples híbrido preserva o crédito ao custo de sair do regime unificado — e a escolha é semestral.",
    base: "LC 123/2006; LC 227/2026; Res. CGSN 190/2026",
  },
  {
    dimensao: "Regiões e incentivos",
    sentido: "compensatório",
    quem: "Norte, Nordeste e Zona Franca de Manaus",
    efeito:
      "O FNDR cresce de R$ 8 bi (2029) a R$ 60 bi/ano (2043+), e o FCBF compensa benefícios de ICMS entre 2029 e 2032. A ZFM é preservada até 2073.",
    base: "EC 132/2023, arts. 12 e 13; ADCT, arts. 92-A e 128; LC 214/2025, arts. 384 a 460",
  },
];

/* ------------------------------------------------------------------ *
 * INTEROPERABILIDADE E EXEMPLOS
 * ------------------------------------------------------------------ */
export const EXEMPLO_XML = {
  titulo: "Estrutura ilustrativa de um item com o grupo IBSCBS",
  aviso:
    "Exemplo DIDÁTICO para mostrar a forma do grupo. Os nomes exatos das tags, a ordem dos elementos e as regras de validação estão no schema (XSD) oficial do documento — nunca implemente a partir deste exemplo.",
  codigo: `<!-- ILUSTRATIVO — não é um XML válido para envio -->
<det nItem="1">
  <prod>
    <cProd>1234</cProd>
    <NCM>22021000</NCM>
    <CFOP>5102</CFOP>
    <vProd>100.00</vProd>
  </prod>

  <imposto>
    <IBSCBS>
      <!-- CST = essência do tratamento (3 dígitos).
           000 = tributação integral -->
      <CST>000</CST>

      <!-- cClassTrib = regra completa, com base legal unívoca.
           Os 3 primeiros dígitos repetem o CST. -->
      <cClassTrib>000001</cClassTrib>

      <!-- cIndOp = indicador de operação (padrões da NFS-e) -->
      <cIndOp>...</cIndOp>

      <!-- Base e alíquotas efetivas calculadas pelo motor oficial -->
      <vBC>100.00</vBC>
      <pCBS>11.20</pCBS>
      <vCBS>11.20</vCBS>
      <pIBSUF>0.05</pIBSUF>
      <vIBSUF>0.05</vIBSUF>
      <pIBSMun>0.05</pIBSMun>
      <vIBSMun>0.05</vIBSMun>
    </IBSCBS>
  </imposto>
</det>`,
  leitura: [
    "O grupo IBSCBS é por item, não por nota: cada linha pode ter tratamento diferente.",
    "CST responde o “tipo” do tratamento; cClassTrib responde “qual regra”. A dupla é o que libera ou veda o crédito.",
    "Os valores devem sair do motor de cálculo oficial — divergência entre o destacado e o calculado é apontada na validação.",
    "Alíquota em 2026 é de teste (0,1% IBS + 0,9% CBS); o exemplo usa 2027 para mostrar o grupo em operação.",
  ],
};

export const INTEROPERABILIDADE = [
  {
    titulo: "1. Schema (XSD) é o contrato",
    texto:
      "O schema define o que pode existir no XML: elemento, ordem, tipo e obrigatoriedade. Implementar pelo exemplo de outra empresa — e não pelo XSD — é a causa mais comum de rejeição.",
    links: [
      { rotulo: "Esquemas XML do CT-e", url: "https://www.cte.fazenda.gov.br/portal/listaConteudo.aspx?tipoConteudo=0xlG1bdBass=" },
      { rotulo: "Downloads NF-e (schema, manual, NT)", url: "https://www.nfe.fazenda.gov.br/portal/downloads.aspx" },
    ],
  },
  {
    titulo: "2. Valide antes de transmitir",
    texto:
      "Validação local contra o XSD e contra as regras de negócio evita ida e volta com a SEFAZ. É mais barato rejeitar no seu ambiente do que descobrir em produção.",
    links: [
      { rotulo: "Documentação atual da NFS-e", url: "https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/documentacao-atual" },
    ],
  },
  {
    titulo: "3. Use o motor de cálculo oficial",
    texto:
      "A Calculadora de Tributos é código aberto e pode ser embarcada no seu sistema. Ela aplica reduções, valida NCM/NBS, gera memória de cálculo e monta os blocos de XML — evitando que cada sistema implemente a regra à sua maneira.",
    links: [
      { rotulo: "Guia de integração da Calculadora", url: "https://consumo.tributos.gov.br/servico/calcular-tributos-consumo/calculadora/documentacao/guia-integracao" },
    ],
  },
  {
    titulo: "4. Classifique antes de emitir",
    texto:
      "O Anexo VIII da NFS-e correlaciona item de serviço, NBS, cClassTrib e cIndOp. Sem essa correlação, a alíquota reduzida não é aplicada e o crédito do cliente se perde.",
    links: [
      { rotulo: "Anexo VIII — correlação (XLSX)", url: "https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/rtc/anexo_viii-tabela-correlacao-v01-02-00-20261026.xlsx" },
      { rotulo: "Anexo VI — leiautes IBS/CBS (XLSX)", url: "https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/rtc/anexovi-leiautesrn_rtc_ibscbs-v1-04-01-nt009.xlsx" },
    ],
  },
  {
    titulo: "5. Homologue com o ambiente de teste",
    texto:
      "Produção restrita existe para isso. Erros de leiaute custam mais caro em produção porque afetam apuração e crédito de terceiros, não apenas a sua nota.",
    links: [
      { rotulo: "Produção restrita da NFS-e", url: "https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/producao-restrita" },
    ],
  },
  {
    titulo: "6. Monitore notas técnicas",
    texto:
      "Leiaute muda durante 2026 e 2027. Um processo que não acompanha NT vira dívida técnica silenciosa: a nota continua sendo emitida, mas fora do padrão vigente.",
    links: [
      { rotulo: "Notas técnicas da NFS-e Via", url: "https://www.gov.br/nfse/pt-br/nfs-e-via/documentacao-tecnica/notas-tecnicas" },
      { rotulo: "Atualizações e implantações da NFS-e", url: "https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/atualizacoes-e-implantacoes" },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * DeRE — Declaração de Regimes Específicos
 * Conteúdo extraído das páginas oficiais da RFB/SPED e do CGIBS (acesso em
 * 30/10/2026). O que é projeto ou está em implantação aparece marcado.
 * ------------------------------------------------------------------ */
export const DERE = {
  sigla: "DeRE",
  nome: "Declaração de Regimes Específicos",
  resumo:
    "Novo documento fiscal eletrônico, criado para apurar IBS e CBS em setores cuja base de cálculo não é o preço da operação, mas uma margem com deduções próprias.",
  oQue:
    "A DeRE não é uma obrigação acessória acessória no sentido antigo: ela alimenta diretamente o Motor de Cálculo do IBS e da CBS. Os dados declarados é que permitem à administração tributária processar a apuração assistida — a incidência sobre a margem, a não cumulatividade para os adquirentes e o cashback.",
  porque:
    "Nos setores alcançados, o sistema padrão de débito e crédito não funciona: o tributo não incide sobre o preço da nota, e sim sobre uma margem apurada com controle de deduções específicas. Sem a DeRE, não há base confiável para calcular o tributo.",
  baseLegal: [
    { norma: "LC 214/2025", papel: "Institui os regimes específicos e a apuração por margem." },
    { norma: "LC 227/2026", papel: "Acrescenta os dispositivos operacionais necessários à implementação da DeRE." },
  ],
  versao: "Pacote de integração v1.0.0 — publicado em 12/12/2025, atualizado em 18/08/2026",
  setores: [
    { nome: "Serviços financeiros", nota: "Base por margem (spread) e por tarifas; apuração mensal." },
    { nome: "Planos de assistência à saúde", nota: "Base própria, com deduções e regras de crédito específicas." },
    { nome: "Concursos de prognósticos", nota: "Loterias, apostas de quota fixa, fantasy sport; o IS integra a base." },
  ],
  eventos: [
    { nome: "Informações do Contribuinte", nota: "Identificação e dados cadastrais de quem declara." },
    { nome: "Plano Geral de Contas Comentado", nota: "Estrutura que liga a contabilidade societária à apuração fiscal." },
    { nome: "Retorno — Eventos de Tabela", nota: "Retorno do ambiente sobre os eventos de tabela transmitidos." },
  ],
  pacote: [
    {
      item: "MOD — Manual de Orientação do Usuário",
      detalhe: "Diretrizes conceituais, fluxo de transmissão via Web Service, estrutura de eventos e orientações de preenchimento.",
      formato: "PDF",
    },
    {
      item: "Leiautes",
      detalhe: "Especificação técnica dos eventos, séries D-1000 e D-9000, com a estrutura do XML.",
      formato: "Planilha",
    },
    {
      item: "Schemas XSD",
      detalhe: "Esquemas oficiais para validação estrutural — é o que permite validar o XML antes de transmitir.",
      formato: "XSD",
    },
    {
      item: "Anexo I — Tabelas",
      detalhe: "Códigos padronizados, incluindo a Tabela de Códigos de Tributação (codTrib), que faz o mapeamento entre a contabilidade e a apuração fiscal.",
      formato: "Planilha",
    },
    {
      item: "Anexo II — Regras de Validação",
      detalhe: "Críticas aplicadas pelo ambiente da DeRE na recepção dos lotes: erros e alertas.",
      formato: "Planilha",
    },
  ],
  checklist: [
    "Baixar o pacote v1.0.0 e versionar: MOD, leiautes, XSD e os dois anexos.",
    "Validar o XML contra o XSD antes de transmitir — rejeição em lote custa mais caro.",
    "Mapear o plano de contas para a codTrib do Anexo I: é o elo entre contabilidade e apuração.",
    "Ler o Anexo II antes de codificar: as críticas dizem o que o ambiente rejeita.",
    "Integrar o envio ao Web Service e tratar os retornos por evento.",
    "Testar com o motor de cálculo oficial para conferir se a margem apurada bate com o tributo calculado.",
  ],
  links: [
    {
      rotulo: "Página oficial da DeRE (RFB/SPED)",
      url: "https://www.gov.br/sped/pt-br/assuntos/documentos-fiscais/dere",
      tipo: "portal",
    },
    {
      rotulo: "Comunicado: documentação técnica oficial (RFB + CGIBS)",
      url: "https://www.gov.br/sped/pt-br/assuntos/comunicados/dere/receita-federal-do-brasil-e-cgibs-publicam-documentacao-tecnica-oficial-da-declaracao-de-regimes-especificos-dere",
      tipo: "manual",
    },
    {
      rotulo: "Perguntas frequentes da DeRE",
      url: "https://www.gov.br/sped/pt-br/assuntos/documentos-fiscais/dere/perguntas-frequentes",
      tipo: "manual",
    },
    {
      rotulo: "Central de downloads do SPED",
      url: "https://www.gov.br/sped/pt-br/centrais-de-conteudo/downloads",
      tipo: "portal",
    },
    {
      rotulo: "CGIBS: manuais e leiautes da DeRE",
      url: "https://www.cgibs.gov.br/reforma-tributaria-cgibs-e-receita-federal-disponibilizam-manuais-e-leiautes-da-nova-declaracao-de-regimes-especificos-dere",
      tipo: "portal",
    },
  ],
  ressalvas: [
    "O pacote técnico é versionado: confira a versão vigente antes de implementar, porque o que está no seu sistema pode estar defasado.",
    "Os arquivos ficam na Central de downloads do SPED, que é carregada dinamicamente — por isso o link aponta para a página, e não para o arquivo direto (esses endereços mudam a cada versão).",
    "O calendário de obrigatoriedade por setor deve ser conferido nos comunicados oficiais: não há data única publicada para todos os contribuintes.",
  ],
};

/* ------------------------------------------------------------------ *
 * ÍNDICE DE BUSCA GLOBAL (derivado do conteúdo acima)
 * ------------------------------------------------------------------ */
const PAGINAS = [
  { t: "Painel de situação", href: "/reforma-tributaria/painel/", r: "Onde a reforma está agora, o que muda e o que está pendente.", tags: ["painel", "início", "status", "resumo"] },
  { t: "Cronograma da transição", href: "/reforma-tributaria/cronograma/", r: "Ano a ano, de 2026 a 2033, com alíquotas e marcos.", tags: ["cronograma", "transição", "calendário", "2027", "2033", "rampa"] },
  { t: "Entenda o modelo", href: "/reforma-tributaria/entenda/", r: "IBS, CBS, IS, princípios e regimes diferenciados.", tags: ["ibs", "cbs", "is", "modelo", "princípios", "regimes"] },
  { t: "Antes e depois", href: "/reforma-tributaria/comparativo/", r: "Comparação entre o modelo atual e o novo, incluindo preço final.", tags: ["comparativo", "icms", "pis", "cofins", "iss", "carga"] },
  { t: "Calculadora", href: "/reforma-tributaria/calculadora/", r: "Simulador de IBS, CBS e IS com memória de cálculo.", tags: ["calculadora", "simulação", "cálculo", "alíquota", "crédito", "split"] },
  { t: "Documentos fiscais", href: "/reforma-tributaria/documentos/", r: "NF-e, NFS-e, CT-e, DeRE, split payment e novos campos.", tags: ["nf-e", "nfs-e", "ct-e", "dere", "documento", "split payment", "cclassctrib"] },
  { t: "DeRE — Declaração de Regimes Específicos", href: "/reforma-tributaria/dere/", r: "Documento fiscal que apura IBS/CBS por margem: setores, eventos, pacote técnico e checklist de integração.", tags: ["dere", "regimes específicos", "margem", "financeiro", "planos de saúde", "prognósticos", "codtrib", "xsd", "leiaute"] },
  { t: "Conformidade", href: "/reforma-tributaria/conformidade/", r: "Checklist de adequação por perfil, com prazos.", tags: ["checklist", "conformidade", "prazo", "adequação"] },
  { t: "Kit de divulgação", href: "/reforma-tributaria/divulgacao/", r: "Frases seguras, frases de risco e gerador de resumo.", tags: ["divulgação", "comunicação", "frases", "resumo"] },
  { t: "Legislação", href: "/reforma-tributaria/legislacao/", r: "EC, LC, decretos, resoluções, portarias e notas técnicas da reforma.", tags: ["legislação", "normas", "lei", "decreto", "nota técnica", "resolução", "portaria"] },
  { t: "Glossário", href: "/reforma-tributaria/glossario/", r: "Termos da reforma com definição e base legal.", tags: ["glossário", "termos", "definições"] },
  { t: "Aprender (quiz)", href: "/reforma-tributaria/aprender/", r: "Oito perguntas com explicação e base legal.", tags: ["quiz", "estudo", "aprender", "teste"] },
  { t: "Fontes e base legal", href: "/reforma-tributaria/fontes/", r: "Normas, fontes oficiais e metodologia da calculadora.", tags: ["fontes", "lei", "ec 132", "lc 214", "metodologia"] },
];

export const INDICE = [
  ...PAGINAS.map((p) => ({ titulo: p.t, href: p.href, rota: "Página", resumo: p.r, tags: p.tags })),
  ...CRONOGRAMA.map((c) => ({
    titulo: `${c.ano} — ${c.titulo}`,
    href: `#/cronograma`,
    rota: "Cronograma",
    resumo: c.resumo,
    tags: [String(c.ano), c.fase, c.cbs, c.ibs, ...c.marcos],
  })),
  ...DOCUMENTOS.map((d) => ({
    titulo: d.nome,
    href: "/reforma-tributaria/documentos/",
    rota: "Documentos fiscais",
    resumo: d.uso,
    tags: [d.familia, d.status, d.novidade, d.autoriza],
  })),
  ...CATALOGO_NORMAS.map((n) => ({
    titulo: `${n.tipo} ${n.numero} — ${n.titulo}`,
    href: "/reforma-tributaria/legislacao/",
    rota: "Legislação",
    resumo: n.ementa,
    tags: [n.numero, n.tipo, n.status, n.dataBR, ...(n.tags || [])],
  })),
  ...GLOSSARIO.map((g) => ({
    titulo: g.termo,
    href: "/reforma-tributaria/glossario/",
    rota: "Glossário",
    resumo: g.def,
    tags: [g.lei || ""],
  })),
  ...TEMAS.map((t) => ({
    titulo: t.titulo,
    href: "/reforma-tributaria/entenda/",
    rota: "Entenda",
    resumo: t.texto,
    tags: ["tema", t.lei],
  })),
  ...CAMPOS_FISCAIS.map((c) => ({
    titulo: `${c.campo} — ${c.nome}`,
    href: "/reforma-tributaria/documentos/",
    rota: "Campos fiscais",
    resumo: c.o_que,
    tags: ["campo", "cst", "classificação"],
  })),
  ...RADAR.map((r) => ({
    titulo: r.titulo,
    href: "/reforma-tributaria/painel/",
    rota: "Radar regulatório",
    resumo: r.texto,
    tags: [r.tag, r.data],
  })),
  ...OBRIGACOES.map((o) => ({
    titulo: o.titulo,
    href: "/reforma-tributaria/documentos/",
    rota: "Obrigações",
    resumo: o.texto,
    tags: [o.status],
  })),
];

