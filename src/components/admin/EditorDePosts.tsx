"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IconAlert, IconCheck, IconSpinner } from "@/components/Icons";
import type { Bloco, Post } from "@/lib/blog";

/**
 * ============================================================================
 *  EDITOR DE POSTS DO BLOG
 * ============================================================================
 *  Lista de posts à esquerda, formulário à direita. O corpo do post é editado
 *  em BLOCOS: quem escreve escolhe "parágrafo", "título", "lista", "citação" ou
 *  "imagem" e preenche o campo daquele tipo. Não há marcação para digitar nem
 *  para errar.
 *
 *  O arquivo inteiro é salvo de uma vez (`content/posts.json`), então o envio
 *  leva todos os posts — o que está em edição e os que não foram tocados.
 * ========================================================================== */

/* ------------------------------------------------------------------ modelo */

/** Formulário em edição: campos "achatados" para caber em inputs simples. */
type Formulario = {
  slug: string;
  titulo: string;
  resumo: string;
  autor: string;
  data: string;
  atualizadoEm: string;
  tagsTexto: string;
  rascunho: boolean;
  capaSrc: string;
  capaAlt: string;
  blocos: Bloco[];
};

/** Mesma regra de src/lib/blog.ts, repetida aqui para não puxar o conteúdo do
 *  blog para dentro do bundle do painel. */
