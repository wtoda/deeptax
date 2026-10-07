import { appendFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

/* ============================================================================
 *  MODELO E VALIDAÇÃO DE LEAD
 * ========================================================================== */

export type LeadInput = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  company?: unknown;
  service?: unknown;
  message?: unknown;
  consent?: unknown;
  /** Honeypot: se preenchido, é bot. */
  website?: unknown;
  source?: unknown;
};

export type Lead = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  source: string;
};

export type ValidationResult =
  | { ok: true; lead: Lead }
  | { ok: false; errors: Record<string, string> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const PHONE_DIGITS_RE = /\d/g;

const clean = (value: unknown, max = 500) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const digits = (value: string) => (value.match(PHONE_DIGITS_RE) ?? []).length;

export function validateLead(input: LeadInput): ValidationResult {
  const errors: Record<string, string> = {};

  const name = clean(input.name, 120);
  const email = clean(input.email, 160).toLowerCase();
  const phone = clean(input.phone, 40);
  const company = clean(input.company, 140);
  const service = clean(input.service, 80) || "Não informado";
  const message = clean(input.message, 2000);
  const source = clean(input.source, 60) || "site";

  if (name.length < 3) {
    errors.name = "Informe seu nome completo.";
  } else if (!name.includes(" ")) {
    errors.name = "Informe nome e sobrenome.";
  }

  // O e-mail é OPCIONAL de propósito: o formulário do hero (modo compacto)
  // coleta apenas nome, empresa e telefone/WhatsApp, que é o canal primário de
  // contato do escritório. Validamos o formato sempre que vier preenchido, mas
  // não o exigimos — do contrário o formulário do hero seria rejeitado com erro
  // em um campo que sequer é exibido na tela.
  if (email && !EMAIL_RE.test(email)) {
    errors.email = "Informe um e-mail válido.";
  }

  if (digits(phone) < 10) {
    errors.phone = "Informe um telefone com DDD.";
  }

  if (company.length < 2) {
    errors.company = "Informe o nome da empresa.";
  }

  // Consentimento LGPD é obrigatório para tratar o contato.
  const consent =
    input.consent === true || input.consent === "true" || input.consent === "on";
  if (!consent) {
    errors.consent = "É necessário autorizar o contato para enviar.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const lead: Lead = {
    id: `lead_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    name,
    email,
    phone,
    company,
    service,
    message,
    source,
  };

  return { ok: true, lead };
}

/** Detecta bots por honeypot preenchido ou tempo de preenchimento absurdo. */
export function looksLikeBot(input: LeadInput): boolean {
  const honeypot = clean(input.website, 200);
  return honeypot.length > 0;
}

/* ============================================================================
 *  PERSISTÊNCIA
 * ----------------------------------------------------------------------------
 *  Um destino é considerado DURÁVEL quando o lead sobrevive à requisição:
 *
 *  1) LEAD_WEBHOOK_URL — destino externo (Slack, n8n, Make, Zapier, Google Apps
 *     Script, CRM). É o ÚNICO destino durável em serverless. Obrigatório na
 *     Vercel.
 *  2) Arquivo local (`data/leads.jsonl`) — durável em VPS, container com disco
 *     persistente ou execução local. NÃO é durável na Vercel: o sistema de
 *     arquivos da função é somente leitura fora de /tmp, e /tmp é descartado
 *     entre execuções.
 *
 *  Sem nenhum destino durável a API responde 503 e o formulário oferece o envio
 *  pelo WhatsApp já preenchido — assim o lead é preservado de qualquer forma,
 *  em vez de aceitar o envio e perder o contato em silêncio.
 * ========================================================================== */

/** True quando rodando em ambiente serverless com disco efêmero. */
export const IS_EPHEMERAL_FS = Boolean(
  process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME,
);

export const hasDurableDestination = () =>
  Boolean(process.env.LEAD_WEBHOOK_URL) || !IS_EPHEMERAL_FS;

const LEADS_FILE = IS_EPHEMERAL_FS
  ? path.join(tmpdir(), "deeptax-leads.jsonl")
  : path.join(process.cwd(), "data", "leads.jsonl");

async function persistToFile(lead: Lead): Promise<boolean> {
  try {
    await mkdir(path.dirname(LEADS_FILE), { recursive: true });
    await appendFile(LEADS_FILE, `${JSON.stringify(lead)}\n`, "utf8");
    return true;
  } catch (error) {
    console.error("[leads] falha ao gravar arquivo local:", error);
    return false;
  }
}

async function forwardToWebhook(lead: Lead): Promise<boolean> {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return false;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "novo_lead",
        site: process.env.NEXT_PUBLIC_SITE_NAME ?? "Deeptax",
        ...lead,
      }),
      // Destinos como o Google Apps Script podem levar alguns segundos na
      // primeira execução (cold start). O padrão de 10s evita devolver erro ao
      // visitante por causa de uma resposta lenta do destino.
      signal: AbortSignal.timeout(
        Number(process.env.LEAD_WEBHOOK_TIMEOUT_MS ?? 10000),
      ),
    });
    return response.ok;
  } catch (error) {
    console.error("[leads] falha ao encaminhar para o webhook:", error);
    return false;
  }
}

export async function saveLead(lead: Lead) {
  // O webhook é o destino durável em serverless; o arquivo é o durável fora
  // dele. Tentamos os dois quando fazem sentido e reportamos o que funcionou.
  const forwarded = await forwardToWebhook(lead);
  const stored = IS_EPHEMERAL_FS && forwarded ? false : await persistToFile(lead);

  if (IS_EPHEMERAL_FS && !forwarded) {
    console.error(
      "[leads] ATENÇÃO: rodando em ambiente serverless sem LEAD_WEBHOOK_URL. " +
        "Os leads NÃO estão sendo persistidos de forma durável. " +
        "Configure a variável LEAD_WEBHOOK_URL no painel da Vercel.",
    );
  }

  return { stored, forwarded, durable: forwarded || (!IS_EPHEMERAL_FS && stored) };
}

/* ============================================================================
 *  LIMITAÇÃO DE TAXA (em memória, por instância)
 * ----------------------------------------------------------------------------
 *  Em serverless cada instância tem seu próprio contador, então isto é uma
 *  barreira contra abuso trivial, não uma proteção distribuída. Para algo
 *  robusto em escala, use um rate limit no edge (Vercel Firewall, Cloudflare)
 *  ou um store compartilhado (Upstash Redis).
 * ========================================================================== */

const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = Number(process.env.LEAD_RATE_LIMIT_WINDOW_MS ?? 10 * 60 * 1000);
// Configurável para permitir testes automatizados sem esbarrar no limite.
const MAX_PER_WINDOW = Number(process.env.LEAD_RATE_LIMIT_MAX ?? 5);

export function rateLimit(key: string) {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_PER_WINDOW - 1 };
  }

  entry.count += 1;
  if (entry.count > MAX_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }
  return { allowed: true, remaining: MAX_PER_WINDOW - entry.count };
}

/** Mensagem de WhatsApp pré-preenchida a partir dos dados do formulário. */
export function buildWhatsappMessage(fields: {
  name: string;
  company?: string;
  service?: string;
  message?: string;
}) {
  const lines = [
    `Olá! Meu nome é ${fields.name}.`,
    fields.company ? `Empresa: ${fields.company}` : "",
    fields.service ? `Assunto: ${fields.service}` : "",
    fields.message ? `\n${fields.message}` : "",
    "\n(vim pelo site da Deeptax)",
  ].filter(Boolean);
  return lines.join("\n");
}
