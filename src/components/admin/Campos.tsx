"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { IconCheck, IconAlert, IconSpinner } from "@/components/Icons";
import {
  abas,
  camposDaArea,
  camposJsonDaArea,
  type Campo,
  type CampoDeLista,
} from "@/lib/admin/schema";

/* ============================================================================
 *  Utilitários de caminho
 *  Os campos do esquema endereçam o conteúdo por caminho com ponto
 *  ("contact.address.city"). Estas funções leem e gravam sem mutar o original.
 * ========================================================================== */

type Qualquer = Record<string, unknown>;

function ler(obj: unknown, caminho: string): unknown {
  return caminho.split(".").reduce<unknown>((acc, chave) => {
    if (acc && typeof acc === "object") return (acc as Qualquer)[chave];
    return undefined;
  }, obj);
}

function definir<T>(obj: T, caminho: string, valor: unknown): T {
  const copia = structuredClone(obj) as Qualquer;
  const partes = caminho.split(".");
  let alvo: Qualquer = copia;

  for (let i = 0; i < partes.length - 1; i += 1) {
    const chave = partes[i];
    if (alvo[chave] === null || typeof alvo[chave] !== "object") alvo[chave] = {};
    alvo = alvo[chave] as Qualquer;
  }
  alvo[partes[partes.length - 1]] = valor;
  return copia as T;
}

const comoTexto = (v: unknown) => (typeof v === "string" ? v : "");
const comoLista = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

/* ============================================================================
 *  Campo de JSON
 *  Guarda o texto digitado separado do modelo: enquanto o JSON estiver
 *  inválido, o modelo não é alterado e o salvamento fica bloqueado.
 * ========================================================================== */

export function CampoJson({
  campo,
  valor,
  invalido,
  onMudanca,
}: {
  campo: Extract<Campo, { tipo: "json" }>;
  valor: unknown;
  invalido: boolean;
  onMudanca: (texto: string, valido: boolean) => void;
}) {
  const [texto, setTexto] = useState(() => JSON.stringify(valor ?? [], null, 2));

  // Se o conteúdo recarregar (outra aba, outro campo), o texto acompanha.
  useEffect(() => {
    setTexto(JSON.stringify(valor ?? [], null, 2));
  }, [valor]);

  return (
    <div className="rounded-xl border border-brand-100 bg-brand-50/40 p-4">
      <label className="mb-1 block text-sm font-semibold text-brand-950">
        {campo.rotulo}
      </label>
      {campo.ajuda && <p className="mb-2 text-xs text-brand-900/55">{campo.ajuda}</p>}
      <textarea
        value={texto}
        rows={campo.linhas ?? 10}
        spellCheck={false}
        onChange={(e) => {
          const novo = e.target.value;
          setTexto(novo);
          let valido = true;
          try {
            JSON.parse(novo);
          } catch {
            valido = false;
          }
          onMudanca(novo, valido);
        }}
        className={`w-full resize-y rounded-lg border bg-white p-3 font-mono text-xs leading-relaxed text-brand-950 outline-none ${
          invalido ? "border-red-400" : "border-brand-200 focus:border-accent-400"
        }`}
      />
      {invalido && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
          <IconAlert className="size-3.5" />
          JSON inválido — corrija para poder salvar. Verifique vírgulas e aspas.
        </p>
      )}
    </div>
  );
}

/* ============================================================================
 *  Lista de textos simples
 * ========================================================================== */

