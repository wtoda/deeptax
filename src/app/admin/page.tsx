import type { Metadata } from "next";
import { Painel } from "@/components/admin/Painel";

export const metadata: Metadata = {
  title: "Painel de conteúdo",
  // Área administrativa: fora dos buscadores, mesmo que a URL seja descoberta.
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <section className="bg-brand-50/60 py-12 sm:py-16">
      <div className="container-x">
        <Painel />
      </div>
    </section>
  );
}
