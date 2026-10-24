import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';
import { JsonLd } from '@/components/shared/JsonLd';
import { companyInfo, siteUrl } from '@/data/content';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0B1F3A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: `${companyInfo.name} · ${companyInfo.tagline}`,
  description:
    "ARISOFT : Votre partenaire pour logiciels de gestion d'entreprise, création de sites web, applications mobiles, caméras de surveillance et impression textile personnalisée.",
  keywords: [
    'logiciel de gestion',
    'création site web',
    'installation caméras de surveillance',
    'impression t-shirts personnalisés',
    'assistance informatique',
    'logiciel de caisse',
    'ARISOFT',
  ],
  authors: [{ name: companyInfo.name }],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: `${companyInfo.name} · Solutions informatiques & gestion de A à Z`,
    description: companyInfo.heroSubtitle,
    url: siteUrl,
    siteName: companyInfo.name,
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${companyInfo.name} · ${companyInfo.tagline}`,
    description: companyInfo.heroSubtitle,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={plusJakartaSans.variable}>
      <body className="font-sans antialiased text-content-primary bg-white flex flex-col min-h-screen">
        <JsonLd />
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
