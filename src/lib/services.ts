import servicesJson from "../../content/services.json";

/**
 * ============================================================================
 *  ÁREAS DO ESCRITÓRIO
 * ============================================================================
 *  O conteúdo das seis áreas vive em `content/services.json` — não mais neste
 *  arquivo. Edite pelo painel em /admin ou diretamente pelo JSON.
 *
 *  As páginas internas são geradas automaticamente a partir desta lista:
 *  acrescentar, remover ou renomear uma área atualiza sozinho a navegação, o
 *  rodapé, os cards, o sitemap e a rota /servicos/<slug>.
 * ============================================================================
 */

export type FaqItem = { question: string; answer: string };

export type ServiceContent = {
  slug: string;
  /** Nome da área, como o escritório a apresenta ao mercado. */
  name: string;
  shortName: string;
  tagline: string;
  summary: string;
  /** Nome do ícone; se não existir, o site usa um ícone padrão. */
  icon: string;
  /** Classes de gradiente do Tailwind para o ícone e os destaques. */
  accent: string;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    highlights: string[];
  };
  intro: { title: string; paragraphs: string[] };
  audience: {
    title: string;
    lead: string;
    items: { title: string; description: string }[];
  };
  scope: { title: string; description: string; items: string[] }[];
  methodology: { step: string; title: string; description: string }[];
  deliverables: string[];
  faq: FaqItem[];
  cta: { title: string; description: string };
  seo: { title: string; description: string; keywords: string[] };
};

const bruto = (servicesJson as { services?: unknown }).services;

if (!Array.isArray(bruto) || bruto.length === 0) {
  throw new Error(
    'O conteúdo das áreas está inválido: "services" em content/services.json ' +
      "precisa ser uma lista com pelo menos uma área.",
  );
}

const slugsVistos = new Set<string>();

export const services: ServiceContent[] = (bruto as ServiceContent[]).map((servico) => {
  const problemas: string[] = [];

  if (!servico.slug?.trim()) problemas.push("uma área está sem slug");
  if (!servico.name?.trim()) problemas.push(`a área "${servico.slug}" está sem name`);
  if (!servico.shortName?.trim())
    problemas.push(`a área "${servico.slug}" está sem shortName`);

  // O slug vira URL: precisa ser seguro e único.
  if (servico.slug && !/^[a-z0-9-]+$/.test(servico.slug)) {
    problemas.push(
      `o slug "${servico.slug}" é inválido: use apenas letras minúsculas, números e hífen`,
    );
  }
  if (servico.slug && slugsVistos.has(servico.slug)) {
    problemas.push(`o slug "${servico.slug}" está repetido em duas áreas`);
  }
  slugsVistos.add(servico.slug);

  if (problemas.length > 0) {
    throw new Error(
      `O conteúdo das áreas tem ${problemas.length} problema(s):\n` +
        problemas.map((p) => `  • ${p}`).join("\n"),
    );
  }

  return {
    ...servico,
    icon: servico.icon || "ledger",
    accent: servico.accent || "from-sky-500 to-cyan-400",
    hero: {
      ...servico.hero,
      highlights: servico.hero?.highlights ?? [],
    },
    intro: {
      ...servico.intro,
      paragraphs: servico.intro?.paragraphs ?? [],
    },
    audience: {
      ...servico.audience,
      items: servico.audience?.items ?? [],
    },
    scope: servico.scope ?? [],
    methodology: servico.methodology ?? [],
    deliverables: servico.deliverables ?? [],
    faq: servico.faq ?? [],
  };
});

export const getService = (slug: string) =>
  services.find((service) => service.slug === slug);

export const serviceSlugs = services.map((service) => service.slug);
