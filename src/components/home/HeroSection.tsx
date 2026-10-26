import React from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Users,
  Building,
  UtensilsCrossed,
  Hotel,
  GraduationCap,
  Hospital,
  HardHat,
  ArrowRight,
  ShieldCheck,
  Zap,
  } from 'lucide-react';
import { companyInfo, softwareModules } from '@/data/content';
import { ContactButtons } from '@/components/shared/ContactButtons';
import { SocialLinks } from '@/components/shared/SocialLinks';

// Map module icons
const getModuleIcon = (id: string) => {
  switch (id) {
    case 'commerce':
      return <ShoppingCart className="w-5 h-5 text-brand-green" aria-hidden="true" />;
    case 'rh':
      return <Users className="w-5 h-5 text-brand-green" aria-hidden="true" />;
    case 'ong':
      return <Building className="w-5 h-5 text-brand-green" aria-hidden="true" />;
    case 'restaurant':
      return <UtensilsCrossed className="w-5 h-5 text-brand-green" aria-hidden="true" />;
    case 'hotellerie':
      return <Hotel className="w-5 h-5 text-brand-green" aria-hidden="true" />;
    case 'ecoles':
      return <GraduationCap className="w-5 h-5 text-brand-green" aria-hidden="true" />;
    case 'hopitaux':
      return <Hospital className="w-5 h-5 text-brand-green" aria-hidden="true" />;
    case 'btp':
      return <HardHat className="w-5 h-5 text-brand-green" aria-hidden="true" />;
    default:
      return <Zap className="w-5 h-5 text-brand-green" aria-hidden="true" />;
  }
};

const heroStats = [
  { value: String(softwareModules.length), label: 'secteurs couverts par notre logiciel' },
  { value: '1', label: 'seul interlocuteur pour tout votre système' },
  { value: '6 j/7', label: 'du lundi au samedi' },
];

export const HeroSection: React.FC = () => {
  return (
    <section className="bg-navy text-white pt-10 sm:pt-16 pb-16 sm:pb-24 border-b border-navy-light/60 relative overflow-hidden">
      {/* Halos lumineux et quadrillage décoratifs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-[28rem] h-[28rem] rounded-full bg-brand-green/25 blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-[32rem] h-[32rem] rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute inset-0 hero-grid" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Colonne Gauche : Pitch & CTA */}
          <div className="lg:col-span-7 space-y-6">
            {/* Petit badge */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-light border border-navy-subtle text-xs sm:text-sm font-semibold text-brand-green-light">
                <span className="w-2 h-2 rounded-full bg-brand-green shrink-0 animate-pulse" />
                <span>Assistance informatique & gestion d'entreprise</span>
              </div>
            </div>

            {/* Titre principal */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-white">
              {companyInfo.heroHeadline}
            </h1>

            {/* Sous-titre */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              {companyInfo.heroSubtitle}
            </p>

            {/* Boutons d'action rapides */}
            <div className="pt-2">
              <ContactButtons
                size="large"
                isDarkTheme={true}
                whatsappLabel="Écrire sur WhatsApp"
                phoneLabel={companyInfo.phoneDisplay}
              />
            </div>

            {/* Réseaux sociaux */}
            <SocialLinks label="Suivez-nous :" isDarkTheme={true} size="lg" />

            {/* Éléments de réassurance discrets */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-green-light" aria-hidden="true" />
                <span>Devis gratuit sans engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-green-light" aria-hidden="true" />
                <span>Installation et formation sur place</span>
              </div>
            </div>

            {/* Chiffres clés */}
            <dl className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
              {heroStats.map((stat) => (
                <div key={stat.label} className="rounded-card-sm bg-white/5 border border-white/10 px-3 py-3 backdrop-blur-sm">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block text-2xl sm:text-3xl font-extrabold text-white">{stat.value}</span>
                    <span className="block text-[11px] sm:text-xs text-slate-300 leading-snug mt-0.5">{stat.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Colonne Droite : Carte blanche Logiciel de gestion ARISOFT */}
          <div className="lg:col-span-5">
            <div className="bg-white text-content-primary rounded-card-lg p-6 sm:p-7 shadow-2xl shadow-black/30 ring-1 ring-white/10 border border-line-subtle relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-line-subtle">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-green">
                    Solution métier phare
                  </span>
                  <h2 className="text-lg sm:text-xl font-extrabold text-content-primary mt-0.5">
                    Logiciel de gestion ARISOFT
                  </h2>
                </div>
                <div className="hidden sm:block text-xs font-semibold px-2.5 py-1 rounded-md bg-brand-green-pale text-brand-green">
                  Sur-mesure
                </div>
              </div>

              <p className="text-xs sm:text-sm text-content-secondary mb-4 leading-relaxed">
                Une interface unique adaptée aux besoins stricts de votre secteur. Sélectionnez votre métier :
              </p>

              {/* Une tuile par module + la tuile démo */}
              <div className="grid grid-cols-2 gap-2.5">
                {softwareModules.map((module) => (
                  <Link
                    key={module.id}
                    href={`/logiciel-de-gestion/#${module.slug}`}
                    className="p-3 rounded-card-sm border border-line-subtle hover:border-brand-green hover:bg-slate-50 transition-colors flex flex-col justify-between group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="p-1.5 rounded-lg bg-green-50 group-hover:bg-brand-green-pale transition-colors">
                        {getModuleIcon(module.id)}
                      </div>
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-content-primary group-hover:text-brand-green transition-colors">
                        {module.title}
                      </span>
                      <span className="block text-[11px] text-content-secondary line-clamp-1">
                        {module.subtitle}
                      </span>
                    </div>
                  </Link>
                ))}

                {/* Tuile Voir une démo */}
                <Link
                  href="/logiciel-de-gestion/"
                  className={`p-3 rounded-card-sm bg-brand-green text-white hover:bg-brand-green-hover transition-colors flex flex-col justify-between group active:scale-[0.98] ${softwareModules.length % 2 === 0 ? 'col-span-2' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-green-200">
                      Gratuit
                    </span>
                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="block text-sm font-extrabold text-white">
                      Voir une démo →
                    </span>
                    <span className="block text-[11px] text-green-100">
                      Testez nos modules
                    </span>
                  </div>
                </Link>
              </div>

              <div className="mt-4 pt-3 border-t border-line-subtle text-center">
                <Link
                  href="/contact/"
                  className="text-xs font-semibold text-content-secondary hover:text-brand-green transition-colors inline-flex items-center gap-1"
                >
                  <span>Besoin d'une démonstration dans vos locaux ?</span>
                  <span className="text-brand-green underline">Contactez-nous</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
