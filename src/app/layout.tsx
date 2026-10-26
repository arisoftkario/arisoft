import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';
import { InstallApp } from '@/components/layout/InstallApp';
import { NewAdsNotifier } from '@/components/layout/NewAdsNotifier';
import { AutoLanguage } from '@/components/layout/AutoLanguage';
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
    "ARISOFT : Votre partenaire pour logiciels de gestion d'entreprise, création de sites web, applications mobiles, caméras de surveillance, réseaux informatiques, cybersécurité et impression textile personnalisée.",
  keywords: [
    'logiciel de gestion',
    'création site web',
    'installation caméras de surveillance',
    'impression t-shirts personnalisés',
    'assistance informatique',
    'installation réseau informatique',
    'cybersécurité',
    'logiciel de caisse',
    'logiciel de gestion scolaire',
    'logiciel de gestion hospitalière',
    'logiciel de gestion de chantier BTP',
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
  appleWebApp: {
    capable: true,
    title: companyInfo.name,
    statusBarStyle: 'black-translucent',
  },
  // Code fourni par Google Search Console (méthode « Balise HTML »)
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
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
        <InstallApp />
        <NewAdsNotifier />
        <AutoLanguage />
      </body>
    </html>
  );
}
