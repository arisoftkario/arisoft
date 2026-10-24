import React from 'react';
import type { Metadata } from 'next';
import { SocialLinks } from '@/components/shared/SocialLinks';
import { PublicitesFeed } from './PublicitesFeed';

export const metadata: Metadata = {
  title: 'Offres & actualités · ARISOFT',
  description:
    'Promotions, nouveautés et actualités ARISOFT à Butembo : logiciels de gestion, sites web, caméras de surveillance, impression textile.',
};

export default function PublicitesPage() {
  return (
    <div className="bg-surface-alt">
      {/* En-tête */}
      <section className="bg-navy text-white py-14 sm:py-20 border-b border-navy-light/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-green-light px-3 py-1 rounded-full bg-navy-light border border-navy-subtle mb-4">
              Offres & actualités
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
              Nos offres du moment.
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6">
              Aimez, partagez avec vos proches et contactez-nous directement sur WhatsApp pour en profiter.
            </p>
            <SocialLinks label="Suivre ARISOFT :" isDarkTheme={true} size="lg" />
          </div>
        </div>
      </section>

      {/* Fil des publicités */}
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PublicitesFeed />
        </div>
      </section>
    </div>
  );
}
