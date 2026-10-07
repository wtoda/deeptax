import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export const IconCpu = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="7" y="7" width="10" height="10" rx="2" />
    <path d="M10.5 10.5h3v3h-3z" />
    <path d="M4 10h3M4 14h3M17 10h3M17 14h3M10 4v3M14 4v3M10 17v3M14 17v3" />
  </svg>
);

export const IconReceipt = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M6 3h12v18l-3-1.5-3 1.5-3-1.5L6 21z" />
    <path d="M9.5 8h5M9.5 11.5h5" />
    <path d="M10 15h3" />
  </svg>
);

/** Indica que o link leva para fora do site, em nova aba. */
export const IconExternal = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M14 4h6v6" />
    <path d="M20 4l-8.5 8.5" />
    <path d="M18 14.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4.5" />
  </svg>
);

export const IconSearch = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
    <path d="M11 8v6M8 11h6" />
  </svg>
);

export const IconCompass = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5.2-5.2 2 2-5.2z" />
  </svg>
);

export const IconLedger = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6.5A1.5 1.5 0 0 1 5 19.5z" />
    <path d="M5 4.5A1.5 1.5 0 0 0 6.5 6H19" />
    <path d="M9 10h6M9 14h4" />
  </svg>
);

export const IconGavel = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m14.5 5.5 4 4" />
    <path d="m17 3 4 4-2.5 2.5-4-4z" />
    <path d="m10.5 9.5 4 4-2.5 2.5-4-4z" />
    <path d="M12 12 5 19" />
    <path d="M4 21h9" />
  </svg>
);

export const IconShield = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 3l7 3v5.5c0 4.2-2.9 7.9-7 9-4.1-1.1-7-4.8-7-9V6z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const IconChart = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 20h16" />
    <path d="M7 20v-6M12 20V7M17 20v-9" />
    <path d="m5 8 4.5-3.5L14 7l5-4" />
  </svg>
);

export const IconClock = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5V12l3 1.8" />
  </svg>
);

export const IconUsers = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
    <path d="M16 5.4a3.2 3.2 0 0 1 0 6.2" />
    <path d="M17.5 14.6A5.5 5.5 0 0 1 20.5 20" />
  </svg>
);

export const IconLock = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="4.5" y="10" width="15" height="10" rx="2" />
    <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
    <path d="M12 14v2" />
  </svg>
);

export const IconSparkles = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9z" />
    <path d="M18.5 16.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
  </svg>
);

export const IconCheck = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </svg>
);

export const IconArrowRight = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4.5 12h15" />
    <path d="m13.5 6 6 6-6 6" />
  </svg>
);

export const IconChevronDown = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m6 9.5 6 6 6-6" />
  </svg>
);

export const IconMenu = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const IconX = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconPhone = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6L16.5 13l4 1.5v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z" />
  </svg>
);

export const IconMail = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="2" />
    <path d="m3.8 7 7.1 5.3a2 2 0 0 0 2.2 0L20.2 7" />
  </svg>
);

export const IconMapPin = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 21s6.5-5.4 6.5-10.2A6.5 6.5 0 0 0 5.5 10.8C5.5 15.6 12 21 12 21z" />
    <circle cx="12" cy="10.5" r="2.4" />
  </svg>
);

export const IconWhatsApp = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15s-.77.95-.94 1.15c-.17.2-.35.22-.64.07a8.2 8.2 0 0 1-2.4-1.48 9 9 0 0 1-1.66-2.07c-.17-.3-.02-.46.13-.6.15-.16.35-.42.52-.62.17-.2.22-.35.32-.55.1-.2.05-.37-.02-.52s-.67-1.62-.92-2.2c-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37s-1.03 1-1.03 2.45 1.06 2.85 1.2 3.05c.15.2 2.05 3.25 5.02 4.44 2.47.99 3.13.85 3.68.8.55-.05 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.07-.12-.27-.2-.57-.35z" />
    <path d="M12.04 2C6.6 2 2.18 6.42 2.18 11.86c0 1.74.45 3.42 1.32 4.9L2 22l5.4-1.42a9.83 9.83 0 0 0 4.64 1.18h.01c5.43 0 9.85-4.42 9.85-9.86A9.8 9.8 0 0 0 12.04 2zm0 17.94a8.2 8.2 0 0 1-4.15-1.13l-.3-.18-3.07.8.82-3-.19-.31a8.14 8.14 0 0 1-1.25-4.36 8.16 8.16 0 0 1 8.15-8.14 8.1 8.1 0 0 1 8.13 8.15c0 4.5-3.65 8.14-8.14 8.17z" />
  </svg>
);

export const IconLinkedIn = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM3 9h4v12H3zM9.5 9h3.8v1.7h.05a4.2 4.2 0 0 1 3.77-2.07c4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.5c0-1.31-.02-3-1.83-3-1.84 0-2.12 1.44-2.12 2.9V21h-4z" />
  </svg>
);

export const IconInstagram = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="16.9" cy="7.1" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconQuote = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M9.5 5.5c-3.3 1.1-5.5 3.9-5.5 7.6V19h6v-6H7.4c.2-1.9 1.2-3.2 3-3.9zm10 0c-3.3 1.1-5.5 3.9-5.5 7.6V19h6v-6h-2.6c.2-1.9 1.2-3.2 3-3.9z" />
  </svg>
);

export const IconBuilding = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 21h16" />
    <path d="M6 21V5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v16" />
    <path d="M15 10h3a1 1 0 0 1 1 1v10" />
    <path d="M9 8h2M9 12h2M9 16h2" />
  </svg>
);

export const IconFileText = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M13 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8z" />
    <path d="M13 3v5h5" />
    <path d="M9 13h6M9 17h4" />
  </svg>
);

export const IconTrendingUp = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m4 16 5-5 3.5 3.5L20 7" />
    <path d="M15 7h5v5" />
  </svg>
);

export const IconSpinner = (p: IconProps) => (
  <svg {...base} {...p} className={`animate-spin ${p.className ?? ""}`}>
    <path d="M12 3a9 9 0 1 0 9 9" />
  </svg>
);

export const IconAlert = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5M12 16h.01" />
  </svg>
);

/* -------------------------------------------------------------------------- */

export const serviceIcons = {
  cpu: IconCpu,
  receipt: IconReceipt,
  ledger: IconLedger,
  gavel: IconGavel,
  compass: IconCompass,
  shield: IconShield,
} as const;

export const featureIcons = {
  shield: IconShield,
  chart: IconChart,
  clock: IconClock,
  users: IconUsers,
  lock: IconLock,
  sparkles: IconSparkles,
} as const;

export type FeatureIconName = keyof typeof featureIcons;
