/**
 * motor.js — Motor de cálculo da Reforma Tributária do Consumo (IBS, CBS e IS).
 *
 * Princípios de projeto:
 *  1. Módulo puro: nenhuma dependência de DOM, roda no navegador e no Node (testes).
 *  2. Todo parâmetro vive em tabelas nomeadas, com fonte e status (lei vigente x pendente),
 *     para que a atualização normativa seja uma edição de dados — não de lógica.
 *  3. Cada linha de resultado carrega a base legal, para que o número seja auditável.
 *
 * Fontes: EC 132/2023 (ADCT arts. 125-133), LC 214/2025 (arts. 1-45, 260, 409-438 e Anexos)
 * e cronograma oficial divulgado pela RFB no curso RTC/CFC.
 *
 * ATENÇÃO: as alíquotas de 2027 em diante dependem de resolução do Senado Federal.
 * Ver CENARIOS e o campo `status` de cada linha.
 */

/* ------------------------------------------------------------------ *
 * 1. CENÁRIOS DE ALÍQUOTA DE REFERÊNCIA
 * ------------------------------------------------------------------ */

/**
 * Valores expressos em fração (0.113 = 11,3%).
 * `ibs` e `cbs` são as alíquotas de referência "cheias" (regime geral, tributação integral).
 */
export const CENARIOS = {
  tcu_out2026: {
    id: "tcu_out2026",
    nome: "TCU — outubro/2026 (encaminhado ao Senado)",
    curto: "TCU 2026",
    cbs: 0.113,
    ibs: 0.177,
    status: "CBS calculada pelo TCU em 11,3468% (11,3%); falta a resolução do Senado",
    detalhe:
      "Em 28/10/2026 o TCU aprovou o cálculo da alíquota de referência da CBS em 11,3468%, arredondado para 11,3%, e definiu redutor de 44,16% nas compras da administração pública direta, autarquias e fundações. Segundo a Agência Senado, se o Senado não fixar a alíquota por resolução até dezembro, a alíquota do TCU passa a valer em 1º/01/2027. Para o IBS mantém-se a estimativa oficial de 17,7% de 2024, porque a alíquota de referência do IBS também depende da resolução do Senado.",
    fonte: "https://www.infomoney.com.br/economia/tcu-propoe-aliquota-de-113-para-a-cbs-em-2027-acima-do-previsto-pelo-governo/",
    padrao: true,
  },
  fazenda_2024: {
    id: "fazenda_2024",
    nome: "Ministério da Fazenda — estimativa de 2024 (LC 214/2025)",
    curto: "Fazenda 2024",
    cbs: 0.088,
    ibs: 0.177,
    status: "Estimativa oficial que embasou a LC 214/2025 (total 26,5%)",
    detalhe:
      "Cenário de referência divulgado em 2024 junto à regulamentação: IBS 17,7% + CBS 8,8%, somando 26,5%. Serve como linha de base histórica para comparar com os cálculos posteriores.",
    fonte: "https://www.infomoney.com.br/economia/tcu-propoe-aliquota-de-113-para-a-cbs-em-2027-acima-do-previsto-pelo-governo/",
    padrao: false,
  },
  cgibs_2026: {
    id: "cgibs_2026",
    nome: "Comitê Gestor do IBS — julho/2026 (total estimado 27,91%)",
    curto: "CGIBS 2026",
    cbs: 0.0921,
    ibs: 0.187,
    status: "Estimativa do CGIBS (superada, para a CBS, pelo cálculo do TCU)",
    detalhe:
      "Em julho de 2026 o Comitê Gestor do IBS estimou alíquota de referência combinada de 27,91%, com CBS de 9,21% e IBS de 18,7%. O TCU calculou depois a CBS em 11,3%, patamar mais alto.",
    fonte: "https://www.taxgroup.com.br/intelligence/aliquota-ibs-cbs/",
    padrao: false,
  },
};

export const cenarioPadrao = () =>
  Object.values(CENARIOS).find((c) => c.padrao) ?? CENARIOS.fazenda_2024;

/** Anos cobertos pela transição. */
export const ANOS = [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033];

/* ------------------------------------------------------------------ *
 * 2. CRONOGRAMA — alíquotas por ano
 * ------------------------------------------------------------------ */

