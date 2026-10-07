"use client";

import { useEffect, useState } from "react";
import { IconWhatsApp } from "@/components/Icons";
import { defaultWhatsappMessage, site, whatsappLink } from "@/lib/site";

/**
 * Botão flutuante de WhatsApp. Aparece após uma pequena rolagem e ganha
 * destaque no mobile — principal canal de conversão da página.
 */
export function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-5 right-5 z-40 transition-all duration-500 sm:bottom-7 sm:right-7 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <a
        href={whatsappLink(defaultWhatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Falar com a ${site.name} no WhatsApp`}
        className="group relative flex items-center gap-3 rounded-full bg-[#25D366] py-3.5 pl-3.5 pr-4 text-[#04331b] shadow-lift transition-transform hover:scale-[1.03] active:scale-[0.98]"
      >
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.6s]" />
        <IconWhatsApp className="size-6" />
        <span className="hidden text-sm font-bold sm:inline">Fale com um contador</span>
      </a>
    </div>
  );
}
