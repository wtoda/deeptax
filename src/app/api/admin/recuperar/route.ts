import { NextResponse } from "next/server";
import { limparTentativas, registrarTentativa } from "@/lib/admin/auth";
import {
  VALIDADE_TOKEN_MINUTOS,
  adminDisponivel,
  emailConfigurado,
} from "@/lib/admin/config";
import { enviarEmail, textoDeRecuperacao } from "@/lib/admin/email";
import { acharUsuario, criarTokenDeRecuperacao, tokensAtivosDe } from "@/lib/admin/usuarios";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Pedido de recuperação de senha.
 *
 * Regras de segurança que definem este arquivo:
 *
 * 1. A resposta é SEMPRE a mesma, exista ou não a conta. Responder "e-mail não
 *    encontrado" entregaria a lista de quem tem acesso ao painel.
 * 2. Só gera token para conta existente — mas isso não aparece na resposta.
 * 3. Há limite de pedidos, para não inundar a caixa de alguém nem gastar a cota
 *    de envio do servidor.
 *
 * Entrega do link: por e-mail quando o SMTP está configurado. Sem SMTP, o
 * link NÃO é devolvido pela rede (seria um bypass de senha) — ele fica
 * registrado no log do servidor e a tela orienta a falar com quem administra.
 */

/**
 * A resposta depende apenas da CONFIGURAÇÃO do servidor — nunca da existência da
 * conta. Se variasse por conta, qualquer visitante descobriria quem tem acesso
 * ao painel testando endereços.
 */
const respostaPadrao = () =>
  emailConfigurado
    ? "Se este e-mail estiver cadastrado no painel, enviamos as instruções para " +
      "redefinir a senha. Confira a caixa de entrada e o lixo eletrônico."
    : "Se este e-mail estiver cadastrado, o link de redefinição foi registrado no " +
      "servidor. Este servidor ainda não envia e-mail — peça a quem administra para " +
      "executar: journalctl -u deeptax -n 30 | grep redefinir";

function origem(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "desconhecido"
  );
}

export async function POST(request: Request) {
  if (!adminDisponivel()) {
    return NextResponse.json(
      { ok: false, message: "O painel ainda não está configurado." },
      { status: 503 },
    );
  }

  let email = "";
  try {
    const corpo = (await request.json()) as { email?: unknown };
    email = typeof corpo.email === "string" ? corpo.email.trim() : "";
  } catch {
    return NextResponse.json({ ok: false, message: "Requisição inválida." }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ ok: false, message: "Informe o e-mail." }, { status: 400 });
  }

  const { liberado } = registrarTentativa(`recuperar:${origem(request)}`);
  if (!liberado) {
    return NextResponse.json(
      { ok: false, message: "Muitos pedidos em pouco tempo. Aguarde 15 minutos." },
      { status: 429 },
    );
  }

  const usuario = await acharUsuario(email);

  // Conta inexistente: mesma resposta, sem gerar token, e sem enviar nada.
  if (!usuario) {
    return NextResponse.json({ ok: true, message: respostaPadrao() });
  }

  // Evita disparo repetido: um link já ativo basta.
  if ((await tokensAtivosDe(usuario.email)) > 0) {
    return NextResponse.json({ ok: true, message: respostaPadrao() });
  }

  const { token } = await criarTokenDeRecuperacao(usuario.email);
  const link = `${site.url}/admin/redefinir?token=${encodeURIComponent(token)}`;

  if (emailConfigurado) {
    const envio = await enviarEmail({
      para: usuario.email,
      assunto: "Redefinir a senha do painel do site",
      texto: textoDeRecuperacao({
        nome: usuario.nome,
        link,
        minutos: VALIDADE_TOKEN_MINUTOS,
      }),
    });

    if (!envio.ok) {
      // O pedido seguiu, mas o e-mail não saiu. O log guarda o link para que
      // quem administra o servidor possa entregá-lo sem gerar outro token.
      console.error(
        `[admin] e-mail de recuperação NÃO enviado (${envio.erro}). Link para ${usuario.email}: ${link}`,
      );
    }

    return NextResponse.json({ ok: true, message: respostaPadrao() });
  }

  // Sem SMTP configurado: o link vai para o log do servidor, nunca para a rede.
  console.warn(
    `[admin] SMTP não configurado. Link de recuperação para ${usuario.email}: ${link}`,
  );
  limparTentativas(`recuperar:${origem(request)}`);
  return NextResponse.json({ ok: true, message: respostaPadrao() });
}