export function ListaTextos({
  campo,
  itens,
  onMudanca,
}: {
  campo: Extract<Campo, { tipo: "lista-textos" }>;
  itens: unknown[];
  onMudanca: (novo: unknown[]) => void;
}) {
  const textos = itens.map(comoTexto);

  const mover = (de: number, para: number) => {
    if (para < 0 || para >= textos.length) return;
    const copia = [...textos];
    const [item] = copia.splice(de, 1);
    copia.splice(para, 0, item);
    onMudanca(copia);
  };

  return (
    <div className="rounded-xl border border-brand-100 bg-brand-50/40 p-4">
      <label className="block text-sm font-semibold text-brand-950">{campo.rotulo}</label>
      {campo.ajuda && <p className="mb-3 text-xs text-brand-900/55">{campo.ajuda}</p>}

      <div className="space-y-2">
        {textos.map((valor, i) => (
          <div key={i} className="flex items-start gap-2">
            <textarea
              value={valor}
              rows={2}
              onChange={(e) => {
                const copia = [...textos];
                copia[i] = e.target.value;
                onMudanca(copia);
              }}
              className="w-full resize-y rounded-lg border border-brand-200 bg-white p-2.5 text-sm text-brand-950 outline-none focus:border-accent-400"
            />
            <div className="flex shrink-0 flex-col gap-1">
              <button
                type="button"
                onClick={() => mover(i, i - 1)}
                disabled={i === 0}
                title="Mover para cima"
                className="rounded-md border border-brand-200 bg-white px-2 py-1 text-xs text-brand-700 disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => mover(i, i + 1)}
                disabled={i === textos.length - 1}
                title="Mover para baixo"
                className="rounded-md border border-brand-200 bg-white px-2 py-1 text-xs text-brand-700 disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => onMudanca(textos.filter((_, j) => j !== i))}
                title="Remover"
                className="rounded-md border border-red-200 bg-white px-2 py-1 text-xs text-red-600"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onMudanca([...textos, ""])}
        className="mt-3 rounded-lg border border-brand-200 bg-white px-3 py-1.5 text-xs font-semibold text-brand-800 hover:bg-brand-50"
      >
        + Adicionar item
      </button>
    </div>
  );
}

/* ============================================================================
 *  Lista de objetos (diferenciais, etapas, FAQ, depoimentos...)
 * ========================================================================== */

export function ListaObjetos({
  campo,
  itens,
  onMudanca,
}: {
  campo: Extract<Campo, { tipo: "lista-objetos" }>;
  itens: unknown[];
  onMudanca: (novo: unknown[]) => void;
}) {
  const registros = itens as Qualquer[];

  const atualizarCampo = (indice: number, chave: string, valor: string) => {
    const copia = structuredClone(registros);
    copia[indice][chave] = valor;
    onMudanca(copia);
  };

  const mover = (de: number, para: number) => {
    if (para < 0 || para >= registros.length) return;
    const copia = structuredClone(registros);
    const [item] = copia.splice(de, 1);
    copia.splice(para, 0, item);
    onMudanca(copia);
  };

  const novoItem = () => {
    const vazio: Qualquer = {};
    for (const c of campo.campos) vazio[c.chave] = "";
    onMudanca([...registros, vazio]);
  };

  return (
    <div className="rounded-xl border border-brand-100 bg-brand-50/40 p-4">
      <label className="block text-sm font-semibold text-brand-950">{campo.rotulo}</label>
      {campo.ajuda && <p className="mb-3 text-xs text-brand-900/55">{campo.ajuda}</p>}

      {registros.length === 0 && (
        <p className="rounded-lg border border-dashed border-brand-200 bg-white px-3 py-4 text-center text-xs text-brand-900/50">
          Nenhum item. Com a lista vazia, este bloco não aparece no site.
        </p>
      )}

      <div className="space-y-3">
        {registros.map((registro, i) => (
          <div key={i} className="rounded-lg border border-brand-200 bg-white p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-brand-900/45">
                Item {i + 1}
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => mover(i, i - 1)}
                  disabled={i === 0}
                  title="Mover para cima"
                  className="rounded-md border border-brand-200 px-2 py-0.5 text-xs text-brand-700 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => mover(i, i + 1)}
                  disabled={i === registros.length - 1}
                  title="Mover para baixo"
                  className="rounded-md border border-brand-200 px-2 py-0.5 text-xs text-brand-700 disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => onMudanca(registros.filter((_, j) => j !== i))}
                  title="Remover item"
                  className="rounded-md border border-red-200 px-2 py-0.5 text-xs text-red-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {campo.campos.map((sub: CampoDeLista) => (
                <div key={sub.chave}>
                  <label className="mb-1 block text-xs font-medium text-brand-900/70">
                    {sub.rotulo}
                  </label>
                  {sub.tipo === "texto-longo" ? (
                    <textarea
                      value={comoTexto(registro[sub.chave])}
                      rows={3}
                      placeholder={sub.exemplo}
                      onChange={(e) => atualizarCampo(i, sub.chave, e.target.value)}
                      className="w-full resize-y rounded-lg border border-brand-200 p-2.5 text-sm text-brand-950 outline-none focus:border-accent-400"
                    />
                  ) : (
                    <input
                      type="text"
                      value={comoTexto(registro[sub.chave])}
                      placeholder={sub.exemplo}
                      onChange={(e) => atualizarCampo(i, sub.chave, e.target.value)}
                      className="w-full rounded-lg border border-brand-200 p-2.5 text-sm text-brand-950 outline-none focus:border-accent-400"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={novoItem}
        className="mt-3 rounded-lg border border-brand-200 bg-white px-3 py-1.5 text-xs font-semibold text-brand-800 hover:bg-brand-50"
      >
        + Adicionar item
      </button>
    </div>
  );
}

/* ============================================================================
 *  Rótulo das áreas
 * ========================================================================== */

const rotuloDaAba = (id: string) =>
  abas.find((a) => a.id === id)?.titulo ?? id;

export { definir, ler, rotuloDaAba };
