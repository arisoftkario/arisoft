import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Monitor } from 'lucide-react';
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

              {/* Aperçu illustratif du tableau de bord */}
              <div className="bg-slate-50 rounded-card border border-line-subtle p-4 sm:p-5 space-y-4" aria-label="Aperçu du tableau de bord ARISOFT Gestion">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Ventes du jour', value: '1 245 $', trend: '+12 %', tone: 'text-brand-green' },
                    { label: 'Trésorerie', value: '8 930 $', trend: 'À jour', tone: 'text-brand-green' },
                    { label: 'Alertes stock', value: '3', trend: 'À commander', tone: 'text-red-600' },
                  ].map((kpi) => (
                    <div key={kpi.label} className="bg-white rounded-card-sm border border-line-subtle p-3">
                      <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-content-muted">{kpi.label}</p>
                      <p className="text-base sm:text-xl font-extrabold text-content-primary mt-1">{kpi.value}</p>
                      <p className={`text-[10px] sm:text-xs font-bold ${kpi.tone}`}>{kpi.trend}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-card-sm border border-line-subtle p-4">
                  <p className="text-xs font-bold text-content-primary mb-3">Ventes de la semaine</p>
                  <div className="flex items-end gap-2 h-28" aria-hidden="true">
                    {[45, 62, 38, 70, 55, 88, 74].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className={`w-full rounded-t ${i === 5 ? 'bg-brand-green' : 'bg-brand-green/30'}`}
                          style={{ height: `${h}%` }}
                        />
                        <span className="text-[10px] text-content-muted">{['L', 'M', 'M', 'J', 'V', 'S', 'D'][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-card-sm border border-line-subtle divide-y divide-line-subtle text-xs">
                  {[
                    { item: 'Ciment 50 kg', stock: '4 sacs', alert: true },
                    { item: 'Huile 5 L', stock: '18 bidons', alert: false },
                    { item: 'Sucre 1 kg', stock: '2 cartons', alert: true },
                  ].map((row) => (
                    <div key={row.item} className="flex items-center justify-between px-4 py-2.5">
                      <span className="font-semibold text-content-primary">{row.item}</span>
                      <span className={`font-bold px-2 py-0.5 rounded-full ${row.alert ? 'bg-red-50 text-red-600' : 'bg-brand-green-pale text-brand-green'}`}>
                        {row.stock}
                      </span>
                    </div>
                  ))}
                </div>
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
