import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Pasta de saída do build. Em servidor próprio, o script de reconstrução
   * aponta para uma pasta separada e só troca depois que a construção termina
   * com sucesso — assim o site continua servindo a versão anterior durante o
   * rebuild, em vez de ficar alguns segundos fora do ar.
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  /**
   * As rotas de serviço foram reorganizadas nas seis áreas atuais (DeepCont,
   * DeepTax, Deep Systems, DeepPericia, DeepConsult e DeepCompliance). Os
   * endereços anteriores ficaram públicos por um curto período; redirecionamos
   * para não deixar link quebrado nem perder quem já tinha o endereço.
   *
   * "auditoria" não tem área equivalente na estrutura nova, então encaminha
   * para a visão geral das áreas.
   */
  /**
   * Correção do cache das páginas estáticas.
   *
   * O Next responde estas páginas com "s-maxage=31536000" — um ano em cache
   * COMPARTILHADO. Hoje não há CDN na frente, mas no dia em que houver (é o
   * caminho natural para crescer), a CDN passaria a servir a página de um ano
   * atrás. Aqui o HTML fica revalidável: o navegador não guarda, e qualquer
   * cache intermediário confirma antes de entregar.
   *
   * Só as páginas públicas estão listadas: /api e /admin ficam de fora de
   * propósito, para não afrouxar o no-store das respostas autenticadas.
   */
  async headers() {
    const htmlRevalidavel = [
      { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
    ];
    return [
      ...[
        "/",
        "/blog",
        "/blog/:slug*",
        "/servicos",
        "/servicos/:slug",
        "/sobre",
        "/contato",
        "/politica-de-privacidade",
      ].map((source) => ({ source, headers: htmlRevalidavel })),

      // As rotas do painel devolvem estado de sessão e dados internos. Sem
      // `Cache-Control`, um cache intermediário pode guardar a resposta e
      // entregá-la a outra pessoa — então aqui é sempre no-store.
      {
        source: "/api/admin/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
    ];
  },

  async redirects() {
    return [
      { source: "/servicos/consultoria", destination: "/servicos/deep-consult", permanent: true },
      { source: "/servicos/servicos-contabeis", destination: "/servicos/deep-cont", permanent: true },
      { source: "/servicos/pericia-contabil", destination: "/servicos/deep-pericia", permanent: true },
      { source: "/servicos/auditoria", destination: "/servicos", permanent: true },
    ];
  },
};

export default nextConfig;
