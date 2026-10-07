import Link from "next/link";
import { Logo } from "@/components/Logo";
import {
  IconInstagram,
  IconLinkedIn,
  IconMail,
  IconMapPin,
  IconPhone,
  IconWhatsApp,
} from "@/components/Icons";
import { services } from "@/lib/services";
import {
  defaultWhatsappMessage,
  fullAddress,
  site,
  whatsappLink,
} from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink relative overflow-hidden text-white">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />

      <div className="container-x relative py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Marca */}
          <div className="lg:col-span-4">
            <Logo tone="light" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-brand-100/70">
              {site.shortDescription}
            </p>

            <div className="mt-6 flex items-center gap-3">
              {site.social.linkedin && (
                <a
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn da Deeptax"
                  className="flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-brand-100/80 transition-colors hover:border-accent-400/50 hover:text-white"
                >
                  <IconLinkedIn className="size-4" />
                </a>
              )}
              {site.social.instagram && (
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram da Deeptax"
                  className="flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-brand-100/80 transition-colors hover:border-accent-400/50 hover:text-white"
                >
                  <IconInstagram className="size-4" />
                </a>
              )}
              <a
                href={whatsappLink(defaultWhatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp da Deeptax"
                className="flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-brand-100/80 transition-colors hover:border-accent-400/50 hover:text-white"
              >
                <IconWhatsApp className="size-4" />
              </a>
            </div>
          </div>

          {/* Serviços */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">
              Serviços
            </h3>
            <ul className="mt-5 space-y-3">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/servicos/${service.slug}`}
                    className="text-sm text-brand-100/70 transition-colors hover:text-accent-300"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/servicos"
                  className="text-sm font-medium text-accent-300 transition-colors hover:text-accent-200"
                >
                  Ver todos os serviços →
                </Link>
              </li>
            </ul>
          </div>

          {/* Institucional */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">
              Escritório
            </h3>
            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/sobre"
                  className="text-sm text-brand-100/70 transition-colors hover:text-accent-300"
                >
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="text-sm text-brand-100/70 transition-colors hover:text-accent-300"
                >
                  Contato
                </Link>
              </li>
              <li>
                <Link
                  href="/contato#proposta"
                  className="text-sm text-brand-100/70 transition-colors hover:text-accent-300"
                >
                  Solicitar proposta
                </Link>
              </li>
              <li>
                <Link
                  href="/politica-de-privacidade"
                  className="text-sm text-brand-100/70 transition-colors hover:text-accent-300"
                >
                  Privacidade e LGPD
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">
              Fale com a gente
            </h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <a
                  href={`tel:${site.contact.phone.replace(/\D/g, "")}`}
                  className="flex items-start gap-3 text-brand-100/70 transition-colors hover:text-accent-300"
                >
                  <IconPhone className="mt-0.5 size-4 shrink-0 text-accent-400" />
                  {site.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink(defaultWhatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-brand-100/70 transition-colors hover:text-accent-300"
                >
                  <IconWhatsApp className="mt-0.5 size-4 shrink-0 text-accent-400" />
                  {site.contact.whatsapp}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="flex items-start gap-3 text-brand-100/70 transition-colors hover:text-accent-300"
                >
                  <IconMail className="mt-0.5 size-4 shrink-0 text-accent-400" />
                  {site.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-brand-100/70">
                <IconMapPin className="mt-0.5 size-4 shrink-0 text-accent-400" />
                <span>{fullAddress}</span>
              </li>
            </ul>
            <p className="mt-5 text-xs text-brand-100/50">{site.contact.hours}</p>
          </div>
        </div>

        {/* Barra final */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-brand-100/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. Todos os direitos reservados.
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>CNPJ {site.cnpj}</span>
            {site.crc && (
              <>
                <span className="hidden sm:inline text-white/20">•</span>
                <span>{site.crc}</span>
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
