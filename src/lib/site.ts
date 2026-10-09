import siteJson from "../../content/site.json";

/**
 * ============================================================================
 *  CONTEÚDO DO SITE
 * ============================================================================
 *  Os textos e dados do escritório vivem em `content/site.json` — não mais
 *  neste arquivo. Edite pelo painel em /admin ou diretamente pelo JSON; este
 *  módulo apenas carrega, valida e deriva o que os componentes consomem.
 *
 *  A validação abaixo existe para dar mensagem clara quando alguém salva um
 *  conteúdo inválido: sem ela, o erro apareceria como uma tela em branco.
 * ============================================================================
 */

export type Stat = { value: string; label: string };
export type Testimonial = { quote: string; author: string; company: string };
export type FaqItem = { question: string; answer: string };
export type Differential = { icon: string; title: string; description: string };
export type ProcessStep = { step: string; title: string; description: string };

export type Address = {
  street: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type SiteContent = {
  name: string;
  legalName: string;
  tradeName: string;
  cnpj: string;
  crc: string;
  tagline: string;
  shortDescription: string;
  url: string;
  blogUrl: string;
  contact: {
    phone: string;
    whatsapp: string;
    whatsappNumber: string;
    email: string;
    commercialEmail: string;
    address: Address;
    hours: string;
  };
  social: { linkedin: string; instagram: string };
  stats: Stat[];
  differentials: Differential[];
  process: ProcessStep[];
  testimonials: Testimonial[];
  faq: FaqItem[];
};

/** Erro de conteúdo — mensagem pensada para quem edita, não para programador. */
export class ErroDeConteudo extends Error {
  constructor(problemas: string[]) {
    super(
      `O conteúdo do site tem ${problemas.length} problema(s) e não pode ser publicado:\n` +
        problemas.map((p) => `  • ${p}`).join("\n"),
    );
    this.name = "ErroDeConteudo";
  }
}

const texto = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export function validarSite(bruto: unknown): SiteContent {
  const problemas: string[] = [];
  const d = (bruto ?? {}) as Record<string, unknown>;

  const exigir = (valor: unknown, campo: string, comoEditar: string) => {
    const t = texto(valor);
    if (!t) problemas.push(`"${campo}" está vazio. ${comoEditar}`);
    return t;
  };

  const contact = (d.contact ?? {}) as Record<string, unknown>;
  const address = (contact.address ?? {}) as Record<string, unknown>;

  // O número do WhatsApp é o que monta todos os links wa.me do site: se vier
  // com parênteses, traço ou espaço, os botões param de funcionar.
  const whatsappNumber = texto(contact.whatsappNumber);
  if (!/^\d{12,14}$/.test(whatsappNumber)) {
    problemas.push(
      `"contact.whatsappNumber" deve conter só dígitos, com 55 + DDD + número ` +
        `(ex.: 5511932362770). Valor atual: "${whatsappNumber}".`,
    );
  }

  const email = texto(contact.email);
  if (email && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) {
    problemas.push(`"contact.email" não parece um e-mail válido: "${email}".`);
  }

  const lista = <T,>(v: unknown, campo: string): T[] => {
    if (v === undefined || v === null) return [];
    if (!Array.isArray(v)) {
      problemas.push(`"${campo}" deveria ser uma lista.`);
      return [];
    }
    return v as T[];
  };

  const conteudo: SiteContent = {
    name: exigir(d.name, "name", "É o nome da marca exibido no site."),
    legalName: texto(d.legalName),
    tradeName: texto(d.tradeName),
    cnpj: texto(d.cnpj),
    crc: texto(d.crc),
    tagline: texto(d.tagline),
    shortDescription: exigir(
      d.shortDescription,
      "shortDescription",
      "Aparece na descrição para buscadores e no rodapé.",
    ),
    // Também usada em canonical, sitemap, robots e Open Graph.
    url: (process.env.NEXT_PUBLIC_SITE_URL || texto(d.url) || "https://www.deeptax.com.br").replace(
      /\/+$/,
      "",
    ),
    blogUrl: texto(d.blogUrl),
    contact: {
      phone: texto(contact.phone),
      whatsapp: texto(contact.whatsapp),
      whatsappNumber,
      email,
      commercialEmail: texto(contact.commercialEmail),
      address: {
        street: texto(address.street),
        complement: texto(address.complement),
        district: texto(address.district),
        city: texto(address.city),
        state: texto(address.state),
        zip: texto(address.zip),
        country: texto(address.country) || "Brasil",
      },
      hours: texto(contact.hours),
    },
    social: {
      linkedin: texto((d.social as Record<string, unknown>)?.linkedin),
      instagram: texto((d.social as Record<string, unknown>)?.instagram),
    },
    stats: lista<Stat>(d.stats, "stats"),
    differentials: lista<Differential>(d.differentials, "differentials"),
    process: lista<ProcessStep>(d.process, "process"),
    testimonials: lista<Testimonial>(d.testimonials, "testimonials"),
    faq: lista<FaqItem>(d.faq, "faq"),
  };

  if (problemas.length > 0) throw new ErroDeConteudo(problemas);
  return conteudo;
}

export const site: SiteContent = validarSite(siteJson);

/* --------------------------------------------------------------- DERIVADOS */

/** Blog do escritório — link externo, exibido no menu e no rodapé. */
export const blogUrl = site.blogUrl;

/**
 * Monta o endereço completo ignorando as partes não preenchidas.
 * O CEP entra após a cidade/UF separado por vírgula — usar outro travessão
 * deixaria a linha com duas quebras e leitura confusa.
 */
export const fullAddress = [
  [site.contact.address.street, site.contact.address.complement]
    .filter(Boolean)
    .join(", "),
  [
    site.contact.address.district,
    `${site.contact.address.city}/${site.contact.address.state}${
      site.contact.address.zip ? `, ${site.contact.address.zip}` : ""
    }`,
  ]
    .filter(Boolean)
    .join(", "),
]
  .filter(Boolean)
  .join(" — ");

export const whatsappLink = (message?: string) =>
  `https://wa.me/${site.contact.whatsappNumber}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;

export const defaultWhatsappMessage =
  `Olá! Vim pelo site da ${site.name} e gostaria de falar sobre os serviços contábeis.`;
