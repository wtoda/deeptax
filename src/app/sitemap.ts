import type { MetadataRoute } from "next";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${site.url}/servicos`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    { url: `${site.url}/sobre`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    {
      url: `${site.url}/contato`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${site.url}/politica-de-privacidade`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  /**
   * Portal da Reforma Tributária. São páginas estáticas (pré-renderizadas) em
   * /reforma-tributaria/, servidas pelo nginx. Entram aqui para que o sitemap
   * do site seja a única fonte de URLs do domínio.
   */
  const portaisReforma = [
    ["", 0.9],
    ["cronograma", 0.8],
    ["entenda", 0.8],
    ["calculadora", 0.8],
    ["documentos", 0.7],
    ["legislacao", 0.7],
    ["dere", 0.7],
    ["conformidade", 0.7],
    ["comparativo", 0.6],
    ["glossario", 0.6],
    ["aprender", 0.5],
    ["divulgacao", 0.5],
    ["fontes", 0.5],
  ] as const;

  const rotasDoPortal: MetadataRoute.Sitemap = portaisReforma.map(
    ([caminho, prioridade]) => ({
      url: `${site.url}/reforma-tributaria/${caminho}${caminho ? "/" : "/"}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: prioridade,
    }),
  );

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${site.url}/servicos/${service.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...serviceRoutes, ...rotasDoPortal];
}
