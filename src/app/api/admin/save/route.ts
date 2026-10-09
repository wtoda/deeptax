import { NextResponse } from "next/server";
import { lerSessao } from "@/lib/admin/auth";
import {
  ARQUIVO_AREAS,
  ARQUIVO_SITE,
  adminDisponivel,
  adminConfig,
  pendenciasDeConfiguracao,
} from "@/lib/admin/config";
import { ErroGitHub, gravarArquivo, lerArquivo } from "@/lib/admin/github";
import { validarSite } from "@/lib/site";
import { validarAreas } from "@/lib/services";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Primeira mensagem de erro de um validador, sem o cabeçalho. */
function problemaDe(erro: unknown): string {
  const texto = erro instanceof Error ? erro.message : String(erro);
  return texto;
}

export async function POST(request: Request) {
  if (!adminDisponivel()) {
    return NextResponse.json(
      { ok: false, message: "O painel ainda não está configurado.", pendencias: pendenciasDeConfiguracao() },
      { status: 503 },
    );
  }

  if (!(await lerSessao())) {
    return NextResponse.json({ ok: false, message: "Sessão expirada." }, { status: 401 });
  }

  let corpo: { site?: unknown; areas?: unknown; observacao?: unknown };
  try {
    corpo = (await request.json()) as typeof corpo;
  } catch {
    return NextResponse.json({ ok: false, message: "Requisição inválida." }, { status: 400 });
  }

  /* ------------------------------------------------ validação antes de gravar */
  // Gravar conteúdo inválido derrubaria a publicação: o build da Vercel falha
  // e o site fica na versão anterior. Melhor barrar aqui, com mensagem clara.
  let siteValidado: ReturnType<typeof validarSite>;
  let areasValidadas: ReturnType<typeof validarAreas>;

  try {
    siteValidado = validarSite(corpo.site);
  } catch (erro) {
    return NextResponse.json(
      { ok: false, message: `Não salvei: ${problemaDe(erro)}`, campo: "site" },
      { status: 422 },
    );
  }

  try {
    areasValidadas = validarAreas(Array.isArray(corpo.areas) ? { services: corpo.areas } : corpo.areas);
  } catch (erro) {
    return NextResponse.json(
      { ok: false, message: `Não salvei: ${problemaDe(erro)}`, campo: "areas" },
      { status: 422 },
    );
  }

  const observacao =
    typeof corpo.observacao === "string" ? corpo.observacao.trim().slice(0, 200) : "";

  try {
    const gravados: string[] = [];

    // Só gravamos o que realmente mudou: evita commit vazio e redeploy inútil.
    const [siteAtual, areasAtuais] = await Promise.all([
      lerArquivo(ARQUIVO_SITE),
      lerArquivo(ARQUIVO_AREAS),
    ]);

    const novoSite = JSON.stringify(corpo.site, null, 2) + "\n";
    const novasAreas = JSON.stringify({ services: areasValidadas }, null, 2) + "\n";

    let commit = "";
    let url = "";

    if (novoSite !== siteAtual.conteudo) {
      const r = await gravarArquivo(
        ARQUIVO_SITE,
        novoSite,
        `conteudo: atualiza dados e textos do site pelo painel${observacao ? `\n\n${observacao}` : ""}`,
      );
      gravados.push("site");
      commit = r.commit;
      url = r.url;
    }

    if (novasAreas !== areasAtuais.conteudo) {
      const r = await gravarArquivo(
        ARQUIVO_AREAS,
        novasAreas,
        `conteudo: atualiza as áreas pelo painel${observacao ? `\n\n${observacao}` : ""}`,
      );
      gravados.push("areas");
      commit = r.commit || commit;
      url = r.url || url;
    }

    if (gravados.length === 0) {
      return NextResponse.json({
        ok: true,
        semAlteracao: true,
        message: "Nada mudou desde a última publicação — nenhum commit foi criado.",
      });
    }

    return NextResponse.json({
      ok: true,
      gravados,
      commit,
      url,
      repo: adminConfig.repo,
      branch: adminConfig.branch,
      message:
        "Alterações salvas no repositório. A Vercel já está publicando — " +
        "o site costuma atualizar em cerca de 1 minuto.",
    });
  } catch (erro) {
    const status = erro instanceof ErroGitHub ? erro.status : 500;
    console.error("[admin] falha ao salvar:", erro);
    return NextResponse.json(
      { ok: false, message: erro instanceof Error ? erro.message : "Falha ao salvar." },
      { status: status === 401 || status === 403 ? 502 : status },
    );
  }
}
