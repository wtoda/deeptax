import { NextResponse } from "next/server";
import { lerSessao, problemaComSenha, usuarioDaSessao } from "@/lib/admin/auth";
import { acharUsuario, definirSenha, senhaConfereComHash } from "@/lib/admin/usuarios";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Troca da própria senha, dentro do painel.
 *
 * Exige a senha atual mesmo com a sessão válida: sem isso, quem deixasse o
 * navegador aberto e destravado entregaria a conta para quem passasse — a
 * sessão dura 12 horas.
 */
export async function POST(request: Request) {
  if (!(await lerSessao())) {
    return NextResponse.json({ ok: false, message: "Sessão expirada." }, { status: 401 });
  }

  const usuario = await usuarioDaSessao();
  if (!usuario) {
    return NextResponse.json({ ok: false, message: "Sessão inválida." }, { status: 401 });
  }

  let atual = "";
  let nova = "";
  try {
    const corpo = (await request.json()) as { atual?: unknown; nova?: unknown };
    atual = typeof corpo.atual === "string" ? corpo.atual : "";
    nova = typeof corpo.nova === "string" ? corpo.nova : "";
  } catch {
    return NextResponse.json({ ok: false, message: "Requisição inválida." }, { status: 400 });
  }

  const confere = await senhaConfereComHash(atual, usuario.senha);
  if (!confere) {
    return NextResponse.json(
      { ok: false, message: "A senha atual não confere." },
      { status: 401 },
    );
  }

  const problema = problemaComSenha(nova);
  if (problema) {
    return NextResponse.json({ ok: false, message: problema }, { status: 422 });
  }

  if (atual === nova) {
    return NextResponse.json(
      { ok: false, message: "A nova senha é igual à atual. Escolha outra." },
      { status: 422 },
    );
  }

  const gravou = await definirSenha(usuario.email, nova);
  if (!gravou) {
    return NextResponse.json(
      { ok: false, message: "Não encontrei mais a sua conta. Entre novamente." },
      { status: 409 },
    );
  }

  // A sessão é mantida: o cookie não é derivado da senha, então trocar a senha
  // não derruba quem está logado — nem aqui, nem no acesso do outro usuário.
  return NextResponse.json({
    ok: true,
    message: "Senha alterada. Vale já no próximo acesso.",
  });
}

/** Só para o painel saber se a conta existe antes de mostrar o formulário. */
export async function GET() {
  const usuario = await usuarioDaSessao();
  if (!usuario) {
    return NextResponse.json({ ok: false, message: "Sessão expirada." }, { status: 401 });
  }
  const existe = Boolean(await acharUsuario(usuario.email));
  return NextResponse.json({ ok: true, email: usuario.email, nome: usuario.nome, existe });
}
