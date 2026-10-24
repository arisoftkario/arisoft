import React from 'react';
import Link from 'next/link';
import { ClientLogos } from '@/components/shared/ClientLogos';
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

        {/* Clients */}
        <div className="mt-14 pt-10 border-t border-line-subtle">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-content-muted mb-6">
            Ils nous font confiance
          </p>
          <ClientLogos />
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