/**
 * Fase de transição e regra de alíquota aplicável em cada ano.
 * A regra é expressa em função do cenário escolhido.
 *
 * | Ano  | CBS                              | IBS                                  |
 * |------|----------------------------------|--------------------------------------|
 * | 2026 | teste: 0,9%                      | teste: 0,1%                          |
 * | 2027 | referência − 0,1 p.p.            | 0,1% (0,05% UF + 0,05% municípios)   |
 * | 2028 | referência − 0,1 p.p.            | 0,1%                                 |
 * | 2029 | referência (100%)                | 10% da referência                    |
 * | 2030 | referência                       | 20% da referência                    |
 * | 2031 | referência                       | 30% da referência                    |
 * | 2032 | referência                       | 40% da referência                    |
 * | 2033+| referência                       | referência (100%)                    |
 */
export const FASE_POR_ANO = {
  2026: {
    fase: "Ano de teste (IBS e CBS)",
    regraCbs: "teste",
    regraIbs: "teste_estadual",
    titulo: "Ano de teste",
    resumo:
      "Vigência apenas para teste e adaptação dos sistemas. IBS de 0,1% e CBS de 0,9% destacados nos documentos fiscais, com caráter informativo.",
  },
  2027: {
    fase: "CBS em vigor + Imposto Seletivo",
    regraCbs: "referencia_menos_01",
    regraIbs: "teste_dupla",
    titulo: "CBS cheia e início do IS",
    resumo:
      "A CBS entra em vigor com alíquota de referência (reduzida em 0,1 p.p. em 2027 e 2028). PIS e Cofins deixam de existir. O Imposto Seletivo começa a ser cobrado e o IPI é reduzido a zero para a maioria dos produtos.",
  },
  2028: {
    fase: "CBS cheia + correção do IS pelo IPCA",
    regraCbs: "referencia_menos_01",
    regraIbs: "teste_dupla",
    titulo: "Consolidação da CBS",
    resumo:
      "Mantém-se a CBS de referência e o IBS de teste. Começa a correção anual das alíquotas específicas do Imposto Seletivo pelo IPCA.",
  },
  2029: {
    fase: "Início da transição do IBS (10%)",
    regraCbs: "referencia",
    regraIbs: "fracao_10",
    titulo: "IBS a 10% e ICMS/ISS a 90%",
    resumo:
      "Início da substituição gradual de ICMS e ISS: 10% do IBS da alíquota de referência, com redução de 10% nas alíquotas de ICMS e ISS.",
  },
  2030: {
    fase: "Transição do IBS (20%)",
    regraCbs: "referencia",
    regraIbs: "fracao_20",
    titulo: "IBS a 20% e ICMS/ISS a 80%",
    resumo: "O IBS avança para 20% da alíquota de referência, e ICMS e ISS caem para 80% do valor original.",
  },
  2031: {
    fase: "Transição do IBS (30%)",
    regraCbs: "referencia",
    regraIbs: "fracao_30",
    titulo: "IBS a 30% e ICMS/ISS a 70%",
    resumo: "O IBS avança para 30% da alíquota de referência, e ICMS e ISS caem para 70% do valor original.",
  },
  2032: {
    fase: "Transição do IBS (40%)",
    regraCbs: "referencia",
    regraIbs: "fracao_40",
    titulo: "IBS a 40% e ICMS/ISS a 60%",
    resumo: "Último ano de convivência com ICMS e ISS, que caem para 60%. O IBS chega a 40% da referência.",
  },
  2033: {
    fase: "Regime pleno",
    regraCbs: "referencia",
    regraIbs: "referencia",
    titulo: "IBS e CBS integrais",
    resumo:
      "Vigência integral do IBS e da CBS e extinção do ICMS e do ISS. A partir daqui o modelo IVA dual opera em plenitude.",
  },
};

/** Alíquotas do período de teste (fixadas em lei). */
export const ALIQUOTAS_TESTE = { cbs: 0.009, ibs: 0.001 };

/** Percentual do IBS de referência aplicado em cada ano de transição (2029-2032). */
const FRACAO_IBS = { fracao_10: 0.1, fracao_20: 0.2, fracao_30: 0.3, fracao_40: 0.4 };

/**
 * Retorna as alíquotas "cheias" (regime geral) de um ano.
 *
 * Sobre a repartição federativa do IBS:
 *  - 2026: o IBS é cobrado apenas na esfera estadual, a 0,1% (ADCT, art. 125).
 *  - 2027-2028: parcela estadual de 0,05% + municipal de 0,05% (ADCT, art. 127).
 *  - 2029 em diante: a repartição interna depende da resolução do Senado Federal
 *    (ADCT, art. 130), por isso `divisaoConhecida` é false e as parcelas ficam nulas.
 *
 * @param {number} ano
 * @param {string|object} cenario — id de CENARIOS ou objeto com {cbs, ibs}
 */
