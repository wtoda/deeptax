import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui";
import { paginas } from "@/lib/paginas";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidade e LGPD",
  description:
    "Como a Deeptax coleta, usa, armazena e protege os dados pessoais informados em nosso site, em conformidade com a Lei Geral de Proteção de Dados.",
  alternates: { canonical: "/politica-de-privacidade" },
  robots: { index: true, follow: true },
};

export default function PoliticaPage() {
  return (
    <>
      <section className="bg-ink relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="container-x relative py-14 sm:py-16 lg:py-20">
          <nav aria-label="Você está aqui" className="mb-7 flex items-center gap-2 text-xs text-brand-100/50">
            <Link href="/" className="transition-colors hover:text-accent-300">
              Início
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-brand-100/80">{paginas.privacidade.hero.selo}</span>
          </nav>
          <h1 className="max-w-3xl font-display text-[2rem] font-extrabold leading-[1.15] text-white sm:text-4xl">
            {paginas.privacidade.hero.titulo}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-brand-100/70">
            {paginas.privacidade.hero.descricao}
          </p>
        </div>
      </section>

      <Section tone="light">
        <div className="container-x">
          <div className="mx-auto max-w-3xl">
            <p className="rounded-2xl border border-brand-100 bg-brand-50/60 px-6 py-5 text-sm leading-relaxed text-brand-900/70">
              {paginas.privacidade.avisoAtualizacao}
            </p>

            <div className="mt-10 space-y-10">
              {paginas.privacidade.blocos.map((block) => (
                <section key={block.title}>
                  <h2 className="font-display text-lg font-bold text-brand-950 sm:text-xl">
                    {block.title}
                  </h2>
                  <div className="mt-4 space-y-3.5">
                    {block.paragraphs.map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-sm leading-relaxed text-brand-900/70"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {block.list && (
                    <ul className="mt-4 space-y-2.5">
                      {block.list.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent-400" />
                          <span className="text-sm leading-relaxed text-brand-900/70">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-brand-100 bg-white p-7 shadow-soft">
              <h2 className="font-display text-lg font-bold text-brand-950">
                {paginas.privacidade.contatoBloco.titulo}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-brand-900/70">
                {paginas.privacidade.contatoBloco.antesWhatsapp}{" "}
                <a
                  href={whatsappLink(
                    "Olá! Gostaria de falar sobre privacidade e proteção de dados (LGPD).",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-accent-600 underline decoration-accent-300 underline-offset-2"
                >
                  {site.contact.whatsapp}
                </a>{" "}
                {paginas.privacidade.contatoBloco.entre}{" "}
                <a
                  href={`mailto:${site.contact.email}`}
                  className="font-semibold text-accent-600 underline decoration-accent-300 underline-offset-2"
                >
                  {site.contact.email}
                </a>
                {paginas.privacidade.contatoBloco.depois}
              </p>
              <Link
                href="/contato"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-900"
              >
                {paginas.privacidade.botao}
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
