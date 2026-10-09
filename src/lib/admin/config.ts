/**
 * ============================================================================
 *  CONFIGURAÇÃO DO PAINEL DE EDIÇÃO
 * ============================================================================
 *  O painel fica em /admin e só funciona com estas variáveis de ambiente
 *  configuradas na Vercel (Settings → Environment Variables):
 *
 *    ADMIN_PASSWORD   senha de acesso ao painel (você escolhe)
 *    GITHUB_TOKEN     token do GitHub com permissão de escrita no conteúdo
 *    GITHUB_REPO      "usuario/repositorio" (padrão: wtoda/deeptax)
 *    GITHUB_BRANCH    branch onde salvar (padrão: main)
 *
 *  Sem ADMIN_PASSWORD ou GITHUB_TOKEN, o painel se declara indisponível e
 *  mostra o que falta — em vez de existir aberto ou falhar de forma confusa.
 * ============================================================================
 */

export const adminConfig = {
  senha: process.env.ADMIN_PASSWORD ?? "",
  token: process.env.GITHUB_TOKEN ?? "",
  repo: process.env.GITHUB_REPO ?? "wtoda/deeptax",
  branch: process.env.GITHUB_BRANCH ?? "main",
  /**
   * Endereço da API do GitHub. Só precisa mudar para GitHub Enterprise ou
   * para apontar a um simulador em testes.
   */
  apiBase: process.env.GITHUB_API_URL ?? "https://api.github.com",
  /** Segredo da sessão: derivado da senha, para não exigir outra variável. */
  get segredoSessao() {
    return process.env.ADMIN_SESSION_SECRET || `deeptax::${this.senha}`;
  },
} as const;

export const NOME_DO_COOKIE = "deeptax_admin";

/** Arquivos de conteúdo versionados no repositório. */
export const ARQUIVO_SITE = "content/site.json";
export const ARQUIVO_AREAS = "content/services.json";
/** Duração da sessão: 12 horas. */
export const DURACAO_SESSAO_SEGUNDOS = 12 * 60 * 60;

export type PendenciaDeConfiguracao = { variavel: string; explica: string };

/**
 * Lista o que falta para o painel funcionar. Conteúdo usado tanto pela
 * interface quanto pelas rotas de API.
 */
export function pendenciasDeConfiguracao(): PendenciaDeConfiguracao[] {
  const faltando: PendenciaDeConfiguracao[] = [];

  if (!adminConfig.senha) {
    faltando.push({
      variavel: "ADMIN_PASSWORD",
      explica: "senha que protege o acesso ao painel",
    });
  } else if (adminConfig.senha.length < 10) {
    faltando.push({
      variavel: "ADMIN_PASSWORD",
      explica: "a senha precisa ter pelo menos 10 caracteres",
    });
  }

  if (!adminConfig.token) {
    faltando.push({
      variavel: "GITHUB_TOKEN",
      explica:
        "token do GitHub com permissão de leitura e escrita em Contents, para o painel gravar as alterações no repositório",
    });
  }

  if (!/^[\w.-]+\/[\w.-]+$/.test(adminConfig.repo)) {
    faltando.push({
      variavel: "GITHUB_REPO",
      explica: `deve estar no formato usuario/repositorio (valor atual: "${adminConfig.repo}")`,
    });
  }

  return faltando;
}

export const adminDisponivel = () => pendenciasDeConfiguracao().length === 0;
