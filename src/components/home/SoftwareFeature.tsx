import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Monitor, Laptop, Play } from 'lucide-react';
import { softwareKeyHighlights } from '@/data/content';
import { SectionHeader } from '@/components/shared/SectionHeader';

export const SoftwareFeature: React.FC = () => {
  return (
    <section className="bg-white py-16 sm:py-24 border-b border-line-subtle" id="logiciel-de-gestion">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Colonne Gauche : Emplacement Capture d'écran du logiciel */}
          <div className="lg:col-span-6">
            <div className="bg-surface-alt rounded-card-lg border border-line-subtle p-4 sm:p-6 shadow-md relative overflow-hidden">
              {/* Barre de fenêtre d'application factice */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-line-subtle">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" />
                </div>
                <div className="text-[11px] font-mono text-content-muted flex items-center gap-1">
                  <Monitor className="w-3.5 h-3.5 text-brand-green" aria-hidden="true" />
                  <span>ARISOFT Gestion v4.2 - Tableau de bord</span>
                </div>
                <div className="w-8" />
              </div>

              {/* Emplacement Capture d'écran du logiciel */}
              <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-card p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[300px] sm:min-h-[360px]">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-brand-green border border-green-200">
                  <Laptop className="w-8 h-8" aria-hidden="true" />
                </div>
                <span className="font-extrabold text-base sm:text-lg text-content-primary mb-1">
                  [Capture d'écran du logiciel]
                </span>
                <p className="text-xs sm:text-sm text-content-secondary max-w-sm mb-4">
                  Aperçu de l’interface : suivi des ventes journalières, alertes de stocks en rouge et état de trésorerie en direct.
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-brand-green-pale text-brand-green">
                  <Play className="w-3 h-3 fill-current" aria-hidden="true" />
                  <span>Démonstration interactive disponible</span>
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-content-secondary">
                <span>Accessible en réseau local ou hors-ligne</span>
                <span className="font-semibold text-brand-green">Mises à jour incluses</span>
              </div>
            </div>
          </div>

          {/* Colonne Droite : Titre, 4 points avec coche verte & Bouton */}
          <div className="lg:col-span-6 space-y-6">
            <SectionHeader
              badge="Produit phare"
              title="Un logiciel de gestion adapté à votre secteur."
              subtitle="Conçu pour simplifier votre quotidien sans jargon informatique : vous maîtrisez vos encaissements, vos stocks et vos comptes en un coup d'œil."
              className="mb-6"
            />

            {/* 4 points avec coche verte */}
            <div className="space-y-4">
              {softwareKeyHighlights.map((point) => (
                <div key={point.id} className="flex items-start gap-3.5">
                  <div className="mt-1 shrink-0 text-brand-green">
                    <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-content-primary">
                      {point.title}
                    </h4>
                    <p className="text-sm text-content-secondary mt-0.5 leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bouton Demander une démo */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/contact/?service=Logiciel%20de%20gestion&sujet=Demande%20de%20d%C3%A9monstration"
                className="inline-flex items-center justify-center font-bold text-white bg-brand-green hover:bg-brand-green-hover px-6 py-3.5 rounded-card transition-colors duration-150 shadow-sm active:translate-y-0.5"
              >
                <span>Demander une démo</span>
                <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
              </Link>

              <Link
                href="/logiciel-de-gestion/"
                className="inline-flex items-center justify-center font-semibold text-content-primary hover:text-brand-green border border-line-subtle hover:border-slate-400 bg-white px-5 py-3.5 rounded-card transition-colors text-sm"
              >
                <span>Découvrir les 5 modules métier</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
