import type { Metadata } from "next";
import { Login } from "@/components/admin/Login";

export const metadata: Metadata = {
  title: "Acesso ao painel",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <section className="bg-brand-50/60 py-16 sm:py-24">
      <div className="container-x">
        <Login />
      </div>
    </section>
  );
}
