import type { Metadata } from "next";
import { RecuperarSenha } from "@/components/admin/RecuperarSenha";

export const metadata: Metadata = {
  title: "Recuperar acesso ao painel",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default function RecuperarPage() {
  return (
    <section className="bg-brand-50/60 py-16 sm:py-24">
      <div className="container-x">
        <RecuperarSenha />
      </div>
    </section>
  );
}
