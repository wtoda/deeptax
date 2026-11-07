import { NextResponse } from "next/server";
import { lerSessao } from "@/lib/admin/auth";
import {
  adminDisponivel,
  ambienteDoPainel,
  avisoDeSenhaCurta,
  pendenciasDeConfiguracao,
} from "@/lib/admin/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Diz ao painel em que estado ele está: configurado, autenticado ou não.
 *
 * Existe para o painel não precisar chamar a rota de conteúdo antes de saber
 * se há sessão — o que responderia 401 e apareceria como erro no console do
 * navegador de quem apenas abriu a página de login.
 *
 * Sempre responde 200: não ter sessão aqui é um estado normal, não um erro.
 */
export async function GET() {
  const configurado = adminDisponivel();

  return NextResponse.json({
    ok: true,
    // "servidor" ou "vercel": as telas do painel usam isso para dar instruções
    // do ambiente certo, em vez de mandar todo mundo para a Vercel.
    ambiente: ambienteDoPainel,
    configurado,
    autenticado: configurado ? await lerSessao() : false,
    pendencias: configurado ? [] : pendenciasDeConfiguracao(),
    aviso: configurado ? avisoDeSenhaCurta() : null,
  });
}
