import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"]
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"]
});

export const metadata: Metadata = {
  title: "GTC | Garg Trading Company - Corrugated Box Manufacturer",
  description:
    "Garg Trading Company (GTC), founded by Sonu Garg, is a direct manufacturer of high-quality corrugated boxes, shipping cartons, and printed packaging with 6+ years experience and 10 Lakh+ boxes shipped.",
  keywords: [
    "Garg Trading Company",
    "Sonu Garg",
    "GTC packaging",
    "corrugated box manufacturer",
    "custom cardboard boxes",
    "printed boxes",
    "heavy duty boxes",
    "die cut packaging",
    "direct factory packaging supplier"
  ],
  authors: [{ name: "Sonu Garg - Garg Trading Company" }],
  icons: {
    icon: "/images/logo/png-01.png",
    shortcut: "/images/logo/png-01.png",
    apple: "/images/logo/png-01.png"
  },
  openGraph: {
    title: "GTC | Garg Trading Company - Strong Boxes. Honest Pricing. On-Time Delivery.",
    description:
      "Direct manufacturer of custom corrugated boxes, shipping cartons, and printed brand packaging. Request your free quotation today.",
    type: "website",
    locale: "en_IN",
    siteName: "Garg Trading Company"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ManufacturingBusiness",
    name: "Garg Trading Company (GTC)",
    alternateName: "GTC Packaging",
    founder: {
      "@type": "Person",
      name: "Sonu Garg"
    },
    description:
      "Direct manufacturer of custom corrugated cardboard boxes, shipping cartons, and printed packaging. Strong quality, fair factory prices, and fast delivery.",
    telephone: "+91 7060443193",
    email: "garg00445@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "689/4 Madhavpuram, Delhi Road",
      addressLocality: "Meerut",
      postalCode: "250002",
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN"
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        opens: "09:00",
        closes: "18:30"
      }
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning data-theme="dark">
      <head>
        <link rel="icon" href="/images/logo/png-01.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/logo/png-01.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('gtc-theme');
                  var theme = saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
                  document.documentElement.setAttribute('data-theme', theme);
                } catch(e) {}
              })();
            `
          }}
        />
      </head>
      <body className={`${plusJakarta.variable} ${spaceGrotesk.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        {children}
      </body>
    </html>
  );
}
