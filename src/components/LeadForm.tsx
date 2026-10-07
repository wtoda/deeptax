"use client";

import { useId, useMemo, useState } from "react";
import {
  IconAlert,
  IconArrowRight,
  IconCheck,
  IconSpinner,
  IconWhatsApp,
} from "@/components/Icons";
import { services } from "@/lib/services";
import { site, whatsappLink } from "@/lib/site";

type FormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  consent: boolean;
  website: string; // honeypot
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: "",
  message: "",
  consent: false,
  website: "",
};

/** Máscara progressiva para telefone brasileiro. */
function maskPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function LeadForm({
  defaultService = "",
  source = "site",
  tone = "light",
  compact = false,
}: {
  defaultService?: string;
  source?: string;
  tone?: "light" | "dark";
  /** Versão reduzida (nome, empresa, WhatsApp e serviço) para uso no hero. */
  compact?: boolean;
}) {
  const [form, setForm] = useState<FormState>({ ...initialState, service: defaultService });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [sentName, setSentName] = useState("");

  const isDark = tone === "dark";

  // Cada instância do formulário precisa de IDs próprios: a home, por exemplo,
  // renderiza dois formulários na mesma página, e IDs duplicados quebrariam a
  // associação entre <label> e campo.
  const uid = useId().replace(/:/g, "");
  const fieldId = (field: string) => `lead-${field}-${uid}`;
  const errorId = (field: string) => `lead-${field}-error-${uid}`;

  const fieldClass = (hasError: boolean) =>
    `w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-brand-900/35 ${
      isDark
        ? "border-white/15 bg-white/5 text-white placeholder:text-brand-100/35 focus:border-accent-400 focus:bg-white/10"
        : "border-brand-200 bg-white text-brand-950 focus:border-accent-400 focus:ring-4 focus:ring-accent-500/12"
    } ${hasError ? (isDark ? "border-red-400/70" : "border-red-400") : ""}`;

  const labelClass = `mb-2 block text-sm font-semibold ${
    isDark ? "text-brand-100/85" : "text-brand-950"
  }`;

  const validate = () => {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 3) next.name = "Informe seu nome completo.";
    else if (!form.name.trim().includes(" ")) next.name = "Informe nome e sobrenome.";
    if (!compact && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(form.email.trim()))
      next.email = "Informe um e-mail válido.";
    if (form.phone.replace(/\D/g, "").length < 10)
      next.phone = "Informe um telefone com DDD.";
    if (form.company.trim().length < 2) next.company = "Informe o nome da empresa.";
    if (!form.consent) next.consent = "Autorize o contato para enviar.";
    return next;
  };

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as string]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as string];
        return next;
      });
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus("error");
      setFeedback("Confira os campos destacados antes de enviar.");
      return;
    }

    setStatus("sending");
    setFeedback("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        message?: string;
        errors?: Record<string, string>;
      };

      if (!response.ok || !data.ok) {
        setErrors(data.errors ?? {});
        setStatus("error");
        setFeedback(data.message ?? "Não foi possível enviar agora. Tente novamente.");
        return;
      }

      setSentName(form.name.split(" ")[0]);
      setStatus("success");
      setForm({ ...initialState, service: defaultService });
    } catch {
      setStatus("error");
      setFeedback(
        "Falha de conexão. Verifique sua internet ou fale com a gente pelo WhatsApp.",
      );
    }
  };

  const whatsappAfterSend = useMemo(
    () =>
      whatsappLink(
        `Olá! Sou ${sentName || "cliente"} e acabei de enviar uma solicitação pelo site da ${site.name}. Gostaria de adiantar meu atendimento.`,
      ),
    [sentName],
  );

  /* ------------------------------------------------------------- SUCESSO -- */
  if (status === "success") {
    return (
      <div
        className={`rounded-2xl border p-8 text-center ${
          isDark ? "glass" : "border-accent-200 bg-accent-50/50"
        }`}
        role="status"
      >
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-accent-500 text-white shadow-lift">
          <IconCheck className="size-7" />
        </span>
        <h3
          className={`mt-5 font-display text-xl font-bold ${
            isDark ? "text-white" : "text-brand-950"
          }`}
        >
          Solicitação enviada{sentName ? `, ${sentName}` : ""}!
        </h3>
        <p
          className={`mx-auto mt-3 max-w-md text-sm leading-relaxed ${
            isDark ? "text-brand-100/75" : "text-brand-900/65"
          }`}
        >
          Nossa equipe analisa as informações e entra em contato em até{" "}
          <strong className={isDark ? "text-white" : "text-brand-950"}>
            1 dia útil
          </strong>
          . Se preferir adiantar, chame no WhatsApp agora mesmo.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={whatsappAfterSend}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-semibold text-[#04331b] shadow-soft transition-all hover:brightness-105 sm:w-auto"
          >
            <IconWhatsApp className="size-4" />
            Falar no WhatsApp agora
          </a>
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setFeedback("");
            }}
            className={`inline-flex w-full items-center justify-center rounded-xl border px-5 py-3 text-sm font-semibold transition-colors sm:w-auto ${
              isDark
                ? "border-white/20 text-white hover:bg-white/10"
                : "border-brand-200 text-brand-900 hover:bg-white"
            }`}
          >
            Enviar outra solicitação
          </button>
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------------- FORMULÁRIO -- */
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className={`grid gap-5 ${compact ? "" : "sm:grid-cols-2"}`}>
        <div>
          <label htmlFor={fieldId("name")} className={labelClass}>
            Nome completo <span className="text-accent-500">*</span>
          </label>
          <input
            id={fieldId("name")}
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Como podemos te chamar?"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? errorId("name") : undefined}
            className={fieldClass(Boolean(errors.name))}
          />
          <FieldError id={errorId("name")} message={errors.name} />
        </div>

        <div>
          <label htmlFor={fieldId("company")} className={labelClass}>
            Empresa <span className="text-accent-500">*</span>
          </label>
          <input
            id={fieldId("company")}
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="Razão social ou nome fantasia"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            aria-invalid={Boolean(errors.company)}
            aria-describedby={errors.company ? errorId("company") : undefined}
            className={fieldClass(Boolean(errors.company))}
          />
          <FieldError id={errorId("company")} message={errors.company} />
        </div>

        {!compact && (
          <div>
            <label htmlFor={fieldId("email")} className={labelClass}>
              E-mail <span className="text-accent-500">*</span>
            </label>
            <input
              id={fieldId("email")}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="voce@empresa.com.br"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? errorId("email") : undefined}
              className={fieldClass(Boolean(errors.email))}
            />
            <FieldError id={errorId("email")} message={errors.email} />
          </div>
        )}

        <div>
          <label htmlFor={fieldId("phone")} className={labelClass}>
            Telefone / WhatsApp <span className="text-accent-500">*</span>
          </label>
          <input
            id={fieldId("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(11) 90000-0000"
            value={form.phone}
            onChange={(e) => update("phone", maskPhone(e.target.value))}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? errorId("phone") : undefined}
            className={fieldClass(Boolean(errors.phone))}
          />
          <FieldError id={errorId("phone")} message={errors.phone} />
        </div>
      </div>

      <div>
        <label htmlFor={fieldId("service")} className={labelClass}>
          Como podemos ajudar?
        </label>
        <select
          id={fieldId("service")}
          name="service"
          value={form.service}
          onChange={(e) => update("service", e.target.value)}
          className={`${fieldClass(false)} appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-11`}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9.5 6 6 6-6'/%3E%3C/svg%3E\")",
          }}
        >
          <option value="">Selecione o serviço de interesse</option>
          {services.map((service) => (
            <option key={service.slug} value={service.name}>
              {service.name}
            </option>
          ))}
          <option value="Outro assunto">Outro assunto</option>
        </select>
      </div>

      {!compact && (
        <div>
          <label htmlFor={fieldId("message")} className={labelClass}>
            Conte um pouco do seu cenário
          </label>
          <textarea
            id={fieldId("message")}
            name="message"
            rows={4}
            placeholder="Ex.: preciso trocar de contador, tenho 12 funcionários e faturo cerca de R$ 300 mil/mês."
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            className={`${fieldClass(false)} resize-none`}
          />
        </div>
      )}

      {/* Honeypot anti-spam: invisível para humanos */}
      <div className="absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
        <label htmlFor={fieldId("website")}>Não preencha este campo</label>
        <input
          id={fieldId("website")}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => update("website", e.target.value)}
        />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="consent"
            checked={form.consent}
            onChange={(e) => update("consent", e.target.checked)}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? errorId("consent") : undefined}
            className="mt-0.5 size-4.5 shrink-0 cursor-pointer rounded border-brand-300 accent-accent-500"
          />
          <span
            className={`text-xs leading-relaxed ${
              isDark ? "text-brand-100/70" : "text-brand-900/65"
            }`}
          >
            Autorizo a {site.name} a entrar em contato pelos dados informados e
            concordo com o tratamento das informações conforme a{" "}
            <a
              href="/politica-de-privacidade"
              className="font-medium text-accent-600 underline decoration-accent-300 underline-offset-2 hover:text-accent-700"
            >
              Política de Privacidade
            </a>
            . <span className="text-accent-500">*</span>
          </span>
        </label>
        <FieldError id={errorId("consent")} message={errors.consent} />
      </div>

      {status === "error" && feedback && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <IconAlert className="mt-0.5 size-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-accent-600 hover:shadow-lift active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {status === "sending" ? (
            <>
              <IconSpinner className="size-4" />
              Enviando...
            </>
          ) : (
            <>
              Solicitar diagnóstico gratuito
              <IconArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
        <p
          className={`text-xs leading-relaxed ${
            isDark ? "text-brand-100/55" : "text-brand-900/50"
          }`}
        >
          Resposta em até 1 dia útil. Seus dados ficam sob sigilo.
        </p>
      </div>
    </form>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
      <IconAlert className="size-3.5" />
      {message}
    </p>
  );
}
