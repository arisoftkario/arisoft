import React from 'react';
import { companyInfo } from '@/data/content';

export const JsonLd: React.FC = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: companyInfo.name,
    description: companyInfo.tagline,
    telephone: companyInfo.phone,
    url: 'https://arisoft.cd',
    logo: 'https://arisoft.cd/images/logo-dark.png',
    image: 'https://arisoft.cd/opengraph-image.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: companyInfo.address,
      addressLocality: companyInfo.city,
      addressCountry: companyInfo.country,
    },
    openingHours: 'Mo-Fr 08:30-17:00, Sa 09:00-13:00',
    priceRange: '$$',
    currenciesAccepted: 'USD, CDF',
    paymentAccepted: 'Cash, Mobile Money, Bank Transfer',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services informatiques & gestion ARISOFT',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Logiciel de gestion d’entreprise',
            description: 'Modules Commerce, Ressources Humaines, ONG, Restaurant, Hôtellerie.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Création de sites web',
            description: 'Sites vitrines et plateformes professionnelles légères optimisées mobile.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Installation de caméras de surveillance',
            description: 'Vidéosurveillance HD avec accès et visualisation directe sur smartphone.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Impression textile personnalisée',
            description: 'T-shirts et polos personnalisés pour entreprises et organisations.',
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};
