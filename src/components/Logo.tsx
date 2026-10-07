import Link from "next/link";
import { site } from "@/lib/site";

export function LogoMark({ className = "size-10" }: { className?: string }) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-brand-700 ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 32 32" className="size-[62%] text-white" fill="none">
        <path
          d="M9 7h6.2c5 0 8.3 3.4 8.3 8.6S20.2 25 15.2 25H9z"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path
          d="M13.4 13.2l3.1 3.3 4.6-5"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function Logo({
  tone = "dark",
  className = "",
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label={`${site.name} — página inicial`}
    >
      <LogoMark className="size-10 transition-transform duration-300 group-hover:scale-[1.04]" />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[1.35rem] font-bold tracking-tight ${
            tone === "light" ? "text-white" : "text-brand-950"
          }`}
        >
          Deep<span className="text-accent-500">tax</span>
        </span>
        <span
          className={`mt-0.5 text-[0.6rem] font-medium uppercase tracking-[0.2em] ${
            tone === "light" ? "text-brand-100/60" : "text-brand-900/45"
          }`}
        >
          Contabilidade
        </span>
      </span>
    </Link>
  );
}
