import type { NextConfig } from 'next';

// Sous-dossier de publication (ex : /arisoft sur GitHub Pages), vide en local et sur un domaine propre.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  // Sur Vercel, le site garde un petit serveur pour envoyer les notifications (/api/notify).
  // STATIC_EXPORT=1 produit un site 100 % statique (dossier out/), sans notifications.
  output: process.env.STATIC_EXPORT ? 'export' : undefined,
  basePath,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
