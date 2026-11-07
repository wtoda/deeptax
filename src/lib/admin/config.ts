import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import path from "node:path";

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
  /**
   * Segredo que assina o cookie de sessão.
   *
   * Não pode vir da senha de um usuário: com várias contas, trocar a senha
   * derrubaria a sessão de todo mundo, e a saída de um usuário invalidaria o
   * acesso dos demais. A ordem é: variável de ambiente, arquivo gerado no
   * servidor, e só no fim a senha antiga (para não quebrar instalação Vercel).
   */
  get segredoSessao() {
    return obterSegredoDeSessao();
  },
} as const;

export const NOME_DO_COOKIE = "deeptax_admin";

/** Arquivos de conteúdo versionados no repositório. */
export const ARQUIVO_SITE = "content/site.json";
export const ARQUIVO_AREAS = "content/services.json";
export const ARQUIVO_PAGINAS = "content/paginas.json";
export const ARQUIVO_POSTS = "content/posts.json";

/**
 * Dados de operação do painel — fora de `content/` de propósito: `content/` é
 * conteúdo editorial (versionado, editável pelo painel). Credenciais e tokens
 * ficam em `dados/`, que entra no .gitignore.
 */
export const PASTA_DADOS = "dados";
export const ARQUIVO_USUARIOS = "dados/usuarios.json";
export const ARQUIVO_TOKENS = "dados/tokens-senha.json";

/** Validade do link de recuperação de senha. */
export const VALIDADE_TOKEN_MINUTOS = 30;
/** Duração da sessão: 12 horas. */
export const DURACAO_SESSAO_SEGUNDOS = 12 * 60 * 60;

/**
 * Em servidor próprio (fora da Vercel) o disco é gravável e o painel salva os
 * arquivos de conteúdo localmente. Na Vercel o disco é somente leitura, então
 * lá o único caminho é a API do GitHub.
 */
export const armazenamentoLocal = !process.env.VERCEL;

/**
 * Onde o painel está rodando. É isto que decide o TEXTO das instruções: a
 * mesma tela de configuração precisa dizer coisas diferentes conforme o
 * ambiente, em vez de mandar todo mundo para a Vercel.
 */
export const ambienteDoPainel = armazenamentoLocal ? "servidor" : "vercel";


export type PendenciaDeConfiguracao = {
  variavel: string;
  explica: string;
  /** Atalho para resolver — quando existe, o painel exibe como botão. */
  atalho?: { texto: string; url: string };
  /** Passo a passo curto, mostrado na tela de configuração. */
  passos?: string[];
};

/**
 * Lista o que falta para o painel funcionar. Conteúdo usado tanto pela
 * interface quanto pelas rotas de API.
 */
