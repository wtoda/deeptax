import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * ============================================================================
 *  IMAGENS DO BLOG
 * ============================================================================
 *  Serve as imagens enviadas pelo painel, guardadas em `arquivos/midia/`.
 *
 *  Por que não `public/`: o Next monta a lista de arquivos públicos quando o
 *  servidor SOBE. Uma imagem enviada depois disso responde 404 até reiniciar —
 *  ou seja, quem enviasse uma foto veria a pré-visualização quebrada até a
 *  próxima reconstrução. Servindo por rota, a imagem aparece na hora.
 *
 *  O nome é o hash do conteúdo, então o endereço nunca muda para o mesmo
 *  arquivo: dá para servir com cache longo e imutável, que é o mais rápido que
 *  o navegador tem.
 * ========================================================================== */

/** Só aceita o formato que o envio gera: 16 hex + extensão conhecida. */
const NOME_VALIDO = /^[a-f0-9]{16}\.(jpg|png|webp)$/;

const TIPOS: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

const PASTA = path.join(process.cwd(), "arquivos", "midia");

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ arquivo: string }> },
) {
  const { arquivo } = await params;

  // O padrão fecha a porta para "../" e para qualquer nome fora do esquema.
  if (!NOME_VALIDO.test(arquivo)) {
    return new Response("Imagem não encontrada.", { status: 404 });
  }

  const extensao = arquivo.split(".").pop() ?? "";
  const tipo = TIPOS[extensao];
  if (!tipo) return new Response("Imagem não encontrada.", { status: 404 });

  try {
    const bytes = await readFile(path.join(PASTA, arquivo));
    return new Response(bytes, {
      headers: {
        "Content-Type": tipo,
        "Content-Length": String(bytes.byteLength),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Imagem não encontrada.", { status: 404 });
  }
}
