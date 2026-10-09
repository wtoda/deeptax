import paginasJson from "../../content/paginas.json";
import { fullAddress, site } from "@/lib/site";

/**
 * ============================================================================
 *  TEXTOS DAS PÁGINAS
 * ============================================================================
 *  O conteúdo vive em `content/paginas.json` — edite pelo painel em /admin ou
 *  diretamente no JSON. Este módulo carrega e resolve os marcadores.
 *
 *  MARCADORES: nos textos você pode escrever {{razaoSocial}}, {{cnpj}},
 *  {{endereco}} e afins. Eles são substituídos pelos dados do escritório na
 *  hora de renderizar, então trocar o telefone uma vez atualiza todas as
 *  menções — inclusive dentro de um parágrafo.
 * ============================================================================
 */

const marcadores: Record<string, string> = {
  nome: site.name,
  razaoSocial: site.legalName,
  nomeFantasia: site.tradeName,
  cnpj: site.cnpj,
  crc: site.crc,
  endereco: fullAddress,
  telefone: site.contact.phone,
  whatsapp: site.contact.whatsapp,
  email: site.contact.email,
  blog: site.blogUrl,
};

/** Substitui os marcadores em um texto. Marcador desconhecido fica como está. */
export function preencher(texto: string): string {
  return texto.replace(/\{\{(\w+)\}\}/g, (todo, chave: string) =>
    chave in marcadores ? marcadores[chave] : todo,
  );
}

/** Percorre a estrutura inteira aplicando os marcadores em todo texto. */
function preencherArvore<T>(valor: T): T {
  if (typeof valor === "string") return preencher(valor) as unknown as T;
  if (Array.isArray(valor)) return valor.map(preencherArvore) as unknown as T;
  if (valor && typeof valor === "object") {
    const saida: Record<string, unknown> = {};
    for (const [chave, item] of Object.entries(valor as Record<string, unknown>)) {
      saida[chave] = preencherArvore(item);
    }
    return saida as T;
  }
  return valor;
}

export type BlocoDaPolitica = {
  title: string;
  paragraphs: string[];
  list?: string[];
};

export type Secao = { selo: string; titulo: string; descricao?: string };
export type ItemSimples = { title: string; description: string };

export type Paginas = {
  ctaPadrao: {
    selo: string;
    titulo: string;
    descricao: string;
    garantias: string[];
    tituloFormulario: string;
    notaFormulario: string;
  };
  home: {
    hero: {
      selo: string;
      titulo: string;
      tituloDestaque: string;
      subtitulo: string;
      itens: string[];
      botaoPrincipal: string;
      botaoWhatsapp: string;
      formularioTitulo: string;
      formularioNota: string;
    };
    segmentos: { titulo: string; itens: string[] };
    secoes: Record<"servicos" | "diferenciais" | "processo" | "depoimentos" | "faq", Secao>;
  };
  sobre: {
    hero: { selo: string; titulo: string; descricao: string };
    historia: {
      selo: string;
      titulo: string;
      paragrafos: string[];
      missaoTitulo: string;
      missao: string;
      compromissoTitulo: string;
      compromisso: string;
    };
    valores: Secao & { itens: ItemSimples[] };
    time: Secao & {
      itens: ItemSimples[];
      dadosTitulo: string;
      atendimento: string;
      botao: string;
    };
    porQue: Secao;
    ondeAtuamos: Secao;
  };
  contato: {
    hero: { selo: string; titulo: string; descricao: string };
    canais: { whatsapp: string; telefone: string; email: string; escritorio: string };
    solicitar: {
      selo: string;
      titulo: string;
      descricao: string;
      garantias: string[];
      horarioTitulo: string;
      formularioTitulo: string;
      formularioNota: string;
    };
    faq: { selo: string; titulo: string };
    botaoServicos: string;
  };
  servicos: {
    hero: { selo: string; titulo: string; descricao: string };
    secoes: {
      areas: Secao;
      resumo: Secao & { colunaServico: string; colunaQuando: string; botaoDetalhes: string };
      combinacoes: Secao & { itens: ItemSimples[] };
    };
    ajuda: { titulo: string; descricao: string; itens: string[]; botao: string };
    cta: { titulo: string; descricao: string };
  };
  privacidade: {
    hero: { selo: string; titulo: string; descricao: string };
    avisoAtualizacao: string;
    blocos: BlocoDaPolitica[];
    contatoBloco: {
      titulo: string;
      antesWhatsapp: string;
      entre: string;
      depois: string;
    };
    botao: string;
  };
};

const secoesObrigatorias = ["home", "sobre", "contato", "servicos", "privacidade"] as const;

/**
 * Valida a estrutura mínima do arquivo de textos das páginas. Usada tanto ao
 * carregar quanto pelo painel, antes de gravar.
 */
export function validarPaginas(bruto: unknown): Paginas {
  const dados = (bruto ?? {}) as Record<string, unknown>;
  const ausentes = secoesObrigatorias.filter((chave) => !dados[chave]);

  if (ausentes.length > 0) {
    throw new Error(
      `Faltam as seções ${ausentes.join(", ")} em content/paginas.json. ` +
        "Restaure pelo histórico do repositório se alguma foi removida por engano.",
    );
  }

  if (!Array.isArray((dados.privacidade as Record<string, unknown>)?.blocos)) {
    throw new Error(
      '"privacidade.blocos" precisa ser uma lista — é onde ficam os itens da Política de Privacidade.',
    );
  }

  return bruto as Paginas;
}

export const paginas: Paginas = preencherArvore(validarPaginas(paginasJson));
