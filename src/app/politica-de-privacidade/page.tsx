import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui";
import { fullAddress, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidade e LGPD",
  description:
    "Como a Deeptax coleta, usa, armazena e protege os dados pessoais informados em nosso site, em conformidade com a Lei Geral de Proteção de Dados.",
  alternates: { canonical: "/politica-de-privacidade" },
  robots: { index: true, follow: true },
};

const blocks = [
  {
    title: "1. Quem é o controlador dos seus dados",
    paragraphs: [
      `O controlador dos dados pessoais tratados neste site é ${site.legalName}, inscrita no CNPJ nº ${site.cnpj}, com sede em ${fullAddress}, registrada sob o ${site.crc}.`,
      `Contato do encarregado de dados (DPO): ${site.contact.email}.`,
    ],
  },
  {
    title: "2. Quais dados coletamos",
    paragraphs: [
      "Coletamos apenas os dados necessários para responder à sua solicitação e prestar serviços contábeis:",
    ],
    list: [
      "Dados de identificação e contato: nome completo, nome da empresa, e-mail e telefone/WhatsApp.",
      "Dados da solicitação: serviço de interesse e a mensagem que você escreve livremente.",
      "Dados técnicos de navegação: endereço IP e data/hora do envio, utilizados para segurança e prevenção de abuso do formulário.",
    ],
  },
  {
    title: "3. Para que usamos os dados",
    paragraphs: [
      "Utilizamos os dados exclusivamente para: (i) entrar em contato e responder à sua solicitação; (ii) elaborar proposta comercial de escopo e honorários; (iii) cumprir obrigações legais e regulatórias aplicáveis à atividade contábil; e (iv) proteger o site contra envios automatizados e fraudulentos.",
      "Não utilizamos seus dados para publicidade de terceiros e não vendemos, alugamos ou cedemos dados pessoais a terceiros.",
    ],
  },
  {
    title: "4. Base legal do tratamento",
    paragraphs: [
      "O tratamento se fundamenta no consentimento do titular (art. 7º, I, da LGPD), manifestado no momento do envio do formulário, e no legítimo interesse (art. 7º, IX) para fins de segurança da informação e prevenção de fraudes.",
      "Para dados necessários à execução de contrato de prestação de serviços contábeis, a base legal é a execução de contrato (art. 7º, V).",
    ],
  },
  {
    title: "5. Compartilhamento de dados",
    paragraphs: [
      "Seus dados podem ser armazenados em serviços de infraestrutura em nuvem e ferramentas de gestão utilizadas pelo escritório, sempre com cláusulas de confidencialidade e em ambiente controlado.",
      "Não compartilhamos dados pessoais com terceiros para finalidades próprias destes.",
    ],
  },
  {
    title: "6. Por quanto tempo guardamos",
    paragraphs: [
      "Dados de contato de potenciais clientes que não se tornam clientes são mantidos por até 24 meses, prazo após o qual são eliminados.",
      "Dados de clientes são mantidos pelo prazo legal exigido para guarda de documentos contábeis e fiscais, que pode chegar a 5 anos após o encerramento do contrato, ou por prazo superior em caso de obrigação legal ou processo em curso.",
    ],
  },
  {
    title: "7. Seus direitos como titular",
    paragraphs: [
      "Você pode, a qualquer momento, solicitar: confirmação da existência de tratamento; acesso aos dados; correção de dados incompletos ou desatualizados; anonimização, bloqueio ou eliminação de dados desnecessários; portabilidade; informação sobre compartilhamentos; e revogação do consentimento.",
      `Para exercer qualquer um desses direitos, escreva para ${site.contact.email}. Responderemos em até 15 dias.`,
    ],
  },
  {
    title: "8. Segurança da informação",
    paragraphs: [
      "Adotamos medidas técnicas e administrativas para proteger os dados contra acesso não autorizado, perda, alteração ou destruição, incluindo controle de acesso, transmissão criptografada (HTTPS) e política interna de sigilo profissional.",
      "Nenhum sistema é absolutamente invulnerável. Em caso de incidente de segurança com risco relevante aos titulares, comunicaremos os afetados e a Autoridade Nacional de Proteção de Dados, conforme a lei.",
    ],
  },
  {
    title: "9. Cookies",
    paragraphs: [
      "Este site não utiliza cookies de publicidade ou de rastreamento de terceiros. Eventuais cookies estritamente necessários ao funcionamento da página são utilizados apenas para a operação técnica do site.",
    ],
  },
  {
    title: "10. Alterações desta política",
    paragraphs: [
      "Esta política pode ser atualizada para refletir mudanças legais ou operacionais. A versão vigente será sempre a publicada nesta página, com indicação da data da última atualização.",
    ],
  },
];

export default function PoliticaPage() {
  return (
    <>
      <section className="bg-ink relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="container-x relative py-14 sm:py-16 lg:py-20">
          <nav aria-label="Você está aqui" className="mb-7 flex items-center gap-2 text-xs text-brand-100/50">
            <Link href="/" className="transition-colors hover:text-accent-300">
              Início
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-brand-100/80">Privacidade e LGPD</span>
          </nav>
          <h1 className="max-w-3xl font-display text-[2rem] font-extrabold leading-[1.15] text-white sm:text-4xl">
            Política de Privacidade e Proteção de Dados
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-brand-100/70">
            Transparência sobre como tratamos as informações que você nos confia.
            Em conformidade com a Lei nº 13.709/2018 (LGPD).
          </p>
        </div>
      </section>

      <Section tone="light">
        <div className="container-x">
          <div className="mx-auto max-w-3xl">
            <p className="rounded-2xl border border-brand-100 bg-brand-50/60 px-6 py-5 text-sm leading-relaxed text-brand-900/70">
              <strong className="font-semibold text-brand-950">
                Última atualização:
              </strong>{" "}
              revise esta data a cada alteração do documento. Este texto é um
              modelo de referência e deve ser validado pelo responsável jurídico do
              escritório antes da publicação.
            </p>

            <div className="mt-10 space-y-10">
              {blocks.map((block) => (
                <section key={block.title}>
                  <h2 className="font-display text-lg font-bold text-brand-950 sm:text-xl">
                    {block.title}
                  </h2>
                  <div className="mt-4 space-y-3.5">
                    {block.paragraphs.map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-sm leading-relaxed text-brand-900/70"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {block.list && (
                    <ul className="mt-4 space-y-2.5">
                      {block.list.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent-400" />
                          <span className="text-sm leading-relaxed text-brand-900/70">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-brand-100 bg-white p-7 shadow-soft">
              <h2 className="font-display text-lg font-bold text-brand-950">
                Dúvidas sobre privacidade?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-brand-900/70">
                Fale com o nosso encarregado de dados pelo e-mail{" "}
                <a
                  href={`mailto:${site.contact.email}`}
                  className="font-semibold text-accent-600 underline decoration-accent-300 underline-offset-2"
                >
                  {site.contact.email}
                </a>
                .
              </p>
              <Link
                href="/contato"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-900"
              >
                Ir para a página de contato
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