export function aliquotasDoAno(ano, cenario = cenarioPadrao()) {
  const c = typeof cenario === "string" ? CENARIOS[cenario] ?? cenarioPadrao() : cenario;
  const fase = FASE_POR_ANO[ano] ?? FASE_POR_ANO[2033];
  const a = ano < 2026 ? 0 : ano;

  let cbs, ibs, obsCbs = "", obsIbs = "";
  let divisaoConhecida = false;
  let ibsUf = null;
  let ibsMun = null;

  switch (fase.regraCbs) {
    case "teste":
      cbs = ALIQUOTAS_TESTE.cbs;
      obsCbs = "Alíquota de teste (ADCT, art. 125)";
      break;
    case "referencia_menos_01":
      cbs = round6(c.cbs - 0.001);
      obsCbs = "Referência reduzida em 0,1 p.p. em 2027 e 2028 (ADCT, art. 127)";
      break;
    default:
      cbs = round6(c.cbs);
      obsCbs = "Alíquota de referência (resolução do Senado, ADCT art. 130)";
  }

  switch (fase.regraIbs) {
    case "teste_estadual":
      // 2026: apenas a parcela estadual, a 0,1%.
      ibs = ALIQUOTAS_TESTE.ibs;
      ibsUf = ibs;
      ibsMun = 0;
      divisaoConhecida = true;
      obsIbs = "Alíquota de teste, integralmente estadual (ADCT, art. 125)";
      break;
    case "teste_dupla":
      // 2027-2028: 0,05% estadual + 0,05% municipal.
      ibs = ALIQUOTAS_TESTE.ibs;
      ibsUf = round6(ibs / 2);
      ibsMun = round6(ibs / 2);
      divisaoConhecida = true;
      obsIbs = "0,05% estadual + 0,05% municipal (ADCT, art. 127)";
      break;
    default: {
      const fracao = FRACAO_IBS[fase.regraIbs];
      ibs = fracao ? round6(c.ibs * fracao) : round6(c.ibs);
      obsIbs = fracao
        ? `${fracao * 100}% da alíquota de referência (ADCT, arts. 126 a 128)`
        : "Alíquota de referência (ADCT, art. 130)";
    }
  }

  return {
    ano: a,
    cbs,
    ibs,
    ibsUf,
    ibsMun,
    divisaoConhecida,
    total: round6(cbs + ibs),
    fase: fase.fase,
    titulo: fase.titulo,
    resumo: fase.resumo,
    cenario: c,
    obsCbs,
    obsIbs,
  };
}

/* ------------------------------------------------------------------ *
 * 3. REGIMES DIFERENCIADOS
 * ------------------------------------------------------------------ */

/**
 * Fator aplicado sobre a alíquota de referência.
 * Redução de 60% => paga 40%. Redução de 30% => paga 70%.
 */
