/**
 * ============================================================================
 *  JSON-LD SEGURO PARA <script>
 * ============================================================================
 *  Dados estruturados precisam entrar na página como HTML cru (é o único jeito
 *  de um <script type="application/ld+json"> funcionar). O problema: `JSON.stringify`
 *  não escapa `<`, então um texto que contenha "</script>" FECHA a tag antes da
 *  hora e o que vier depois é interpretado como HTML.
 *
 *  Isso importa aqui porque quase todo o conteúdo vem do painel: um título de
 *  artigo ou a descrição de uma área com "</script><img onerror=...>" seria
 *  executado na página do site — XSS armazenado, com o painel como porta.
 *
 *  A correção é trocar os caracteres perigosos pelas formas de escape do JSON
 *  (\u003c, \u003e, \u0026). O navegador lê o mesmo dado; o parser de HTML não
 *  encontra mais o fechamento de tag.
 * ========================================================================== */

export function jsonLdSeguro(dados: unknown): string {
  return JSON.stringify(dados)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
