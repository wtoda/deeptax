import { NextResponse } from "next/server";
import { lerSessao } from "@/lib/admin/auth";
import {
  ARQUIVO_POSTS,
  adminConfig,
  adminDisponivel,
  armazenamentoLocal,
  pendenciasDeConfiguracao,
} from "@/lib/admin/config";
import { gravarConteudoLocal, lerConteudoLocal } from "@/lib/admin/arquivos";
import { ErroGitHub, gravarArquivo, lerArquivo } from "@/lib/admin/github";
import { validarPosts } from "@/lib/blog";

/**
 * ============================================================================
 *  API DO BLOG (painel)
 * ============================================================================
 *  GET  → todos os posts, inclusive rascunhos (só quem está logado vê)
 *  PUT  → grava a lista inteira, depois de validar
 *
 *  A gravação reaproveita o mecanismo do resto do painel: no servidor próprio,
 *  escreve `content/posts.json` no disco (grava em temporário e renomeia, o que
 *  dispara o observador que reconstrói o site); na Vercel, grava pelo GitHub.
 *
 *  O arquivo é gravado inteiro, e não por post. É simples e seguro: não existe
 *  estado parcial, e o painel é usado por uma pessoa de cada vez.
 * ========================================================================== */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const naoConfigurado = () =>
  NextResponse.json(
    {
      ok: false,
      message: "O painel ainda não está configurado.",
      pendencias: pendenciasDeConfiguracao(),
    },
    { status: 503 },
  );

const semSessao = () =>
  NextResponse.json({ ok: false, message: "Sessão expirada." }, { status: 401 });

export async function GET() {
  if (!adminDisponivel()) return naoConfigurado();
  if (!(await lerSessao())) return semSessao();

  try {
    const bruto = armazenamentoLocal
      ? await lerConteudoLocal(ARQUIVO_POSTS)
      : (await lerArquivo(ARQUIVO_POSTS)).conteudo;

    // Devolve como está no disco: se alguém gravou um JSON inválido à mão, o
    // painel precisa mostrar o problema em vez de fingir que está tudo certo.
    const dados = JSON.parse(bruto) as { posts?: unknown };
    return NextResponse.json({
      ok: true,
      armazenamento: armazenamentoLocal ? "local" : "github",
      repo: adminConfig.repo,
      branch: adminConfig.branch,
      posts: Array.isArray(dados.posts) ? dados.posts : [],
    });
  } catch (erro) {
    const status = erro instanceof ErroGitHub ? erro.status : 500;
    console.error("[blog] falha ao ler os posts:", erro);
    return NextResponse.json(
      {
        ok: false,
        message:
          erro instanceof Error
            ? `Não consegui ler ${ARQUIVO_POSTS}: ${erro.message}`
            : "Falha ao ler os posts.",
      },
      { status: status === 401 || status === 403 ? 502 : status },
    );
  }
}

export async function PUT(request: Request) {
  if (!adminDisponivel()) return naoConfigurado();
  if (!(await lerSessao())) return semSessao();

  let corpo: { posts?: unknown; observacao?: unknown };
  try {
    corpo = (await request.json()) as typeof corpo;
  } catch {
    return NextResponse.json({ ok: false, message: "Requisição inválida." }, { status: 400 });
  }

  // Valida ANTES de gravar: post inválido derrubaria a publicação, e o site
  // ficaria preso na versão anterior sem ninguém entender por quê.
  let validado;
  try {
    validado = validarPosts({ posts: corpo.posts });
  } catch (erro) {
    return NextResponse.json(
      { ok: false, message: erro instanceof Error ? erro.message : "Conteúdo inválido." },
      { status: 422 },
    );
  }

  const conteudo =
    JSON.stringify(
      {
        posts: validado.posts,
      },
      null,
      2,
    ) + "\n";

  const observacao =
    typeof corpo.observacao === "string" ? corpo.observacao.trim().slice(0, 200) : "";
  const mensagemDeCommit = `blog: atualiza posts pelo painel${observacao ? `\n\n${observacao}` : ""}`;

  try {
    /* -------------------------------------------- servidor próprio ------- */
    if (armazenamentoLocal) {
      const atual = await lerConteudoLocal(ARQUIVO_POSTS);

      if (atual === conteudo) {
        return NextResponse.json({
          ok: true,
          semAlteracao: true,
          message: "Nada mudou desde a última publicação — nada foi regravado.",
        });
      }

      await gravarConteudoLocal(ARQUIVO_POSTS, conteudo);

      // Registro no GitHub é opcional aqui: serve de histórico e backup.
      let aviso: string | undefined;
      if (adminConfig.token) {
        try {
          await gravarArquivo(ARQUIVO_POSTS, conteudo, mensagemDeCommit);
        } catch (erro) {
          aviso =
            "Os posts foram salvos no servidor, mas não foi possível registrá-los no GitHub: " +
            (erro instanceof Error ? erro.message : String(erro));
        }
      }

      const rascunhos = validado.posts.filter((p) => p.rascunho).length;
      return NextResponse.json({
        ok: true,
        armazenamento: "local",
        aviso,
        posts: validado.posts.length,
        rascunhos,
        message:
          "Blog salvo. O site é reconstruído automaticamente em cerca de 1 minuto — " +
          "recarregue a página para ver.",
      });
    }

    /* --------------------------------------------------- Vercel --------- */
    const atual = await lerArquivo(ARQUIVO_POSTS);
    if (atual.conteudo === conteudo) {
      return NextResponse.json({
        ok: true,
        semAlteracao: true,
        message: "Nada mudou desde a última publicação — nenhum commit foi criado.",
      });
    }

    const r = await gravarArquivo(ARQUIVO_POSTS, conteudo, mensagemDeCommit);
    return NextResponse.json({
      ok: true,
      armazenamento: "github",
      commit: r.commit,
      url: r.url,
      repo: adminConfig.repo,
      branch: adminConfig.branch,
      message:
        "Posts salvos no repositório. A Vercel já está publicando — " +
        "o site costuma atualizar em cerca de 1 minuto.",
    });
  } catch (erro) {
    const status = erro instanceof ErroGitHub ? erro.status : 500;
    console.error("[blog] falha ao salvar os posts:", erro);
    return NextResponse.json(
      { ok: false, message: erro instanceof Error ? erro.message : "Falha ao salvar." },
      { status: status === 401 || status === 403 ? 502 : status },
    );
  }
}
