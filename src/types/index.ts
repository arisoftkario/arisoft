export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  features: string[];
  ctaLabel?: string;
}

export interface SoftwareModule {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  features: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  clientName: string;
  serviceCategory: string;
  imagePlaceholder: string;
  description: string;
  /** Jusqu'à 4 photos : data URL publiées depuis l'admin ou chemins d'images du site (/images/realisations/…). */
  images?: string[];
  /** Lien d'une vidéo TikTok, YouTube ou Facebook. */
  videoUrl?: string;
}

export interface AdvantageItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  heroHeadline: string;
  heroSubtitle: string;
  phone: string;
  phoneDisplay: string;
  phoneRaw: string;
  whatsappUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  instagramUrl: string;
  address: string;
  /** Rue, numéro, quartier : affiché avant la ville quand il est renseigné. */
  streetAddress?: string;
  /** Coordonnées GPS de l'agence : épingle précise sur la carte et pour Google. */
  geo?: { latitude: number; longitude: number };
  email: string;
  openingHours: string;
  city: string;
  province: string;
  country: string;
}
