'use client';

import React from 'react';
import { Loader2, Megaphone } from 'lucide-react';
import { AdsFeed, useAds } from '@/components/shared/AdsFeed';

export const PublicitesFeed: React.FC = () => {
  const ads = useAds();

  if (ads === null) {
    return (
      <div className="flex justify-center py-16 text-content-muted">
        <Loader2 className="w-7 h-7 animate-spin" aria-label="Chargement des offres" />
      </div>
    );
  }

  if (ads.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center bg-white rounded-card-lg border border-dashed border-slate-300 p-10">
        <Megaphone className="w-10 h-10 text-brand-green mx-auto mb-3" aria-hidden="true" />
        <p className="font-bold text-content-primary">Nos prochaines offres arrivent bientôt.</p>
        <p className="text-sm text-content-secondary mt-1">
          Suivez ARISOFT sur nos réseaux pour être informé en premier.
        </p>
      </div>
    );
  }

  return <AdsFeed ads={ads} />;
};
