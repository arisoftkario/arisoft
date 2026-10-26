import { MetadataRoute } from 'next';
import { siteUrl, softwareModules } from '@/data/content';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteUrl;
  const lastModified = new Date();

  return [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/sw/`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/logiciel-de-gestion/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...softwareModules.map((m) => ({
      url: `${baseUrl}/logiciel-de-gestion/${m.slug}/`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: `${baseUrl}/realisations/`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/publicites/`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/avis/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact/`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