export const REGIMES = {
  geral: {
    id: "geral",
    nome: "Regime geral",
    fator: 1,
    reducao: 0,
    descricao: "Tributação integral pelas alíquotas de referência do IBS e da CBS.",
    base: "LC 214/2025, arts. 1º a 27",
    exemplos: "Comércio em geral, indústria, serviços não listados em regimes especiais.",
  },
  reduzido60: {
    id: "reduzido60",
    nome: "Redução de 60%",
    fator: 0.4,
    reducao: 60,
    descricao:
      "Alíquota reduzida em 60% (paga-se 40% da referência). Alcança treze blocos de bens e serviços, cada um em seu próprio anexo: educação, saúde, medicamentos, dispositivos médicos, acessibilidade, alimentos, higiene, produtos e insumos agropecuários, cultura, comunicação institucional, esporte e segurança nacional.",
    base: "LC 214/2025, arts. 128 e seguintes, Anexos II a XI; Decreto 12.955/2026 (RCBS), arts. 203 e seguintes",
    exemplos:
      "Serviços de saúde e planos de saúde, educação, medicamentos e dispositivos médicos, produtos agropecuários in natura, insumos agropecuários, cultura, esporte, comunicação institucional à Administração Pública.",
  },
  reduzido40: {
    id: "reduzido40",
    nome: "Redução de 40%",
    fator: 0.6,
    reducao: 40,
    descricao:
      "Alíquota reduzida em 40% (paga-se 60% da referência). Aplicável a setores com regime específico de redução, como bares e restaurantes, hotelaria, parques e transporte aéreo regional. Em regra o adquirente não apropria crédito nessas hipóteses.",
    base: "LC 214/2025; Decreto 12.955/2026 (RCBS), arts. 200 e seguintes",
    exemplos: "Bares e restaurantes, hotéis, parques temáticos, transporte aéreo regional.",
  },
  reduzido30: {
    id: "reduzido30",
    nome: "Redução de 30%",
    fator: 0.7,
    reducao: 30,
    descricao:
      "Alíquota reduzida em 30% (paga-se 70% da referência) para serviços de profissões intelectuais regulamentadas: advogados, administradores, contadores, arquitetos, engenheiros, economistas, assistentes sociais, bibliotecários, profissionais de educação física, agrônomos, estatísticos, veterinários, zootecnistas, museólogos, químicos, relações públicas, técnicos industriais e agrícolas.",
    base: "LC 214/2025; Decreto 12.955/2026 (RCBS), art. 202",
    exemplos:
      "Sociedades de advogados, escritórios de contabilidade, consultorias de engenharia — com requisitos próprios quando a prestadora é pessoa jurídica.",
  },
  zero: {
    id: "zero",
    nome: "Alíquota zero",
    fator: 0,
    reducao: 100,
    descricao:
      "Alíquota zero para a Cesta Básica Nacional de Alimentos e demais itens do Anexo I, com manutenção do crédito para o adquirente.",
    base: "EC 132/2023, art. 8º do ADCT; LC 214/2025, Anexo I (cesta básica) e Anexo XV (hortícolas, frutas e ovos)",
    exemplos:
      "Cesta Básica Nacional de Alimentos; produtos hortícolas, frutas e ovos — inclusive lavados, cortados, higienizados ou congelados.",
  },
  isento: {
    id: "isento",
    nome: "Isenção / não incidência",
    fator: 0,
    reducao: 100,
    descricao:
      "Operações fora do campo de incidência ou beneficiadas com isenção. Atenção: na isenção não há crédito na entrada, o que pode encarecer a cadeia.",
    base: "LC 214/2025, arts. 6º a 9º",
    exemplos: "Operações imunes (livros, jornais, periódicos, atos internacionais) e hipóteses legais de não incidência.",
  },
};

/** Retorna o fator do regime (1 = integral). */
export function fatorDoRegime(regime = "geral") {
  return (REGIMES[regime] ?? REGIMES.geral).fator;
}

/* ------------------------------------------------------------------ *
 * 4. IMPOSTO SELETIVO
 * ------------------------------------------------------------------ */

/**
 * Categorias do Anexo XVII da LC 214/2025.
 * `aliquotaPadrao` = null significa: estrutura já definida em lei, MAS alíquota
 * ainda pendente de lei ordinária/regulamento (situação em out/2026).
 */
