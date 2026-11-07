import postsJson from "../../content/posts.json";
import { ErroDeConteudo, site } from "./site";

/**
 * ============================================================================
 *  BLOG
 * ============================================================================
 *  Os textos do blog vivem em `content/posts.json`. Edite pelo painel em
 *  /admin (aba Blog) ou diretamente pelo JSON; este módulo apenas carrega,
 *  valida e deriva o que as páginas consomem.
 *
 *  O corpo de cada post é uma lista de BLOCOS, e não um texto com marcação.
 *  A razão é prática: quem escreve aqui não é programador. Com blocos, não há
 *  marcação para errar, o texto não quebra e cada tipo é renderizado do jeito
 *  certo — inclusive imagem com legenda e citação com autor.
 * ========================================================================== */

/** Um bloco do corpo do post. */
export type Bloco =
  | { tipo: "paragrafo"; texto: string }
  | { tipo: "titulo"; nivel: 2 | 3; texto: string }
  | { tipo: "lista"; ordenada?: boolean; itens: string[] }
  | { tipo: "citacao"; texto: string; autor?: string }
  | { tipo: "imagem"; src: string; alt: string; legenda?: string };

export type Imagem = { src: string; alt: string };

export type Post = {
  slug: string;
  titulo: string;
  resumo: string;
  autor: string;
  /** Data de publicação, no formato AAAA-MM-DD. */
  data: string;
  /** Preenchida quando o post é revisado depois de publicado. */
  atualizadoEm?: string;
  tags: string[];
  capa?: Imagem;
  /** Rascunhos não são publicados nem entram no sitemap. */
  rascunho: boolean;
  blocos: Bloco[];
};

export type PostsContent = { posts: Post[] };

/* ---------------------------------------------------------------- validação */

const texto = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** Endereço aceito em imagem e link: caminho do próprio site ou http(s). */
export function urlSegura(bruta: string): string {
  const url = bruta.trim();
  if (/^\/(?!\/)/.test(url)) return url; // caminho interno
  if (/^https?:\/\//i.test(url)) return url;
  return "";
}

/**
 * Converte um título em endereço: "Reforma Tributária: o que muda?" →
 * "reforma-tributaria-o-que-muda". Sem acento, sem pontuação.
 */
export function gerarSlug(titulo: string): string {
  return titulo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const RE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const RE_DATA = /^\d{4}-\d{2}-\d{2}$/;

export function validarPosts(bruto: unknown): PostsContent {
  const problemas: string[] = [];
  const raiz = (bruto ?? {}) as Record<string, unknown>;
  const lista = raiz.posts;

  if (!Array.isArray(lista)) {
    problemas.push('"posts" deveria ser uma lista. O arquivo precisa ter a forma { "posts": [] }.');
    throw new ErroDeConteudo(problemas, "O blog");
  }

  const vistos = new Set<string>();

  const posts = lista.map((item, indice): Post => {
    const d = (item ?? {}) as Record<string, unknown>;
    const onde = `post ${indice + 1}`;

    const titulo = texto(d.titulo);
    if (!titulo) problemas.push(`${onde}: "titulo" está vazio.`);

    const resumo = texto(d.resumo);
    if (!resumo) {
      problemas.push(`${onde}: "resumo" está vazio. É o texto que aparece na lista e na busca do Google.`);
    } else if (resumo.length > 300) {
      problemas.push(`${onde}: "resumo" tem ${resumo.length} caracteres (o limite é 300).`);
    }

    const slug = texto(d.slug) || gerarSlug(titulo);
    if (!RE_SLUG.test(slug)) {
      problemas.push(
        `${onde}: o endereço "${slug}" é inválido. Use só letras minúsculas, números e hífen ` +
          `(ex.: reforma-tributaria-2026).`,
      );
    }
    if (vistos.has(slug)) {
      problemas.push(`${onde}: o endereço "${slug}" já é usado por outro post. Cada post precisa do seu.`);
    }
    vistos.add(slug);

    const data = texto(d.data);
    if (!RE_DATA.test(data)) {
      problemas.push(`${onde}: "data" deve estar no formato AAAA-MM-DD (ex.: 2026-11-06).`);
    } else if (Number.isNaN(new Date(`${data}T12:00:00`).getTime())) {
      problemas.push(`${onde}: a data "${data}" não existe no calendário.`);
    }

    const atualizadoEm = texto(d.atualizadoEm);
    if (atualizadoEm && !RE_DATA.test(atualizadoEm)) {
      problemas.push(`${onde}: "atualizadoEm" deve estar no formato AAAA-MM-DD.`);
    }

    const tags = Array.isArray(d.tags)
      ? d.tags.map((t) => texto(t)).filter(Boolean)
      : [];
    if (tags.length > 6) {
      problemas.push(`${onde}: são ${tags.length} tags (o máximo é 6).`);
    }

    const capaBruta = (d.capa ?? null) as Record<string, unknown> | null;
    let capa: Imagem | undefined;
    if (capaBruta && texto(capaBruta.src)) {
      const src = urlSegura(texto(capaBruta.src));
      const alt = texto(capaBruta.alt);
      if (!src) {
        problemas.push(`${onde}: o endereço da imagem de capa não é um caminho do site nem um link http(s).`);
      } else if (!alt) {
        problemas.push(
          `${onde}: a imagem de capa precisa de "alt" — é o texto que descreve a imagem para ` +
            `quem não a vê e para o Google.`,
        );
      } else {
        capa = { src, alt };
      }
    }

    const blocos = validarBlocos(d.blocos, onde, problemas);

    return {
      slug,
      titulo,
      resumo,
      autor: texto(d.autor) || site.name,
      data,
      atualizadoEm: atualizadoEm || undefined,
      tags,
      capa,
      rascunho: d.rascunho === true,
      blocos,
    };
  });

  if (problemas.length) throw new ErroDeConteudo(problemas, "O blog");
  return { posts };
}

function validarBlocos(bruto: unknown, onde: string, problemas: string[]): Bloco[] {
  if (bruto === undefined || bruto === null) return [];
  if (!Array.isArray(bruto)) {
    problemas.push(`${onde}: "blocos" deveria ser uma lista.`);
    return [];
  }

  const saida: Bloco[] = [];

  bruto.forEach((item, i) => {
    const b = (item ?? {}) as Record<string, unknown>;
    const tipo = texto(b.tipo);
    const ref = `${onde}, bloco ${i + 1}`;

    switch (tipo) {
      case "paragrafo": {
        const t = texto(b.texto);
        if (!t) problemas.push(`${ref}: parágrafo vazio.`);
        else saida.push({ tipo: "paragrafo", texto: t });
        break;
      }
      case "titulo": {
        const t = texto(b.texto);
        const nivel = b.nivel === 3 ? 3 : 2;
        if (!t) problemas.push(`${ref}: título vazio.`);
        else saida.push({ tipo: "titulo", nivel, texto: t });
        break;
      }
      case "lista": {
        const itens = Array.isArray(b.itens)
          ? b.itens.map((v) => texto(v)).filter(Boolean)
          : [];
        if (itens.length === 0) problemas.push(`${ref}: lista sem itens.`);
        else saida.push({ tipo: "lista", ordenada: b.ordenada === true, itens });
        break;
      }
      case "citacao": {
        const t = texto(b.texto);
        if (!t) problemas.push(`${ref}: citação vazia.`);
        else saida.push({ tipo: "citacao", texto: t, autor: texto(b.autor) || undefined });
        break;
      }
      case "imagem": {
        const src = urlSegura(texto(b.src));
        const alt = texto(b.alt);
        if (!src) problemas.push(`${ref}: endereço da imagem inválido.`);
        else if (!alt) problemas.push(`${ref}: a imagem precisa de "alt" (descrição para leitores de tela).`);
        else
          saida.push({ tipo: "imagem", src, alt, legenda: texto(b.legenda) || undefined });
        break;
      }
      default:
        problemas.push(
          `${ref}: tipo "${tipo || "?"}" desconhecido. Os tipos aceitos são ` +
            `paragrafo, titulo, lista, citacao e imagem.`,
        );
    }
  });

  return saida;
}

/* ------------------------------------------------------------------ consulta */

const VALIDADO = validarPosts(postsJson);

/** Posts publicados, do mais recente para o mais antigo. */
export const posts: Post[] = VALIDADO.posts
  .filter((p) => !p.rascunho)
  .sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : a.slug.localeCompare(b.slug)));

