import Link from "next/link";
import { IconArrowRight, IconWhatsApp } from "@/components/Icons";
import { services } from "@/lib/services";
import { defaultWhatsappMessage, whatsappLink } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="bg-ink relative flex min-h-[70vh] items-center overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
      <div
        className="pointer-events-none absolute -right-20 top-10 size-[24rem] rounded-full bg-accent-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-x relative py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-6xl font-extrabold text-accent-500 sm:text-8xl">
            404
          </p>
          <h1 className="mt-6 font-display text-2xl font-bold text-white sm:text-3xl">
            Não encontramos esta página
          </h1>
          <p className="mt-4 text-base leading-relaxed text-brand-100/70">
            O endereço pode ter mudado ou sido digitado incorretamente. Mas não
            perca o foco: escolha um caminho abaixo e continue de onde parou.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lift transition-all hover:bg-accent-600 sm:w-auto"
            >
              Voltar para a página inicial
              <IconArrowRight className="size-4" />
            </Link>
            <a
              href={whatsappLink(defaultWhatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all hover:border-white/40 hover:bg-white/10 sm:w-auto"
            >
              <IconWhatsApp className="size-4 text-[#25D366]" />
              Falar no WhatsApp
            </a>
          </div>

          <div className="mt-12 border-t border-white/10 pt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-100/45">
              Serviços
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2.5">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/servicos/${service.slug}`}
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-brand-100/85 transition-colors hover:border-accent-400/40 hover:text-white"
                >
                  {service.shortName}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