export const IS_CATEGORIAS = [
  {
    id: "nenhum",
    nome: "Não sujeito ao IS",
    ncm: "—",
    aliquotaPadrao: 0,
    aplicaBase: "nenhuma",
    status: "aplicavel",
    obs: "Operação fora do Anexo XVII.",
  },
  {
    id: "veiculos",
    nome: "Veículos automotores",
    ncm: "87.03 e 87.04",
    aliquotaPadrao: null,
    status: "pendente",
    obs: "Alíquota base por motorização/combustível, com ajuste por potência (kW) e reduções por eficiência energética, reciclabilidade, pegada de carbono, densidade tecnológica e etapas fabris. Veículos para PcD/TEA e táxi têm alíquota zero; caminhões e uso das Forças Armadas, não incidência.",
  },
  {
    id: "embarcacoes",
    nome: "Embarcações de recreio e esporte",
    ncm: "89.03",
    aliquotaPadrao: null,
    status: "pendente",
    obs: "Alíquotas por porte; fornecimento sem motorização aumenta a alíquota em 25%; propulsão elétrica ou sem emissão direta de CO₂ tem alíquota zero.",
  },
  {
    id: "aeronaves",
    nome: "Aeronaves",
    ncm: "88.02",
    aliquotaPadrao: null,
    status: "pendente",
    obs: "Alíquota distinta para transporte aéreo público regular; aeronaves sustentáveis com alíquota zero; veículos espaciais (8802.60.00) e uso operacional das Forças Armadas/segurança, não incidência.",
  },
  {
    id: "fumigenos",
    nome: "Produtos fumígenos",
    ncm: "Cap. 24",
    aliquotaPadrao: null,
    status: "pendente",
    obs: "Estrutura mista (ad valorem + parcela específica por vintena de cigarros ou por grama de tabaco), com incorporação gradual do diferencial de ICMS até 2033.",
  },
  {
    id: "bebidas_alcoolicas",
    nome: "Bebidas alcoólicas",
    ncm: "22.03 a 22.08",
    aliquotaPadrao: null,
    status: "pendente",
    obs: "Estrutura mista: ad valorem + parcela específica por litro de álcool (teor alcoólico). Pequenos produtores têm redução condicionada a campanhas de conscientização.",
  },
  {
    id: "bebidas_acucaradas",
    nome: "Bebidas açucaradas",
    ncm: "2202.10.00",
    aliquotaPadrao: null,
    status: "pendente",
    obs: "Ad valorem, específica ou mista, com possível adoção gradual entre 2027 e 2033.",
  },
  {
    id: "minerais",
    nome: "Extração de bens minerais",
    ncm: "Anexo XVII e carvão mineral",
    aliquotaPadrao: 0.0025,
    status: "aplicavel",
    obs: "Alíquota única de 0,25% sobre o valor de referência previsto no art. 414 da LC 214/2025 (incide sobre a extração, não sobre o consumo).",
  },
  {
    id: "prognosticos",
    nome: "Concursos de prognósticos e fantasy sport",
    ncm: "—",
    aliquotaPadrao: null,
    status: "pendente",
    obs: "Alíquotas podem variar segundo a modalidade (loterias federais, apostas de quota fixa).",
  },
];

/** Vedações constitucionais à incidência do IS (EC 132/2023). */
export const IS_VEDACOES = [
  "Exportações",
  "Energia elétrica",
  "Telecomunicações",
  "Operações com bagagens e remessas internacionais (isentas)",
];

/**
 * Calcula o IS de uma operação.
 * @param {object} p
 * @param {string} p.categoria — id de IS_CATEGORIAS
 * @param {number} p.aliquota — alíquota efetiva informada (fração). Se ausente, usa a padrão.
 * @param {number} p.base — base de cálculo (valor da operação ou valor de referência)
 * @param {number} p.ano — ano da operação (IS vigora a partir de 2027)
 */
export function calcularIS({ categoria = "nenhum", aliquota, base = 0, ano = 2027 }) {
  const cat = IS_CATEGORIAS.find((c) => c.id === categoria) ?? IS_CATEGORIAS[0];
  if (cat.id === "nenhum") {
    return { valor: 0, aliquota: 0, categoria: cat, motivo: "Operação não sujeita ao Imposto Seletivo." };
  }
  if (ano < 2027) {
    return {
      valor: 0,
      aliquota: 0,
      categoria: cat,
      motivo: "O Imposto Seletivo passa a ser cobrado a partir de 2027 (LC 214/2025).",
    };
  }
  const aliq = aliquota ?? cat.aliquotaPadrao ?? 0;
  return {
    valor: round2(base * aliq),
    aliquota: aliq,
    categoria: cat,
    pendente: (aliquota === null || aliquota === undefined) && cat.aliquotaPadrao === null,
    motivo: cat.aliquotaPadrao === null ? "Alíquota pendente de lei ordinária/regulamento." : null,
  };
}

/* ------------------------------------------------------------------ *
 * 5. CÁLCULO DE UMA OPERAÇÃO (IBS + CBS + IS)
 * ------------------------------------------------------------------ */

/**
 * @param {object} p
 * @param {number} p.valor           valor da operação (base de cálculo)
 * @param {number} p.ano             ano de referência (2026-2033+)
 * @param {string} p.cenario         id do cenário de alíquota de referência
 * @param {string} p.regime          id de REGIMES
 * @param {boolean} p.exportacao     operação de exportação (imune → alíquota zero)
 * @param {string} p.isCategoria     id de IS_CATEGORIAS
 * @param {number|null} p.isAliquota alíquota do IS informada (fração)
 * @param {number} p.creditos        créditos de IBS/CBS apropriados nas entradas
 * @param {boolean} p.split          split payment na liquidação financeira
 */
