/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";
import type { Bloco } from "@/lib/blog";

/**
 * ============================================================================
 *  RENDERIZAÇÃO DO CORPO DO POST
 * ============================================================================
 *  O corpo vem em blocos (não em HTML), então nada aqui usa
 *  dangerouslySetInnerHTML: todo texto entra como texto. É o que impede que um
 *  post publicado consiga injetar marcação na página.
 *
 *  As imagens usam <img> em vez de next/image porque a dimensão real só é
 *  conhecida depois do envio, e o otimizador de imagem não roda neste servidor
 *  (não há sharp instalado). A imagem é servida com cache longo e carregamento
 *  tardio, que é o que importa para o visitante.
 * ========================================================================== */

type Props = { texto: string };

const LINK_EXTERNO = { target: "_blank", rel: "noopener noreferrer" } as const;

function urlDeLink(bruta: string): { href: string; externo: boolean } | null {
  if (/^\/(?!\/)/.test(bruta)) return { href: bruta, externo: false };
  if (/^https?:\/\//i.test(bruta)) return { href: bruta, externo: true };
  return null; // javascript:, data:, mailto: disfarçado — não renderiza link
}

/**
 * Formatação dentro de um bloco: **negrito**, *itálico* e [texto](endereço).
 * Deliberadamente mínimo: o necessário para um texto corrido legível.
 */
export function TextoRico({ texto }: Props) {
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  const nos: ReactNode[] = [];
  let ultimo = 0;
  let chave = 0;
  let achado: RegExpExecArray | null;

  while ((achado = re.exec(texto)) !== null) {
    if (achado.index > ultimo) nos.push(texto.slice(ultimo, achado.index));

    if (achado[1] !== undefined) {
      nos.push(
        <strong key={chave++} className="font-semibold text-brand-950">
          {achado[1]}
        </strong>,
      );
    } else if (achado[2] !== undefined) {
      nos.push(<em key={chave++}>{achado[2]}</em>);
    } else if (achado[3] !== undefined) {
      const link = urlDeLink(achado[4]);
      nos.push(
        link ? (
          <a
            key={chave++}
            href={link.href}
            {...(link.externo ? LINK_EXTERNO : {})}
            className="font-medium text-accent-700 underline decoration-accent-300 underline-offset-2 hover:decoration-accent-600"
          >
            {achado[3]}
          </a>
        ) : (
          achado[3]
        ),
      );
    }

    ultimo = re.lastIndex;
  }

  if (ultimo < texto.length) nos.push(texto.slice(ultimo));
  return <>{nos}</>;
}

/** Corpo completo, na ordem em que os blocos foram escritos. */
export function CorpoDoPost({ blocos }: { blocos: Bloco[] }) {
  return (
    <div className="space-y-5">
      {blocos.map((bloco, i) => {
        switch (bloco.tipo) {
          case "paragrafo":
            return (
              <p key={i} className="text-[1.02rem] leading-[1.75] text-brand-900/85">
                <TextoRico texto={bloco.texto} />
              </p>
            );

          case "titulo":
            return bloco.nivel === 3 ? (
              <h3
                key={i}
                className="!mt-9 font-display text-lg font-bold leading-snug text-brand-950"
              >
                <TextoRico texto={bloco.texto} />
              </h3>
            ) : (
              <h2
                key={i}
                className="!mt-11 font-display text-2xl font-bold leading-snug text-brand-950"
              >
                <TextoRico texto={bloco.texto} />
              </h2>
            );

          case "lista": {
            const Lista = bloco.ordenada ? "ol" : "ul";
            return (
              <Lista
                key={i}
                className={`ml-5 space-y-2 text-[1.02rem] leading-[1.75] text-brand-900/85 ${
                  bloco.ordenada ? "list-decimal" : "list-disc"
                } marker:text-accent-500`}
              >
                {bloco.itens.map((item, j) => (
                  <li key={j} className="pl-1">
                    <TextoRico texto={item} />
                  </li>
                ))}
              </Lista>
            );
          }

          case "citacao":
            return (
              <blockquote
                key={i}
                className="rounded-r-xl border-l-[3px] border-accent-500 bg-brand-50/70 py-4 pl-5 pr-4"
              >
                <p className="text-[1.02rem] leading-relaxed text-brand-900/90 italic">
                  <TextoRico texto={bloco.texto} />
                </p>
                {bloco.autor && (
                  <footer className="mt-2 text-sm font-semibold not-italic text-brand-900/60">
                    — {bloco.autor}
                  </footer>
                )}
              </blockquote>
            );

          case "imagem":
            return (
              <figure key={i} className="!mt-8">
                <img
                  src={bloco.src}
                  alt={bloco.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full rounded-xl border border-brand-100"
                />
                {bloco.legenda && (
                  <figcaption className="mt-2.5 text-sm leading-relaxed text-brand-900/55">
                    {bloco.legenda}
                  </figcaption>
                )}
              </figure>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
