'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { TestimonialsGrid, useTestimonials } from '@/components/shared/Testimonials';

/** Section d'accueil « Avis clients » : masquée tant qu'aucun avis n'est validé. */
export const TestimonialsSection: React.FC = () => {
  const items = useTestimonials();
  if (!items || items.length === 0) return null;

  return (
    <section className="bg-surface-alt py-16 sm:py-24" id="avis">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Avis clients"
          title="Ils nous font confiance."
          subtitle="Ce que disent les entreprises et organisations accompagnées par ARISOFT."
          centered={true}
        />

        <TestimonialsGrid items={items} limit={3} />

        <div className="mt-10 text-center">
          <Link
            href="/avis/"
            className="inline-flex items-center font-bold text-sm text-white bg-navy hover:bg-navy-light px-5 py-3 rounded-card transition-colors"
          >
            Voir tous les avis ou laisser le vôtre
            <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};
