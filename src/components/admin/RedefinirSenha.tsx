"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IconAlert, IconCheck, IconSpinner } from "@/components/Icons";

/**
 * Definição de nova senha a partir do link de recuperação.
 *
 * O token vem na URL e é conferido ao abrir a tela — assim quem recebeu um link
 * vencido descobre na hora, em vez de preencher o formulário e falhar no envio.
 */
export function RedefinirSenha({ token }: { token: string }) {
  const [conferindo, setConferindo] = useState(true);
  const [valido, setValido] = useState(false);
  const [nova, setNova] = useState("");
  const [repetida, setRepetida] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [pronto, setPronto] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const dados = await (
          await fetch(`/api/admin/redefinir?token=${encodeURIComponent(token)}`, {
            cache: "no-store",
          })
        ).json();
        if (!ativo) return;
        setValido(Boolean(dados.valido));
        if (!dados.valido) setErro(dados.message ?? "Link inválido.");
      } catch {
        if (ativo) setErro("Não consegui conferir o link.");
      } finally {
        if (ativo) setConferindo(false);
      }
    })();
    return () => {
      ativo = false;
    };
  }, [token]);

  const enviar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setErro("");

    if (nova !== repetida) {
      setErro("As duas senhas não são iguais.");
      return;
    }

    setEnviando(true);
    try {
      const resposta = await fetch("/api/admin/redefinir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nova }),
      });
      const dados = await resposta.json();

      if (!resposta.ok || !dados.ok) {
        setErro(dados.message ?? "Não foi possível redefinir a senha.");
        return;
      }
      setPronto(true);
    } catch {
      setErro("Falha de conexão.");
    } finally {
      setEnviando(false);
    }
  };

  if (conferindo) {
    return (
      <div className="flex items-center justify-center gap-3 py-16 text-brand-900/60">
        <IconSpinner className="size-5" />
        Conferindo o link…
      </div>
    );
  }

  if (pronto) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-emerald-200 bg-emerald-50 p-7 text-center">
        <IconCheck className="mx-auto size-8 text-emerald-600" />
        <h1 className="mt-3 font-display text-xl font-bold text-brand-950">Senha redefinida</h1>
        <p className="mt-2 text-sm text-brand-900/70">
          Já pode entrar com a nova senha. Por segurança, o link não funciona mais.
        </p>
        <Link
          href="/admin/login"
          className="mt-6 inline-flex rounded-xl bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Ir para o acesso
        </Link>
      </div>
    );
  }

  if (!valido) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-amber-200 bg-amber-50 p-7">
        <h1 className="flex items-center gap-2 font-display text-lg font-bold text-brand-950">
          <IconAlert className="size-5 text-amber-600" />
          Link inválido ou vencido
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-brand-900/75">
          {erro || "Este link expirou ou já foi usado."} Os links valem por 30 minutos e
          servem uma única vez.
        </p>
        <Link
          href="/admin/recuperar"
          className="mt-5 inline-flex rounded-xl bg-brand-950 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Pedir um link novo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-display text-2xl font-bold text-brand-950">Criar nova senha</h1>
      <p className="mt-2 text-sm leading-relaxed text-brand-900/65">
        Escolha uma senha com pelo menos 10 caracteres. Ela vale para o seu acesso e não
        afeta a senha dos outros usuários do painel.
      </p>

      <form onSubmit={enviar} className="mt-6 space-y-4 rounded-2xl border border-brand-100 bg-white p-6">
        <div>
          <label htmlFor="nova" className="mb-1.5 block text-sm font-semibold text-brand-950">
            Nova senha
          </label>
          <input
            id="nova"
            type="password"
            required
            value={nova}
            onChange={(e) => setNova(e.target.value)}
            autoComplete="new-password"
            className="w-full rounded-lg border border-brand-200 p-3 text-sm outline-none focus:border-accent-400"
          />
        </div>

        <div>
          <label htmlFor="repetida" className="mb-1.5 block text-sm font-semibold text-brand-950">
            Repita a nova senha
          </label>
          <input
            id="repetida"
            type="password"
            required
            value={repetida}
            onChange={(e) => setRepetida(e.target.value)}
            autoComplete="new-password"
            className="w-full rounded-lg border border-brand-200 p-3 text-sm outline-none focus:border-accent-400"
          />
        </div>

        <button
          type="submit"
          disabled={enviando || !nova || !repetida}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {enviando && <IconSpinner className="size-4" />}
          Salvar nova senha
        </button>

        {erro && (
          <p className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            <IconAlert className="mt-0.5 size-4 shrink-0" />
            <span>{erro}</span>
          </p>
        )}
      </form>
    </div>
  );
}
