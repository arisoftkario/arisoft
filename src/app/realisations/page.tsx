import React from 'react';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { companyInfo } from '@/data/content';
import { ClientLogos } from '@/components/shared/ClientLogos';
import { ContactButtons } from '@/components/shared/ContactButtons';
import { ProjectsGrid } from '@/components/shared/ProjectsGrid';

export const metadata: Metadata = pageMetadata(
  '/realisations/',
  'Nos Réalisations & Références clients · ARISOFT',
  'Consultez les réalisations d’ARISOFT : installations logicielles, déploiements de caméras de surveillance HD, sites internet et impression textile pour entreprises.',
);

export default function RealisationsPage() {
  return (
    <div className="bg-white">
      {/* En-tête */}
      <section className="bg-navy text-white py-14 sm:py-20 border-b border-navy-light/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-green-light px-3 py-1 rounded-full bg-navy-light border border-navy-subtle mb-4">
              Références & Projets
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
              Ils nous ont fait confiance.
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6">
              Découvrez nos déploiements récents auprès d'entreprises locales : des installations matérielles fiables et des logiciels opérationnels au quotidien.
            </p>
            <div className="pt-2">
              <ContactButtons
                isDarkTheme={true}
                whatsappLabel="Parler de votre projet"
                phoneLabel={companyInfo.phoneDisplay}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grille des réalisations */}
      <section className="py-16 sm:py-24 bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProjectsGrid headingLevel="h2" />

          {/* Clients */}
          <div className="mt-16 pt-12 border-t border-line-subtle">
            <h2 className="text-center text-xs font-bold uppercase tracking-wider text-content-muted mb-8">
              Ils nous font confiance
            </h2>
            <ClientLogos />
          </div>
        </div>
      </section>

      {/* Pourquoi nos clients restent fidèles */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-content-primary">
            Notre méthode de livraison garantie
          </h2>
          <p className="text-content-secondary text-base leading-relaxed">
            Chaque projet confié à ARISOFT respecte un cahier des charges strict : audit préalable de vos installations, devis transparent, configuration soignée et formation opérationnelle de vos collaborateurs.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
            <div className="p-4 rounded-card bg-surface-alt border border-line-subtle">
              <span className="text-xs font-mono font-bold text-brand-green block mb-1">01. ÉCOUTE</span>
              <h3 className="font-bold text-sm text-content-primary">Étude des besoins</h3>
              <p className="text-xs text-content-secondary mt-1">Évaluation sur place de vos contraintes techniques.</p>
            </div>
            <div className="p-4 rounded-card bg-surface-alt border border-line-subtle">
              <span className="text-xs font-mono font-bold text-brand-green block mb-1">02. DÉPLOIEMENT</span>
              <h3 className="font-bold text-sm text-content-primary">Installation & Tests</h3>
              <p className="text-xs text-content-secondary mt-1">Mise en route rigoureuse sans perturber votre activité.</p>
            </div>
            <div className="p-4 rounded-card bg-surface-alt border border-line-subtle">
              <span className="text-xs font-mono font-bold text-brand-green block mb-1">03. FORMATION</span>
              <h3 className="font-bold text-sm text-content-primary">Accompagnement</h3>
              <p className="text-xs text-content-secondary mt-1">Assistance permanente et suivi technique régulier.</p>
            </div>
          </div>
          <div className="pt-4">
            <Link
              href="/contact/"
              className="inline-flex items-center font-bold text-white bg-brand-green hover:bg-brand-green-hover px-6 py-3.5 rounded-card text-base shadow-sm"
            >
              <span>Discuter de vos besoins techniques</span>
              <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
