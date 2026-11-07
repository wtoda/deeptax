"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IconAlert, IconCheck, IconSpinner } from "@/components/Icons";

/**
 * Pedido de recuperação de senha.
 *
 * A tela nunca diz se o e-mail existe — só que, se existir, as instruções foram
 * enviadas. É o comportamento correto e o que a rota garante; aqui só repetimos
 * a mensagem que o servidor devolve.
 */
export function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [emailAtivo, setEmailAtivo] = useState<boolean | null>(null);

  // Saber se o servidor envia e-mail muda a orientação dada ao usuário.
  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const dados = await (await fetch("/api/admin/sessao", { cache: "no-store" })).json();
        if (ativo) setEmailAtivo(Boolean(dados.emailConfigurado));
      } catch {
        if (ativo) setEmailAtivo(false);
      }
    })();
    return () => {
      ativo = false;
    };
  }, []);

  const enviar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setEnviando(true);
    setErro("");
    setMensagem("");

    try {
      const resposta = await fetch("/api/admin/recuperar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const dados = await resposta.json();

      if (!resposta.ok || !dados.ok) {
        setErro(dados.message ?? "Não foi possível concluir o pedido.");
        return;
      }
      setMensagem(dados.message);
      setEmail("");
    } catch {
      setErro("Falha de conexão.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-display text-2xl font-bold text-brand-950">Recuperar acesso</h1>
      <p className="mt-2 text-sm leading-relaxed text-brand-900/65">
        Informe o e-mail cadastrado no painel. Enviaremos um link para você criar uma
        nova senha.
      </p>

      {emailAtivo === false && (
        <p className="mt-5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <IconAlert className="mt-0.5 size-4 shrink-0" />
          <span>
            Este servidor <strong>ainda não envia e-mail</strong>. Você pode pedir o link
            assim mesmo: ele fica registrado no servidor e quem administra entrega para
            você. O comando está na mensagem de confirmação.
          </span>
        </p>
      )}

      <form onSubmit={enviar} className="mt-6 rounded-2xl border border-brand-100 bg-white p-6">
        <label htmlFor="recuperar-email" className="mb-1.5 block text-sm font-semibold text-brand-950">
          E-mail
        </label>
        <input
          id="recuperar-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nome@deeptax.com.br"
          autoComplete="username"
          className="w-full rounded-lg border border-brand-200 p-3 text-sm outline-none focus:border-accent-400"
        />

        <button
          type="submit"
          disabled={enviando || !email.trim()}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {enviando && <IconSpinner className="size-4" />}
          Enviar link de redefinição
        </button>

        {erro && (
          <p className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            <IconAlert className="mt-0.5 size-4 shrink-0" />
            <span>{erro}</span>
          </p>
        )}
        {mensagem && (
          <p className="mt-4 flex items-start gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            <IconCheck className="mt-0.5 size-4 shrink-0" />
            <span>{mensagem}</span>
          </p>
        )}
      </form>

      <p className="mt-6 text-sm text-brand-900/60">
        Lembrou a senha?{" "}
        <Link href="/admin/login" className="font-semibold text-accent-700 underline">
          Voltar para o acesso
        </Link>
      </p>
    </div>
  );
}
