import { NextResponse } from "next/server";
import { iniciarSessao, limparTentativas, registrarTentativa } from "@/lib/admin/auth";
import { adminDisponivel, pendenciasDeConfiguracao } from "@/lib/admin/config";
import { normalizarEmail, verificarCredenciais } from "@/lib/admin/usuarios";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
      {
        ok: false,
        message: "O painel ainda não está configurado.",
        pendencias: pendenciasDeConfiguracao(),
      },
      { status: 503 },
    );
  }

  let usuario = "";
  let senha = "";
  try {
    const corpo = (await request.json()) as { usuario?: unknown; email?: unknown; senha?: unknown };
    usuario = typeof corpo.usuario === "string" ? corpo.usuario : typeof corpo.email === "string" ? corpo.email : "";
    senha = typeof corpo.senha === "string" ? corpo.senha : "";
  } catch {
    return NextResponse.json({ ok: false, message: "Requisição inválida." }, { status: 400 });
  }

  if (!usuario.trim() || !senha) {
    return NextResponse.json(
      { ok: false, message: "Informe o e-mail e a senha." },
      { status: 400 },
    );
  }

  // O limite combina IP e conta: um ataque contra uma conta não pode trancar o
  // acesso de outra pessoa que esteja na mesma rede.
  const chave = `login:${origem(request)}:${normalizarEmail(usuario)}`;
  const { liberado } = registrarTentativa(chave);
  if (!liberado) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Muitas tentativas de acesso. Aguarde 15 minutos ou use “Esqueci a senha” " +
          "para definir uma nova.",
      },
      { status: 429 },
    );
  }

  const encontrado = await verificarCredenciais(usuario, senha);

  if (!encontrado) {
    // Mesma resposta para e-mail inexistente e senha errada: dizer qual dos dois
    // falhou entregaria a lista de quem tem acesso ao painel.
    return NextResponse.json(
      { ok: false, message: "E-mail ou senha incorretos." },
      { status: 401 },
    );
  }

  limparTentativas(chave);
  await iniciarSessao(encontrado.email);

  return NextResponse.json({ ok: true, usuario: { email: encontrado.email, nome: encontrado.nome } });
}
