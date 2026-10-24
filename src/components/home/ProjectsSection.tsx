import React from 'react';
import Link from 'next/link';
import { clientLogos } from '@/data/content';
import { ProjectsGrid } from '@/components/shared/ProjectsGrid';
import { SectionHeader } from '@/components/shared/SectionHeader';

export const ProjectsSection: React.FC = () => {
  return (
    <section className="bg-surface-alt py-16 sm:py-24 border-b border-line-subtle" id="realisations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Nos références"
          title="Ils nous ont fait confiance."
          subtitle="Découvrez quelques-uns de nos projets récents livrés avec succès auprès d'entreprises locales."
          centered={true}
        />

        {/* 3 dernières réalisations publiées */}
        <ProjectsGrid limit={3} />

        {/* Rangée de logos clients */}
        <div className="mt-14 pt-10 border-t border-line-subtle">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-content-muted mb-6">
            Entreprises, commerces et institutions partenaires
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {clientLogos.map((logo) => (
              <div
                key={logo.id}
                className="h-16 rounded-card-sm border border-line-subtle bg-white flex items-center justify-center p-3 text-center shadow-xs"
              >
                <span className="text-xs font-semibold text-content-muted">
                  {logo.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/realisations/"
            className="inline-flex items-center font-bold text-sm text-content-primary hover:text-brand-green underline"
          >
            <span>Voir toutes nos réalisations et domaines d'intervention →</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
