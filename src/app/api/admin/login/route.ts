import { NextResponse } from "next/server";
import {
  iniciarSessao,
  limparTentativas,
  registrarTentativa,
  senhaConfere,
} from "@/lib/admin/auth";
import { adminDisponivel, pendenciasDeConfiguracao } from "@/lib/admin/config";

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

  const chave = origem(request);
  const { liberado } = registrarTentativa(`login:${chave}`);
  if (!liberado) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Muitas tentativas de acesso. Aguarde 15 minutos ou redefina a senha " +
          "alterando a variável ADMIN_PASSWORD na Vercel.",
      },
      { status: 429 },
    );
  }

  let senha = "";
  try {
    const corpo = (await request.json()) as { senha?: unknown };
    senha = typeof corpo.senha === "string" ? corpo.senha : "";
  } catch {
    return NextResponse.json({ ok: false, message: "Requisição inválida." }, { status: 400 });
  }

  if (!senhaConfere(senha)) {
    return NextResponse.json(
      { ok: false, message: "Senha incorreta." },
      { status: 401 },
    );
  }

  limparTentativas(`login:${chave}`);
  await iniciarSessao();
  return NextResponse.json({ ok: true });
}
