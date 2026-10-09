"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconAlert, IconSpinner } from "@/components/Icons";

type Pendencia = { variavel: string; explica: string };

/**
 * Tela de acesso ao painel.
 *
 * Fica em rota própria (/admin/login) para o endereço ser simples de lembrar e
 * para o editor só carregar depois de autenticado.
 */
export function Login() {
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [entrando, setEntrando] = useState(false);
  const [erro, setErro] = useState("");
  const [pendencias, setPendencias] = useState<Pendencia[] | null>(null);

  const entrar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setEntrando(true);
    setErro("");

    try {
      const resposta = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senha }),
      });
      const dados = await resposta.json();

      if (!resposta.ok || !dados.ok) {
        setErro(dados.message ?? "Não foi possível entrar.");
        if (dados.pendencias) setPendencias(dados.pendencias);
        return;
      }

      setSenha("");
      // O editor carrega o conteúdo ao montar, já com a sessão ativa.
      router.replace("/admin");
      router.refresh();
    } catch {
      setErro("Falha de conexão.");
    } finally {
      setEntrando(false);
    }
  };

  if (pendencias) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 p-7">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-brand-950">
          <IconAlert className="size-5 text-amber-600" />
          O painel precisa de configuração
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-brand-900/75">
          Falta configurar na Vercel (<strong>Settings → Environment Variables</strong>) e
          fazer um novo deploy. Enquanto isso o painel fica indisponível — ele não abre
          sem essas proteções.
        </p>
        <ul className="mt-4 space-y-3">
          {pendencias.map((p) => (
            <li key={p.variavel} className="rounded-xl border border-amber-200 bg-white p-4">
              <code className="text-sm font-bold text-brand-950">{p.variavel}</code>
              <p className="mt-1 text-sm text-brand-900/70">{p.explica}</p>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs leading-relaxed text-brand-900/60">
          O passo a passo está em <code>docs/PAINEL-DE-CONTEUDO.md</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm">
      <form
        onSubmit={entrar}
        className="rounded-2xl border border-brand-100 bg-white p-7 shadow-soft"
      >
        <h1 className="font-display text-lg font-bold text-brand-950">Painel de conteúdo</h1>
        <p className="mt-1.5 text-sm text-brand-900/60">
          Acesso restrito ao escritório.
        </p>

        <label htmlFor="senha" className="mt-6 mb-1 block text-sm font-semibold text-brand-950">
          Senha
        </label>
        <input
          id="senha"
          type="password"
          autoComplete="current-password"
          autoFocus
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full rounded-lg border border-brand-200 p-3 text-sm outline-none focus:border-accent-400"
        />

        {erro && (
          <p className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <IconAlert className="mt-0.5 size-4 shrink-0" />
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={entrando || !senha}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {entrando && <IconSpinner className="size-4" />}
          Entrar
        </button>

        <p className="mt-4 text-center text-xs text-brand-900/45">
          Esqueceu a senha? Ela é definida na variável ADMIN_PASSWORD, na Vercel.
        </p>
      </form>
    </div>
  );
}
