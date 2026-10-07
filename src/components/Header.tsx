"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import {
  IconChevronDown,
  IconMail,
  IconMenu,
  IconPhone,
  IconWhatsApp,
  IconX,
  serviceIcons,
} from "@/components/Icons";
import { services } from "@/lib/services";
import { defaultWhatsappMessage, site, whatsappLink } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fecha os menus a cada mudança de rota.
  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  // Bloqueia o scroll do body com o menu mobile aberto.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setServicesOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const openServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const scheduleCloseServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setServicesOpen(false), 160);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Faixa superior com contatos */}
      <div className="hidden bg-brand-950 lg:block">
        <div className="container-x flex h-9 items-center justify-between text-xs text-brand-100/70">
          <div className="flex items-center gap-6">
            <a
              href={`tel:${site.contact.phone.replace(/\D/g, "")}`}
              className="inline-flex items-center gap-2 transition-colors hover:text-white"
            >
              <IconPhone className="size-3.5" />
              {site.contact.phone}
            </a>
            <a
              href={`mailto:${site.contact.email}`}
              className="inline-flex items-center gap-2 transition-colors hover:text-white"
            >
              <IconMail className="size-3.5" />
              {site.contact.email}
            </a>
          </div>
          <div className="flex items-center gap-6">
            <span>{site.contact.hours}</span>
            {site.crc && (
              <>
                <span className="text-brand-100/40">|</span>
                <span>{site.crc}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navegação principal */}
      <div
        className={`border-b transition-all duration-300 ${
          scrolled
            ? "border-brand-100 bg-white/85 shadow-soft backdrop-blur-xl"
            : "border-transparent bg-white/70 backdrop-blur-md"
        }`}
      >
        <nav className="container-x flex h-[4.5rem] items-center justify-between gap-6">
          <Logo />

          {/* Desktop */}
          <div className="hidden items-center gap-1 lg:flex">
            <NavLink href="/" active={isActive("/")}>
              Início
            </NavLink>

            <div
              className="relative"
              onMouseEnter={openServices}
              onMouseLeave={scheduleCloseServices}
            >
              <button
                type="button"
                onClick={() => setServicesOpen((v) => !v)}
                aria-expanded={servicesOpen}
                aria-haspopup="true"
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive("/servicos")
                    ? "text-accent-600"
                    : "text-brand-900/75 hover:text-brand-950"
                }`}
              >
                Serviços
                <IconChevronDown
                  className={`size-3.5 transition-transform duration-200 ${
                    servicesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`absolute left-1/2 top-full w-[34rem] -translate-x-1/2 pt-3 transition-all duration-200 ${
                  servicesOpen
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-1 opacity-0"
                }`}
              >
                <div className="overflow-hidden rounded-2xl border border-brand-100 bg-white p-2.5 shadow-lift">
                  <div className="grid grid-cols-2 gap-1">
                    {services.map((service) => {
                      const Icon = serviceIcons[service.icon];
                      return (
                        <Link
                          key={service.slug}
                          href={`/servicos/${service.slug}`}
                          className="group flex gap-3 rounded-xl p-3 transition-colors hover:bg-brand-50"
                        >
                          <span
                            className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${service.accent} text-white`}
                          >
                            <Icon className="size-4.5" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-brand-950">
                              {service.shortName}
                            </span>
                            <span className="mt-0.5 block text-xs leading-snug text-brand-900/55">
                              {service.tagline}
                            </span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                  <Link
                    href="/servicos"
                    className="mt-1 flex items-center justify-between rounded-xl bg-brand-50/70 px-3.5 py-3 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100/70"
                  >
                    Ver todos os serviços
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>

            <NavLink href="/sobre" active={isActive("/sobre")}>
              Sobre
            </NavLink>
            <NavLink href="/contato" active={isActive("/contato")}>
              Contato
            </NavLink>
          </div>

          <div className="hidden items-center gap-2.5 lg:flex">
            <a
              href={whatsappLink(defaultWhatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-brand-200 px-3.5 py-2.5 text-sm font-semibold text-brand-900 transition-colors hover:border-accent-300 hover:bg-accent-50/60 hover:text-accent-700"
            >
              <IconWhatsApp className="size-4 text-[#25D366]" />
              WhatsApp
            </a>
            <Link
              href="/contato#proposta"
              className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-accent-600 hover:shadow-lift"
            >
              Solicitar proposta
            </Link>
          </div>

          {/* Botão mobile */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menu"
            className="inline-flex size-10 items-center justify-center rounded-xl border border-brand-200 text-brand-900 transition-colors hover:bg-brand-50 lg:hidden"
          >
            <IconMenu className="size-5" />
          </button>
        </nav>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-brand-950/50 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-brand-100 px-5 py-4">
              <Logo />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Fechar menu"
                className="inline-flex size-10 items-center justify-center rounded-xl border border-brand-200 text-brand-900"
              >
                <IconX className="size-5" />
              </button>
            </div>

            <div className="flex-1 px-5 py-5">
              <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-900/40">
                Navegação
              </p>
              <div className="space-y-1">
                <MobileNavLink href="/" active={isActive("/")}>
                  Início
                </MobileNavLink>
                <MobileNavLink href="/servicos" active={isActive("/servicos")}>
                  Todos os serviços
                </MobileNavLink>
                <MobileNavLink href="/sobre" active={isActive("/sobre")}>
                  Sobre o escritório
                </MobileNavLink>
                <MobileNavLink href="/contato" active={isActive("/contato")}>
                  Contato
                </MobileNavLink>
              </div>

              <p className="mb-2 mt-7 px-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-900/40">
                Serviços
              </p>
              <div className="space-y-1">
                {services.map((service) => {
                  const Icon = serviceIcons[service.icon];
                  return (
                    <Link
                      key={service.slug}
                      href={`/servicos/${service.slug}`}
                      className="flex items-center gap-3 rounded-xl border border-brand-100 p-3 transition-colors hover:bg-brand-50"
                    >
                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${service.accent} text-white`}
                      >
                        <Icon className="size-4.5" />
                      </span>
                      <span className="text-sm font-semibold text-brand-950">
                        {service.shortName}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2.5 border-t border-brand-100 bg-brand-50/60 px-5 py-5">
              <Link
                href="/contato#proposta"
                className="flex w-full items-center justify-center rounded-xl bg-accent-500 px-4 py-3 text-sm font-semibold text-white"
              >
                Solicitar proposta
              </Link>
              <a
                href={whatsappLink(defaultWhatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand-200 bg-white px-4 py-3 text-sm font-semibold text-brand-900"
              >
                <IconWhatsApp className="size-4 text-[#25D366]" />
                Falar no WhatsApp
              </a>
              <div className="pt-1 text-center text-xs text-brand-900/55">
                {site.contact.phone}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
        active ? "text-accent-600" : "text-brand-900/75 hover:text-brand-950"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`block rounded-xl px-3.5 py-3 text-sm font-semibold transition-colors ${
        active ? "bg-accent-50 text-accent-700" : "text-brand-900 hover:bg-brand-50"
      }`}
    >
      {children}
    </Link>
  );
}
