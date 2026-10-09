import { createHmac, randomBytes, timingSafeEqual, createHash } from "node:crypto";
import { cookies } from "next/headers";
import {
  DURACAO_SESSAO_SEGUNDOS,
  NOME_DO_COOKIE,
  adminConfig,
} from "@/lib/admin/config";

/**
 * Sessão do painel: um cookie assinado, sem estado no servidor.
 *
 * O cookie carrega só o vencimento; a validade vem da assinatura HMAC com um
 * segredo derivado da própria senha. Assim não é preciso guardar sessões em
 * memória (que se perderiam a cada instância nova da função na Vercel) nem
 * adicionar um banco só para isso.
 */

const assinar = (dados: string) =>
  createHmac("sha256", adminConfig.segredoSessao).update(dados).digest("base64url");

export function criarTokenDeSessao(): string {
  const expiraEm = Date.now() + DURACAO_SESSAO_SEGUNDOS * 1000;
  // O nonce evita que duas sessões criadas no mesmo segundo sejam idênticas.
  const dados = `${expiraEm}.${randomBytes(8).toString("base64url")}`;
  return `${dados}.${assinar(dados)}`;
}

export function tokenValido(token: string | undefined): boolean {
  if (!token) return false;

  const partes = token.split(".");
  if (partes.length !== 3) return false;

  const [expiraEm, nonce, assinatura] = partes;
  const dados = `${expiraEm}.${nonce}`;

  // Comparação em tempo constante: comparar com === vazaria, pelo tempo de
  // resposta, quantos caracteres da assinatura estão corretos.
  const esperada = Buffer.from(assinar(dados));
  const recebida = Buffer.from(assinatura);
  if (esperada.length !== recebida.length) return false;
  if (!timingSafeEqual(esperada, recebida)) return false;

  const vencimento = Number(expiraEm);
  return Number.isFinite(vencimento) && vencimento > Date.now();
}

/** Comparação de senha em tempo constante, sobre o hash (evita vazar tamanho). */
export function senhaConfere(tentativa: string): boolean {
  if (!adminConfig.senha) return false;
  const a = createHash("sha256").update(tentativa).digest();
  const b = createHash("sha256").update(adminConfig.senha).digest();
  return timingSafeEqual(a, b);
}

/* ------------------------------------------------------------------ cookie - */

export async function lerSessao(): Promise<boolean> {
  const jar = await cookies();
  return tokenValido(jar.get(NOME_DO_COOKIE)?.value);
}

export async function iniciarSessao(): Promise<void> {
  const jar = await cookies();
  jar.set(NOME_DO_COOKIE, criarTokenDeSessao(), {
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

/** Freia ataques de força bruta à senha do painel. */
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
