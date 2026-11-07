#!/usr/bin/env node
/**
 * ============================================================================
 *  GERENCIAR USUÁRIOS DO PAINEL
 * ============================================================================
 *  Comandos:
 *
 *    node scripts/gerenciar-usuarios.mjs listar
 *    node scripts/gerenciar-usuarios.mjs criar  <email> [nome] [senha]
 *    node scripts/gerenciar-usuarios.mjs senha  <email> [senha]
 *    node scripts/gerenciar-usuarios.mjs remover <email>
 *
 *  Sem e-mail/senha na linha de comando, o script pergunta — o que é preferível:
 *  argumento fica no histórico do shell e na lista de processos.
 *
 *  Rode como o usuário dono da aplicação (no servidor: `deeptax`), senão o
 *  arquivo nasce com dono errado e o Next não consegue lê-lo:
 *
 *    su -s /bin/bash deeptax -c "cd /opt/deeptax/app && node scripts/gerenciar-usuarios.mjs criar"
 *
 *  O formato do hash precisa ser idêntico ao de `src/lib/admin/usuarios.ts`
 *  (scrypt, N=16384, r=8, p=1, 64 bytes, sal de 16). Se um dos dois mudar, a
 *  senha criada aqui deixa de servir no login — por isso os parâmetros estão
 *  repetidos explicitamente nos dois arquivos e há teste cruzado.
 * ========================================================================== */

import { randomBytes, scryptSync } from "node:crypto";
import { mkdirSync, readFileSync, renameSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline";

const N = 16384;
const R = 8;
const P = 1;
const TAMANHO = 64;

const RAIZ = process.cwd();
const ARQUIVO = path.join(RAIZ, "dados", "usuarios.json");
const MINIMO_SENHA = 10;

const normalizar = (email) => email.trim().toLowerCase();

function gerarHash(senha) {
  const sal = randomBytes(16);
  const derivada = scryptSync(senha.normalize("NFC"), sal, TAMANHO, { N, r: R, p: P });
  return `scrypt$${N}$${R}$${P}$${sal.toString("base64")}$${derivada.toString("base64")}`;
}

function ler() {
  try {
    const dados = JSON.parse(readFileSync(ARQUIVO, "utf8"));
    return Array.isArray(dados.usuarios) ? dados.usuarios : [];
  } catch {
    return [];
  }
}

function gravar(usuarios) {
  mkdirSync(path.dirname(ARQUIVO), { recursive: true });
  const temporario = `${ARQUIVO}.tmp-${process.pid}`;
  writeFileSync(temporario, JSON.stringify({ usuarios }, null, 2) + "\n", { mode: 0o600 });
  renameSync(temporario, ARQUIVO);
}

/* ------------------------------------------------------------- entrada ----- */

function perguntar(rotulo, { oculto = false } = {}) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });

    if (!oculto) {
      rl.question(rotulo, (resposta) => {
        rl.close();
        resolve(resposta.trim());
      });
      return;
    }

    // Esconde a digitação da senha no terminal.
    process.stdout.write(rotulo);
    const original = rl._writeToOutput;
    rl._writeToOutput = () => {};
    rl.question("", (resposta) => {
      rl.close();
      process.stdout.write("\n");
      resolve(resposta);
    });
    void original;
  });
}

function conferirSenha(senha) {
  if (senha.length < MINIMO_SENHA) {
    throw new Error(`A senha precisa ter pelo menos ${MINIMO_SENHA} caracteres.`);
  }
  if (/^\s|\s$/.test(senha)) {
    throw new Error("A senha não pode começar nem terminar com espaço.");
  }
}

/* ------------------------------------------------------------- comandos ---- */

