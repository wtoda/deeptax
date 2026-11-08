import type { Metadata } from "next";
import Link from "next/link";
import { CartaoDePost } from "@/components/blog/CartaoDePost";
import { CtaSection } from "@/components/CtaSection";
import { IconArrowRight } from "@/components/Icons";
import { Section } from "@/components/ui";
import { blogTemPosts, posts, tagsEmUso } from "@/lib/blog";
import { imagemSocial, site } from "@/lib/site";

const DESCRICAO =
  "Artigos da Deeptax sobre reforma tributária, IBS e CBS, apuração, créditos fiscais, " +
  "folha de pagamento e gestão contábil — escritos por quem faz a apuração todos os meses.";

export const metadata: Metadata = {
  // Até ~50 caracteres: o layout soma " | Deeptax" e o Google corta ~60.
  title: "Blog: tributos, contabilidade e reforma na prática",
  description: DESCRICAO,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: `${site.url}/blog`,
    title: "Blog da Deeptax",
    description: DESCRICAO,
    images: [imagemSocial],
  },
  // Um blog sem posts é uma página vazia — não deve ser indexada nem entrar no
  // sitemap. Passa a ser indexável no instante em que o primeiro post é
  // publicado.
  robots: blogTemPosts ? { index: true, follow: true } : { index: false, follow: true },
};

export default function BlogPage() {
  const tags = tagsEmUso();

  return (
    <>
      {/* ============================================================== HERO == */}
      <section className="bg-ink relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
        <div
          className="pointer-events-none absolute -right-24 -top-16 size-[28rem] rounded-full bg-accent-500/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="container-x relative py-16 sm:py-20 lg:py-24">
          <nav
            aria-label="Você está aqui"
            className="mb-8 flex items-center gap-2 text-xs text-brand-100/50"
          >
            <Link href="/" className="transition-colors hover:text-accent-300">
              Início
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-brand-100/80">Blog</span>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent-300">
              <span className="size-1.5 rounded-full bg-accent-400" />
              Blog
            </span>
            <h1 className="mt-6 font-display text-[2.1rem] font-extrabold leading-[1.12] text-white sm:text-4xl lg:text-5xl">
              O que muda na prática, escrito por quem apura
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-100/75 sm:text-lg">
              {DESCRICAO}
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================= POSTS == */}
      <Section tone="light">
        <div className="container-x">
          {blogTemPosts ? (
            <>
              <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-brand-100 pb-6">
                <h2 className="font-display text-xl font-bold text-brand-950">
                  {posts.length === 1 ? "1 artigo publicado" : `${posts.length} artigos publicados`}
                </h2>
                {tags.length > 0 && (
                  <p className="text-sm text-brand-900/55">
                    Temas: {tags.map((t) => t.tag).join(" · ")}
                  </p>
                )}
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <CartaoDePost key={post.slug} post={post} />
                ))}
              </div>
            </>
          ) : (
            <div className="mx-auto max-w-2xl rounded-2xl border border-brand-100 bg-white p-8 text-center sm:p-12">
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-brand-50 text-xl text-accent-600">
                ✎
              </span>
              <h2 className="mt-5 font-display text-xl font-bold text-brand-950">
                Os primeiros artigos estão sendo escritos
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-brand-900/65">
                Este espaço reúne textos sobre a reforma tributária, a rotina de apuração e
                as decisões que aparecem na contabilidade do mês. Se a sua dúvida é para
                agora, fale com a gente — respondemos sem compromisso.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link
                  href="/contato"
                  className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
                >
                  Falar com o escritório
                  <IconArrowRight className="size-4" />
                </Link>
                <Link
                  href="/reforma-tributaria/"
                  className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-5 py-2.5 text-sm font-semibold text-brand-900 transition-colors hover:bg-brand-50"
                >
                  Portal da Reforma Tributária
                </Link>
              </div>
            </div>
          )}
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
