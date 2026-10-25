import { ServiceItem, ClientItem } from '@/types';

// Conversion des documents Firestore (lus par le serveur ou par l'admin) en services et clients.

const str = (v: unknown) => (typeof v === 'string' ? v : '');
const num = (v: unknown) => (typeof v === 'number' ? v : 0);

export function toService(id: string, d: Record<string, unknown>): ServiceItem {
  return {
    id,
    slug: str(d.slug) || id,
    title: str(d.title),
    shortDescription: str(d.shortDescription),
    fullDescription: str(d.fullDescription),
    iconName: str(d.iconName) || 'LayoutDashboard',
    features: Array.isArray(d.features) ? d.features.filter((f): f is string => typeof f === 'string') : [],
    ctaLabel: str(d.ctaLabel) || undefined,
    order: num(d.order),
  };
}

export function toClient(id: string, d: Record<string, unknown>): ClientItem {
  return {
    id,
    name: str(d.name),
    activity: str(d.activity),
    location: str(d.location),
    logo: str(d.logo),
    order: num(d.order),
  };
}

export const byOrder = (a: { order?: number }, b: { order?: number }) => (a.order ?? 0) - (b.order ?? 0);

/** Identifiant lisible tiré d'un titre (« Réseaux informatiques » → « reseaux-informatiques »). */
export function slugify(text: string): string {
  return (
    text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60) || 'service'
  );
}