async function criar(args) {
  const email = normalizar(args[0] || (await perguntar("E-mail: ")));
  const nome = (args[1] || (await perguntar("Nome: "))).trim() || email;
  const senha = args[2] || (await perguntar("Senha: ", { oculto: true }));

  if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) throw new Error("E-mail inválido.");
  conferirSenha(senha);

  const usuarios = ler();
  if (usuarios.some((u) => normalizar(u.email) === email)) {
    throw new Error(`Já existe usuário com o e-mail ${email}. Use "senha" para trocar a senha.`);
  }

  const agora = new Date().toISOString();
  usuarios.push({
    email,
    nome,
    senha: gerarHash(senha),
    criadoEm: agora,
    senhaAlteradaEm: agora,
  });
  gravar(usuarios);

  console.log(`\n  ✓ Usuário criado: ${email} (${nome})`);
  console.log(`  Total de usuários: ${usuarios.length}`);
  if (usuarios.length > 1) {
    console.log(
      "\n  Atenção: contas com a MESMA senha anulam a vantagem de ter contas separadas —\n" +
        "  o registro de quem alterou cada texto deixa de ser confiável.",
    );
  }
}

async function senha(args) {
  const email = normalizar(args[0] || (await perguntar("E-mail: ")));
  const nova = args[1] || (await perguntar("Nova senha: ", { oculto: true }));
  conferirSenha(nova);

  const usuarios = ler();
  const indice = usuarios.findIndex((u) => normalizar(u.email) === email);
  if (indice === -1) throw new Error(`Não existe usuário com o e-mail ${email}.`);

  usuarios[indice] = {
    ...usuarios[indice],
    senha: gerarHash(nova),
    senhaAlteradaEm: new Date().toISOString(),
  };
  gravar(usuarios);
  console.log(`\n  ✓ Senha de ${email} alterada.`);
}

function listar() {
  const usuarios = ler();
  if (usuarios.length === 0) {
    console.log("\n  Nenhum usuário cadastrado. Crie o primeiro com: criar\n");
    return;
  }
  console.log(`\n  ${usuarios.length} usuário(s):\n`);
  for (const u of usuarios) {
    const desde = (u.criadoEm || "").slice(0, 10);
    const trocou = (u.senhaAlteradaEm || "").slice(0, 10);
    console.log(`  • ${u.email}`);
    console.log(`      nome: ${u.nome} | criado: ${desde} | senha alterada: ${trocou}`);
  }
  console.log("");
}

function remover(args) {
  const email = normalizar(args[0] || "");
  if (!email) throw new Error("Informe o e-mail.");
  const usuarios = ler();
  const restantes = usuarios.filter((u) => normalizar(u.email) !== email);

  if (restantes.length === usuarios.length) {
    throw new Error(`Não existe usuário com o e-mail ${email}.`);
  }
  if (restantes.length === 0) {
    throw new Error(
      "Este é o último usuário: removê-lo deixaria o painel sem nenhum acesso. " +
        "Crie outro antes de remover este.",
    );
  }

  gravar(restantes);
  console.log(`\n  ✓ Usuário ${email} removido. Restam ${restantes.length}.`);
}

/* --------------------------------------------------------------- execução -- */

const [comando, ...args] = process.argv.slice(2);

const AJUDA = `
  Uso: node scripts/gerenciar-usuarios.mjs <comando>

    listar                       mostra as contas existentes
    criar  [email] [nome] [senha] cria uma conta
    senha  [email] [senha]        troca a senha de uma conta
    remover <email>               remove uma conta (nunca a última)

  Deixar e-mail e senha fora da linha de comando é mais seguro: eles ficariam
  no histórico do shell.
`;

try {
  if (comando === "listar") listar();
  else if (comando === "criar") await criar(args);
  else if (comando === "senha") await senha(args);
  else if (comando === "remover") remover(args);
  else {
    console.log(AJUDA);
    process.exit(comando ? 1 : 0);
  }
} catch (erro) {
  console.error(`\n  ✗ ${erro instanceof Error ? erro.message : String(erro)}\n`);
  process.exit(1);
}
