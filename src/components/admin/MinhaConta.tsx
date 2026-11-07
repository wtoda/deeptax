"use client";

import { useEffect, useState } from "react";
import { IconAlert, IconCheck, IconSpinner } from "@/components/Icons";

/**
 * Conta do usuário logado: identidade e troca da própria senha.
 *
 * Pede a senha atual mesmo com a sessão válida, de propósito: a sessão dura 12
 * horas, e um navegador destravado não pode valer como autorização para trocar
 * a senha de quem está logado.
 */
export function MinhaConta() {
  const [carregando, setCarregando] = useState(true);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [alteradaEm, setAlteradaEm] = useState("");

  const [atual, setAtual] = useState("");
  const [nova, setNova] = useState("");
  const [repetida, setRepetida] = useState("");

  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const sessao = await (await fetch("/api/admin/sessao", { cache: "no-store" })).json();
        if (!ativo) return;
        setNome(sessao.usuario?.nome ?? "");
        setEmail(sessao.usuario?.email ?? "");
      } catch {
        if (ativo) setErro("Não consegui carregar os dados da conta.");
      } finally {
        if (ativo) setCarregando(false);
      }
    })();
    return () => {
      ativo = false;
    };
  }, []);

  const trocar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setErro("");
    setMensagem("");

    if (nova !== repetida) {
      setErro("As duas senhas novas não são iguais.");
      return;
    }

    setSalvando(true);
    try {
      const resposta = await fetch("/api/admin/senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ atual, nova }),
      });
      const dados = await resposta.json();

      if (!resposta.ok || !dados.ok) {
        setErro(dados.message ?? "Não foi possível alterar a senha.");
        return;
      }

      setMensagem(dados.message);
      setAtual("");
      setNova("");
      setRepetida("");
      setAlteradaEm(new Date().toLocaleString("pt-BR"));
    } catch {
      setErro("Falha de conexão.");
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-brand-100 bg-white p-6 text-sm text-brand-900/60">
        <IconSpinner className="size-4" />
        Carregando…
      </div>
    );
  }

  const campo =
    "w-full rounded-lg border border-brand-200 bg-white p-2.5 text-sm text-brand-950 outline-none focus:border-accent-400";
  const rotulo = "mb-1.5 block text-sm font-semibold text-brand-950";

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-xl border border-brand-100 bg-white p-5">
        <h3 className="font-display text-base font-bold text-brand-950">Conta</h3>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-brand-900/50">Nome</dt>
            <dd className="font-semibold text-brand-950">{nome || "—"}</dd>
          </div>
          <div>
            <dt className="text-brand-900/50">E-mail de acesso</dt>
            <dd className="font-mono text-brand-950">{email || "—"}</dd>
          </div>
          {alteradaEm && (
            <div>
              <dt className="text-brand-900/50">Senha alterada agora</dt>
              <dd className="text-brand-950">{alteradaEm}</dd>
            </div>
          )}
        </dl>
        <p className="mt-5 text-xs leading-relaxed text-brand-900/50">
          Esta conta assina as alterações feitas no painel. Cada pessoa do escritório
          com acesso tem a sua — não compartilhe a mesma senha entre contas.
        </p>
      </div>

      <form onSubmit={trocar} className="rounded-xl border border-brand-100 bg-white p-5">
        <h3 className="font-display text-base font-bold text-brand-950">Alterar senha</h3>

        <div className="mt-4 space-y-3">
          <div>
            <label className={rotulo} htmlFor="senha-atual">
              Senha atual
            </label>
            <input
              id="senha-atual"
              type="password"
              autoComplete="current-password"
              value={atual}
              onChange={(e) => setAtual(e.target.value)}
              className={campo}
            />
          </div>
          <div>
            <label className={rotulo} htmlFor="senha-nova">
              Nova senha
            </label>
            <input
              id="senha-nova"
              type="password"
              autoComplete="new-password"
              value={nova}
              onChange={(e) => setNova(e.target.value)}
              className={campo}
            />
            <p className="mt-1 text-xs text-brand-900/45">Pelo menos 10 caracteres.</p>
          </div>
          <div>
            <label className={rotulo} htmlFor="senha-repetida">
              Repita a nova senha
            </label>
            <input
              id="senha-repetida"
              type="password"
              autoComplete="new-password"
              value={repetida}
              onChange={(e) => setRepetida(e.target.value)}
              className={campo}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={salvando || !atual || !nova || !repetida}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {salvando && <IconSpinner className="size-4" />}
          Alterar senha
        </button>

        {erro && (
          <p className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            <IconAlert className="mt-0.5 size-4 shrink-0" />
            <span>{erro}</span>
          </p>
        )}
        {mensagem && (
          <p className="mt-3 flex items-start gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            <IconCheck className="mt-0.5 size-4 shrink-0" />
            <span>{mensagem}</span>
          </p>
        )}
      </form>
    </div>
  );
}
