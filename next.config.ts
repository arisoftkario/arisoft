import type { NextConfig } from 'next';

// Sous-dossier de publication (ex : /arisoft sur GitHub Pages), vide en local et sur un domaine propre.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
