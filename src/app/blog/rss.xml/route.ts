import { posts, urlAbsolutaDoPost, type Bloco, type Post } from "@/lib/blog";
import { site } from "@/lib/site";

/**
 * Feed do blog em RSS 2.0.
 *
 * Existe porque parte do público do escritório acompanha por leitor de feeds e
 * porque o feed ajuda a distribuir o artigo quando ele é publicado, sem depender
 * de rede social. É gerado no build: se nenhum post foi publicado, o feed sai
 * vazio, mas válido.
 */
export const dynamic = "force-static";

const escapar = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/** Marcação mínima para o feed — sem classes, que ali não servem para nada. */
function blocosParaHtml(blocos: Bloco[]): string {
  return blocos
    .map((b) => {
      switch (b.tipo) {
        case "paragrafo":
          return `<p>${escapar(b.texto)}</p>`;
        case "titulo":
          return b.nivel === 3
            ? `<h3>${escapar(b.texto)}</h3>`
            : `<h2>${escapar(b.texto)}</h2>`;
        case "lista": {
          const tag = b.ordenada ? "ol" : "ul";
          return `<${tag}>${b.itens.map((i) => `<li>${escapar(i)}</li>`).join("")}</${tag}>`;
        }
        case "citacao":
          return `<blockquote><p>${escapar(b.texto)}</p>${
            b.autor ? `<footer>— ${escapar(b.autor)}</footer>` : ""
          }</blockquote>`;
        case "imagem":
          return `<figure><img src="${escapar(b.src)}" alt="${escapar(b.alt)}">${
            b.legenda ? `<figcaption>${escapar(b.legenda)}</figcaption>` : ""
          }</figure>`;
        default:
          return "";
      }
    })
    .join("\n");
}

function item(post: Post): string {
  const url = urlAbsolutaDoPost(post);
  return [
    "    <item>",
    `      <title>${escapar(post.titulo)}</title>`,
    `      <link>${escapar(url)}</link>`,
    `      <guid isPermaLink="true">${escapar(url)}</guid>`,
    `      <pubDate>${new Date(`${post.data}T12:00:00-03:00`).toUTCString()}</pubDate>`,
    `      <dc:creator>${escapar(post.autor)}</dc:creator>`,
    ...post.tags.map((t) => `      <category>${escapar(t)}</category>`),
    `      <description>${escapar(post.resumo)}</description>`,
    `      <content:encoded><![CDATA[${blocosParaHtml(post.blocos)}]]></content:encoded>`,
    "    </item>",
  ].join("\n");
}

export async function GET() {
  const atualizado = posts[0]?.data ?? new Date().toISOString().slice(0, 10);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog — ${escapar(site.name)}</title>
    <link>${site.url}/blog</link>
    <description>${escapar(site.shortDescription)}</description>
    <language>pt-BR</language>
    <lastBuildDate>${new Date(`${atualizado}T12:00:00-03:00`).toUTCString()}</lastBuildDate>
    <atom:link href="${site.url}/blog/rss.xml" rel="self" type="application/rss+xml" />
${posts.map(item).join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