export function pendenciasDeConfiguracao(): PendenciaDeConfiguracao[] {
  const faltando: PendenciaDeConfiguracao[] = [];

  // O acesso ao painel é por conta de usuário, e não mais por uma senha única
  // compartilhada: sem nenhum usuário cadastrado, não há como entrar.
  if (usuariosCadastrados() === 0) {
    faltando.push({
      variavel: "nenhum usuário cadastrado",
      explica:
        "o painel não tem contas. São as contas que dão acesso e identificam quem " +
        "alterou cada texto — não existe mais senha única compartilhada.",
      passos:
        ambienteDoPainel === "servidor"
          ? [
              "No servidor, rode: node scripts/gerenciar-usuarios.mjs criar",
              "Informe o e-mail e a senha quando o comando pedir.",
              "Pronto: entre em /admin/login com esse e-mail e senha.",
            ]
          : [
              "Rode localmente: node scripts/gerenciar-usuarios.mjs criar",
              "O arquivo dados/usuarios.json precisa ir junto no deploy.",
            ],
    });
  }

  // O token só é necessário quando a gravação depende do GitHub.
  if (!armazenamentoLocal && !adminConfig.token) {
    faltando.push({
      variavel: "GITHUB_TOKEN",
      explica:
        "token do GitHub que autoriza o painel a gravar as alterações nos arquivos de conteúdo",
      atalho: {
        texto: "Criar o token no GitHub",
        url: "https://github.com/settings/personal-access-tokens/new",
      },
      passos: [
        "Em Repository access, escolha “Only select repositories” e marque wtoda/deeptax.",
        "Em Permissions → Repository permissions, dê acesso “Read and write” a Contents.",
        "Gere o token e copie (o GitHub só mostra uma vez).",
        ambienteDoPainel === "servidor"
          ? "Acrescente a linha GITHUB_TOKEN=... em /opt/deeptax/deeptax.env e reinicie o serviço."
          : "Cole em Vercel → Settings → Environment Variables → nome GITHUB_TOKEN.",
      ],
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

/**
 * Quantos usuários existem, em leitura síncrona.
 *
 * `adminDisponivel()` é síncrono e chamado no começo de cada rota do painel —
 * por isso a leitura direta, sem await. O arquivo é pequeno e o tráfego do
 * painel é mínimo.
 */
export function usuariosCadastrados(): number {
  try {
    const bruto = readFileSync(path.join(process.cwd(), ARQUIVO_USUARIOS), "utf8");
    const dados = JSON.parse(bruto) as { usuarios?: unknown };
    return Array.isArray(dados.usuarios) ? dados.usuarios.length : 0;
  } catch {
    return 0;
  }
}

/* ------------------------------------------------- segredo de sessão ------- */

let segredoEmCache: string | null = null;

/**
 * Segredo que assina o cookie.
 *
 * No servidor próprio ele é gerado uma vez e guardado em `dados/segredo-sessao`
 * (permissão 600). Assim a sessão sobrevive a reinícios e não depende de
 * nenhuma variável configurada à mão. Na Vercel, onde o disco é somente leitura,
 * cai para a senha antiga — que continua servindo de semente.
 */
function obterSegredoDeSessao(): string {
  if (process.env.ADMIN_SESSION_SECRET) return process.env.ADMIN_SESSION_SECRET;
  if (segredoEmCache) return segredoEmCache;

  try {
    // Leitura síncrona de propósito: o getter é usado em contexto síncrono e
    // isto roda uma vez por processo, não a cada requisição.
    const arquivo = path.join(process.cwd(), PASTA_DADOS, "segredo-sessao");

    if (existsSync(arquivo)) {
      const lido = readFileSync(arquivo, "utf8").trim();
      if (lido.length >= 32) {
        segredoEmCache = lido;
        return lido;
      }
    }

    const novo = randomBytes(48).toString("base64url");
    mkdirSync(path.dirname(arquivo), { recursive: true });
    writeFileSync(arquivo, novo, { mode: 0o600 });
    segredoEmCache = novo;
    return novo;
  } catch {
    // Ambiente sem disco gravável: mantém a compatibilidade com a Vercel.
    segredoEmCache = `deeptax::${adminConfig.senha}`;
    return segredoEmCache;
  }
}

/* ------------------------------------------------------------- e-mail ------ */

/**
 * Envio de e-mail do painel (recuperação de senha).
 *
 * Sem estas variáveis a recuperação continua funcionando, mas entrega o link
 * por outro caminho — ver `lib/admin/email.ts`. Nada quebra por falta delas.
 */
export const emailConfig = {
  host: process.env.SMTP_HOST ?? "",
  porta: Number(process.env.SMTP_PORT ?? 465),
  usuario: process.env.SMTP_USER ?? "",
  senha: process.env.SMTP_PASS ?? "",
  remetente: process.env.SMTP_FROM ?? "Deeptax <contato@deeptax.com.br>",
} as const;

export const emailConfigurado = Boolean(
  emailConfig.host && emailConfig.usuario && emailConfig.senha,
);
