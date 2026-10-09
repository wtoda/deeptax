"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { IconAlert, IconCheck, IconSpinner } from "@/components/Icons";
import {
  CampoJson,
  ListaObjetos,
  ListaTextos,
  definir,
  ler,
} from "@/components/admin/Campos";
import {
  abas,
  camposDaArea,
  camposJsonDaArea,
  type Campo,
} from "@/lib/admin/schema";

type Qualquer = Record<string, unknown>;
type Pendencia = { variavel: string; explica: string };

const comoTexto = (v: unknown) => (typeof v === "string" ? v : "");
const comoLista = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

export function Painel() {
  const [fase, setFase] = useState<"carregando" | "login" | "editor" | "sem-configuracao">(
    "carregando",
  );
  const [pendencias, setPendencias] = useState<Pendencia[]>([]);
  const [senha, setSenha] = useState("");
  const [entrando, setEntrando] = useState(false);

  const [site, setSite] = useState<Qualquer>({});
  const [areas, setAreas] = useState<Qualquer[]>([]);
  const [original, setOriginal] = useState("");

  const [aba, setAba] = useState(abas[0]?.id ?? "contato");
  const [indiceArea, setIndiceArea] = useState(0);
  const [errosJson, setErrosJson] = useState<Record<string, boolean>>({});

  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [linkCommit, setLinkCommit] = useState("");

  /* ------------------------------------------------------------- carregar -- */

  const carregar = useCallback(async () => {
    setErro("");
    try {
      // Primeiro descobrimos o estado do painel — sem isso, pedir o conteúdo
      // sem sessão responderia 401 e apareceria como erro no console de quem
      // apenas abriu a tela de login.
      const sessao = await (await fetch("/api/admin/sessao", { cache: "no-store" })).json();

      if (!sessao.configurado) {
        setPendencias(sessao.pendencias ?? []);
        setFase("sem-configuracao");
        return;
      }
      if (!sessao.autenticado) {
        setFase("login");
        return;
      }

      const resposta = await fetch("/api/admin/content", { cache: "no-store" });
      const dados = await resposta.json();

      if (!resposta.ok || !dados.ok) {
        setErro(dados.message ?? "Não consegui carregar o conteúdo.");
        setFase("login");
        return;
      }

      setSite(dados.site);
      setAreas(dados.areas.services ?? []);
      setOriginal(JSON.stringify({ site: dados.site, areas: dados.areas }));
      setFase("editor");
    } catch {
      setErro("Falha de conexão ao carregar o conteúdo.");
      setFase("login");
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  /* ---------------------------------------------------------------- login -- */

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
        if (dados.pendencias) {
          setPendencias(dados.pendencias);
          setFase("sem-configuracao");
        }
        return;
      }
      setSenha("");
      await carregar();
    } catch {
      setErro("Falha de conexão.");
    } finally {
      setEntrando(false);
    }
  };

  const sair = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setFase("login");
    setSite({});
    setAreas([]);
  };

  /* --------------------------------------------------------------- salvar -- */

  const alterado = useMemo(
    () => JSON.stringify({ site, areas: { services: areas } }) !== original,
    [site, areas, original],
  );

  const jsonComErro = Object.values(errosJson).some(Boolean);

  const salvar = async () => {
    setSalvando(true);
    setErro("");
    setMensagem("");
    setLinkCommit("");
    try {
      const resposta = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site, areas }),
      });
      const dados = await resposta.json();

      if (!resposta.ok || !dados.ok) {
        setErro(dados.message ?? "Não foi possível salvar.");
        return;
      }

      setMensagem(dados.message);
      if (dados.url) setLinkCommit(dados.url);
      setOriginal(JSON.stringify({ site, areas: { services: areas } }));
    } catch {
      setErro("Falha de conexão ao salvar.");
    } finally {
      setSalvando(false);
    }
  };

  /* -------------------------------------------------------------- campos --- */

  const objetoAtual: Qualquer =
    aba === "areas" ? (areas[indiceArea] ?? {}) : site;

  const aoMudarCampo = (caminho: string, valor: unknown) => {
    if (aba === "areas") {
      const copia = structuredClone(areas);
      copia[indiceArea] = definir(copia[indiceArea] ?? {}, caminho, valor);
      setAreas(copia);
    } else {
      setSite((atual) => definir(atual, caminho, valor));
    }
  };

  const renderizarCampo = (campo: Campo, chave: string) => {
    const valor = ler(objetoAtual, campo.caminho);

    if (campo.tipo === "texto" || campo.tipo === "texto-longo") {
      const Comum =
        campo.tipo === "texto-longo"
          ? { rows: campo.linhas ?? 3, className: "resize-y" }
          : {};

      return (
        <div key={chave}>
          <label className="mb-1 block text-sm font-semibold text-brand-950">
            {campo.rotulo}
          </label>
          {campo.ajuda && <p className="mb-1.5 text-xs text-brand-900/55">{campo.ajuda}</p>}
          {campo.tipo === "texto-longo" ? (
            <textarea
              {...Comum}
              value={comoTexto(valor)}
              placeholder={campo.exemplo}
              onChange={(e) => aoMudarCampo(campo.caminho, e.target.value)}
              className="w-full resize-y rounded-lg border border-brand-200 bg-white p-2.5 text-sm text-brand-950 outline-none focus:border-accent-400"
            />
          ) : (
            <input
              type="text"
              {...Comum}
              value={comoTexto(valor)}
              placeholder={campo.exemplo}
              onChange={(e) => aoMudarCampo(campo.caminho, e.target.value)}
              className="w-full rounded-lg border border-brand-200 bg-white p-2.5 text-sm text-brand-950 outline-none focus:border-accent-400"
            />
          )}
        </div>
      );
    }

    if (campo.tipo === "selecao") {
      return (
        <div key={chave}>
          <label className="mb-1 block text-sm font-semibold text-brand-950">
            {campo.rotulo}
          </label>
          {campo.ajuda && <p className="mb-1.5 text-xs text-brand-900/55">{campo.ajuda}</p>}
          <select
            value={comoTexto(valor)}
            onChange={(e) => aoMudarCampo(campo.caminho, e.target.value)}
            className="w-full rounded-lg border border-brand-200 bg-white p-2.5 text-sm text-brand-950 outline-none focus:border-accent-400"
          >
            {campo.opcoes.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (campo.tipo === "lista-textos") {
      return (
        <ListaTextos
          key={chave}
          campo={campo}
          itens={comoLista(valor)}
          onMudanca={(novo) => aoMudarCampo(campo.caminho, novo)}
        />
      );
    }

    if (campo.tipo === "lista-objetos") {
      return (
        <ListaObjetos
          key={chave}
          campo={campo}
          itens={comoLista(valor)}
          onMudanca={(novo) => aoMudarCampo(campo.caminho, novo)}
        />
      );
    }

    // tipo "json"
    return (
      <CampoJson
        key={chave}
        campo={campo}
        valor={valor}
        invalido={Boolean(errosJson[chave])}
        onMudanca={(texto, valido) => {
          setErrosJson((atual) => ({ ...atual, [chave]: !valido }));
          if (valido) aoMudarCampo(campo.caminho, JSON.parse(texto));
        }}
      />
    );
  };

  /* --------------------------------------------------------------- telas --- */

  if (fase === "carregando") {
    return (
      <div className="flex items-center justify-center gap-3 py-24 text-brand-900/60">
        <IconSpinner className="size-5" />
        Carregando o conteúdo…
      </div>
    );
  }

  if (fase === "sem-configuracao") {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 p-7">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-brand-950">
          <IconAlert className="size-5 text-amber-600" />
          O painel precisa de configuração
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-brand-900/75">
          Falta configurar na Vercel (<strong>Settings → Environment Variables</strong>) e
          fazer um novo deploy. Enquanto isso, o painel fica indisponível — ele não abre
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
          O passo a passo está em <code>README.md</code>, na seção{" "}
          <em>Painel de edição de conteúdo</em>.
        </p>
      </div>
    );
  }

  if (fase === "login") {
    return (
      <div className="mx-auto max-w-sm">
        <form
          onSubmit={entrar}
          className="rounded-2xl border border-brand-100 bg-white p-7 shadow-soft"
        >
          <h2 className="font-display text-lg font-bold text-brand-950">
            Painel de conteúdo
          </h2>
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
        </form>
      </div>
    );
  }

  /* ------------------------------------------------------------- editor ---- */

  const campos = aba === "areas" ? camposDaArea : (abas.find((a) => a.id === aba)?.campos ?? []);
  const camposJson = aba === "areas" ? camposJsonDaArea : [];
  const descricaoAba =
    aba === "areas"
      ? "Conteúdo das páginas internas. Escolha a área e edite os textos. Os blocos em JSON são as listas mais longas (escopo, metodologia, FAQ)."
      : (abas.find((a) => a.id === aba)?.descricao ?? "");

  return (
    <div className="pb-28">
      {/* Cabeçalho */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-brand-950">
            Editar conteúdo do site
          </h2>
          <p className="mt-1 text-sm text-brand-900/60">
            Ao salvar, as alterações vão para o repositório e a Vercel publica sozinha.
          </p>
        </div>
        <button
          type="button"
          onClick={sair}
          className="rounded-lg border border-brand-200 bg-white px-3.5 py-2 text-sm font-semibold text-brand-800 hover:bg-brand-50"
        >
          Sair
        </button>
      </div>

      {/* Abas */}
      <div className="mb-6 flex flex-wrap gap-1.5 border-b border-brand-100 pb-3">
        {[...abas, { id: "areas", titulo: "Áreas (páginas internas)" }].map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setAba(a.id)}
            className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
              aba === a.id
                ? "bg-brand-950 text-white"
                : "text-brand-900/70 hover:bg-brand-50"
            }`}
          >
            {a.titulo}
          </button>
        ))}
      </div>

      {descricaoAba && (
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-brand-900/65">
          {descricaoAba}
        </p>
      )}

      {/* Seletor de área */}
      {aba === "areas" && (
        <div className="mb-6">
          <label className="mb-1 block text-sm font-semibold text-brand-950">
            Área em edição
          </label>
          <select
            value={indiceArea}
            onChange={(e) => {
              setIndiceArea(Number(e.target.value));
              setErrosJson({});
            }}
            className="w-full max-w-md rounded-lg border border-brand-200 bg-white p-2.5 text-sm"
          >
            {areas.map((a, i) => (
              <option key={i} value={i}>
                {comoTexto(a.name) || `Área ${i + 1}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Campos */}
      <div className="grid gap-5 lg:grid-cols-2">
        {campos.map((campo, i) => (
          <div key={campo.caminho} className={campo.tipo === "lista-objetos" ? "lg:col-span-2" : ""}>
            {renderizarCampo(campo, `${aba}:${indiceArea}:${campo.caminho}:${i}`)}
          </div>
        ))}
      </div>

      {camposJson.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-1 font-display text-base font-bold text-brand-950">
            Conteúdo detalhado desta área
          </h3>
          <p className="mb-4 max-w-3xl text-sm text-brand-900/60">
            Listas mais longas, em JSON. Edite com cuidado: as aspas e as vírgulas
            precisam estar corretas.
          </p>
          <div className="space-y-4">
            {camposJson.map((campo, i) =>
              renderizarCampo(campo, `json:${indiceArea}:${campo.caminho}:${i}`),
            )}
          </div>
        </div>
      )}

      {/* Barra de salvar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-brand-100 bg-white/95 backdrop-blur">
        <div className="container-x flex flex-wrap items-center justify-between gap-3 py-3.5">
          <div className="min-w-0 text-sm">
            {erro && (
              <p className="flex items-start gap-2 text-red-700">
                <IconAlert className="mt-0.5 size-4 shrink-0" />
                <span className="line-clamp-2">{erro}</span>
              </p>
            )}
            {mensagem && !erro && (
              <p className="flex items-start gap-2 text-accent-700">
                <IconCheck className="mt-0.5 size-4 shrink-0" />
                <span>
                  {mensagem}{" "}
                  {linkCommit && (
                    <a
                      href={linkCommit}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      ver commit
                    </a>
                  )}
                </span>
              </p>
            )}
            {!erro && !mensagem && (
              <span className="text-brand-900/55">
                {jsonComErro
                  ? "Corrija o JSON inválido para salvar."
                  : alterado
                    ? "Você tem alterações não publicadas."
                    : "Nenhuma alteração pendente."}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={salvar}
            disabled={salvando || !alterado || jsonComErro}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {salvando && <IconSpinner className="size-4" />}
            {alterado ? "Salvar e publicar" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
