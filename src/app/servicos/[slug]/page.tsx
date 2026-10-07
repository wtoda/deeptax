import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaSection } from "@/components/CtaSection";
import {
  IconArrowRight,
  IconCheck,
  IconFileText,
  IconWhatsApp,
  serviceIcons,
} from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { FaqList, Section, SectionHeading } from "@/components/ui";
import { getService, services } from "@/lib/services";
import { site, whatsappLink } from "@/lib/site";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    return { title: "Serviço não encontrado" };
  }

  return {
    title: service.seo.title,
    description: service.seo.description,
    keywords: [...service.seo.keywords],
    alternates: { canonical: `/servicos/${service.slug}` },
    openGraph: {
      type: "article",
      title: `${service.seo.title} | ${site.name}`,
      description: service.seo.description,
      url: `${site.url}/servicos/${service.slug}`,
    },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) notFound();

  const Icon = serviceIcons[service.icon];
  const others = services.filter((item) => item.slug !== service.slug);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    serviceType: service.name,
    description: service.seo.description,
    provider: {
      "@type": "AccountingService",
      name: site.name,
      url: site.url,
      telephone: site.contact.phone,
    },
    areaServed: { "@type": "Country", name: "Brasil" },
  };

  return (
    <>
      {/* ============================================================== HERO == */}
      <section className="bg-ink relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
        <div
          className={`pointer-events-none absolute -right-24 -top-24 size-[30rem] rounded-full bg-gradient-to-br ${service.accent} opacity-20 blur-3xl`}
          aria-hidden="true"
        />

        <div className="container-x relative py-16 sm:py-20 lg:py-24">
          <nav aria-label="Você está aqui" className="mb-8 flex flex-wrap items-center gap-2 text-xs text-brand-100/50">
            <Link href="/" className="transition-colors hover:text-accent-300">
              Início
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/servicos" className="transition-colors hover:text-accent-300">
              Serviços
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-brand-100/80">{service.name}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent-300">
                <Icon className="size-3.5" />
                {service.hero.eyebrow}
              </span>

              <h1 className="mt-6 font-display text-[2rem] font-extrabold leading-[1.12] text-white sm:text-4xl lg:text-[3rem] lg:leading-[1.08]">
                {service.hero.title}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-100/75 sm:text-lg">
                {service.hero.subtitle}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="#proposta"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lift transition-all hover:bg-accent-600 active:scale-[0.985]"
                >
                  Solicitar proposta
                  <IconArrowRight className="size-4" />
                </Link>
                <a
                  href={whatsappLink(
                    `Olá! Gostaria de falar sobre ${service.name} com a ${site.name}.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all hover:border-white/40 hover:bg-white/10"
                >
                  <IconWhatsApp className="size-4 text-[#25D366]" />
                  Tirar uma dúvida
                </a>
              </div>
            </div>

            {/* Destaques do serviço */}
            <Reveal delay={100}>
              <div className="glass rounded-3xl p-7 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-300">
                  O que está incluído
                </p>
                <ul className="mt-5 space-y-3.5">
                  {service.hero.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-500/20 text-accent-300">
                        <IconCheck className="size-3" />
                      </span>
                      <span className="text-sm leading-relaxed text-brand-100/85">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 border-t border-white/10 pt-6">
                  <p className="text-sm text-brand-100/60">
                    Atendimento remoto em todo o Brasil e presencial em{" "}
                    {site.contact.address.city}/{site.contact.address.state}.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================= INTRO == */}
      <Section tone="light">
        <div className="container-x">
          {/* min-w-0 é necessário: sem isso, o texto com `truncate` no aside
              impõe uma largura mínima à coluna do grid e a página rola na
              horizontal no mobile. */}
          <div className="grid gap-14 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16">
            <div className="min-w-0">
              <h2 className="font-display text-2xl font-bold text-brand-950 sm:text-3xl">
                {service.intro.title}
              </h2>
              <div className="mt-6 space-y-5">
                {service.intro.paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-base leading-relaxed text-brand-900/70"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Outros serviços */}
            <aside className="min-w-0 lg:sticky lg:top-32 lg:self-start">
              <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-900/45">
                  Outros serviços
                </p>
                <div className="mt-4 space-y-2">
                  {others.map((item) => {
                    const OtherIcon = serviceIcons[item.icon];
                    return (
                      <Link
                        key={item.slug}
                        href={`/servicos/${item.slug}`}
                        className="group flex items-center gap-3 rounded-xl border border-transparent bg-white p-3.5 shadow-soft transition-all hover:border-accent-200 hover:shadow-lift"
                      >
                        <span
                          className={`flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${item.accent} text-white`}
                        >
                          <OtherIcon className="size-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-brand-950">
                            {item.shortName}
                          </span>
                          <span className="block truncate text-xs text-brand-900/55">
                            {item.tagline}
                          </span>
                        </span>
                        <IconArrowRight className="size-4 shrink-0 text-brand-300 transition-all group-hover:translate-x-0.5 group-hover:text-accent-500" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </Section>

      {/* ============================================================ PÚBLICO == */}
      <Section tone="muted">
        <div className="container-x">
          <SectionHeading
            eyebrow="Para quem é"
            title={service.audience.title}
            description={service.audience.lead}
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {service.audience.items.map((item, index) => (
              <Reveal key={item.title} delay={index * 80}>
                <div className="flex h-full gap-5 rounded-2xl border border-brand-100 bg-white p-7 shadow-soft">
                  <span
                    className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${service.accent} text-white`}
                  >
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-brand-950">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand-900/65">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ============================================================== ESCOPO */}
      <Section tone="light">
        <div className="container-x">
          <SectionHeading
            eyebrow="Escopo detalhado"
            title="Exatamente o que fazemos neste serviço"
            description="Transparência desde a proposta: você sabe quais procedimentos serão executados, sem zona cinzenta."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {service.scope.map((block, index) => (
              <Reveal key={block.title} delay={index * 70}>
                <div className="flex h-full flex-col rounded-2xl border border-brand-100 bg-white p-7 shadow-soft">
                  <h3 className="font-display text-lg font-bold text-brand-950">
                    {block.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-brand-900/60">
                    {block.description}
                  </p>
                  <ul className="mt-6 space-y-2.5 border-t border-brand-100 pt-6">
                    {block.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="mt-1 size-1.5 shrink-0 rounded-full bg-accent-400" />
                        <span className="text-sm leading-relaxed text-brand-900/75">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ======================================================== METODOLOGIA == */}
      <section className="bg-ink relative overflow-hidden py-20 sm:py-24 lg:py-28">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="container-x relative">
          <SectionHeading
            tone="dark"
            eyebrow="Metodologia"
            title="Como conduzimos o trabalho, etapa por etapa"
            description="Um processo estruturado reduz risco, encurta prazo e garante que nada relevante fique de fora."
          />

          <div className="mt-16 space-y-4">
            {service.methodology.map((step, index) => (
              <Reveal key={step.step} delay={index * 70}>
                <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition-colors hover:border-accent-400/30 sm:flex-row sm:items-start sm:gap-7 sm:p-7">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 font-display text-base font-bold text-white">
                    {step.step}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-bold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-brand-100/70">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= ENTREGÁVEIS */}
      <Section tone="light">
        <div className="container-x">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Entregáveis"
                title="O que você recebe ao final do trabalho"
                description="Documentos concretos, organizados e prontos para uso com sócios, bancos, investidores ou no processo judicial."
              />

              <ul className="mt-9 space-y-4">
                {service.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-3.5">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                      <IconCheck className="size-3.5" />
                    </span>
                    <span className="text-sm leading-relaxed text-brand-900/75">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Reveal delay={120}>
              <div className="rounded-3xl border border-brand-100 bg-brand-50/60 p-8 sm:p-9">
                <span className="flex size-12 items-center justify-center rounded-xl bg-brand-950 text-accent-400">
                  <IconFileText className="size-6" />
                </span>
                <h3 className="mt-6 font-display text-xl font-bold text-brand-950">
                  Precisa adequar o escopo ao seu caso?
                </h3>
                <p className="mt-3.5 text-sm leading-relaxed text-brand-900/65">
                  Todo trabalho é dimensionado ao porte, ao setor e ao prazo da sua
                  empresa. Na primeira conversa definimos juntos o que entra e o que
                  fica para uma segunda etapa, com honorários proporcionais.
                </p>

                <div className="mt-7 space-y-3">
                  {[
                    "Proposta com escopo e prazos por escrito",
                    "Honorários definidos antes de começar",
                    "Contador responsável nomeado para o seu caso",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-500/15 text-accent-600">
                        <IconCheck className="size-3" />
                      </span>
                      <span className="text-sm text-brand-900/70">{item}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="#proposta"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-950 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-900"
                >
                  Solicitar proposta deste serviço
                  <IconArrowRight className="size-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* =============================================================== FAQ == */}
      <Section tone="muted">
        <div className="container-x">
          <SectionHeading
            eyebrow="Dúvidas frequentes"
            title={`Perguntas sobre ${service.shortName.toLowerCase()}`}
            description="As respostas para o que mais nos perguntam antes de fechar um trabalho."
          />
          <div className="mx-auto mt-12 max-w-3xl">
            <FaqList items={service.faq} />
          </div>
        </div>
      </Section>

      {/* =============================================================== CTA == */}
      <CtaSection
        source={`servico-${service.slug}`}
        defaultService={service.name}
        eyebrow={service.name}
        title={service.cta.title}
        description={service.cta.description}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
