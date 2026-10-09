import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/components/CtaSection";
import {
  IconArrowRight,
  IconBuilding,
  IconCheck,
  IconSparkles,
  IconUsers,
  resolverIconeDiferencial,
} from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/ui";
import { services } from "@/lib/services";
import { paginas } from "@/lib/paginas";
import { fullAddress, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre o escritório",
  description:
    "Conheça a Deeptax: um escritório contábil que une rigor técnico, tecnologia e leitura estratégica para apoiar a decisão de empresas de todos os portes.",
  alternates: { canonical: "/sobre" },
};

export default function SobrePage() {
  return (
    <>
      {/* ============================================================== HERO == */}
      <section className="bg-ink relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
        <div
          className="pointer-events-none absolute -left-24 top-0 size-[26rem] rounded-full bg-accent-500/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="container-x relative py-16 sm:py-20 lg:py-24">
          <nav aria-label="Você está aqui" className="mb-8 flex items-center gap-2 text-xs text-brand-100/50">
            <Link href="/" className="transition-colors hover:text-accent-300">
              Início
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-brand-100/80">Sobre</span>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent-300">
              <span className="size-1.5 rounded-full bg-accent-400" />
              {paginas.sobre.hero.selo}
            </span>
            <h1 className="mt-6 font-display text-[2.1rem] font-extrabold leading-[1.12] text-white sm:text-4xl lg:text-5xl">
              {paginas.sobre.hero.titulo}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-100/75 sm:text-lg">
              {paginas.sobre.hero.descricao}
            </p>
          </div>

          {site.stats.length > 0 && (
            <div className="mt-14 grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
              {site.stats.map((stat, index) => (
                <Reveal key={stat.label} delay={index * 70}>
                  <div>
                    <p className="font-display text-3xl font-extrabold text-white sm:text-4xl">
                      {stat.value}
                    </p>
                    <p className="mt-1.5 text-sm text-brand-100/60">{stat.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ HISTÓRIA */}
      <Section tone="light">
        <div className="container-x">
          <div className="grid gap-14 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
            <div>
              <SectionHeading
                align="left"
                eyebrow={paginas.sobre.historia.selo}
                title={paginas.sobre.historia.titulo}
              />

              <div className="mt-8 space-y-5 text-base leading-relaxed text-brand-900/70">
                {paginas.sobre.historia.paragrafos.map((paragrafo, i) => (
                  <p key={i}>{paragrafo}</p>
                ))}
              </div>
            </div>

            <Reveal delay={120}>
              <div className="space-y-5">
                <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-7">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-brand-950 text-accent-400">
                    <IconBuilding className="size-5" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-brand-950">
                    {paginas.sobre.historia.missaoTitulo}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-brand-900/70">
                    {paginas.sobre.historia.missao}
                  </p>
                </div>

                <div className="rounded-2xl border border-brand-100 bg-white p-7 shadow-soft">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                    <IconSparkles className="size-5" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-brand-950">
                    {paginas.sobre.historia.compromissoTitulo}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-brand-900/70">
                    {paginas.sobre.historia.compromisso}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ============================================================= VALORES */}
      <Section tone="muted">
        <div className="container-x">
          <SectionHeading
            eyebrow={paginas.sobre.valores.selo}
            title={paginas.sobre.valores.titulo}
            description={paginas.sobre.valores.descricao}
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {paginas.sobre.valores.itens.map((value, index) => (
              <Reveal key={value.title} delay={index * 80}>
                <div className="flex h-full gap-5 rounded-2xl border border-brand-100 bg-white p-7 shadow-soft">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-600">
                    <IconCheck className="size-3.5" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-brand-950">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand-900/65">
                      {value.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* =============================================================== TIME == */}
      <Section tone="light">
        <div className="container-x">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <SectionHeading
                align="left"
                eyebrow={paginas.sobre.time.selo}
                title={paginas.sobre.time.titulo}
                description={paginas.sobre.time.descricao}
              />

              <div className="mt-9 space-y-5">
                {paginas.sobre.time.itens.map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-950 text-accent-400">
                      <IconUsers className="size-5" />
                    </span>
                    <div>
                      <p className="font-display text-base font-bold text-brand-950">
                        {item.title}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-brand-900/65">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Reveal delay={120}>
              <div className="bg-ink relative overflow-hidden rounded-3xl p-8 sm:p-10">
                <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
                <div className="relative">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-300">
                    {paginas.sobre.time.dadosTitulo}
                  </p>
                  <dl className="mt-6 space-y-4">
                    {[
                      { label: "Razão social", value: site.legalName },
                      { label: "Nome fantasia", value: site.tradeName },
                      { label: "CNPJ", value: site.cnpj },
                      { label: "Registro profissional", value: site.crc },
                      { label: "Endereço", value: fullAddress },
                      { label: "Atendimento", value: paginas.sobre.time.atendimento },
                    ]
                      .filter((row) => Boolean(row.value))
                      .map((row) => (
                        <div
                          key={row.label}
                          className="border-b border-white/10 pb-4 last:border-0 last:pb-0"
                        >
                          <dt className="text-xs text-brand-100/50">{row.label}</dt>
                          <dd className="mt-1 text-sm font-medium text-white">
                            {row.value}
                          </dd>
                        </div>
                      ))}
                  </dl>

                  <Link
                    href="/contato#proposta"
                    className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-600"
                  >
                    {paginas.sobre.time.botao}
                    <IconArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ========================================================= COMO AGIMOS */}
      <Section tone="muted">
        <div className="container-x">
          <SectionHeading
            eyebrow={paginas.sobre.porQue.selo}
            title={paginas.sobre.porQue.titulo}
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {site.differentials.map((item, index) => {
              const Icon = resolverIconeDiferencial(item.icon);
              return (
                <Reveal key={item.title} delay={index * 70}>
                  <div className="h-full rounded-2xl border border-brand-100 bg-white p-7 shadow-soft">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-brand-950 text-accent-400">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-5 font-display text-base font-bold text-brand-950">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-brand-900/65">
                      {item.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ========================================================== SERVIÇOS == */}
      <Section tone="light">
        <div className="container-x">
          <SectionHeading
            eyebrow={paginas.sobre.ondeAtuamos.selo}
            title={paginas.sobre.ondeAtuamos.titulo}
            description={paginas.sobre.ondeAtuamos.descricao}
          />
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/servicos/${service.slug}`}
                className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-5 py-3 text-sm font-semibold text-brand-950 shadow-soft transition-all hover:-translate-y-0.5 hover:border-accent-300 hover:text-accent-700"
              >
                {service.name}
                <IconArrowRight className="size-3.5" />
              </Link>
            ))}
          </div>
        </div>
      </Section>

      <CtaSection
        source="sobre"
        title="Quer conhecer o escritório antes de decidir?"
        description="Agende uma conversa de 30 minutos. Apresentamos como trabalhamos, tiramos suas dúvidas e avaliamos se faz sentido caminharmos juntos."
      />
    </>
  );
}
