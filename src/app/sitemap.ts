import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { blogTemPosts, posts, urlAbsolutaDoPost } from "@/lib/blog";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

/**
 * Data da última alteração de conteúdo.
 *
 * Antes, toda entrada saía com a hora do build. Como o sitemap é regerado a cada
 * publicação, o `lastmod` mudava sempre — e o Google aprende a ignorar um
 * `lastmod` que nunca é confiável. O `mtime` dos arquivos de `content/` reflete
 * a última edição de verdade (o painel grava direto neles), então é isso que
 * vale como sinal de atualização.
 */
function ultimaAlteracaoDoConteudo(): Date {
  try {
    const pasta = path.join(process.cwd(), "content");
    const datas = readdirSync(pasta)
      .filter((arquivo) => arquivo.endsWith(".json"))
      .map((arquivo) => statSync(path.join(pasta, arquivo)).mtime.getTime());
    if (datas.length) return new Date(Math.max(...datas));
  } catch {
    // Sem acesso ao disco (ambiente de build imutável): cai na data base.
  }
  return new Date("2026-11-01T12:00:00Z");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = ultimaAlteracaoDoConteudo();

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
      // A raiz do portal é "/reforma-tributaria/" — sem a barra dupla que a
      // concatenação ingênua produzia ("/reforma-tributaria//"), que não é a
      // URL canônica declarada na própria página.
      url: `${site.url}/reforma-tributaria/${caminho}${caminho ? "/" : ""}`,
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

  /**
   * Blog. A lista só entra no sitemap quando tem post publicado — um endereço
   * vazio não deve ser oferecido ao rastreador. Cada post usa a data real de
   * publicação/atualização como lastModified, que é o sinal de frescor.
   */
  const rotasDoBlog: MetadataRoute.Sitemap = blogTemPosts
    ? [
        {
          url: `${site.url}/blog`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.7,
        },
        ...posts.map((post) => ({
          url: urlAbsolutaDoPost(post),
          lastModified: new Date(`${post.atualizadoEm ?? post.data}T12:00:00`),
          changeFrequency: "yearly" as const,
          priority: 0.6,
        })),
      ]
    : [];

  return [...staticRoutes, ...serviceRoutes, ...rotasDoPortal, ...rotasDoBlog];
}
