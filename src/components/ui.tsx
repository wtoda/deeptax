import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/* --------------------------------------------------------------- Layout --- */

export function Section({
  children,
  className = "",
  id,
  tone = "light",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "light" | "muted" | "dark";
}) {
  const tones = {
    light: "bg-white",
    muted: "bg-brand-50/60",
    dark: "bg-ink text-white",
  };
  return (
    <section
      id={id}
      className={`relative py-20 sm:py-24 lg:py-28 ${tones[tone]} ${className}`}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "light",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  tone?: "light" | "dark";
  className?: string;
}) {
  const isDark = tone === "dark";
  return (
    <div
      className={`${
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"
      } ${className}`}
    >
      {eyebrow && (
        <span
          className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] ${
            isDark
              ? "border-white/15 bg-white/5 text-accent-300"
              : "border-brand-100 bg-brand-50 text-brand-600"
          }`}
        >
          <span className="size-1.5 rounded-full bg-accent-500" />
          {eyebrow}
        </span>
      )}
      <h2
        className={`text-3xl font-bold sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12] ${
          isDark ? "text-white" : "text-brand-950"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-5 text-base leading-relaxed sm:text-lg ${
            isDark ? "text-brand-100/75" : "text-brand-900/65"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------- Botões ---- */

type ButtonVariant = "primary" | "secondary" | "ghost" | "whatsapp" | "outline-light";
type ButtonSize = "md" | "lg";

const buttonBase =
  "group inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-500 text-white shadow-soft hover:bg-accent-600 hover:shadow-lift active:scale-[0.985]",
  secondary:
    "bg-brand-950 text-white shadow-soft hover:bg-brand-900 hover:shadow-lift active:scale-[0.985]",
  ghost:
    "border border-brand-200 bg-white text-brand-900 hover:border-brand-300 hover:bg-brand-50",
  whatsapp:
    "bg-[#25D366] text-[#04331b] shadow-soft hover:brightness-[1.06] hover:shadow-lift active:scale-[0.985]",
  "outline-light":
    "border border-white/25 bg-white/5 text-white backdrop-blur hover:border-white/40 hover:bg-white/10",
};

const buttonSizes: Record<ButtonSize, string> = {
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-3.5 text-[0.95rem]",
};

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  external,
  ...rest
}: {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  external?: boolean;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">) {
  const classes = `${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`;

  if (external || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={classes}
        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}

/* --------------------------------------------------------------- Cartões -- */

export function Card({
  children,
  className = "",
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-brand-100 bg-white p-6 shadow-soft ${
        interactive
          ? "transition-all duration-300 hover:-translate-y-1 hover:border-accent-200 hover:shadow-lift"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "light",
  className = "",
}: {
  children: ReactNode;
  tone?: "light" | "dark" | "accent";
  className?: string;
}) {
  const tones = {
    light: "border-brand-100 bg-brand-50 text-brand-700",
    dark: "border-white/15 bg-white/5 text-accent-300",
    accent: "border-accent-200 bg-accent-50 text-accent-700",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function CheckItem({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
          tone === "dark" ? "bg-accent-500/20 text-accent-300" : "bg-accent-50 text-accent-600"
        }`}
      >
        <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 12.5 4.5 4.5L19 7" />
        </svg>
      </span>
      <span
        className={`text-sm leading-relaxed ${
          tone === "dark" ? "text-brand-100/80" : "text-brand-900/75"
        }`}
      >
        {children}
      </span>
    </li>
  );
}

/* ------------------------------------------------------------------ FAQ --- */

export function FaqList({
  items,
}: {
  items: readonly { question: string; answer: string }[];
}) {
  return (
    <div className="divide-y divide-brand-100 overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-soft">
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-brand-50/50 [&::-webkit-details-marker]:hidden">
            <span className="font-display text-base font-semibold text-brand-950 sm:text-lg">
              {item.question}
            </span>
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-brand-200 text-brand-600 transition-transform duration-300 group-open:rotate-180 group-open:border-accent-300 group-open:bg-accent-50 group-open:text-accent-600">
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9.5 6 6 6-6" />
              </svg>
            </span>
          </summary>
          <div className="px-6 pb-6 -mt-1">
            <p className="max-w-3xl text-sm leading-relaxed text-brand-900/70">
              {item.answer}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
