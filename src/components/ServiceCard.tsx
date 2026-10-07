import Link from "next/link";
import { IconArrowRight, serviceIcons } from "@/components/Icons";
import type { ServiceContent } from "@/lib/services";

export function ServiceCard({
  service,
  index = 0,
}: {
  service: ServiceContent;
  index?: number;
}) {
  const Icon = serviceIcons[service.icon];

  return (
    <Link
      href={`/servicos/${service.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-brand-100 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-accent-200 hover:shadow-lift"
    >
      {/* Brilho no hover */}
      <span
        className={`pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-gradient-to-br ${service.accent} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-15`}
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between">
        <span
          className={`flex size-13 items-center justify-center rounded-xl bg-gradient-to-br ${service.accent} text-white shadow-soft transition-transform duration-300 group-hover:scale-105`}
        >
          <Icon className="size-6" />
        </span>
        <span className="font-display text-4xl font-bold text-brand-100 transition-colors duration-300 group-hover:text-accent-100">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <h3 className="relative mt-6 font-display text-xl font-bold text-brand-950">
        {service.name}
      </h3>

      <p className="relative mt-1.5 text-sm font-medium text-accent-600">
        {service.tagline}
      </p>

      <p className="relative mt-4 flex-1 text-sm leading-relaxed text-brand-900/65">
        {service.summary}
      </p>

      <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-950 transition-colors group-hover:text-accent-600">
        Conhecer o serviço
        <IconArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
