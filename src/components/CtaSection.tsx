import { LeadForm } from "@/components/LeadForm";
import { Reveal } from "@/components/Reveal";
import {
  IconCheck,
  IconLock,
  IconMail,
  IconPhone,
  IconWhatsApp,
} from "@/components/Icons";
import { paginas } from "@/lib/paginas";
import { defaultWhatsappMessage, site, whatsappLink } from "@/lib/site";

// Os ícones ficam fixos; os textos vêm de content/paginas.json (ctaPadrao).
const iconesDasGarantias = [IconWhatsApp, IconCheck, IconLock];

const garantias = paginas.ctaPadrao.garantias.map((texto, i) => ({
  icon: iconesDasGarantias[i] ?? IconCheck,
  text: texto,
}));

export function CtaSection({
  id = "proposta",
  eyebrow = paginas.ctaPadrao.selo,
  title = paginas.ctaPadrao.titulo,
  description = paginas.ctaPadrao.descricao,
  defaultService = "",
  source = "cta-section",
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  defaultService?: string;
  source?: string;
}) {
  return (
    <section id={id} className="bg-ink relative scroll-mt-24 overflow-hidden py-20 sm:py-24 lg:py-28">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-70" />
      <div
        className="pointer-events-none absolute -right-24 top-1/4 size-[26rem] rounded-full bg-accent-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-x relative">
        <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-16">
          {/* Coluna de texto */}
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent-300">
              <span className="size-1.5 rounded-full bg-accent-400" />
              {eyebrow}
            </span>

            <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl lg:text-[2.6rem] lg:leading-[1.15]">
              {title}
            </h2>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-100/70">
              {description}
            </p>

            <ul className="mt-8 space-y-3.5">
              {garantias.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent-500/15 text-accent-300">
                    <Icon className="size-4" />
                  </span>
                  <span className="text-sm font-medium text-brand-100/85">{text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9 space-y-3 border-t border-white/10 pt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-100/45">
                Ou fale direto com a gente
              </p>

              <a
                href={whatsappLink(defaultWhatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-brand-100/80 transition-colors hover:text-white"
              >
                <span className="flex size-9 items-center justify-center rounded-xl bg-[#25D366]/15 text-[#25D366]">
                  <IconWhatsApp className="size-4" />
                </span>
                {site.contact.whatsapp}
              </a>

              <a
                href={`tel:${site.contact.phone.replace(/\D/g, "")}`}
                className="flex items-center gap-3 text-sm text-brand-100/80 transition-colors hover:text-white"
              >
                <span className="flex size-9 items-center justify-center rounded-xl bg-white/5 text-accent-300">
                  <IconPhone className="size-4" />
                </span>
                {site.contact.phone}
              </a>

              <a
                href={`mailto:${site.contact.email}`}
                className="flex items-center gap-3 text-sm text-brand-100/80 transition-colors hover:text-white"
              >
                <span className="flex size-9 items-center justify-center rounded-xl bg-white/5 text-accent-300">
                  <IconMail className="size-4" />
                </span>
                {site.contact.email}
              </a>
            </div>
          </Reveal>

          {/* Coluna do formulário */}
          <Reveal delay={120}>
            <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-lift sm:p-8">
              <h3 className="font-display text-lg font-bold text-brand-950">
                {paginas.ctaPadrao.tituloFormulario}
              </h3>
              <p className="mt-1.5 text-sm text-brand-900/60">
                {paginas.ctaPadrao.notaFormulario}
              </p>
              <div className="mt-6">
                <LeadForm defaultService={defaultService} source={source} />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
