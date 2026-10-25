'use client';

import React from 'react';
import { Loader2, MessageSquareQuote } from 'lucide-react';
import { TestimonialForm, TestimonialsGrid, useTestimonials } from '@/components/shared/Testimonials';

export const AvisFeed: React.FC = () => {
  const items = useTestimonials();

  return (
    <div className="space-y-14">
      {items === null ? (
        <div className="flex justify-center py-16 text-content-muted">
          <Loader2 className="w-7 h-7 animate-spin" aria-label="Chargement des avis" />
        </div>
      ) : items.length === 0 ? (
        <div className="max-w-xl mx-auto text-center bg-white rounded-card-lg border border-dashed border-slate-300 p-10">
          <MessageSquareQuote className="w-10 h-10 text-brand-green mx-auto mb-3" aria-hidden="true" />
          <p className="font-bold text-content-primary">Soyez le premier à donner votre avis.</p>
          <p className="text-sm text-content-secondary mt-1">
            Les avis de nos clients seront publiés ici après relecture.
          </p>
        </div>
      ) : (
        <TestimonialsGrid items={items} />
      )}

      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-extrabold text-content-primary mb-2">Laisser un avis</h2>
        <p className="text-sm text-content-secondary mb-6">Quelques mots suffisent : le service reçu, la rapidité, le résultat.</p>
        <TestimonialForm />
      </div>
    </div>
  );
};
