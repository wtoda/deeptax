import { site, whatsappLink } from "@/lib/site";

/**
 * Monta a mensagem que o visitante envia pelo WhatsApp.
 *
 * Este módulo é seguro para o cliente (não usa nada de servidor). O site não
 * guarda, não envia e não armazena dados de lead em lugar nenhum: o formulário
 * apenas organiza o texto e abre a conversa no WhatsApp do escritório, com tudo
 * preenchido. O lead existe somente na conversa — não há backend, webhook,
 * e-mail, planilha ou arquivo envolvido.
 */
export type LeadFields = {
  name: string;
  company: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  source?: string;
};

const origemLabel = (source?: string): string => {
  const mapa: Record<string, string> = {
    "hero-home": "formulário do topo da página inicial",
    "home-bottom": "formulário do final da página inicial",
    "pagina-contato": "formulário da página de contato",
    "servicos-index": "página de serviços",
    sobre: "página sobre o escritório",
  };
  if (!source) return "site";
  if (source.startsWith("servico-")) {
    return `página do serviço (${source.replace("servico-", "").replace(/-/g, " ")})`;
  }
  return mapa[source] ?? "site";
};

export function buildLeadMessage(fields: LeadFields): string {
  // Campos opcionais entram só quando preenchidos; as linhas em branco são
  // separadores deliberados, por isso a montagem é feita em blocos.
  const dados = [
    `*Empresa:* ${fields.company.trim()}`,
    fields.phone.trim() ? `*Telefone:* ${fields.phone.trim()}` : null,
    fields.email.trim() ? `*E-mail:* ${fields.email.trim()}` : null,
    fields.service ? `*Assunto:* ${fields.service}` : null,
  ].filter((linha): linha is string => Boolean(linha));

  const blocos = [
    `Olá, ${site.name}! Meu nome é ${fields.name.trim()}.`,
    dados.join("\n"),
    fields.message.trim() ? `*Situação:*\n${fields.message.trim()}` : null,
    `_(Contato enviado pelo ${origemLabel(fields.source)})_`,
  ].filter((bloco): bloco is string => Boolean(bloco));

  return blocos.join("\n\n");
}

export function buildLeadWhatsappUrl(fields: LeadFields): string {
  return whatsappLink(buildLeadMessage(fields));
}
