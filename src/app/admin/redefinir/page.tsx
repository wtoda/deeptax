import type { Metadata } from "next";
import { RedefinirSenha } from "@/components/admin/RedefinirSenha";

export const metadata: Metadata = {
  title: "Criar nova senha",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function RedefinirPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <section className="bg-brand-50/60 py-16 sm:py-24">
      <div className="container-x">
        <RedefinirSenha token={typeof token === "string" ? token : ""} />
      </div>
    </section>
  );
}
