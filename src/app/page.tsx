import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/components/CtaSection";
import {
  IconArrowRight,
  IconCheck,
  IconQuote,
  IconWhatsApp,
  featureIcons,
} from "@/components/Icons";
import { LeadForm } from "@/components/LeadForm";
import { Reveal } from "@/components/Reveal";
import { ServiceCard } from "@/components/ServiceCard";
import { FaqList, Section, SectionHeading } from "@/components/ui";
import { services } from "@/lib/services";
import { defaultWhatsappMessage, site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.shortDescription,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* ============================================================ HERO == */}
      <section className="bg-ink relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
        <div
          className="pointer-events-none absolute -left-32 top-10 size-[30rem] rounded-full bg-accent-500/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-20 bottom-0 size-[24rem] rounded-full bg-brand-500/15 blur-3xl"
          aria-hidden="true"
        />

        <div className="container-x relative py-16 sm:py-20 lg:py-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* Texto */}
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-brand-100/85 backdrop-blur">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-accent-400" />
                </span>
                Contabilidade consultiva para empresas que crescem
              </span>

              <h1 className="mt-7 font-display text-[2.15rem] font-extrabold leading-[1.1] text-white sm:text-5xl lg:text-[3.4rem] lg:leading-[1.06]">
                Seus números explicam o passado.
                <span className="block text-gradient">Nós usamos para decidir o futuro.</span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-relaxed text-brand-100/75 sm:text-lg">
                {site.name} reúne contabilidade, especialistas em tributos,
                tecnologia fiscal, perícia contábil, consultoria e compliance em
                um só lugar. Rigor técnico no que a lei exige, visão estratégica
                no que o seu negócio precisa.
              </p>

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  "Obrigações fiscais sempre em dia",
                  "Planejamento tributário com base em números",
                  "Relatórios gerenciais que orientam decisão",
                  "Atendimento direto com contador sênior",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-500/20 text-accent-300">
                      <IconCheck className="size-3" />
                    </span>
                    <span className="text-sm text-brand-100/80">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="#proposta"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lift transition-all hover:bg-accent-600 active:scale-[0.985]"
                >
                  Quero um diagnóstico gratuito
                  <IconArrowRight className="size-4" />
                </Link>
                <a
                  href={whatsappLink(defaultWhatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all hover:border-white/40 hover:bg-white/10"
                >
                  <IconWhatsApp className="size-4 text-[#25D366]" />
                  Falar no WhatsApp
                </a>
              </div>

              {/* Prova social resumida — só aparece quando há números reais */}
              {site.stats.length > 0 && (
                <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/10 pt-7">
                  {site.stats.slice(0, 3).map((stat) => (
                    <div key={stat.label}>
                      <p className="font-display text-2xl font-bold text-white">{stat.value}</p>
                      <p className="mt-0.5 text-xs text-brand-100/55">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Formulário do hero */}
            <Reveal delay={100}>
              <div className="relative">
                <div
                  className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-accent-500/20 via-transparent to-brand-500/20 blur-2xl"
                  aria-hidden="true"
                />
                <div className="relative rounded-3xl border border-white/10 bg-white p-6 shadow-lift sm:p-8">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                      <IconCheck className="size-5" />
                    </span>
                    <div>
                      <h2 className="font-display text-base font-bold text-brand-950">
                        Fale com um contador especialista
                      </h2>
                      <p className="text-xs text-brand-900/55">
                        Resposta em até 1 dia útil
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <LeadForm compact source="hero-home" />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ====================================================== FAIXA SEGMENTOS */}
      <div className="border-y border-brand-100 bg-brand-50/60">
        <div className="container-x flex flex-col items-center gap-5 py-7 sm:flex-row sm:justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-900/45">
            Atendemos empresas de diversos segmentos
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-brand-900/60">
            {["Comércio", "Indústria", "Serviços", "Tecnologia", "Saúde", "Terceiro setor"].map(
              (segment) => (
                <span key={segment} className="inline-flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-accent-400" />
                  {segment}
                </span>
              ),
            )}
          </div>
        </div>
      </div>

      {/* ========================================================== SERVIÇOS == */}
      <Section id="servicos" tone="light">
        <div className="container-x">
          <SectionHeading
            eyebrow="Nossos serviços"
            title="Seis áreas, uma visão completa do seu negócio"
            description="Cada área resolve um problema diferente — e todas conversam entre si. É assim que a contabilidade deixa de ser obrigação e passa a ser ferramenta de gestão."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Reveal key={service.slug} delay={index * 90}>
                <ServiceCard service={service} index={index} />
              </Reveal>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/servicos"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-950 transition-colors hover:text-accent-600"
            >
              Comparar todos os serviços em detalhe
              <IconArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </Section>

      {/* ======================================================= DIFERENCIAIS == */}
      <Section tone="muted">
        <div className="container-x">
          <SectionHeading
            eyebrow="Por que a Deeptax"
            title="O que muda quando a contabilidade é feita com método"
            description="Não vendemos horas de digitação. Vendemos segurança sobre a informação, prazo cumprido e leitura estratégica do que os números estão dizendo."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {site.differentials.map((item, index) => {
              const Icon = featureIcons[item.icon as keyof typeof featureIcons];
              return (
                <Reveal key={item.title} delay={index * 70}>
                  <div className="h-full rounded-2xl border border-brand-100 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-accent-200 hover:shadow-lift">
                    <span className="flex size-12 items-center justify-center rounded-xl bg-brand-950 text-accent-400">
                      <Icon className="size-6" />
                    </span>
                    <h3 className="mt-5 font-display text-lg font-bold text-brand-950">
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

      {/* ============================================================ NÚMEROS == */}
      {site.stats.length > 0 && (
        <section className="bg-ink relative overflow-hidden py-16">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
          <div className="container-x relative">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {site.stats.map((stat, index) => (
                <Reveal key={stat.label} delay={index * 80}>
                  <div className="text-center lg:text-left">
                    <p className="font-display text-4xl font-extrabold text-white sm:text-5xl">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-sm text-brand-100/60">{stat.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ PROCESSO == */}
      <Section tone="light">
        <div className="container-x">
          <SectionHeading
            eyebrow="Como trabalhamos"
            title="Do primeiro contato ao acompanhamento contínuo"
            description="Um processo claro, com etapas definidas e responsáveis nomeados. Você sempre sabe o que vai acontecer e quando."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-4">
            {site.process.map((item, index) => (
              <Reveal key={item.step} delay={index * 90}>
                <div className="relative h-full">
                  {/* Linha conectora */}
                  {index < site.process.length - 1 && (
                    <span
                      className="absolute left-1/2 top-6 hidden h-px w-full bg-gradient-to-r from-brand-200 to-transparent lg:block"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex h-full flex-col rounded-2xl border border-brand-100 bg-white p-7 shadow-soft">
                    <span className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 font-display text-base font-bold text-white shadow-soft">
                      {item.step}
                    </span>
                    <h3 className="mt-5 font-display text-lg font-bold text-brand-950">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-brand-900/65">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ======================================================== DEPOIMENTOS == */}
      {site.testimonials.length > 0 && (
        <Section tone="muted">
          <div className="container-x">
            <SectionHeading
              eyebrow="Depoimentos"
              title="Resultados que os nossos clientes descrevem"
              description="Trechos de avaliações de clientes das áreas de contabilidade, tributos, consultoria e perícia."
            />

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {site.testimonials.map((item, index) => (
                <Reveal key={item.author + index} delay={index * 90}>
                  <figure className="flex h-full flex-col rounded-2xl border border-brand-100 bg-white p-7 shadow-soft">
                    <IconQuote className="size-7 text-accent-200" />
                    <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-brand-900/75">
                      “{item.quote}”
                    </blockquote>
                    <figcaption className="mt-6 border-t border-brand-100 pt-5">
                      <p className="text-sm font-semibold text-brand-950">{item.author}</p>
                      <p className="mt-0.5 text-xs text-brand-900/55">{item.company}</p>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* =============================================================== FAQ == */}
      <Section tone="light">
        <div className="container-x">
          <SectionHeading
            eyebrow="Dúvidas frequentes"
            title="Perguntas que ouvimos todos os dias"
            description="Se a sua dúvida não estiver aqui, é só perguntar — respondemos sem compromisso."
          />
          <div className="mx-auto mt-12 max-w-3xl">
            <FaqList items={site.faq} />
            <p className="mt-8 text-center text-sm text-brand-900/60">
              Ainda com dúvida?{" "}
              <a
                href={whatsappLink(defaultWhatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-accent-600 underline decoration-accent-300 underline-offset-2 hover:text-accent-700"
              >
                Fale com um contador no WhatsApp
              </a>
            </p>
          </div>
        </div>
      </Section>

      {/* =============================================================== CTA == */}
      <CtaSection source="home-bottom" />
    </>
  );
}
