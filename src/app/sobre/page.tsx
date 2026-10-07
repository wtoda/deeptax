import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/components/CtaSection";
import {
  IconArrowRight,
  IconBuilding,
  IconCheck,
  IconSparkles,
  IconUsers,
  featureIcons,
} from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/ui";
import { services } from "@/lib/services";
import { fullAddress, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre o escritório",
  description:
    "Conheça a Deeptax: um escritório contábil que une rigor técnico, tecnologia e leitura estratégica para apoiar a decisão de empresas de todos os portes.",
  alternates: { canonical: "/sobre" },
};

const values = [
  {
    title: "Técnica antes de opinião",
    description:
      "Toda recomendação que damos é sustentada por norma, dado e simulação. Se não conseguimos fundamentar, não recomendamos.",
  },
  {
    title: "Transparência no escopo",
    description:
      "Você sabe o que está contratando, o que está incluído e quanto custa — antes de assinar, não depois.",
  },
  {
    title: "Proximidade real",
    description:
      "Atendimento por pessoas que conhecem a sua operação, não por robô de triagem. Contador sênior com nome e telefone.",
  },
  {
    title: "Confidencialidade",
    description:
      "Informação contábil é ativo sensível. Tratamos dados em ambiente controlado e sob política de sigilo e LGPD.",
  },
];

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
              Quem somos
            </span>
            <h1 className="mt-6 font-display text-[2.1rem] font-extrabold leading-[1.12] text-white sm:text-4xl lg:text-5xl">
              Um escritório contábil construído sobre método, não sobre improviso
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-100/75 sm:text-lg">
              A {site.name} nasceu de uma constatação simples: a maioria das
              empresas não precisa de mais contabilidade — precisa de contabilidade
              melhor. Feita no prazo, com técnica e, principalmente, com alguém
              capaz de explicar o que os números estão dizendo.
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
                eyebrow="Nossa história"
                title="De escritório de rotina a parceiro de decisão"
              />

              <div className="mt-8 space-y-5 text-base leading-relaxed text-brand-900/70">
                <p>
                  Começamos atendendo pequenas empresas que precisavam,
                  essencialmente, cumprir obrigações. Com o tempo, ficou evidente
                  que o problema dos nossos clientes raramente era a guia do mês —
                  era a ausência de informação confiável para decidir preço,
                  investimento, contratação e crescimento.
                </p>
                <p>
                  A partir disso, reestruturamos o escritório em torno de quatro
                  competências que se reforçam: a contabilidade do dia a dia, que
                  gera o dado; a consultoria, que transforma o dado em decisão; a
                  auditoria, que valida o dado perante terceiros; e a perícia, que
                  defende o dado quando ele vira prova.
                </p>
                <p>
                  Hoje atendemos empresas de comércio, indústria, serviços e
                  tecnologia, em diferentes regimes tributários, com o mesmo
                  compromisso: prazo cumprido, número confiável e uma conversa
                  franca sobre o que faz sentido para o negócio.
                </p>
              </div>
            </div>

            <Reveal delay={120}>
              <div className="space-y-5">
                <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-7">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-brand-950 text-accent-400">
                    <IconBuilding className="size-5" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-brand-950">
                    Nossa missão
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-brand-900/70">
                    Dar a empresários brasileiros clareza, segurança e tempo para
                    cuidar do que realmente move o negócio — enquanto cuidamos do
                    que a legislação exige.
                  </p>
                </div>

                <div className="rounded-2xl border border-brand-100 bg-white p-7 shadow-soft">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                    <IconSparkles className="size-5" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-brand-950">
                    Nosso compromisso
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-brand-900/70">
                    Nunca recomendar um caminho que não defenderíamos tecnicamente
                    diante de uma fiscalização ou de um juízo. Segurança jurídica
                    vem antes de economia aparente.
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
            eyebrow="Como pensamos"
            title="Quatro princípios que orientam cada trabalho"
            description="Não são frases de parede. São critérios que usamos para decidir o que aceitamos fazer e como conduzimos cada contrato."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {values.map((value, index) => (
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
                eyebrow="Nosso time"
                title="Você fala com quem executa"
                description="Sem camadas de atendimento entre você e o técnico responsável. Quem responde a sua dúvida é quem assina o seu balanço."
              />

              <div className="mt-9 space-y-5">
                {[
                  {
                    title: "Contadores com registro ativo no CRC",
                    description:
                      "Responsabilidade técnica formal em todos os trabalhos de contabilidade, auditoria e perícia.",
                  },
                  {
                    title: "Especialistas por frente",
                    description:
                      "Profissionais dedicados a tributário, auditoria e perícia, com atualização constante em normas do CPC e do CFC.",
                  },
                  {
                    title: "Equipe de apoio dedicada",
                    description:
                      "Analistas e assistentes que garantem a rotina mensal dentro do prazo, sem sobrecarregar o contador responsável.",
                  },
                ].map((item) => (
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
                    Dados do escritório
                  </p>
                  <dl className="mt-6 space-y-4">
                    {[
                      { label: "Razão social", value: site.legalName },
                      { label: "CNPJ", value: site.cnpj },
                      { label: "Registro profissional", value: site.crc },
                      { label: "Endereço", value: fullAddress },
                      { label: "Atendimento", value: "Remoto em todo o Brasil e presencial com agendamento" },
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
                    Falar com o escritório
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
            eyebrow="Por que nos escolher"
            title="O que você pode esperar trabalhando com a Deeptax"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {site.differentials.map((item, index) => {
              const Icon = featureIcons[item.icon as keyof typeof featureIcons];
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
            eyebrow="Onde atuamos"
            title="As frentes que o escritório cobre hoje"
            description="Você pode contratar uma frente isolada ou combinar serviços conforme a necessidade da empresa."
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
