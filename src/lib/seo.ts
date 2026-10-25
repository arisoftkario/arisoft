import type { Metadata } from 'next';
import { companyInfo } from '@/data/content';

// Métadonnées d'une page publique : titre, URL canonique et aperçu de partage (WhatsApp, Facebook…) propres à la page.
export function pageMetadata(path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: companyInfo.name,
      locale: 'fr_FR',
      type: 'website',
      images: ['/opengraph-image.png'],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}
