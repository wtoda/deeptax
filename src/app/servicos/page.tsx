import type { Metadata } from "next";
import { CtaSection } from "@/components/CtaSection";
import {
  IconArrowRight,
  IconCheck,
  resolverIconeArea,
} from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { ServiceCard } from "@/components/ServiceCard";
import { Section, SectionHeading } from "@/components/ui";
import { services } from "@/lib/services";
import { paginas } from "@/lib/paginas";
import Link from "next/link";

export const metadata: Metadata = {
  title: "As seis áreas da DeepTax: contabilidade, tributos, tecnologia, perícia, consultoria e compliance",
  description:
    "Conheça as seis áreas do escritório: DeepCont (contabilidade), DeepTax (tributário), Deep Systems (tecnologia fiscal), DeepPericia (perícia contábil), DeepConsult (consultoria) e DeepCompliance (compliance). Escopo, metodologia e entregáveis de cada uma.",
  alternates: { canonical: "/servicos" },
};

export default function ServicosPage() {
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
          <nav aria-label="Você está aqui" className="mb-8 flex items-center gap-2 text-xs text-brand-100/50">
            <Link href="/" className="transition-colors hover:text-accent-300">
              Início
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-brand-100/80">Serviços</span>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent-300">
              <span className="size-1.5 rounded-full bg-accent-400" />
              {paginas.servicos.hero.selo}
            </span>
            <h1 className="mt-6 font-display text-[2.1rem] font-extrabold leading-[1.12] text-white sm:text-4xl lg:text-5xl">
              {paginas.servicos.hero.titulo}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-100/75 sm:text-lg">
              {paginas.servicos.hero.descricao}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================== SERVIÇOS == */}
      <Section tone="light">
        <div className="container-x">
          <SectionHeading
            eyebrow={paginas.servicos.secoes.areas.selo}
            title={paginas.servicos.secoes.areas.titulo}
            description={paginas.servicos.secoes.areas.descricao}
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Reveal key={service.slug} delay={index * 80}>
                <ServiceCard service={service} index={index} />
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ==================================================== RESUMO COMPARATIVO */}
      <Section tone="muted">
        <div className="container-x">
          <SectionHeading
            eyebrow={paginas.servicos.secoes.resumo.selo}
            title={paginas.servicos.secoes.resumo.titulo}
            description={paginas.servicos.secoes.resumo.descricao}
          />

          <div className="mt-12 overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-soft">
            <div className="hidden grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] gap-4 border-b border-brand-100 bg-brand-50/60 px-7 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-brand-900/50 lg:grid">
              <span>{paginas.servicos.secoes.resumo.colunaServico}</span>
              <span>{paginas.servicos.secoes.resumo.colunaQuando}</span>
            </div>

            <div className="divide-y divide-brand-100">
              {services.map((service) => {
                const Icon = resolverIconeArea(service.icon);
                return (
                  <div
                    key={service.slug}
                    className="grid gap-4 px-7 py-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] lg:items-center"
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${service.accent} text-white`}
                      >
                        <Icon className="size-5" />
                      </span>
                      <div>
                        <p className="font-display text-base font-bold text-brand-950">
                          {service.name}
                        </p>
                        <p className="text-xs text-accent-600">{service.tagline}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm leading-relaxed text-brand-900/65">
                        {service.audience.lead}
                      </p>
                      <Link
                        href={`/servicos/${service.slug}`}
                        className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-brand-200 px-4 py-2.5 text-sm font-semibold text-brand-950 transition-colors hover:border-accent-300 hover:bg-accent-50/60 hover:text-accent-700"
                      >
                        {paginas.servicos.secoes.resumo.botaoDetalhes}
                        <IconArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      {/* ================================================== COMBINAÇÕES COMUNS */}
      <Section tone="light">
        <div className="container-x">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading
                align="left"
                eyebrow={paginas.servicos.secoes.combinacoes.selo}
                title={paginas.servicos.secoes.combinacoes.titulo}
                description={paginas.servicos.secoes.combinacoes.descricao}
              />

              <div className="mt-9 space-y-4">
                {paginas.servicos.secoes.combinacoes.itens.map((combo) => (
                  <div
                    key={combo.title}
                    className="flex gap-4 rounded-2xl border border-brand-100 bg-white p-6 shadow-soft"
                  >
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-600">
                      <IconCheck className="size-3.5" />
                    </span>
                    <div>
                      <p className="font-display text-base font-bold text-brand-950">
                        {combo.title}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-brand-900/65">
                        {combo.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Reveal delay={120}>
              <div className="bg-ink relative overflow-hidden rounded-3xl p-8 shadow-lift sm:p-10">
                <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
                <div className="relative">
                  <h3 className="font-display text-2xl font-bold text-white">
                    {paginas.servicos.ajuda.titulo}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-brand-100/75">
                    {paginas.servicos.ajuda.descricao}
                  </p>

                  <ul className="mt-7 space-y-3">
                    {paginas.servicos.ajuda.itens.map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-500/20 text-accent-300">
                          <IconCheck className="size-3" />
                        </span>
                        <span className="text-sm text-brand-100/80">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contato#proposta"
                    className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:bg-accent-600"
                  >
                    {paginas.servicos.ajuda.botao}
                    <IconArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      <CtaSection
        source="servicos-index"
        title={paginas.servicos.cta.titulo}
        description={paginas.servicos.cta.descricao}
      />
    </>
  );
}