export function calcularOperacao({
  valor = 0,
  ano = 2027,
  cenario = cenarioPadrao().id,
  regime = "geral",
  exportacao = false,
  isCategoria = "nenhum",
  isAliquota = null,
  creditos = 0,
  split = false,
} = {}) {
  const base = round2(Number(valor) || 0);
  const a = aliquotasDoAno(ano, cenario);
  const fator = exportacao ? 0 : fatorDoRegime(regime);
  const reg = REGIMES[regime] ?? REGIMES.geral;

  const aliqCbs = round6(a.cbs * fator);
  const aliqIbs = round6(a.ibs * fator);

  const cbs = round2(base * aliqCbs);
  const ibs = round2(base * aliqIbs);

  // Repartição federativa do IBS: usa a proporção legal quando conhecida
  // (2026 a 2028). De 2029 em diante a divisão interna depende da resolução
  // do Senado Federal (ADCT, art. 130) — as parcelas ficam nulas.
  const fracUf = a.ibs > 0 && a.ibsUf !== null ? a.ibsUf / a.ibs : 0.5;
  const ibsUf = a.divisaoConhecida ? round2(ibs * fracUf) : null;
  const ibsMun = a.divisaoConhecida ? round2(ibs - ibsUf) : null;

  const is = calcularIS({ categoria: isCategoria, aliquota: isAliquota, base, ano });

  const tributos = round2(cbs + ibs + (is.valor || 0));
  const credito = round2(Number(creditos) || 0);
  const aRecolher = round2(Math.max(0, tributos - credito));
  const saldoCredor = round2(Math.max(0, credito - tributos));

  return {
    entrada: { valor: base, ano, cenario: a.cenario, regime: reg, exportacao, split },
    aliquotas: {
      cbs: aliqCbs,
      ibs: aliqIbs,
      ibsUf: a.divisaoConhecida ? round6(aliqIbs * fracUf) : null,
      ibsMun: a.divisaoConhecida ? round6(aliqIbs * (1 - fracUf)) : null,
      divisaoConhecida: a.divisaoConhecida,
      is: is.aliquota || 0,
      total: round6(aliqCbs + aliqIbs + (is.aliquota || 0)),
      referencia: { cbs: a.cbs, ibs: a.ibs, total: a.total },
      fatorRegime: fator,
      fase: a.fase,
      ano: a.ano,
      obsCbs: a.obsCbs,
      obsIbs: a.obsIbs,
    },
    valores: {
      cbs,
      ibs,
      ibsUf,
      ibsMun,
      is: is.valor || 0,
      tributos,
      credito,
      aRecolher,
      saldoCredor,
      precoFinal: round2(base + tributos),
      cargaSobrePreco: base > 0 ? round6(tributos / (base + tributos)) : 0,
    },
    is: { categoria: is.categoria, motivo: is.motivo, pendente: !!is.pendente },
    linhas: montarLinhas({ base, cbs, ibs, ibsUf, ibsMun, is: is.valor || 0, tributos, credito, aRecolher, split, ano, exportacao, regime }),
  };
}

