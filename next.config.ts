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
