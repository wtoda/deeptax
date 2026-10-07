import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Identifica qual build está no ar.
 *
 * Existe porque verificar um deploy por comportamento é frágil: mudanças só no
 * servidor não alteram o HTML, e mensagens de erro podem ser idênticas entre
 * builds diferentes. Com este endpoint, um único GET responde qual commit está
 * publicado — útil tanto para depurar quanto para monitoramento.
 *
 * A Vercel injeta estas variáveis automaticamente no build. Executando local,
 * os campos voltam nulos e "commit" aparece como "local".
 *
 * Expõe apenas o SHA do commit e o ambiente — nenhum dado sensível.
 */
export async function GET() {
  return NextResponse.json(
    {
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
      commitFull: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
      branch: process.env.VERCEL_GIT_COMMIT_REF ?? null,
      message: process.env.VERCEL_GIT_COMMIT_MESSAGE?.split("\n")[0] ?? null,
      env: process.env.VERCEL_ENV ?? "development",
      region: process.env.VERCEL_REGION ?? null,
      deployUrl: process.env.VERCEL_URL ?? null,
    },
    {
      headers: {
        // Nunca cachear: o objetivo é sempre refletir o build atual.
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
