import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { ModalProvider } from "@/components/ConsultationModal";
import { CartProvider } from "@/lib/cart";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { siteConfig } from "@/config/site";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.seo.defaultTitle,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.seo.defaultDescription,
  keywords: [
    "landscaping pune",
    "landscape design pune",
    "plant nursery pune",
    "specimen trees pune",
    "builder foliage supply",
    "vertical gardens pune",
    "estate landscaping lonavala",
    "terrace gardens baner",
  ],
  authors: [{ name: "Green Gallery Pune" }],
  creator: "Green Gallery",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    siteName: siteConfig.name,
    images: [
      {
        url: "/images/hero-clean.webp",
        width: 1920,
        height: 1080,
        alt: "Green Gallery — Landscape Design & Execution, Pune",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org LocalBusiness JSON-LD
  const localBusinessSchema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "LandscapeArchitect",
    "name": siteConfig.name,
    "description": siteConfig.description,
    "image": `${siteConfig.url}/images/hero-clean.webp`,
    "@id": siteConfig.url,
    "url": siteConfig.url,
    "telephone": siteConfig.contact.phone,
    "email": siteConfig.contact.email,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Pune",
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 18.5204,
      "longitude": 73.8567
    },
    "priceRange": "₹₹₹",
    "areaServed": siteConfig.serviceRegions.map((region) => ({
      "@type": "AdministrativeArea",
      "name": region,
    }))
  };

  if (siteConfig.founder.isPublished) {
    localBusinessSchema.founder = {
      "@type": "Person",
      "name": siteConfig.founder.displayName,
    };
  }

  return (
    <html lang="en" className={`${newsreader.variable} ${plusJakarta.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("gg-theme");if(t==="dark"){document.documentElement.classList.add("dark");}else{document.documentElement.classList.remove("dark");}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-cream-50 text-ink-900 transition-colors duration-200">
        <AnalyticsTracker />
        <ThemeProvider>
          <CartProvider>
            <ModalProvider>
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
              <FloatingWhatsApp />
            </ModalProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
