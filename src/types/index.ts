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
  /** Photo publiée depuis l'admin (data URL JPEG compressée). */
  imageUrl?: string;
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
  email: string;
  openingHours: string;
  city: string;
  province: string;
  country: string;
}
