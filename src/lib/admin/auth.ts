import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import {
  DURACAO_SESSAO_SEGUNDOS,
  NOME_DO_COOKIE,
  adminConfig,
} from "@/lib/admin/config";
import { acharUsuario, type Usuario } from "@/lib/admin/usuarios";

/**
 * Sessão do painel: cookie assinado, sem estado no servidor.
 *
 * O cookie carrega o vencimento e QUEM entrou. A validade vem da assinatura
 * HMAC com um segredo próprio do servidor — não da senha de alguém, porque com
 * várias contas trocar a senha de um derrubaria a sessão de todos.
 *
 * Guardar o e-mail dentro do token é o que permite registrar quem fez cada
 * alteração, em vez de existir apenas "alguém com a senha".
 */

export type Sessao = { email: string };

const assinar = (dados: string) =>
  createHmac("sha256", adminConfig.segredoSessao).update(dados).digest("base64url");

export function criarTokenDeSessao(email: string): string {
  const expiraEm = Date.now() + DURACAO_SESSAO_SEGUNDOS * 1000;
  // O nonce evita que duas sessões criadas no mesmo segundo sejam idênticas.
  const nonce = randomBytes(8).toString("base64url");
  // O e-mail vai em base64url porque contém "@" e "." — e "." é o separador.
  const emailB64 = Buffer.from(email, "utf8").toString("base64url");
  const dados = `${expiraEm}.${nonce}.${emailB64}`;
  return `${dados}.${assinar(dados)}`;
}

export function tokenValido(token: string | undefined): Sessao | null {
  if (!token) return null;

  const partes = token.split(".");
  if (partes.length !== 4) return null;

  const [expiraEm, nonce, emailB64, assinatura] = partes;
  const dados = `${expiraEm}.${nonce}.${emailB64}`;

  // Comparação em tempo constante: comparar com === vazaria, pelo tempo de
  // resposta, quantos caracteres da assinatura estão corretos.
  const esperada = Buffer.from(assinar(dados));
  const recebida = Buffer.from(assinatura);
  if (esperada.length !== recebida.length) return null;
  if (!timingSafeEqual(esperada, recebida)) return null;

  const vencimento = Number(expiraEm);
  if (!Number.isFinite(vencimento) || vencimento <= Date.now()) return null;

  try {
    return { email: Buffer.from(emailB64, "base64url").toString("utf8") };
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ cookie - */

/** Sessão atual, ou null. Todos os chamadores usam como verdadeiro/falso. */
export async function lerSessao(): Promise<Sessao | null> {
  const jar = await cookies();
  return tokenValido(jar.get(NOME_DO_COOKIE)?.value);
}

/** Usuário da sessão atual, já com nome — para exibir no painel. */
export async function usuarioDaSessao(): Promise<Usuario | null> {
  const sessao = await lerSessao();
  if (!sessao) return null;
  return acharUsuario(sessao.email);
}

export async function iniciarSessao(email: string): Promise<void> {
  const jar = await cookies();
  jar.set(NOME_DO_COOKIE, criarTokenDeSessao(email), {
    httpOnly: true,
    sameSite: "lax",
    // Em produção o site é sempre https; em desenvolvimento local não, e um
    // cookie `secure` não seria enviado pelo navegador em http.
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DURACAO_SESSAO_SEGUNDOS,
  });
}

export async function encerrarSessao(): Promise<void> {
  const jar = await cookies();
  jar.delete(NOME_DO_COOKIE);
}

/* ------------------------------------------------- limite de tentativas ---- */

const tentativas = new Map<string, { total: number; liberaEm: number }>();
const JANELA_MS = 15 * 60 * 1000;
const MAX_TENTATIVAS = 8;

/**
 * Freia ataques de força bruta. A chave separa o login da recuperação de senha,
 * e combina IP com e-mail — senão um ataque a uma conta bloquearia o acesso de
 * outra pessoa na mesma rede.
 */
export function registrarTentativa(chave: string): { liberado: boolean; restam: number } {
  const agora = Date.now();
  const atual = tentativas.get(chave);

  if (!atual || atual.liberaEm < agora) {
    tentativas.set(chave, { total: 1, liberaEm: agora + JANELA_MS });
    return { liberado: true, restam: MAX_TENTATIVAS - 1 };
  }

  atual.total += 1;
  if (atual.total > MAX_TENTATIVAS) return { liberado: false, restam: 0 };
  return { liberado: true, restam: MAX_TENTATIVAS - atual.total };
}

export function limparTentativas(chave: string): void {
  tentativas.delete(chave);
}

/* ----------------------------------------------------- política de senha --- */

export const TAMANHO_MINIMO_SENHA = 10;

/**
 * Regras mínimas de senha.
 *
 * Comprimento protege mais do que variedade de símbolos, e regra complicada
 * acaba virando senha anotada no papel. Por isso exigimos tamanho e nada mais.
 */
export function problemaComSenha(senha: string): string | null {
  if (senha.length < TAMANHO_MINIMO_SENHA) {
    return `A senha precisa ter pelo menos ${TAMANHO_MINIMO_SENHA} caracteres.`;
  }
  if (/^\s|\s$/.test(senha)) {
    return "A senha não pode começar nem terminar com espaço.";
  }
  return null;
}
