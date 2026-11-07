import nodemailer from "nodemailer";
import { emailConfig, emailConfigurado } from "@/lib/admin/config";
import { site } from "@/lib/site";

/**
 * ============================================================================
 *  ENVIO DE E-MAIL DO PAINEL
 * ============================================================================
 *  Usado apenas para a recuperação de senha.
 *
 *  Desenho deliberado: sem as variáveis SMTP o painel **não quebra** — a
 *  recuperação continua existindo por outro caminho (ver a rota
 *  /api/admin/recuperar). Assim o sistema não fica dependente de uma
 *  configuração de e-mail que pode não existir.
 *
 *  Variáveis: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM.
 *  Hostinger: smtp.hostinger.com, porta 465 (TLS direto) ou 587 (STARTTLS).
 * ========================================================================== */

export { emailConfigurado };

/** As mensagens nunca vão com HTML do usuário: só texto, com o link montado aqui. */
export async function enviarEmail(dados: {
  para: string;
  assunto: string;
  texto: string;
}): Promise<{ ok: true } | { ok: false; erro: string }> {
  if (!emailConfigurado) {
    return { ok: false, erro: "Envio de e-mail não configurado no servidor." };
  }

  try {
    const transporte = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.porta,
      // 465 é TLS direto; 587 começa em claro e sobe com STARTTLS.
      secure: emailConfig.porta === 465,
      auth: { user: emailConfig.usuario, pass: emailConfig.senha },
      // Sem isso, uma falha de rede no SMTP deixaria a requisição pendurada.
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });

    await transporte.sendMail({
      from: emailConfig.remetente,
      to: dados.para,
      subject: dados.assunto,
      text: dados.texto,
    });

    return { ok: true };
  } catch (erro) {
    console.error("[admin] falha ao enviar e-mail:", erro);
    return {
      ok: false,
      erro: erro instanceof Error ? erro.message : "Falha ao enviar o e-mail.",
    };
  }
}

/** Corpo do e-mail de recuperação. Sempre em texto puro, com o link explícito. */
export function textoDeRecuperacao(dados: {
  nome: string;
  link: string;
  minutos: number;
}): string {
  return [
    `Olá, ${dados.nome}.`,
    "",
    "Recebemos um pedido para redefinir a senha de acesso ao painel do site da Deeptax.",
    "Se foi você, abra o endereço abaixo para criar uma nova senha:",
    "",
    dados.link,
    "",
    `O link vale por ${dados.minutos} minutos e só pode ser usado uma vez.`,
    "",
    "Se não foi você, ignore esta mensagem: a senha atual continua valendo e nada",
    "foi alterado. Se os pedidos se repetirem, avise quem administra o servidor.",
    "",
    `— ${site.name}`,
    site.url,
  ].join("\n");
}
