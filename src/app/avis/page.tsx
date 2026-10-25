import React from 'react';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { AvisFeed } from './AvisFeed';

export const metadata: Metadata = pageMetadata(
  '/avis/',
  'Avis clients · ARISOFT',
  'Témoignages des entreprises et organisations accompagnées par ARISOFT à Butembo : logiciels de gestion, sites web, caméras de surveillance. Laissez aussi votre avis.',
);

export default function AvisPage() {
  return (
    <div className="bg-surface-alt">
      {/* En-tête */}
      <section className="bg-navy text-white py-14 sm:py-20 border-b border-navy-light/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-green-light px-3 py-1 rounded-full bg-navy-light border border-navy-subtle mb-4">
              Avis clients
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
              Ce que disent nos clients.
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Vous avez travaillé avec ARISOFT ? Votre avis aide d’autres entreprises à nous faire confiance.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AvisFeed />
        </div>
      </section>
    </div>
  );
}
