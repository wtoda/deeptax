import type { Metadata } from "next";
import Link from "next/link";
import { LeadForm } from "@/components/LeadForm";
import {
  IconArrowRight,
  IconCheck,
  IconClock,
  IconMail,
  IconMapPin,
  IconPhone,
  IconWhatsApp,
} from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { FaqList, Section, SectionHeading } from "@/components/ui";
import {
  defaultWhatsappMessage,
  fullAddress,
  site,
  whatsappLink,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Contato e proposta",
  description:
    "Fale com a Deeptax pelo WhatsApp, o canal de atendimento do escritório, ou consulte telefone, e-mail e endereço. Atendimento remoto em todo o Brasil.",
  alternates: { canonical: "/contato" },
};

const channels = [
  {
    icon: IconWhatsApp,
    label: "WhatsApp",
    value: site.contact.whatsapp,
    href: whatsappLink(defaultWhatsappMessage),
    external: true,
    note: "Canal mais rápido",
    highlight: true,
  },
  {
    icon: IconPhone,
    label: "Telefone",
    value: site.contact.phone,
    href: `tel:${site.contact.phone.replace(/\D/g, "")}`,
    external: false,
    note: "Segunda a sexta, 9h às 18h",
  },
  {
    icon: IconMail,
    label: "E-mail",
    value: site.contact.email,
    href: `mailto:${site.contact.email}`,
    external: false,
    note: "Canal institucional — prefira o WhatsApp",
  },
  {
    icon: IconMapPin,
    label: "Escritório",
    value: fullAddress,
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`,
    external: true,
    note: "Visitas com agendamento",
  },
];

export default function ContatoPage() {
  return (
    <>
      {/* ============================================================== HERO == */}
      <section className="bg-ink relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
        <div
          className="pointer-events-none absolute -right-20 -top-20 size-[26rem] rounded-full bg-accent-500/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="container-x relative py-16 sm:py-20 lg:py-24">
          <nav aria-label="Você está aqui" className="mb-8 flex items-center gap-2 text-xs text-brand-100/50">
            <Link href="/" className="transition-colors hover:text-accent-300">
              Início
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-brand-100/80">Contato</span>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent-300">
              <span className="size-1.5 rounded-full bg-accent-400" />
              Contato
            </span>
            <h1 className="mt-6 font-display text-[2.1rem] font-extrabold leading-[1.12] text-white sm:text-4xl lg:text-5xl">
              Vamos conversar sobre o que a sua empresa precisa
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-100/75 sm:text-lg">
              Escolha o canal que preferir. Se quiser uma proposta com escopo e
              honorários, preencha o formulário — o diagnóstico inicial é gratuito
              e sem compromisso.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================== CANAIS == */}
      <Section tone="light" className="pt-16 sm:pt-20">
        <div className="container-x">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((channel, index) => {
              const Icon = channel.icon;
              return (
                <Reveal key={channel.label} delay={index * 70}>
                  <a
                    href={channel.href}
                    {...(channel.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className={`group flex h-full flex-col rounded-2xl border p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift ${
                      channel.highlight
                        ? "border-accent-200 bg-accent-50/50 hover:border-accent-300"
                        : "border-brand-100 bg-white hover:border-accent-200"
                    }`}
                  >
                    <span
                      className={`flex size-11 items-center justify-center rounded-xl ${
                        channel.highlight
                          ? "bg-[#25D366] text-white"
                          : "bg-brand-950 text-accent-400"
                      }`}
                    >
                      <Icon className="size-5" />
                    </span>
                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-900/45">
                      {channel.label}
                    </p>
                    <p className="mt-2 flex-1 text-sm font-semibold leading-snug text-brand-950">
                      {channel.value}
                    </p>
                    <p className="mt-3 text-xs text-brand-900/55">{channel.note}</p>
                  </a>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ======================================================== FORMULÁRIO == */}
      <Section id="proposta" tone="muted" className="scroll-mt-24">
        <div className="container-x">
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            {/* Coluna informativa */}
            <div>
              <SectionHeading
                align="left"
                eyebrow="Solicitar proposta"
                title="Conte seu cenário e receba um escopo sob medida"
                description="Quanto mais contexto você der, mais precisa será a nossa resposta. Nenhuma informação é compartilhada com terceiros."
              />

              <ul className="mt-9 space-y-4">
                {[
                  "Diagnóstico inicial sem custo",
                  "Proposta com escopo, prazos e honorários por escrito",
                  "Contador sênior responsável pelo seu atendimento",
                  "Transição assistida, caso você esteja trocando de escritório",
                  "Sigilo total e conformidade com a LGPD",
                ].map((item) => (
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

              <div className="mt-10 rounded-2xl border border-brand-100 bg-white p-7 shadow-soft">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-brand-950 text-accent-400">
                    <IconClock className="size-5" />
                  </span>
                  <div>
                    <p className="font-display text-base font-bold text-brand-950">
                      Horário de atendimento
                    </p>
                    <p className="text-sm text-brand-900/60">{site.contact.hours}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3 border-t border-brand-100 pt-6 text-sm">
                  <a
                    href={whatsappLink(defaultWhatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-brand-900/75 transition-colors hover:text-accent-600"
                  >
                    <IconWhatsApp className="size-4 text-[#25D366]" />
                    {site.contact.whatsapp}
                  </a>
                  <a
                    href={`mailto:${site.contact.commercialEmail}`}
                    className="flex items-center gap-3 text-brand-900/75 transition-colors hover:text-accent-600"
                  >
                    <IconMail className="size-4 text-brand-400" />
                    {site.contact.commercialEmail}
                  </a>
                  <p className="flex items-start gap-3 text-brand-900/75">
                    <IconMapPin className="mt-0.5 size-4 shrink-0 text-brand-400" />
                    {fullAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Formulário */}
            <Reveal delay={100}>
              <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-lift sm:p-9">
                <h2 className="font-display text-xl font-bold text-brand-950">
                  Formulário de contato
                </h2>
                <p className="mt-2 text-sm text-brand-900/60">
                  Campos marcados com <span className="text-accent-500">*</span> são
                  obrigatórios.
                </p>
                <div className="mt-7">
                  <LeadForm source="pagina-contato" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ================================================================ FAQ == */}
      <Section tone="light">
        <div className="container-x">
          <SectionHeading
            eyebrow="Antes de escrever"
            title="Talvez a sua dúvida já esteja respondida"
          />
          <div className="mx-auto mt-12 max-w-3xl">
            <FaqList items={site.faq} />
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/servicos"
              className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-5 py-3 text-sm font-semibold text-brand-950 shadow-soft transition-all hover:-translate-y-0.5 hover:border-accent-300 hover:text-accent-700"
            >
              Conhecer os serviços em detalhe
              <IconArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
