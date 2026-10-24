import type { MetadataRoute } from 'next';
import { companyInfo } from '@/data/content';

export const dynamic = 'force-static';

const base = process.env.NEXT_PUBLIC_BASE_PATH || '';

// Rend le site installable comme une application (téléphone et ordinateur).
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: `${base}/`,
    name: `${companyInfo.name} · ${companyInfo.tagline}`,
    short_name: companyInfo.name,
    description: companyInfo.heroSubtitle,
    lang: 'fr',
    start_url: `${base}/`,
    scope: `${base}/`,
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#0B1F3A',
    theme_color: '#0B1F3A',
    categories: ['business', 'productivity'],
    icons: [
      { src: `${base}/icons/icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: `${base}/icons/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: `${base}/icons/maskable-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Demander un devis', url: `${base}/contact/` },
      { name: 'Nos offres', url: `${base}/publicites/` },
      { name: 'Nos services', url: `${base}/services/` },
    ],
  };
}
