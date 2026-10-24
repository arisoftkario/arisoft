'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { AdsFeed, useAds } from '@/components/shared/AdsFeed';
import { SocialLinks } from '@/components/shared/SocialLinks';

/** Section d'accueil « Offres & actualités » : masquée tant qu'aucune publicité n'est publiée. */
export const AdsSection: React.FC = () => {
  const ads = useAds();
  if (!ads || ads.length === 0) return null;

  return (
    <section className="bg-white py-16 sm:py-24 border-b border-line-subtle" id="publicites">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Offres & actualités"
          title="Nos dernières offres."
          subtitle="Promotions, nouveautés et réalisations récentes : aimez, partagez et contactez-nous en un clic."
          centered={true}
        />

        <AdsFeed ads={ads} limit={3} />

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href="/publicites/"
            className="inline-flex items-center font-bold text-sm text-white bg-navy hover:bg-navy-light px-5 py-3 rounded-card transition-colors"
          >
            Voir toutes les offres
            <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
          </Link>
          <SocialLinks label="Suivre ARISOFT :" />
        </div>
      </div>
    </section>
  );
};
