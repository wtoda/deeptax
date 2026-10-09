"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconAlert, IconExternal, IconSpinner } from "@/components/Icons";

type Pendencia = {
  variavel: string;
  explica: string;
  atalho?: { texto: string; url: string };
  passos?: string[];
};

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
  const [verificando, setVerificando] = useState(true);

  /**
   * Pergunta ao servidor se o painel está configurado e se já há sessão.
   * Sem isso, alguém abriria esta tela num deploy sem ADMIN_PASSWORD e veria
   * um formulário de senha que nunca funcionaria, sem saber por quê.
   */
  useEffect(() => {
    let ativo = true;

    (async () => {
      try {
        const resposta = await fetch("/api/admin/sessao", { cache: "no-store" });
        const dados = await resposta.json();
        if (!ativo) return;

        if (!dados.configurado) {
          setPendencias(dados.pendencias ?? []);
        } else if (dados.autenticado) {
          // Já logado: vai direto para o editor.
          router.replace("/admin");
          return;
        }
      } catch {
        // Sem resposta, mostramos o formulário — a tentativa de entrar dará o erro.
      } finally {
        if (ativo) setVerificando(false);
      }
    })();

    return () => {
      ativo = false;
    };
  }, [router]);

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

  if (verificando) {
    return (
      <div className="flex items-center justify-center gap-3 py-16 text-brand-900/60">
        <IconSpinner className="size-5" />
        Verificando o acesso…
      </div>
    );
  }

  if (pendencias) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-7">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-brand-950">
            <IconAlert className="size-5 text-amber-600" />
            Falta configurar o painel
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-900/75">
            O painel fica indisponível até estas variáveis existirem na Vercel — é
            proposital: sem elas ele não teria como proteger o acesso nem gravar as
            alterações. Leva cerca de 5 minutos.
          </p>
        </div>

        <div className="mt-5 space-y-4">
          {pendencias.map((p) => (
            <div key={p.variavel} className="rounded-2xl border border-brand-100 bg-white p-6 shadow-soft">
              <code className="rounded-lg bg-brand-50 px-2.5 py-1 text-sm font-bold text-brand-950">
                {p.variavel}
              </code>
              <p className="mt-2.5 text-sm text-brand-900/70">{p.explica}</p>

              {p.passos && (
                <ol className="mt-4 space-y-2">
                  {p.passos.map((passo, i) => (
                    <li key={i} className="flex gap-3 text-sm text-brand-900/75">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-950 text-[0.65rem] font-bold text-white">
                        {i + 1}
                      </span>
                      <span>{passo}</span>
                    </li>
                  ))}
                </ol>
              )}

              {p.atalho && (
                <a
                  href={p.atalho.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-900"
                >
                  {p.atalho.texto}
                  <IconExternal className="size-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-brand-100 bg-brand-50/60 p-6">
          <p className="text-sm font-semibold text-brand-950">Depois de cadastrar as duas</p>
          <p className="mt-2 text-sm leading-relaxed text-brand-900/70">
            Faça um <strong>Redeploy</strong> na Vercel (Deployments → os três pontos
            do último deploy → Redeploy). Variável nova só passa a valer em um deploy
            novo. Depois é só recarregar esta página e entrar.
          </p>
        </div>
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
