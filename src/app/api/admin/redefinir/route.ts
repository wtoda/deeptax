import { NextResponse } from "next/server";
import { problemaComSenha, registrarTentativa } from "@/lib/admin/auth";
import { adminDisponivel } from "@/lib/admin/config";
import {
  consumirTokenDeRecuperacao,
  definirSenha,
  tokenDeRecuperacaoAtivo,
} from "@/lib/admin/usuarios";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Confere se o link ainda vale — a tela usa isso ao abrir. */
export async function GET(request: Request) {
  if (!adminDisponivel()) {
    return NextResponse.json(
      { ok: false, message: "O painel não está configurado." },
      { status: 503 },
    );
  }

  const token = new URL(request.url).searchParams.get("token") ?? "";
  if (!token) {
    return NextResponse.json({ ok: false, message: "Link incompleto." }, { status: 400 });
  }

  const valido = await tokenDeRecuperacaoAtivo(token);
  return NextResponse.json({
    ok: true,
    valido,
    message: valido
      ? "Link válido. Escolha a nova senha."
      : "Este link expirou ou já foi usado. Peça outro.",
  });
}

/** Define a nova senha a partir do token. */
export async function POST(request: Request) {
  if (!adminDisponivel()) {
    return NextResponse.json(
      { ok: false, message: "O painel não está configurado." },
      { status: 503 },
    );
  }

  let token = "";
  let nova = "";
  try {
    const corpo = (await request.json()) as { token?: unknown; nova?: unknown };
    token = typeof corpo.token === "string" ? corpo.token : "";
    nova = typeof corpo.nova === "string" ? corpo.nova : "";
  } catch {
    return NextResponse.json({ ok: false, message: "Requisição inválida." }, { status: 400 });
  }

  const { liberado } = registrarTentativa("redefinir:tentativa");
  if (!liberado) {
    return NextResponse.json(
      { ok: false, message: "Muitas tentativas. Aguarde 15 minutos e peça um link novo." },
      { status: 429 },
    );
  }

  const problema = problemaComSenha(nova);
  if (problema) {
    return NextResponse.json({ ok: false, message: problema }, { status: 422 });
  }

  // Consome ANTES de gravar: se algo falhar depois, o link já não vale. Melhor
  // pedir outro do que deixar um token reaproveitável em circulação.
  const consumo = await consumirTokenDeRecuperacao(token);
  if (!consumo) {
    return NextResponse.json(
      { ok: false, message: "Este link expirou ou já foi usado. Peça um novo." },
      { status: 410 },
    );
  }

  const gravou = await definirSenha(consumo.email, nova);
  if (!gravou) {
    return NextResponse.json(
      { ok: false, message: "A conta não existe mais no painel." },
      { status: 409 },
    );
  }

  return NextResponse.json({
    ok: true,
    email: consumo.email,
    message: "Senha redefinida. Entre com a nova senha.",
  });
}
