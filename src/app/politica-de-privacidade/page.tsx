import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui";
import { fullAddress, site, whatsappLink } from "@/lib/site";

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
    title: "2. O site não coleta nem armazena dados de formulário",
    paragraphs: [
      "Este site não possui banco de dados, API de contato, webhook, e-mail automático ou arquivo de leads. Quando você preenche o formulário, as informações são usadas apenas no seu próprio navegador para montar uma mensagem — nada é transmitido para nós nem gravado durante esse preenchimento.",
      "Ao tocar em “Enviar pelo WhatsApp”, o seu aparelho abre o WhatsApp com a mensagem já preenchida. É você quem decide enviá-la. Só a partir do envio é que passamos a ter acesso ao conteúdo, e ele chega até nós como uma conversa comum de WhatsApp.",
      "Não registramos endereço IP, data e hora de envio nem qualquer dado técnico de navegação do formulário.",
    ],
    list: [
      "O que o formulário monta na sua tela: nome, nome da empresa, telefone/WhatsApp, e-mail (opcional), serviço de interesse e a mensagem que você escrever.",
      "O que o site faz com isso: apenas monta o texto da mensagem no seu navegador. Não envia, não salva, não compartilha.",
      "O que acontece depois: se você enviar a mensagem, ela chega pelo WhatsApp e passa a ser tratada como descrito nos itens 3 a 6.",
    ],
  },
  {
    title: "3. Para que usamos os dados que você envia pelo WhatsApp",
    paragraphs: [
      "Utilizamos as informações recebidas exclusivamente para: (i) responder à sua solicitação; (ii) elaborar proposta comercial de escopo e honorários; e (iii) cumprir obrigações legais e regulatórias aplicáveis à atividade contábil.",
      "Não utilizamos seus dados para publicidade de terceiros e não vendemos, alugamos ou cedemos dados pessoais a terceiros.",
    ],
  },
  {
    title: "4. Base legal do tratamento",
    paragraphs: [
      "O tratamento se fundamenta no consentimento do titular (art. 7º, I, da LGPD), manifestado quando você decide enviar a mensagem, e em procedimentos preliminares à execução de contrato (art. 7º, V) quando o contato tem por objeto a contratação de serviços.",
      "Não tratamos dados com base em legítimo interesse para fins de segurança do formulário, porque o site não realiza esse processamento.",
    ],
  },
  {
    title: "5. Compartilhamento de dados",
    paragraphs: [
      "Ao usar o WhatsApp para falar conosco, a mensagem é transmitida pelo serviço do WhatsApp, que possui política de privacidade própria e é o controlador dos dados tratados naquela plataforma. Recomendamos ler a política do WhatsApp antes de enviar informações sensíveis.",
      "Internamente, dados necessários à prestação de serviços contábeis podem ser armazenados em ferramentas de gestão e infraestrutura em nuvem utilizadas pelo escritório, sempre com cláusulas de confidencialidade e em ambiente controlado.",
      "Não compartilhamos dados pessoais com terceiros para finalidades próprias destes.",
    ],
  },
  {
    title: "6. Por quanto tempo guardamos",
    paragraphs: [
      "Mensagens de contato de potenciais clientes que não se tornam clientes são mantidas por até 24 meses, prazo após o qual são eliminadas.",
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
      "Como o site não coleta nem armazena dados de formulário, não existe base de dados de leads para ser vazada. O que você digita permanece no seu aparelho até o momento em que decide enviar a mensagem.",
      "Para as informações que chegam até nós por WhatsApp, e-mail ou durante a prestação de serviços, adotamos medidas técnicas e administrativas de proteção, incluindo controle de acesso, transmissão criptografada (HTTPS) e política interna de sigilo profissional.",
      "Nenhum sistema é absolutamente invulnerável. Em caso de incidente de segurança com risco relevante aos titulares, comunicaremos os afetados e a Autoridade Nacional de Proteção de Dados, conforme a lei.",
    ],
  },
  {
    title: "9. Cookies",
    paragraphs: [
      "Este site não utiliza cookies de publicidade, de rastreamento ou de análise de terceiros, e não registra sua navegação para fins de marketing.",
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
                Para exercer seus direitos, fale com o nosso encarregado de dados
                pelo WhatsApp{" "}
                <a
                  href={whatsappLink(
                    "Olá! Gostaria de falar sobre privacidade e proteção de dados (LGPD).",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-accent-600 underline decoration-accent-300 underline-offset-2"
                >
                  {site.contact.whatsapp}
                </a>{" "}
                ou, se preferir por escrito, pelo e-mail{" "}
                <a
                  href={`mailto:${site.contact.email}`}
                  className="font-semibold text-accent-600 underline decoration-accent-300 underline-offset-2"
                >
                  {site.contact.email}
                </a>
                . Responderemos em até 15 dias.
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
