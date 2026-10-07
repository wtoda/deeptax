import type { Metadata } from "next";
import { CtaSection } from "@/components/CtaSection";
import { IconArrowRight, IconCheck, serviceIcons } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { ServiceCard } from "@/components/ServiceCard";
import { Section, SectionHeading } from "@/components/ui";
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Serviços de Contabilidade, Auditoria, Consultoria e Perícia",
  description:
    "Conheça as quatro frentes de atuação da Deeptax: serviços contábeis, auditoria contábil, consultoria tributária e perícia contábil. Escopo, metodologia e entregáveis de cada serviço.",
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
              Serviços
            </span>
            <h1 className="mt-6 font-display text-[2.1rem] font-extrabold leading-[1.12] text-white sm:text-4xl lg:text-5xl">
              Toda a estrutura contábil da sua empresa em um único escritório
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-100/75 sm:text-lg">
              Contabilidade do dia a dia, auditoria independente, consultoria
              tributária e perícia contábil. Escopos distintos, o mesmo padrão
              técnico — e a liberdade de contratar só o que a sua empresa precisa
              agora.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================== SERVIÇOS == */}
      <Section tone="light">
        <div className="container-x">
          <SectionHeading
            eyebrow="Frentes de atuação"
            title="Escolha por onde começar"
            description="Cada frente tem página própria com escopo detalhado, metodologia em etapas, entregáveis e perguntas frequentes."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
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
            eyebrow="Visão rápida"
            title="O que cada serviço entrega, em uma linha"
            description="Se ainda não sabe qual frente procura, este resumo ajuda a identificar o ponto de partida."
          />

          <div className="mt-12 overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-soft">
            <div className="hidden grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] gap-4 border-b border-brand-100 bg-brand-50/60 px-7 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-brand-900/50 lg:grid">
              <span>Serviço</span>
              <span>Quando faz sentido contratar</span>
            </div>

            <div className="divide-y divide-brand-100">
              {services.map((service) => {
                const Icon = serviceIcons[service.icon];
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
                        Detalhes
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
                eyebrow="Combinações que funcionam"
                title="Na prática, os serviços se complementam"
                description="A maioria dos nossos clientes começa por um serviço e amplia o escopo conforme a empresa evolui. Alguns arranjos são especialmente comuns."
              />

              <div className="mt-9 space-y-4">
                {[
                  {
                    title: "Contabilidade + Consultoria",
                    description:
                      "O arranjo mais frequente: a rotina fiscal em dia somada ao planejamento tributário e aos relatórios gerenciais mensais.",
                  },
                  {
                    title: "Auditoria + Consultoria",
                    description:
                      "Indicado antes de captar crédito, receber investidor ou reorganizar o grupo. A auditoria revela; a consultoria corrige e projeta.",
                  },
                  {
                    title: "Perícia + Auditoria",
                    description:
                      "Em disputas societárias, a mesma competência técnica que examina demonstrações sustenta a apuração de haveres.",
                  },
                ].map((combo) => (
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
                    Não sabe qual serviço precisa?
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-brand-100/75">
                    Conte o seu cenário em uma conversa de 30 minutos. Avaliamos a
                    situação atual e indicamos exatamente qual frente resolve o seu
                    problema — mesmo que a resposta seja que você não precisa
                    contratar nada agora.
                  </p>

                  <ul className="mt-7 space-y-3">
                    {[
                      "Diagnóstico sem custo e sem compromisso",
                      "Escopo e honorário por escrito",
                      "Atendimento remoto ou presencial com agendamento",
                    ].map((item) => (
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
                    Solicitar diagnóstico
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
        title={`Fale com a ${site.name} e receba um escopo sob medida`}
        description="Descreva o que a sua empresa precisa e devolvemos uma proposta com escopo, entregáveis, prazos e honorários definidos por escrito."
      />
    </>
  );
}