/** Todos os posts, inclusive rascunhos — usado apenas pelo painel. */
export const todosOsPosts: Post[] = VALIDADO.posts;

export const urlDoPost = (post: Pick<Post, "slug">) => `/blog/${post.slug}`;

export const urlAbsolutaDoPost = (post: Pick<Post, "slug">) => `${site.url}${urlDoPost(post)}`;

/** "2026-11-06" → "6 de novembro de 2026". */
export function formatarData(iso: string): string {
  // Meio-dia local: evita que o fuso empurre a data para o dia anterior.
  const data = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(data.getTime())) return iso;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(data);
}

/** "2026-11-06" → "06/11/2026", para listas curtas do painel. */
export function formatarDataCurta(iso: string): string {
  const data = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(data.getTime())) return iso;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(data);
}

const TEXTO_DE_BLOCO: ((b: Bloco) => string)[] = [
  (b) => ("texto" in b && typeof b.texto === "string" ? b.texto : ""),
  (b) => (b.tipo === "lista" ? b.itens.join(" ") : ""),
  (b) => (b.tipo === "imagem" ? `${b.legenda ?? ""} ${b.alt}` : ""),
];

/** Estimativa de leitura, arredondada para cima, mínimo de 1 minuto. */
export function tempoDeLeitura(post: Post): number {
  const palavras = post.blocos
    .flatMap((b) => TEXTO_DE_BLOCO.map((f) => f(b)))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(palavras / 200));
}

/** Texto puro do post — usado em descrição de busca e no RSS. */
export function textoPuro(post: Post): string {
  return post.blocos.map((b) => TEXTO_DE_BLOCO.map((f) => f(b)).join(" ")).join(" ").trim();
}

export const postsPorTag = (tag: string): Post[] =>
  posts.filter((p) => p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));

/** Tags em uso, com contagem, da mais frequente para a menos frequente. */
export function tagsEmUso(): { tag: string; total: number }[] {
  const contagem = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      contagem.set(tag, (contagem.get(tag) ?? 0) + 1);
    }
  }
  return [...contagem.entries()]
    .map(([tag, total]) => ({ tag, total }))
    .sort((a, b) => b.total - a.total || a.tag.localeCompare(b.tag, "pt-BR"));
}

export const blogTemPosts = posts.length > 0;
