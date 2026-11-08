import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CartaoDePost } from "@/components/blog/CartaoDePost";
import { CorpoDoPost } from "@/components/blog/CorpoDoPost";
import { CtaSection } from "@/components/CtaSection";
import { Section } from "@/components/ui";
import {
  formatarData,
  posts,
  tempoDeLeitura,
  urlAbsolutaDoPost,
  urlDoPost,
  type Post,
} from "@/lib/blog";
import { imagemSocial, site } from "@/lib/site";
import { jsonLdSeguro } from "@/lib/jsonld";

/** Só existem as páginas geradas no build: qualquer outro endereço é 404. */
export const dynamicParams = false;

const acharPost = (slug: string): Post | undefined => posts.find((p) => p.slug === slug);

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = acharPost(slug);
  if (!post) return { title: "Artigo não encontrado" };

  const url = urlDoPost(post);
  return {
    title: post.titulo,
    description: post.resumo,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url: `${site.url}${url}`,
      title: post.titulo,
      description: post.resumo,
      publishedTime: post.data,
      modifiedTime: post.atualizadoEm ?? post.data,
      authors: [post.autor],
      tags: post.tags,
      // A capa do artigo é melhor que a imagem padrão — mas sem capa, a marca
      // entra no lugar (declarar `openGraph` aqui descarta a imagem herdada).
      images: [
        post.capa
          ? { url: `${site.url}${post.capa.src}`, alt: post.capa.alt, width: 1200, height: 630 }
          : imagemSocial,
      ],
    },
    twitter: {
      card: post.capa ? "summary_large_image" : "summary",
      title: post.titulo,
      description: post.resumo,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = acharPost(slug);
  if (!post) notFound();

  const relacionados = posts
    .filter((p) => p.slug !== post.slug && p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 3);

  const dadosEstruturados = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.titulo,
    description: post.resumo,
    datePublished: post.data,
    dateModified: post.atualizadoEm ?? post.data,
    inLanguage: "pt-BR",
    url: urlAbsolutaDoPost(post),
    mainEntityOfPage: { "@type": "WebPage", "@id": urlAbsolutaDoPost(post) },
    ...(post.capa ? { image: [`${site.url}${post.capa.src}`] } : {}),
    ...(post.tags.length ? { keywords: post.tags.join(", "), articleSection: post.tags[0] } : {}),
    author: { "@type": "Organization", name: post.autor, url: site.url },
    publisher: {
      "@type": "AccountingService",
      name: site.name,
      url: site.url,
      ...(site.cnpj ? { taxID: site.cnpj } : {}),
    },
  };

  const migalhas = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: site.name, item: `${site.url}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog` },
      { "@type": "ListItem", position: 3, name: post.titulo, item: urlAbsolutaDoPost(post) },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Conteúdo montado por nós a partir do JSON de conteúdo, sem entrada livre.
        dangerouslySetInnerHTML={{ __html: jsonLdSeguro(dadosEstruturados) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdSeguro(migalhas) }}
      />

      {/* ============================================================== HERO == */}
      <section className="bg-ink relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
        <div
          className="pointer-events-none absolute -right-24 -top-16 size-[28rem] rounded-full bg-accent-500/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="container-x relative py-14 sm:py-16 lg:py-20">
          <nav
            aria-label="Você está aqui"
            className="mb-8 flex flex-wrap items-center gap-2 text-xs text-brand-100/50"
          >
            <Link href="/" className="transition-colors hover:text-accent-300">
              Início
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog" className="transition-colors hover:text-accent-300">
              Blog
            </Link>
            <span aria-hidden="true">/</span>
            <span className="max-w-full truncate text-brand-100/80">{post.titulo}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-medium text-brand-100/60">
              <time dateTime={post.data}>{formatarData(post.data)}</time>
              <span aria-hidden="true">·</span>
              <span>{tempoDeLeitura(post)} min de leitura</span>
              {post.atualizadoEm && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>atualizado em {formatarData(post.atualizadoEm)}</span>
                </>
              )}
            </div>

            <h1 className="mt-4 font-display text-[1.9rem] font-extrabold leading-[1.14] text-white sm:text-4xl lg:text-[2.9rem]">
              {post.titulo}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-brand-100/75">
              {post.resumo}
            </p>

            <p className="mt-6 text-sm text-brand-100/55">Por {post.autor}</p>
          </div>
        </div>
      </section>

      {/* ============================================================ ARTIGO == */}
      <Section tone="light">
        <div className="container-x">
          <div className="mx-auto max-w-3xl">
            {post.capa && (
              <figure className="-mt-2 mb-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.capa.src}
                  alt={post.capa.alt}
                  className="w-full rounded-2xl border border-brand-100"
                />
              </figure>
            )}

            <article>
              <CorpoDoPost blocos={post.blocos} />
            </article>

            {post.tags.length > 0 && (
              <ul className="mt-10 flex flex-wrap gap-2 border-t border-brand-100 pt-6">
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-900/60"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-10 rounded-2xl border border-brand-100 bg-brand-50/50 p-6 sm:p-7">
              <p className="text-sm leading-relaxed text-brand-900/75">
                <strong className="text-brand-950">Este texto é informativo</strong> e não
                substitui a análise do seu caso. Regras de transição e alíquotas podem mudar
                por ato posterior — se a decisão for sua empresa, vale conversar com quem
                acompanha a apuração.
              </p>
              <Link
                href="/contato"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
              >
                Falar com a Deeptax
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* ======================================================== RELACIONADOS == */}
      {relacionados.length > 0 && (
        <Section tone="muted">
          <div className="container-x">
            <h2 className="mb-8 font-display text-xl font-bold text-brand-950">
              Continue lendo
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relacionados.map((p) => (
                <CartaoDePost key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </Section>
      )}

      <CtaSection />
    </>
  );
}
