import { NextResponse } from "next/server";
import { lerSessao } from "@/lib/admin/auth";
import {
  ARQUIVO_AREAS,
  ARQUIVO_PAGINAS,
  ARQUIVO_SITE,
  adminDisponivel,
  adminConfig,
  armazenamentoLocal,
  pendenciasDeConfiguracao,
} from "@/lib/admin/config";
import { ErroGitHub, lerArquivo } from "@/lib/admin/github";
import { lerConteudoLocal } from "@/lib/admin/arquivos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Devolve o conteúdo atual do site.
 *
 * Lê do disco quando o site roda em servidor próprio e do repositório quando
 * roda na Vercel. Em nenhum dos casos usa a cópia empacotada no build: ela fica
 * congelada e o painel precisa mostrar o que foi salvo, e não o que existia
 * quando a aplicação subiu.
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
    // Em servidor próprio, lê do disco; na Vercel, do repositório.
    let conteudos: [string, string, string];

    if (armazenamentoLocal) {
      conteudos = await Promise.all([
        lerConteudoLocal(ARQUIVO_SITE),
        lerConteudoLocal(ARQUIVO_AREAS),
        lerConteudoLocal(ARQUIVO_PAGINAS),
      ]);
    } else {
      const remotos = await Promise.all([
        lerArquivo(ARQUIVO_SITE),
        lerArquivo(ARQUIVO_AREAS),
        lerArquivo(ARQUIVO_PAGINAS),
      ]);
      conteudos = remotos.map((r) => r.conteudo) as [string, string, string];
    }

    const [site, areas, textos] = conteudos.map((c) => JSON.parse(c)) as [
      Record<string, unknown>,
      { services?: unknown },
      Record<string, unknown>,
    ];

    return NextResponse.json({
      ok: true,
      repo: adminConfig.repo,
      branch: adminConfig.branch,
      armazenamento: armazenamentoLocal ? "local" : "github",
      site,
      areas,
      paginas: textos,
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
