import { readFile, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import {
  ARQUIVO_AREAS,
  ARQUIVO_PAGINAS,
  ARQUIVO_SITE,
} from "@/lib/admin/config";

/**
 * ============================================================================
 *  ARMAZENAMENTO LOCAL DE CONTEÚDO
 * ============================================================================
 *  Quando o site roda em servidor próprio (não na Vercel), o painel grava os
 *  arquivos de conteúdo direto no disco. É o modo natural de auto-hospedagem:
 *  não depende de token do GitHub, de webhook nem de reconstrução remota.
 *
 *  Na Vercel o disco é somente leitura, então lá o painel continua gravando via
 *  API do GitHub. O restante do código não precisa saber qual modo está ativo.
 * ========================================================================== */

const RAIZ = process.cwd();

const arquivosPermitidos = new Set([ARQUIVO_SITE, ARQUIVO_AREAS, ARQUIVO_PAGINAS]);

/**
 * Resolve o caminho absoluto de um arquivo de conteúdo, recusando qualquer coisa
 * fora da lista. Barreira contra escrita em caminho arbitrário, ainda que o
 * nome venha de uma requisição.
 */
function caminhoSeguro(arquivo: string): string {
  if (!arquivosPermitidos.has(arquivo)) {
    throw new Error(`Arquivo de conteúdo não permitido: ${arquivo}`);
  }
  return path.join(RAIZ, arquivo);
}

export async function lerConteudoLocal(arquivo: string): Promise<string> {
  return readFile(caminhoSeguro(arquivo), "utf8");
}

export async function gravarConteudoLocal(
  arquivo: string,
  conteudo: string,
): Promise<void> {
  const destino = caminhoSeguro(arquivo);
  // Grava num temporário e renomeia: se algo falhar no meio, o arquivo bom
  // continua intacto em vez de ficar truncado.
  const temporario = `${destino}.tmp-${process.pid}`;
  await writeFile(temporario, conteudo, "utf8");
  await rename(temporario, destino);
}
