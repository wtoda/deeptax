import { NextResponse } from "next/server";
import { lerSessao } from "@/lib/admin/auth";
import {
  adminDisponivel,
  ambienteDoPainel,
  emailConfigurado,
  pendenciasDeConfiguracao,
} from "@/lib/admin/config";
import { acharUsuario } from "@/lib/admin/usuarios";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Diz ao painel em que estado ele está: configurado, autenticado e quem entrou.
 *
 * Existe para o painel não precisar chamar a rota de conteúdo antes de saber se
 * há sessão — o que responderia 401 e apareceria como erro no console do
 * navegador de quem apenas abriu a página de login.
 *
 * Sempre responde 200: não ter sessão aqui é um estado normal, não um erro.
 */
export async function GET() {
  const configurado = adminDisponivel();
  const sessao = configurado ? await lerSessao() : null;
  const usuario = sessao ? await acharUsuario(sessao.email) : null;

  return NextResponse.json({
    ok: true,
    // "servidor" ou "vercel": as telas usam isso para dar instruções do
    // ambiente certo, em vez de mandar todo mundo para a Vercel.
    ambiente: ambienteDoPainel,
    /** Se o envio de e-mail está ativo — a tela de recuperação se adapta. */
    emailConfigurado,
    configurado,
    autenticado: Boolean(sessao),
    usuario: usuario ? { email: usuario.email, nome: usuario.nome } : null,
    pendencias: configurado ? [] : pendenciasDeConfiguracao(),
  });
}
