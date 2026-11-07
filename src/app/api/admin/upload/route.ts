import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { lerSessao } from "@/lib/admin/auth";
import { adminDisponivel, armazenamentoLocal } from "@/lib/admin/config";

/**
 * ============================================================================
 *  ENVIO DE IMAGEM PARA O BLOG
 * ============================================================================
 *  Recebe um arquivo, confere o CONTEÚDO (não a extensão), guarda em
 *  `public/midia/` e devolve o caminho para o post usar.
 *
 *  Duas decisões que valem explicação:
 *
 *  1. O tipo é decidido pelos primeiros bytes do arquivo, e não pelo nome. Quem
 *     envia pode mentir a extensão; o conteúdo, não. SVG é recusado de
 *     propósito: é um formato executável e serviria como porta para injeção de
 *     script na página.
 *  2. O nome vem do hash do conteúdo. Duas razões: nomes enviados por pessoas
 *     trazem acento, espaço e maiúscula (que quebram em URL), e o mesmo arquivo
 *     enviado duas vezes vira o mesmo nome — sem lixo duplicado no servidor.
 * ========================================================================== */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** 4 MB: acima disso a foto tira o leitor do post sem entregar nada a mais. */
const LIMITE_BYTES = 4 * 1024 * 1024;

/**
 * Fora de `public/` de propósito: o Next congela a lista de arquivos públicos
 * no start, e uma imagem enviada depois responderia 404 até reiniciar. Quem
 * serve é a rota `/midia/[arquivo]`.
 */
const PASTA = path.join("arquivos", "midia");
const URL_PUBLICA = "/midia";

type Tipo = { ext: "jpg" | "png" | "webp"; mime: string };

/** Identifica o formato pelos bytes iniciais. Retorna null se não for aceito. */
function identificar(bytes: Buffer): Tipo | null {
  if (bytes.length < 12) return null;

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { ext: "jpg", mime: "image/jpeg" };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return { ext: "png", mime: "image/png" };
  }

  // WebP: "RIFF" .... "WEBP"
  if (
    bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
    bytes.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return { ext: "webp", mime: "image/webp" };
  }

  return null;
}

export async function POST(request: Request) {
  if (!adminDisponivel()) {
    return NextResponse.json({ ok: false, message: "O painel não está configurado." }, { status: 503 });
  }
  if (!(await lerSessao())) {
    return NextResponse.json({ ok: false, message: "Sessão expirada." }, { status: 401 });
  }

  // Na Vercel o disco é somente leitura e não há volume persistente: guardar
  // imagem lá daria a falsa impressão de que funcionou.
  if (!armazenamentoLocal) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "O envio de imagem funciona apenas na instalação em servidor próprio. " +
          "Neste ambiente, informe o endereço de uma imagem já publicada.",
      },
      { status: 501 },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Requisição inválida: envie o arquivo no campo \"arquivo\"." },
      { status: 400 },
    );
  }

  const arquivo = form.get("arquivo");
  if (!(arquivo instanceof File)) {
    return NextResponse.json(
      { ok: false, message: "Nenhum arquivo recebido." },
      { status: 400 },
    );
  }

  if (arquivo.size === 0) {
    return NextResponse.json({ ok: false, message: "O arquivo está vazio." }, { status: 400 });
  }

  if (arquivo.size > LIMITE_BYTES) {
    const mb = (arquivo.size / 1024 / 1024).toFixed(1).replace(".", ",");
    return NextResponse.json(
      {
        ok: false,
        message: `A imagem tem ${mb} MB e o limite é 4 MB. Reduza antes de enviar (a maioria dos editores permite exportar em 1200 px de largura).`,
      },
      { status: 413 },
    );
  }

  const bytes = Buffer.from(await arquivo.arrayBuffer());
  const tipo = identificar(bytes);

  if (!tipo) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Formato não aceito. Envie JPG, PNG ou WebP. " +
          "SVG é recusado de propósito, por ser um formato que pode executar código.",
      },
      { status: 415 },
    );
  }

  try {
    const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 16);
    const nome = `${hash}.${tipo.ext}`;
    const destino = path.join(process.cwd(), PASTA);

    await mkdir(destino, { recursive: true });
    // Sobrescrever o mesmo hash é seguro: conteúdo idêntico, arquivo idêntico.
    await writeFile(path.join(destino, nome), bytes);

    return NextResponse.json({
      ok: true,
      url: `${URL_PUBLICA}/${nome}`,
      nome,
      mime: tipo.mime,
      bytes: arquivo.size,
      message: "Imagem enviada.",
    });
  } catch (erro) {
    console.error("[blog] falha ao gravar a imagem:", erro);
    return NextResponse.json(
      {
        ok: false,
        message:
          "Não consegui gravar a imagem no servidor: " +
          (erro instanceof Error ? erro.message : String(erro)),
      },
      { status: 500 },
    );
  }
}