function gerarSlug(titulo: string): string {
  return titulo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function hoje(): string {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

const texto = (v: unknown) => (typeof v === "string" ? v : "");

function paraFormulario(post: Partial<Post>): Formulario {
  const capa = (post.capa ?? {}) as { src?: unknown; alt?: unknown };
  return {
    slug: texto(post.slug),
    titulo: texto(post.titulo),
    resumo: texto(post.resumo),
    autor: texto(post.autor),
    data: texto(post.data) || hoje(),
    atualizadoEm: texto(post.atualizadoEm),
    tagsTexto: Array.isArray(post.tags) ? post.tags.join(", ") : "",
    rascunho: post.rascunho === true,
    capaSrc: texto(capa.src),
    capaAlt: texto(capa.alt),
    blocos: Array.isArray(post.blocos) ? (post.blocos as Bloco[]) : [],
  };
}

function paraPost(f: Formulario): Post {
  return {
    slug: f.slug.trim(),
    titulo: f.titulo.trim(),
    resumo: f.resumo.trim(),
    autor: f.autor.trim(),
    data: f.data,
    ...(f.atualizadoEm ? { atualizadoEm: f.atualizadoEm } : {}),
    tags: f.tagsTexto
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    ...(f.capaSrc.trim()
      ? { capa: { src: f.capaSrc.trim(), alt: f.capaAlt.trim() } }
      : {}),
    rascunho: f.rascunho,
    blocos: f.blocos,
  } as Post;
}

function blocoPadrao(tipo: Bloco["tipo"]): Bloco {
  switch (tipo) {
    case "titulo":
      return { tipo: "titulo", nivel: 2, texto: "" };
    case "lista":
      return { tipo: "lista", ordenada: false, itens: [""] };
    case "citacao":
      return { tipo: "citacao", texto: "" };
    case "imagem":
      return { tipo: "imagem", src: "", alt: "" };
    default:
      return { tipo: "paragrafo", texto: "" };
  }
}

const NOMES: Record<Bloco["tipo"], string> = {
  paragrafo: "Parágrafo",
  titulo: "Título",
  lista: "Lista",
  citacao: "Citação",
  imagem: "Imagem",
};

/* ------------------------------------------------------------- componentes */

const rotulo = "mb-1.5 block text-sm font-semibold text-brand-950";
const entrada =
  "w-full rounded-lg border border-brand-200 bg-white p-2.5 text-sm text-brand-950 placeholder:text-brand-900/35 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-100";
const botaoLeve =
  "rounded-lg border border-brand-200 bg-white px-3 py-1.5 text-xs font-semibold text-brand-800 transition-colors hover:bg-brand-50 disabled:opacity-40";

/** Campo de imagem com envio de arquivo, endereço e descrição. */
function CampoImagem({
  src,
  alt,
  onMudar,
  rotuloDoCampo,
}: {
  src: string;
  alt: string;
  onMudar: (patch: { src?: string; alt?: string }) => void;
  rotuloDoCampo: string;
}) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const entradaArquivo = useRef<HTMLInputElement>(null);

  const enviar = async (arquivo: File) => {
    setErro("");
    setEnviando(true);
    try {
      const dados = new FormData();
      dados.append("arquivo", arquivo);
      const resposta = await fetch("/api/admin/upload", { method: "POST", body: dados });
      const json = await resposta.json();
      if (!resposta.ok || !json.ok) throw new Error(json.message ?? "Falha ao enviar a imagem.");
      onMudar({ src: json.url });
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao enviar a imagem.");
    } finally {
      setEnviando(false);
      if (entradaArquivo.current) entradaArquivo.current.value = "";
    }
  };

  return (
    <div className="rounded-xl border border-brand-100 bg-brand-50/40 p-3">
      <p className={rotulo}>{rotuloDoCampo}</p>

      <div className="flex flex-wrap items-start gap-3">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt=""
            className="h-20 w-28 shrink-0 rounded-lg border border-brand-200 object-cover"
          />
        ) : (
          <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-lg border border-dashed border-brand-200 text-xs text-brand-900/40">
            sem imagem
          </div>
        )}

        <div className="min-w-[12rem] flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={entradaArquivo}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const arquivo = e.target.files?.[0];
                if (arquivo) void enviar(arquivo);
              }}
            />
            <button
              type="button"
              onClick={() => entradaArquivo.current?.click()}
              disabled={enviando}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-950 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
            >
              {enviando && <IconSpinner className="size-3.5" />}
              {enviando ? "Enviando…" : src ? "Trocar imagem" : "Enviar imagem"}
            </button>
            {src && (
              <button
                type="button"
                onClick={() => onMudar({ src: "" })}
                className={botaoLeve}
              >
                Remover
              </button>
            )}
            <span className="text-xs text-brand-900/45">JPG, PNG ou WebP · até 4 MB</span>
          </div>

          <input
            type="text"
            value={src}
            onChange={(e) => onMudar({ src: e.target.value })}
            placeholder="/midia/… ou https://…"
            className={entrada}
            aria-label="Endereço da imagem"
          />
          <input
            type="text"
            value={alt}
            onChange={(e) => onMudar({ alt: e.target.value })}
            placeholder="Descrição da imagem (obrigatória)"
            className={entrada}
            aria-label="Descrição da imagem"
          />
          {erro && (
            <p className="flex items-start gap-1.5 text-xs text-red-700">
              <IconAlert className="mt-0.5 size-3.5 shrink-0" />
              <span>{erro}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/** Um bloco do corpo, com os campos do seu tipo. */
function CampoBloco({
  bloco,
  indice,
  total,
  onMudar,
  onTrocarTipo,
  onMover,
  onRemover,
}: {
  bloco: Bloco;
  indice: number;
  total: number;
  onMudar: (novo: Bloco) => void;
  onTrocarTipo: (tipo: Bloco["tipo"]) => void;
  onMover: (delta: number) => void;
  onRemover: () => void;
}) {
  return (
    <div className="rounded-xl border border-brand-100 bg-white p-3.5">
      <div className="mb-2.5 flex flex-wrap items-center gap-2">
        <span className="inline-flex size-6 items-center justify-center rounded-md bg-brand-50 text-xs font-bold text-brand-900/60">
          {indice + 1}
        </span>
        <select
          value={bloco.tipo}
          onChange={(e) => onTrocarTipo(e.target.value as Bloco["tipo"])}
          className="rounded-lg border border-brand-200 bg-white px-2 py-1 text-xs font-semibold text-brand-900"
          aria-label="Tipo do bloco"
        >
          {(Object.keys(NOMES) as Bloco["tipo"][]).map((t) => (
            <option key={t} value={t}>
              {NOMES[t]}
            </option>
          ))}
        </select>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => onMover(-1)}
            disabled={indice === 0}
            className={botaoLeve}
            aria-label="Mover para cima"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => onMover(1)}
            disabled={indice === total - 1}
            className={botaoLeve}
            aria-label="Mover para baixo"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={onRemover}
            className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50"
          >
            Remover
          </button>
        </div>
      </div>

      {bloco.tipo === "paragrafo" && (
        <textarea
          value={bloco.texto}
          onChange={(e) => onMudar({ tipo: "paragrafo", texto: e.target.value })}
          rows={4}
          placeholder="Escreva o parágrafo."
          className={entrada}
        />
      )}

      {bloco.tipo === "titulo" && (
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            value={bloco.texto}
            onChange={(e) =>
              onMudar({ tipo: "titulo", nivel: bloco.nivel, texto: e.target.value })
            }
            placeholder="Título da seção"
            className={`${entrada} flex-1`}
          />
          <select
            value={bloco.nivel}
            onChange={(e) =>
              onMudar({ tipo: "titulo", nivel: e.target.value === "3" ? 3 : 2, texto: bloco.texto })
            }
            className="rounded-lg border border-brand-200 bg-white px-2 py-1 text-sm"
            aria-label="Nível do título"
          >
            <option value={2}>Título principal</option>
            <option value={3}>Subtítulo</option>
          </select>
        </div>
      )}

      {bloco.tipo === "lista" && (
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-medium text-brand-900/60">
            <input
              type="checkbox"
              checked={bloco.ordenada === true}
              onChange={(e) => onMudar({ ...bloco, ordenada: e.target.checked })}
              className="size-4 rounded border-brand-300"
            />
            Lista numerada
          </label>
          {bloco.itens.map((item, j) => (
            <div key={j} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const itens = [...bloco.itens];
                  itens[j] = e.target.value;
                  onMudar({ ...bloco, itens });
                }}
                placeholder={`Item ${j + 1}`}
                className={entrada}
              />
              <button
                type="button"
                onClick={() => {
                  const itens = bloco.itens.filter((_, k) => k !== j);
                  onMudar({ ...bloco, itens: itens.length ? itens : [""] });
                }}
                className={botaoLeve}
                aria-label={`Remover item ${j + 1}`}
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onMudar({ ...bloco, itens: [...bloco.itens, ""] })}
            className={botaoLeve}
          >
            + item
          </button>
        </div>
      )}

      {bloco.tipo === "citacao" && (
        <div className="space-y-2">
          <textarea
            value={bloco.texto}
            onChange={(e) => onMudar({ ...bloco, texto: e.target.value })}
            rows={3}
            placeholder="Texto citado."
            className={entrada}
          />
          <input
            type="text"
            value={bloco.autor ?? ""}
            onChange={(e) => onMudar({ ...bloco, autor: e.target.value })}
            placeholder="Quem disse (opcional)"
            className={entrada}
          />
        </div>
      )}

      {bloco.tipo === "imagem" && (
        <div className="space-y-2">
          <CampoImagem
            src={bloco.src}
            alt={bloco.alt}
            rotuloDoCampo="Imagem"
            onMudar={(patch) => onMudar({ ...bloco, ...patch })}
          />
          <input
            type="text"
            value={bloco.legenda ?? ""}
            onChange={(e) => onMudar({ ...bloco, legenda: e.target.value })}
            placeholder="Legenda (opcional)"
            className={entrada}
          />
        </div>
      )}

      {(bloco.tipo === "paragrafo" || bloco.tipo === "citacao" || bloco.tipo === "lista") && (
        <p className="mt-2 text-xs text-brand-900/40">
          Se quiser, use <code className="font-mono">**negrito**</code>,{" "}
          <code className="font-mono">*itálico*</code> e{" "}
          <code className="font-mono">[texto](https://…)</code> para link.
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ editor */

export function EditorDePosts() {
  const [carregando, setCarregando] = useState(true);
  const [erroAoCarregar, setErroAoCarregar] = useState("");

  const [posts, setPosts] = useState<Post[]>([]);
  const [indice, setIndice] = useState<number | null>(null);
  const [form, setForm] = useState<Formulario | null>(null);
  const [original, setOriginal] = useState("");

  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErroAoCarregar("");
    try {
      const resposta = await fetch("/api/admin/posts", { cache: "no-store" });
      const dados = await resposta.json();
      if (!resposta.ok || !dados.ok) {
        throw new Error(dados.message ?? "Não consegui carregar os posts.");
      }
      const lista = (dados.posts ?? []) as Post[];
      setPosts(lista);
      setIndice(null);
      setForm(null);
    } catch (e) {
      setErroAoCarregar(e instanceof Error ? e.message : "Falha ao carregar os posts.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const abrir = (i: number) => {
    setIndice(i);
    const f = paraFormulario(posts[i]);
    setForm(f);
    setOriginal(JSON.stringify(f));
    setErro("");
    setMensagem("");
  };

  const alterado = useMemo(
    () => (form ? JSON.stringify(form) !== original : false),
    [form, original],
  );

  const atualizar = (patch: Partial<Formulario>) =>
    setForm((atual) => (atual ? { ...atual, ...patch } : atual));

  const salvar = async () => {
    if (!form) return;
    setSalvando(true);
    setErro("");
    setMensagem("");
    try {
      // O título define o endereço quando o campo está vazio.
      const preenchido: Formulario = {
        ...form,
        slug: form.slug.trim() || gerarSlug(form.titulo),
      };

      const novos = [...posts];
      if (indice === null) novos.push(paraPost(preenchido));
      else novos[indice] = paraPost(preenchido);

      const resposta = await fetch("/api/admin/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posts: novos }),
      });
      const dados = await resposta.json();

      if (!resposta.ok || !dados.ok) throw new Error(dados.message ?? "Não foi possível salvar.");

      setPosts(novos);
      const novaPosicao = indice === null ? novos.length - 1 : indice;
      setIndice(novaPosicao);
      setForm(preenchido);
      setOriginal(JSON.stringify(preenchido));
      setMensagem([dados.message, dados.aviso].filter(Boolean).join(" "));
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao salvar.");
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async () => {
    if (indice === null || !form) return;
    if (!confirm(`Excluir o post "${form.titulo || form.slug}"? Isso não pode ser desfeito.`)) {
      return;
    }
    setSalvando(true);
    setErro("");
    setMensagem("");
    try {
      const novos = posts.filter((_, i) => i !== indice);
      const resposta = await fetch("/api/admin/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posts: novos }),
      });
      const dados = await resposta.json();
      if (!resposta.ok || !dados.ok) throw new Error(dados.message ?? "Não foi possível excluir.");
      setPosts(novos);
      setIndice(null);
      setForm(null);
      setMensagem(dados.message ?? "Post excluído.");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao excluir.");
    } finally {
      setSalvando(false);
    }
  };

  const bloqueado = salvando || !form;

  /* --------------------------------------------------------- renderização */

  if (carregando) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-brand-100 bg-white p-6 text-sm text-brand-900/60">
        <IconSpinner className="size-4" />
        Carregando os posts…
      </div>
    );
  }

  if (erroAoCarregar) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
        <p className="flex items-start gap-2">
          <IconAlert className="mt-0.5 size-4 shrink-0" />
          <span>{erroAoCarregar}</span>
        </p>
        <button type="button" onClick={() => void carregar()} className={`${botaoLeve} mt-3`}>
          Tentar de novo
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[19rem_1fr]">
      {/* ------------------------------------------------------------- lista */}
      <aside className="lg:sticky lg:top-4 lg:self-start">
        <div className="rounded-xl border border-brand-100 bg-white">
          <div className="flex items-center justify-between border-b border-brand-100 px-4 py-3">
            <h3 className="font-display text-sm font-bold text-brand-950">
              Artigos ({posts.length})
            </h3>
            <button
              type="button"
              onClick={() => {
                const f = paraFormulario({ data: hoje(), autor: "" });
                setIndice(null);
                setForm(f);
                setOriginal(JSON.stringify(f));
                setErro("");
                setMensagem("");
              }}
              className="rounded-lg bg-accent-500 px-3 py-1.5 text-xs font-semibold text-white"
            >
              + Novo
            </button>
          </div>

          {posts.length === 0 ? (
            <p className="px-4 py-6 text-sm text-brand-900/55">
              Nenhum artigo ainda. Comece pelo botão <strong>+ Novo</strong>.
            </p>
          ) : (
            <ul className="max-h-[26rem] divide-y divide-brand-50 overflow-y-auto">
              {posts.map((p, i) => (
                <li key={`${p.slug}-${i}`}>
                  <button
                    type="button"
                    onClick={() => {
                      if (alterado && !confirm("Descartar as alterações não salvas deste artigo?")) {
                        return;
                      }
                      abrir(i);
                    }}
                    className={`w-full px-4 py-3 text-left transition-colors hover:bg-brand-50 ${
                      indice === i ? "bg-brand-50" : ""
                    }`}
                  >
                    <span className="block truncate text-sm font-semibold text-brand-950">
                      {texto(p.titulo) || "(sem título)"}
                    </span>
                    <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-brand-900/50">
                      <span>{texto(p.data) || "sem data"}</span>
                      {p.rascunho ? (
                        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 font-semibold text-amber-800">
                          rascunho
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 font-semibold text-emerald-700">
                          publicado
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-3 px-1 text-xs leading-relaxed text-brand-900/45">
          Rascunho não aparece no site nem no sitemap — pode escrever e revisar com
          calma antes de publicar.
        </p>
      </aside>

      {/* -------------------------------------------------------- formulário */}
      {!form ? (
        <div className="rounded-xl border border-dashed border-brand-200 bg-white/60 p-10 text-center">
          <p className="text-sm text-brand-900/55">
            Escolha um artigo na lista ou crie um novo para começar a escrever.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="space-y-4 rounded-xl border border-brand-100 bg-white p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={rotulo} htmlFor="post-titulo">
                  Título
                </label>
                <input
                  id="post-titulo"
                  type="text"
                  value={form.titulo}
                  onChange={(e) => atualizar({ titulo: e.target.value })}
                  placeholder="Ex.: Reforma tributária: o que muda na sua apuração em 2026"
                  className={entrada}
                />
              </div>

              <div>
                <label className={rotulo} htmlFor="post-slug">
                  Endereço (slug)
                </label>
                <input
                  id="post-slug"
                  type="text"
                  value={form.slug}
                  onChange={(e) => atualizar({ slug: e.target.value })}
                  onBlur={() => {
                    if (!form.slug.trim() && form.titulo) {
                      atualizar({ slug: gerarSlug(form.titulo) });
                    }
                  }}
                  placeholder={gerarSlug(form.titulo) || "reforma-tributaria-2026"}
                  className={entrada}
                />
                <p className="mt-1.5 text-xs text-brand-900/45">
                  Vira <code className="font-mono">deeptax.com.br/blog/{form.slug || "…"}</code>
                </p>
              </div>

              <div>
                <label className={rotulo} htmlFor="post-data">
                  Data de publicação
                </label>
                <input
                  id="post-data"
                  type="date"
                  value={form.data}
                  onChange={(e) => atualizar({ data: e.target.value })}
                  className={entrada}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={rotulo} htmlFor="post-resumo">
                  Resumo
                </label>
                <textarea
                  id="post-resumo"
                  value={form.resumo}
                  onChange={(e) => atualizar({ resumo: e.target.value })}
                  rows={2}
                  maxLength={300}
                  placeholder="Uma ou duas frases que resumem o artigo. É o texto que aparece na lista e na busca do Google."
                  className={entrada}
                />
                <p className="mt-1 text-right text-xs text-brand-900/40">
                  {form.resumo.length}/300
                </p>
              </div>

              <div>
                <label className={rotulo} htmlFor="post-autor">
                  Autor
                </label>
                <input
                  id="post-autor"
                  type="text"
                  value={form.autor}
                  onChange={(e) => atualizar({ autor: e.target.value })}
                  placeholder="Deeptax"
                  className={entrada}
                />
              </div>

              <div>
                <label className={rotulo} htmlFor="post-tags">
                  Temas
                </label>
                <input
                  id="post-tags"
                  type="text"
                  value={form.tagsTexto}
                  onChange={(e) => atualizar({ tagsTexto: e.target.value })}
                  placeholder="reforma tributária, IBS, apuração"
                  className={entrada}
                />
                <p className="mt-1.5 text-xs text-brand-900/45">Separados por vírgula, até 6.</p>
              </div>

              <div className="sm:col-span-2">
                <label className={rotulo} htmlFor="post-atualizado">
                  Atualizado em (opcional)
                </label>
                <input
                  id="post-atualizado"
                  type="date"
                  value={form.atualizadoEm}
                  onChange={(e) => atualizar({ atualizadoEm: e.target.value })}
                  className={`${entrada} sm:max-w-[12rem]`}
                />
                <p className="mt-1.5 text-xs text-brand-900/45">
                  Preencha quando revisar um artigo já publicado — aparece para o leitor.
                </p>
              </div>

              <div className="sm:col-span-2">
                <CampoImagem
                  src={form.capaSrc}
                  alt={form.capaAlt}
                  rotuloDoCampo="Imagem de capa (opcional)"
                  onMudar={(patch) =>
                    atualizar({
                      ...(patch.src !== undefined ? { capaSrc: patch.src } : {}),
                      ...(patch.alt !== undefined ? { capaAlt: patch.alt } : {}),
                    })
                  }
                />
              </div>

              <label className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/60 p-3 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={form.rascunho}
                  onChange={(e) => atualizar({ rascunho: e.target.checked })}
                  className="mt-0.5 size-4 rounded border-brand-300"
                />
                <span className="text-sm text-amber-900">
                  <strong>Manter como rascunho</strong> — não aparece no site, na busca nem
                  no sitemap. Desmarque para publicar.
                </span>
              </label>
            </div>
          </div>

          {/* ---------------------------------------------------- blocos */}
          <div className="rounded-xl border border-brand-100 bg-white p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-base font-bold text-brand-950">Conteúdo</h3>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(NOMES) as Bloco["tipo"][]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => atualizar({ blocos: [...form.blocos, blocoPadrao(t)] })}
                    className={botaoLeve}
                  >
                    + {NOMES[t]}
                  </button>
                ))}
              </div>
            </div>

            {form.blocos.length === 0 ? (
              <p className="rounded-lg border border-dashed border-brand-200 px-4 py-8 text-center text-sm text-brand-900/50">
                Nada escrito ainda. Comece por um <strong>Parágrafo</strong> e acrescente
                título, lista e imagem conforme o texto pedir.
              </p>
            ) : (
              <div className="space-y-3">
                {form.blocos.map((bloco, i) => (
                  <CampoBloco
                    key={i}
                    bloco={bloco}
                    indice={i}
                    total={form.blocos.length}
                    onMudar={(novo) => {
                      const blocos = [...form.blocos];
                      blocos[i] = novo;
                      atualizar({ blocos });
                    }}
                    onTrocarTipo={(tipo) => {
                      const blocos = [...form.blocos];
                      blocos[i] = blocoPadrao(tipo);
                      atualizar({ blocos });
                    }}
                    onMover={(delta) => {
                      const destino = i + delta;
                      if (destino < 0 || destino >= form.blocos.length) return;
                      const blocos = [...form.blocos];
                      [blocos[i], blocos[destino]] = [blocos[destino], blocos[i]];
                      atualizar({ blocos });
                    }}
                    onRemover={() =>
                      atualizar({ blocos: form.blocos.filter((_, k) => k !== i) })
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* --------------------------------------------------- ações */}
          <div className="sticky bottom-0 z-20 rounded-xl border border-brand-100 bg-white/95 p-3.5 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0 text-sm">
                {erro && (
                  <p className="flex items-start gap-2 whitespace-pre-line text-red-700">
                    <IconAlert className="mt-0.5 size-4 shrink-0" />
                    <span>{erro}</span>
                  </p>
                )}
                {mensagem && !erro && (
                  <p className="flex items-start gap-2 text-accent-700">
                    <IconCheck className="mt-0.5 size-4 shrink-0" />
                    <span>{mensagem}</span>
                  </p>
                )}
                {!erro && !mensagem && (
                  <span className="text-brand-900/55">
                    {alterado ? "Alterações não publicadas." : "Nenhuma alteração pendente."}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {indice !== null && (
                  <button
                    type="button"
                    onClick={() => void excluir()}
                    disabled={bloqueado}
                    className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 disabled:opacity-50"
                  >
                    Excluir
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => void salvar()}
                  disabled={bloqueado || !alterado}
                  className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {salvando && <IconSpinner className="size-4" />}
                  {form.rascunho ? "Salvar rascunho" : "Salvar e publicar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
