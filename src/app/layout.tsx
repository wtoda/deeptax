import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { site } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.shortDescription,
  keywords: [
    "contabilidade",
    "escritório de contabilidade",
    "revisão fiscal",
    "recuperação de créditos tributários",
    "perícia contábil",
    "compliance",
    "consultoria tributária",
    "perícia contábil",
    "planejamento tributário",
    "departamento pessoal",
    "abertura de empresa",
  ],
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  publisher: site.legalName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.shortDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.shortDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "Contabilidade",
};

export const viewport: Viewport = {
  themeColor: "#071427",
  width: "device-width",
  initialScale: 1,
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "AccountingService",
  name: site.name,
  // Só declaramos legalName quando difere do nome apresentado — repetir o
  // mesmo valor duas vezes não acrescenta nada ao schema.
  ...(site.legalName !== site.name ? { legalName: site.legalName } : {}),
  description: site.shortDescription,
  url: site.url,
  telephone: site.contact.phone,
  email: site.contact.email,
  address: {
    "@type": "PostalAddress",
    // O schema.org não tem campo para bairro; no Brasil ele costuma ser
    // anexado ao fim do logradouro para não se perder na informação.
    streetAddress: [
      site.contact.address.street,
      site.contact.address.complement,
      site.contact.address.district,
    ]
      .filter(Boolean)
      .join(", "),
    addressLocality: site.contact.address.city,
    addressRegion: site.contact.address.state,
    // Omitido enquanto o CEP não for informado (evita campo vazio no schema).
    ...(site.contact.address.zip ? { postalCode: site.contact.address.zip } : {}),
    addressCountry: "BR",
  },
  areaServed: { "@type": "Country", name: "Brasil" },
  openingHours: "Mo-Fr 09:00-18:00",
  priceRange: "$$",
  sameAs: [site.social.linkedin, site.social.instagram].filter(Boolean),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Serviços contábeis",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "DeepCont — Contabilidade" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "DeepTax — Tributário" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "DeepSystems — Tecnologia fiscal" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "DeepPericia — Perícia contábil" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "DeepConsult — Consultoria" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "DeepCompliance — Compliance" } },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${sora.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-950 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          Ir para o conteúdo
        </a>
        <Header />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppFloat />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </body>
    </html>
  );
}
