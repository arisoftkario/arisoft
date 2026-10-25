import React from 'react';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
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
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  Play,
  MonitorCheck,
  ShieldCheck,
  Headphones,
} from 'lucide-react';
import { softwareModules, companyInfo } from '@/data/content';
import { SectionHeader } from '@/components/shared/SectionHeader';

export const metadata: Metadata = pageMetadata(
  '/logiciel-de-gestion/',
  'Logiciel de gestion d’entreprise sur mesure · ARISOFT',
  'Solutions logicielles modulaires pour Commerce, Ressources Humaines (RH), ONG, Restaurants, Hôtellerie, Écoles, Hôpitaux et BTP & Génie civil. Démonstration gratuite et formation incluse.',
);

const getModuleIcon = (id: string) => {
  const iconProps = { className: 'w-7 h-7 text-brand-green', 'aria-hidden': true };
  switch (id) {
    case 'commerce':
      return <ShoppingCart {...iconProps} />;
    case 'rh':
      return <Users {...iconProps} />;
    case 'ong':
      return <Building {...iconProps} />;
    case 'restaurant':
      return <UtensilsCrossed {...iconProps} />;
    case 'hotellerie':
      return <Hotel {...iconProps} />;
    case 'ecoles':
      return <GraduationCap {...iconProps} />;
    case 'hopitaux':
      return <Hospital {...iconProps} />;
    case 'btp':
      return <HardHat {...iconProps} />;
    default:
      return <ShoppingCart {...iconProps} />;
  }
};

export default function SoftwarePage() {
  return (
    <div className="bg-white">
      {/* Hero du Logiciel */}
      <section className="bg-navy text-white py-14 sm:py-20 border-b border-navy-light/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-5">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-green-light px-3 py-1 rounded-full bg-navy-light border border-navy-subtle">
                Notre solution phare
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Le logiciel de gestion pensé pour votre réalité métier.
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Que vous dirigiez un magasin de vente, une équipe de plusieurs dizaines de collaborateurs, une ONG, un restaurant ou un complexe hôtelier, ARISOFT s’adapte à votre organisation.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={`${companyInfo.whatsappUrl}?text=${encodeURIComponent(
                    'Bonjour ARISOFT, je souhaite planifier une démonstration du logiciel de gestion.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center font-bold text-white bg-brand-green hover:bg-brand-green-hover py-3.5 px-6 rounded-card transition-colors shadow-sm"
                >
                  <Play className="w-4 h-4 fill-current mr-2" aria-hidden="true" />
                  <span>Demander une démo gratuite</span>
                </a>

                <Link
                  href="/contact/"
                  className="inline-flex items-center justify-center font-semibold text-white border border-slate-400 hover:border-white py-3.5 px-6 rounded-card transition-colors text-sm"
                >
                  <span>Recevoir une grille tarifaire</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 bg-navy-light/80 border border-navy-subtle rounded-card p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-brand-green-light">
                Garanties ARISOFT
              </h2>
              <ul className="space-y-3 text-sm text-slate-200">
                <li className="flex items-start gap-2.5">
                  <MonitorCheck className="w-5 h-5 text-brand-green-light shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Fonctionne en réseau local et hors-ligne</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-brand-green-light shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Sauvegardes automatiques quotidiennes</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Headphones className="w-5 h-5 text-brand-green-light shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Support technique direct par WhatsApp</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation rapide entre modules */}
      <nav className="bg-surface-alt border-b border-line-subtle sticky top-20 z-30" aria-label="Menu des modules">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            <span className="text-xs font-bold uppercase text-content-muted mr-2">
              Accès direct :
            </span>
            {softwareModules.map((module) => (
              <a
                key={module.id}
                href={`#${module.slug}`}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-line-subtle text-content-primary hover:border-brand-green hover:text-brand-green transition-colors"
              >
                {module.title}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Sections détaillées des modules */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {softwareModules.map((module, index) => (
            <article
              key={module.id}
              id={module.slug}
              className="bg-surface-alt rounded-card-lg p-6 sm:p-10 border border-line-subtle scroll-mt-36"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-card-sm bg-brand-green-pale border border-green-200 flex items-center justify-center shrink-0">
                      {getModuleIcon(module.id)}
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                        Module 0{index + 1}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-content-primary">
                        Module {module.title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-base font-semibold text-brand-green">
                    {module.subtitle}
                  </p>

                  <p className="text-sm sm:text-base text-content-secondary leading-relaxed">
                    {module.description}
                  </p>

                  <div className="pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-content-primary mb-3">
                      Fonctionnalités intégrées :
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {module.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-2.5 text-sm text-content-secondary">
                          <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0 mt-0.5" aria-hidden="true" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Encadré d'action pour le module */}
                <div className="lg:col-span-4 bg-white rounded-card p-6 border border-line-subtle shadow-xs space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-green">
                    Démonstration
                  </span>
                  <h3 className="text-lg font-bold text-content-primary">
                    Tester le module {module.title}
                  </h3>
                  <p className="text-xs text-content-secondary leading-relaxed">
                    Découvrez l’interface sur vos propres exemples de données avec l'un de nos formateurs.
                  </p>

                  <div className="space-y-2.5 pt-2">
                    <a
                      href={`${companyInfo.whatsappUrl}?text=${encodeURIComponent(
                        `Bonjour ARISOFT, je souhaite une démonstration du module logiciel : ${module.title}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center font-bold text-white bg-brand-green hover:bg-brand-green-hover py-3 px-4 rounded-card text-sm transition-colors text-center shadow-xs"
                    >
                      <Play className="w-4 h-4 fill-current mr-2" aria-hidden="true" />
                      <span>Demander une démo</span>
                    </a>

                    <Link
                      href={`/contact/?service=Logiciel%20de%20gestion&module=${encodeURIComponent(module.title)}`}
                      className="w-full inline-flex items-center justify-center font-semibold text-content-primary bg-slate-50 hover:bg-slate-100 border border-line-subtle py-2.5 px-4 rounded-card text-sm transition-colors text-center"
                    >
                      <span>Demander un devis</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Bloc de réassurance finale */}
      <section className="py-16 sm:py-20 bg-surface-alt border-t border-line-subtle">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-content-primary">
            Installation clé en main et formation de vos équipes
          </h2>
          <p className="text-sm sm:text-base text-content-secondary max-w-2xl mx-auto leading-relaxed">
            Nous installons le logiciel sur vos ordinateurs, configurons vos imprimantes à reçus et formons vos caissiers ou gestionnaires jusqu'à ce qu'ils soient totalement autonomes.
          </p>
          <div className="pt-4">
            <Link
              href="/contact/"
              className="inline-flex items-center font-bold text-white bg-brand-green hover:bg-brand-green-hover px-7 py-3.5 rounded-card text-base shadow-sm"
            >
              <span>Prendre rendez-vous avec un conseiller</span>
              <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
