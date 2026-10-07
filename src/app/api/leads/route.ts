import { NextResponse } from "next/server";
import {
  looksLikeBot,
  rateLimit,
  saveLead,
  validateLead,
  type LeadInput,
} from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "desconhecido";
  return ip;
}

export async function POST(request: Request) {
  /* ---------------------------------------------------- taxa de requisições */
  const { allowed } = rateLimit(clientKey(request));
  if (!allowed) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Recebemos várias solicitações deste dispositivo. Tente novamente em alguns minutos ou fale com a gente pelo WhatsApp.",
      },
      { status: 429 },
    );
  }

  /* ------------------------------------------------------------- parsing --- */
  let payload: LeadInput;
  try {
    payload = (await request.json()) as LeadInput;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Não foi possível ler os dados enviados." },
      { status: 400 },
    );
  }

  /* --------------------------------------------------------------- bots ---- */
  if (looksLikeBot(payload)) {
    // Responde como sucesso para não dar sinal ao bot, mas não grava nada.
    return NextResponse.json({ ok: true, message: "Recebido." });
  }

  /* ---------------------------------------------------------- validação ---- */
  const result = validateLead(payload);
  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: "Confira os campos destacados e envie novamente.",
        errors: result.errors,
      },
      { status: 422 },
    );
  }

  /* -------------------------------------------------------- persistência --- */
  const { stored, forwarded } = await saveLead(result.lead);

  if (!stored && !forwarded) {
    console.error("[leads] lead não pôde ser persistido:", result.lead.id);
    return NextResponse.json(
      {
        ok: false,
        message:
          "Não conseguimos registrar sua solicitação agora. Fale com a gente pelo WhatsApp para não perder o contato.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    id: result.lead.id,
    message: "Recebemos sua solicitação! Nossa equipe entra em contato em breve.",
  });
}

export async function GET() {
  return NextResponse.json(
    { ok: false, message: "Método não permitido." },
    { status: 405 },
  );
}
