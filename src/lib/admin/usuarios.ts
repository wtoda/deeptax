import { createHash, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import {
  ARQUIVO_TOKENS,
  ARQUIVO_USUARIOS,
  PASTA_DADOS,
  VALIDADE_TOKEN_MINUTOS,
} from "@/lib/admin/config";

/**
 * ============================================================================
 *  USUÁRIOS DO PAINEL
 * ============================================================================
 *  Cada pessoa que administra o site tem a sua conta. A senha nunca é gravada:
 *  o que fica no arquivo é o resultado do scrypt (derivação lenta, com sal
 *  próprio por usuário). Quem ler o arquivo não consegue voltar à senha.
 *
 *  Por que scrypt e não SHA-256: hash rápido é bom para integridade e péssimo
 *  para senha — bilhões de tentativas por segundo. O scrypt é caro de propósito.
 *
 *  Arquivo: `dados/usuarios.json` (fora de `content/`, e fora do Git).
 * ========================================================================== */

export type Usuario = {
  email: string;
  nome: string;
  /** scrypt$N$r$p$sal$hash — formato versionado no próprio texto. */
  senha: string;
  criadoEm: string;
  senhaAlteradaEm: string;
};

/* ------------------------------------------------------------- hash de senha */

const scrypt = promisify(scryptCb) as (
  senha: string,
  sal: Buffer,
  tamanho: number,
  opcoes: { N: number; r: number; p: number; maxmem?: number },
) => Promise<Buffer>;

/** Parâmetros do scrypt. N=16384 leva ~60 ms — imperceptível, e caro em escala. */
const N = 16384;
const R = 8;
const P = 1;
const TAMANHO = 64;

export async function gerarHashDeSenha(senha: string): Promise<string> {
  const sal = randomBytes(16);
  const derivada = await scrypt(senha.normalize("NFC"), sal, TAMANHO, { N, r: R, p: P });
  return `scrypt$${N}$${R}$${P}$${sal.toString("base64")}$${derivada.toString("base64")}`;
}

/**
 * Confere a senha contra o hash guardado.
 *
 * A comparação é feita em tempo constante: comparar com `===` vazaria, pelo
 * tempo de resposta, quantos bytes já estavam certos.
 */
export async function senhaConfereComHash(senha: string, guardado: string): Promise<boolean> {
  const partes = guardado.split("$");
  if (partes.length !== 6 || partes[0] !== "scrypt") return false;

  const [, nTexto, rTexto, pTexto, salTexto, hashTexto] = partes;
  const sal = Buffer.from(salTexto, "base64");
  const esperado = Buffer.from(hashTexto, "base64");

  try {
    const derivada = await scrypt(senha.normalize("NFC"), sal, esperado.length, {
      N: Number(nTexto),
      r: Number(rTexto),
      p: Number(pTexto),
      maxmem: 128 * 1024 * 1024,
    });
    if (derivada.length !== esperado.length) return false;
    return timingSafeEqual(derivada, esperado);
  } catch {
    return false;
  }
}

/* ---------------------------------------------------------------- arquivos -- */

const raiz = () => process.cwd();
const caminhoUsuarios = () => path.join(raiz(), ARQUIVO_USUARIOS);
const caminhoTokens = () => path.join(raiz(), ARQUIVO_TOKENS);

async function lerJson<T>(caminho: string, padrao: T): Promise<T> {
  try {
    return JSON.parse(await readFile(caminho, "utf8")) as T;
  } catch {
    return padrao;
  }
}

/** Grava em temporário e renomeia: nunca deixa o arquivo pela metade. */
async function gravarJson(caminho: string, dados: unknown): Promise<void> {
  const pasta = path.dirname(caminho);
  await mkdir(pasta, { recursive: true });
  const temporario = `${caminho}.tmp-${process.pid}`;
  await writeFile(temporario, JSON.stringify(dados, null, 2) + "\n", { mode: 0o600 });
  await rename(temporario, caminho);
}

/* ----------------------------------------------------------------- usuários - */

export const normalizarEmail = (email: string) => email.trim().toLowerCase();

export async function lerUsuarios(): Promise<Usuario[]> {
  const dados = await lerJson<{ usuarios?: Usuario[] }>(caminhoUsuarios(), { usuarios: [] });
  return Array.isArray(dados.usuarios) ? dados.usuarios : [];
}

/** Quantos usuários existem — usado para decidir se o painel está operacional. */
export async function totalDeUsuarios(): Promise<number> {
  return (await lerUsuarios()).length;
}

export async function acharUsuario(email: string): Promise<Usuario | null> {
  const alvo = normalizarEmail(email);
  return (await lerUsuarios()).find((u) => normalizarEmail(u.email) === alvo) ?? null;
}

/**
 * Verifica e-mail + senha.
 *
 * Devolve o usuário quando confere. Não distingue "e-mail não existe" de
 * "senha errada" na resposta ao cliente — a distinção fica só aqui dentro.
 */
export async function verificarCredenciais(
  email: string,
  senha: string,
): Promise<Usuario | null> {
  const usuario = await acharUsuario(email);
  if (!usuario) {
    // Gasta o mesmo tempo de um scrypt real: sem isso, responder rápido para
    // e-mail inexistente revelaria quais endereços estão cadastrados.
    await gerarHashDeSenha(senha);
    return null;
  }
  return (await senhaConfereComHash(senha, usuario.senha)) ? usuario : null;
}

export async function definirSenha(email: string, novaSenha: string): Promise<boolean> {
  const alvo = normalizarEmail(email);
  const usuarios = await lerUsuarios();
  const indice = usuarios.findIndex((u) => normalizarEmail(u.email) === alvo);
  if (indice === -1) return false;

  usuarios[indice] = {
    ...usuarios[indice],
    senha: await gerarHashDeSenha(novaSenha),
    senhaAlteradaEm: new Date().toISOString(),
  };
  await gravarJson(caminhoUsuarios(), { usuarios });
  return true;
}

export async function criarUsuario(dados: {
  email: string;
  nome: string;
  senha: string;
}): Promise<Usuario> {
  const usuarios = await lerUsuarios();
  const email = normalizarEmail(dados.email);

  if (usuarios.some((u) => normalizarEmail(u.email) === email)) {
    throw new Error(`Já existe usuário com o e-mail ${email}.`);
  }

  const agora = new Date().toISOString();
  const novo: Usuario = {
    email,
    nome: dados.nome.trim() || email,
    senha: await gerarHashDeSenha(dados.senha),
    criadoEm: agora,
    senhaAlteradaEm: agora,
  };

  await gravarJson(caminhoUsuarios(), { usuarios: [...usuarios, novo] });
  return novo;
}

/* ------------------------------------------------------- tokens de recuperação */

type Token = {
  /** Só o hash do token é guardado: quem ler o arquivo não consegue usá-lo. */
  hash: string;
  email: string;
  criadoEm: string;
  expiraEm: number;
  usadoEm?: string;
};

const hashDoToken = (token: string) => createHash("sha256").update(token).digest("hex");

const tokensValidos = (lista: Token[]) =>
  lista.filter((t) => !t.usadoEm && t.expiraEm > Date.now());

/**
 * Cria um token de recuperação para o e-mail.
 *
 * Devolve o token em texto puro — a única vez em que ele existe fora do hash.
 * Quem chama é responsável por entregá-lo (e-mail ou outro caminho).
 */
export async function criarTokenDeRecuperacao(
  email: string,
): Promise<{ token: string; expiraEm: Date }> {
  const dados = await lerJson<{ tokens?: Token[] }>(caminhoTokens(), { tokens: [] });

  // Limpa vencidos e usados a cada geração: o arquivo não cresce sem limite e
  // links antigos deixam de existir de fato, não só de funcionar.
  const ativos = tokensValidos(dados.tokens ?? []);

  const token = randomBytes(32).toString("base64url");
  const expiraEm = Date.now() + VALIDADE_TOKEN_MINUTOS * 60 * 1000;

  ativos.push({
    hash: hashDoToken(token),
    email: normalizarEmail(email),
    criadoEm: new Date().toISOString(),
    expiraEm,
  });

  await gravarJson(caminhoTokens(), { tokens: ativos });
  return { token, expiraEm: new Date(expiraEm) };
}

/** Consome o token: devolve o e-mail se era válido, e marca como usado. */
export async function consumirTokenDeRecuperacao(
  token: string,
): Promise<{ email: string } | null> {
  if (!token || token.length < 20) return null;

  const dados = await lerJson<{ tokens?: Token[] }>(caminhoTokens(), { tokens: [] });
  const lista = dados.tokens ?? [];
  const alvo = hashDoToken(token);

  const indice = tokensValidos(lista).findIndex((t) => t.hash === alvo);
  if (indice === -1) return null;

  const encontrado = tokensValidos(lista)[indice];
  // Marca como usado no registro real (a posição pode diferir após a filtragem).
  const posicaoReal = lista.findIndex((t) => t.hash === alvo);
  lista[posicaoReal] = { ...lista[posicaoReal], usadoEm: new Date().toISOString() };

  await gravarJson(caminhoTokens(), { tokens: lista });
  return { email: encontrado.email };
}

/** Há quantos tokens ativos para o e-mail (freia pedidos em sequência). */
export async function tokensAtivosDe(email: string): Promise<number> {
  const dados = await lerJson<{ tokens?: Token[] }>(caminhoTokens(), { tokens: [] });
  const alvo = normalizarEmail(email);
  return tokensValidos(dados.tokens ?? []).filter((t) => t.email === alvo).length;
}

export const PASTA_DE_DADOS = PASTA_DADOS;

/** Confere se o token ainda vale, sem consumi-lo (a tela usa ao abrir). */
export async function tokenDeRecuperacaoAtivo(token: string): Promise<boolean> {
  if (!token) return false;
  const dados = await lerJson<{ tokens?: Token[] }>(caminhoTokens(), { tokens: [] });
  const alvo = hashDoToken(token);
  return (dados.tokens ?? []).some(
    (t) => t.hash === alvo && !t.usadoEm && t.expiraEm > Date.now(),
  );
}
