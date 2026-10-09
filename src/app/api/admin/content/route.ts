import { NextResponse } from "next/server";
import { lerSessao } from "@/lib/admin/auth";
import {
  ARQUIVO_AREAS,
  ARQUIVO_SITE,
  ARQUIVO_PAGINAS,
  adminDisponivel,
  adminConfig,
  pendenciasDeConfiguracao,
} from "@/lib/admin/config";
import { ErroGitHub, lerArquivo } from "@/lib/admin/github";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Devolve o conteúdo atual do site, lido direto do repositório.
 *
 * Lemos do GitHub, e não da cópia empacotada no build, porque a cópia do
 * build fica congelada: depois de salvar, o painel precisa mostrar o que foi
 * salvo, e não o que estava no ar quando a função subiu.
 */
export async function GET() {
  if (!adminDisponivel()) {
    return NextResponse.json(
      { ok: false, message: "O painel ainda não está configurado.", pendencias: pendenciasDeConfiguracao() },
      { status: 503 },
    );
  }

  if (!(await lerSessao())) {
    return NextResponse.json({ ok: false, message: "Sessão expirada." }, { status: 401 });
  }

  try {
    const [site, areas, textos] = await Promise.all([
      lerArquivo(ARQUIVO_SITE),
      lerArquivo(ARQUIVO_AREAS),
      lerArquivo(ARQUIVO_PAGINAS),
    ]);

    return NextResponse.json({
      ok: true,
      repo: adminConfig.repo,
      branch: adminConfig.branch,
      site: JSON.parse(site.conteudo),
      areas: JSON.parse(areas.conteudo),
      paginas: JSON.parse(textos.conteudo),
    });
  } catch (erro) {
    const status = erro instanceof ErroGitHub ? erro.status : 500;
    console.error("[admin] falha ao ler o conteúdo:", erro);
    return NextResponse.json(
      { ok: false, message: erro instanceof Error ? erro.message : "Falha ao ler o conteúdo." },
      { status: status === 401 || status === 403 ? 502 : status },
    );
  }
}