/** Memória de cálculo: cada linha com rótulo, valor e base legal. */
function montarLinhas({ base, cbs, ibs, ibsUf, ibsMun, is, tributos, credito, aRecolher, split, ano, exportacao, regime }) {
  const L = [];
  L.push({ rot: "Base de cálculo (valor da operação)", val: base, base: "LC 214/2025, arts. 10 a 13", tipo: "base" });

  if (exportacao) {
    L.push({
      rot: "Exportação — imunidade",
      val: 0,
      base: "CF, art. 149, § 2º, I; LC 214/2025, art. 6º",
      nota: "Exportações são imunes ao IBS e à CBS, com manutenção do crédito das etapas anteriores.",
      tipo: "info",
    });
  } else {
    L.push({ rot: "CBS", val: cbs, base: "LC 214/2025, arts. 1º a 16", tipo: "tributo" });
    if (ibsUf !== null && ibsMun !== null) {
      L.push({ rot: "IBS — parcela estadual", val: ibsUf, base: "ADCT, arts. 125 e 127; LC 214/2025, arts. 17 a 26", tipo: "tributo" });
      L.push({ rot: "IBS — parcela municipal", val: ibsMun, base: "ADCT, arts. 125 e 127; LC 214/2025, arts. 17 a 26", tipo: "tributo" });
    } else {
      L.push({
        rot: "IBS",
        val: ibs,
        base: "LC 214/2025, arts. 17 a 26",
        nota: "A repartição entre a parcela estadual e a municipal é fixada por resolução do Senado Federal (ADCT, art. 130) e ainda não está definida para este ano.",
        tipo: "tributo",
      });
    }
  }

  if (is > 0) {
    L.push({
      rot: "Imposto Seletivo",
      val: is,
      base: "LC 214/2025, arts. 409 a 438 e Anexo XVII",
      nota: "Tributo monofásico, extrafiscal, não gerador de crédito para o adquirente.",
      tipo: "tributo",
    });
  }

  L.push({ rot: "Total dos tributos sobre a operação", val: tributos, tipo: "subtotal" });

  if (credito > 0) {
    L.push({
      rot: "(−) Créditos de IBS/CBS apropriados",
      val: credito,
      base: "LC 214/2025, arts. 28 a 45 (não cumulatividade plena)",
      nota: "Crédito calculado sobre as aquisições, inclusive bens de capital. Vedado sobre uso e consumo pessoal.",
      tipo: "credito",
    });
    L.push({ rot: "= Saldo a recolher", val: aRecolher, tipo: "total" });
  } else {
    L.push({ rot: "= Total a recolher", val: tributos, tipo: "total" });
  }

  if (split) {
    L.push({
      rot: "Split payment na liquidação",
      val: tributos,
      base: "LC 214/2025, arts. 31 e 32",
      nota: "O valor do IBS/CBS é segregado automaticamente na liquidação financeira da operação: o fornecedor recebe o líquido e o tributo é recolhido na hora. Não altera o valor devido — altera o fluxo de caixa.",
      tipo: "info",
    });
  }

  return L;
}

/* ------------------------------------------------------------------ *
 * 6. COMPARAÇÃO COM O MODELO ATUAL
 * ------------------------------------------------------------------ */

/**
 * Parâmetros do sistema atual. Valores default são referências usuais de mercado
 * e devem ser ajustados pelo usuário (a carga varia por UF, município e setor).
 */
export const MODELO_ATUAL = {
  icms: 0.18,
  pis: 0.0165,
  cofins: 0.076,
  iss: 0.05,
  ipi: 0,
};

/**
 * Compara a carga tributária de uma operação no modelo atual e no novo modelo.
 *
 * Metodologia: no modelo atual, ICMS, PIS, Cofins, ISS e IPI são calculados
 * "por dentro" (compõem a própria base, no regime não cumulativo clássico).
 * No novo modelo, IBS e CBS são calculados "por fora" sobre o valor da operação.
 * Para comparar de forma justa, parte-se do mesmo valor líquido para o fornecedor
 * e calcula-se o preço final ao consumidor em cada modelo.
 */
export function compararModelos({
  valorLiquido = 1000,
  ano = 2033,
  cenario = cenarioPadrao().id,
  regime = "geral",
  tipo = "mercadoria",
  exportacao = false,
  atual = null,
} = {}) {
  const V = Number(valorLiquido) || 0;

  // `atual` permite premissas setoriais (ex.: ICMS interestadual de 12% na
  // indústria, ou ausência de ISS). Sem ele, usa a referência de mercado.
  const base = { ...MODELO_ATUAL, ...(atual || {}) };

  // --- modelo atual (por dentro) ---
  const aliqAtual =
    tipo === "servico"
      ? base.iss + base.pis + base.cofins
      : base.icms + base.pis + base.cofins + base.ipi;

  const precoAtual = aliqAtual >= 1 ? V : V / (1 - aliqAtual);
  const cargaAtual = round2(precoAtual - V);

  // --- modelo novo (por fora) ---
  const fator = exportacao ? 0 : fatorDoRegime(regime);
  const a = aliquotasDoAno(ano, cenario);
  const aliqNova = round6((a.cbs + a.ibs) * fator);
  const cargaNova = round2(V * aliqNova);
  const precoNovo = round2(V + cargaNova);

  return {
    atual: {
      aliquotas: {
        icms: tipo === "servico" ? 0 : base.icms,
        iss: tipo === "servico" ? base.iss : 0,
        pis: base.pis,
        cofins: base.cofins,
        ipi: tipo === "servico" ? 0 : base.ipi,
        total: round6(aliqAtual),
      },
      aliquotaEfetivaSobrePreco: precoAtual > 0 ? round6(cargaAtual / precoAtual) : 0,
      carga: cargaAtual,
      precoFinal: round2(precoAtual),
    },
    novo: {
      aliquotas: { cbs: a.cbs * fator, ibs: a.ibs * fator, total: aliqNova },
      aliquotaEfetivaSobrePreco: precoNovo > 0 ? round6(cargaNova / precoNovo) : 0,
      carga: cargaNova,
      precoFinal: precoNovo,
    },
    diferenca: {
      carga: round2(cargaNova - cargaAtual),
      preco: round2(precoNovo - precoAtual),
      percentual: cargaAtual > 0 ? round6((cargaNova - cargaAtual) / cargaAtual) : 0,
    },
    ano,
    fase: a.fase,
  };
}

