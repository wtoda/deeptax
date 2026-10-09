import { adminConfig } from "@/lib/admin/config";

/**
 * Leitura e gravação do conteúdo no GitHub.
 *
 * O painel não altera arquivos locais: ele grava no repositório. A Vercel
 * detecta o push e publica. Isso mantém o repositório como fonte única da
 * verdade — o que está no ar é sempre o que está versionado, e todo ajuste de
 * texto fica registrado no histórico, com autor e data.
 */

const API = adminConfig.apiBase;

export type ArquivoRemoto = { conteudo: string; sha: string };

class ErroGitHub extends Error {
  constructor(
    mensagem: string,
    readonly status: number,
  ) {
    super(mensagem);
    this.name = "ErroGitHub";
  }
}

async function chamarApi(caminho: string, init: RequestInit = {}): Promise<Response> {
  const resposta = await fetch(`${API}${caminho}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${adminConfig.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    // Evita requisição pendurada travar o painel sem explicação.
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
  });

  if (!resposta.ok) {
    const corpo = await resposta.text().catch(() => "");
    const detalhe = corpo.slice(0, 300);

    if (resposta.status === 401) {
      throw new ErroGitHub(
        "O GITHUB_TOKEN foi recusado (401). Confira se o token está correto e se não expirou.",
        resposta.status,
      );
    }
    if (resposta.status === 403) {
      throw new ErroGitHub(
        "O GITHUB_TOKEN não tem permissão para esta operação (403). Ele precisa de acesso " +
          `de leitura E escrita em "Contents" no repositório ${adminConfig.repo}.`,
        resposta.status,
      );
    }
    if (resposta.status === 404) {
      throw new ErroGitHub(
        `Não encontrei o repositório ou o arquivo (404). Confira GITHUB_REPO (hoje: ` +
          `"${adminConfig.repo}") e se o token dá acesso a ele. Detalhe: ${detalhe}`,
        resposta.status,
      );
    }
    if (resposta.status === 409 || resposta.status === 422) {
      throw new ErroGitHub(
        "O arquivo mudou no repositório desde que você abriu o painel. " +
          "Recarregue a página para carregar a versão atual e refaça a alteração.",
        resposta.status,
      );
    }

    throw new ErroGitHub(
      `O GitHub recusou a operação (HTTP ${resposta.status}). Detalhe: ${detalhe}`,
      resposta.status,
    );
  }

  return resposta;
}

const caminhoDoArquivo = (arquivo: string) =>
  `/repos/${adminConfig.repo}/contents/${arquivo}?ref=${adminConfig.branch}`;

export async function lerArquivo(arquivo: string): Promise<ArquivoRemoto> {
  const resposta = await chamarApi(caminhoDoArquivo(arquivo));
  const dados = (await resposta.json()) as { content?: string; sha?: string };

  if (!dados.content) {
    throw new ErroGitHub(`O arquivo ${arquivo} veio vazio do repositório.`, 500);
  }

  return {
    conteudo: Buffer.from(dados.content, "base64").toString("utf8"),
    sha: dados.sha ?? "",
  };
}

export async function gravarArquivo(
  arquivo: string,
  conteudo: string,
  mensagem: string,
): Promise<{ commit: string; url: string }> {
  // Lemos o sha imediatamente antes de gravar: é o que o GitHub usa para
  // detectar que alguém alterou o arquivo nesse meio-tempo.
  const { sha } = await lerArquivo(arquivo);

  const resposta = await chamarApi(`/repos/${adminConfig.repo}/contents/${arquivo}`, {
    method: "PUT",
    body: JSON.stringify({
      message: mensagem,
      content: Buffer.from(conteudo, "utf8").toString("base64"),
      sha,
      branch: adminConfig.branch,
    }),
  });

  const dados = (await resposta.json()) as {
    commit?: { sha?: string; html_url?: string };
  };

  return {
    commit: dados.commit?.sha?.slice(0, 7) ?? "",
    url: dados.commit?.html_url ?? `https://github.com/${adminConfig.repo}`,
  };
}

export { ErroGitHub };
