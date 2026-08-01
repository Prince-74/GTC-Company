import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap"
});

export const metadata: Metadata = {
  title: "GTC | Garg Trading Company",
  description:
    "Premium custom cardboard boxes and corrugated packaging solutions for business, retail, e-commerce, food, automotive, and industrial brands.",
  keywords: [
    "corrugated boxes",
    "custom cardboard boxes",
    "packaging manufacturer",
    "printed boxes",
    "bulk packaging",
    "B2B packaging"
  ],
  openGraph: {
    title: "GTC | Garg Trading Company",
    description:
      "Modern corrugated box manufacturing with precision printing, die cutting, quality inspection, and reliable delivery.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "GTC | Garg Trading Company",
    description: metadata.description,
    telephone: "+91 98765 43210",
    email: "sales@example.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Industrial Area, Manufacturing Zone",
      addressLocality: "Your City",
      addressCountry: "IN"
    }
  };

  return (
    <html lang="en">
      <body className={`${inter.variable} ${manrope.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        {children}
      </body>
    </html>
  );
}