/* ------------------------------------------------------------------ *
 * 7. SIMULAÇÃO DE CADEIA (cascata x não cumulatividade)
 * ------------------------------------------------------------------ */

/**
 * Compara uma cadeia de três etapas no modelo atual (cumulativo em parte,
 * conforme o tributo) e no novo modelo (não cumulativo pleno).
 * Serve para demonstrar por que a não cumulatividade plena importa.
 */
export function simularCadeia({ valorFinal = 1000, etapas = 3, ano = 2033, cenario = cenarioPadrao().id, regime = "geral" } = {}) {
  const a = aliquotasDoAno(ano, cenario);
  const fator = fatorDoRegime(regime);
  const aliqIva = round6((a.cbs + a.ibs) * fator);

  // Novo modelo: IVA não cumulativo — cada etapa credita o que pagou na anterior.
  let creditoIva = 0;
  const novoPassos = [];
  for (let i = 1; i <= etapas; i++) {
    const valorEtapa = (valorFinal / etapas) * i;
    const debito = round2(valorEtapa * aliqIva);
    const aPagar = round2(Math.max(0, debito - creditoIva));
    novoPassos.push({ etapa: i, valor: round2(valorEtapa), debito, credito: creditoIva, aPagar });
    creditoIva = debito;
  }
  const totalNovo = round2(novoPassos.reduce((s, p) => s + p.aPagar, 0));

  // Modelo atual simplificado: ICMS não cumulativo, mas PIS/Cofins com efeito cascata em parte da cadeia.
  const icmsAliq = MODELO_ATUAL.icms;
  const pisCofins = MODELO_ATUAL.pis + MODELO_ATUAL.cofins;
  let creditoIcms = 0;
  let totalAtual = 0;
  const atualPassos = [];
  for (let i = 1; i <= etapas; i++) {
    const valorEtapa = (valorFinal / etapas) * i;
    const icmsDevido = round2(valorEtapa * icmsAliq);
    const icmsPagar = round2(Math.max(0, icmsDevido - creditoIcms));
    const pcf = round2(valorEtapa * pisCofins);
    atualPassos.push({ etapa: i, valor: round2(valorEtapa), icms: icmsPagar, pisCofins: pcf, aPagar: round2(icmsPagar + pcf) });
    creditoIcms = icmsDevido;
    totalAtual += icmsPagar + pcf;
  }

  return {
    ano,
    aliquotas: { iva: aliqIva, icms: icmsAliq, pisCofins: round6(pisCofins) },
    novo: { passos: novoPassos, total: totalNovo },
    atual: { passos: atualPassos, total: round2(totalAtual) },
    economia: round2(totalAtual - totalNovo),
  };
}

/* ------------------------------------------------------------------ *
 * 8. UTILITÁRIOS
 * ------------------------------------------------------------------ */

function round2(n) {
  return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
}
function round6(n) {
  return Math.round((Number(n) + Number.EPSILON) * 1e6) / 1e6;
}

/** Situação do cronograma na data informada. */
export function situacaoEm(data = new Date()) {
  const ano = data.getFullYear();
  const fase = FASE_POR_ANO[ano];
  if (!fase) {
    return {
      ano,
      titulo: ano < 2026 ? "Antes da transição" : "Regime pleno",
      fase: ano < 2026 ? "Modelo anterior" : "Regime pleno (IVA dual)",
      resumo: "IBS e CBS em vigor integral.",
      proximoAno: null,
    };
  }
  const proximo = ANOS.find((a) => a > ano && a <= 2033) ?? null;
  return {
    ano,
    titulo: fase.titulo,
    fase: fase.fase,
    resumo: fase.resumo,
    proximoAno: proximo,
    proximaFase: proximo ? FASE_POR_ANO[proximo] : null,
  };
}
