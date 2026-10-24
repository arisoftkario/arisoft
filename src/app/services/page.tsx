import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  LayoutDashboard,
  Globe,
  Smartphone,
  Cctv,
  Headphones,
  Shirt,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  PhoneCall,
} from 'lucide-react';
import { servicesData, companyInfo } from '@/data/content';
import { SectionHeader } from '@/components/shared/SectionHeader';

export const metadata: Metadata = {
  title: 'Nos Services informatiques & gestion · ARISOFT',
  description:
    'Découvrez les services complets ARISOFT : logiciels de gestion d’entreprise, sites internet rapides, applications mobiles, vidéosurveillance HD, maintenance informatique et impression textile.',
};

const renderIcon = (name: string) => {
  const props = { className: 'w-7 h-7 text-brand-green', 'aria-hidden': true };
  switch (name) {
    case 'LayoutDashboard':
      return <LayoutDashboard {...props} />;
    case 'Globe':
      return <Globe {...props} />;
    case 'Smartphone':
      return <Smartphone {...props} />;
    case 'Cctv':
      return <Cctv {...props} />;
    case 'Headphones':
      return <Headphones {...props} />;
    case 'Shirt':
      return <Shirt {...props} />;
    default:
      return <LayoutDashboard {...props} />;
  }
};

export default function ServicesPage() {
  return (
    <div className="bg-white">
      {/* En-tête de page */}
      <section className="bg-navy text-white py-14 sm:py-20 border-b border-navy-light/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-green-light px-3 py-1 rounded-full bg-navy-light border border-navy-subtle mb-4">
              Catalogue de prestations
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
              Tout ce dont votre entreprise a besoin, au même endroit.
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6">
              De l’équipement informatique à vos outils de gestion en passant par votre visibilité digitale : nous assurons l’installation, la configuration et le suivi continu.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-green shrink-0" />
                Devis gratuit sans engagement
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-green shrink-0" />
                Accompagnement et formation sur site
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Liste détaillée des 6 services */}
      <section className="py-16 sm:py-24 bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {servicesData.map((service, index) => (
            <article
              key={service.id}
              id={service.slug}
              className="bg-white rounded-card-lg p-6 sm:p-10 border border-line-subtle shadow-sm hover:border-brand-green/30 transition-colors scroll-mt-28"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-card-sm bg-brand-green-pale border border-green-200 flex items-center justify-center shrink-0">
                      {renderIcon(service.iconName)}
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                        Service 0{index + 1}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-content-primary">
                        {service.title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-base sm:text-lg text-content-secondary leading-relaxed">
                    {service.fullDescription}
                  </p>

                  <div className="pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-content-primary mb-3">
                      Ce qui est inclus dans notre prestation :
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {service.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-2.5 text-sm text-content-secondary">
                          <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0 mt-0.5" aria-hidden="true" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bloc CTA du service */}
                <div className="lg:col-span-4 bg-surface-alt rounded-card p-6 border border-line-subtle space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-green">
                    Passez à l'action
                  </span>
                  <h3 className="text-lg font-bold text-content-primary">
                    Intéressé par {service.title.toLowerCase()} ?
                  </h3>
                  <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
                    Obtenez rapidement une proposition tarifaire détaillée, adaptée à vos volumes et besoins.
                  </p>

                  <div className="space-y-2.5 pt-2">
                    <a
                      href={`${companyInfo.whatsappUrl}?text=${encodeURIComponent(
                        `Bonjour ARISOFT, je souhaite un devis pour le service : ${service.title}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center font-bold text-white bg-brand-green hover:bg-brand-green-hover py-3 px-4 rounded-card text-sm transition-colors text-center shadow-xs"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" aria-hidden="true" />
                      <span>Devis via WhatsApp</span>
                    </a>

                    <Link
                      href={`/contact/?service=${encodeURIComponent(service.title)}`}
                      className="w-full inline-flex items-center justify-center font-semibold text-content-primary bg-white hover:bg-slate-50 border border-line-subtle py-2.5 px-4 rounded-card text-sm transition-colors text-center"
                    >
                      <span>Formulaire de devis</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Bloc contact final */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy rounded-card-lg p-8 sm:p-12 text-white text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Besoin de combiner plusieurs services ?
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base">
              Bénéficiez d'une offre packagée (logiciel de gestion + caméras + site web) avec tarif préférentiel et interlocuteur unique.
            </p>
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={companyInfo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center font-bold text-white bg-brand-green hover:bg-brand-green-hover px-6 py-3.5 rounded-card text-base"
              >
                <MessageSquare className="w-5 h-5 mr-2" aria-hidden="true" />
                <span>Discuter de votre projet complet</span>
              </a>
              <a
                href={companyInfo.phoneRaw}
                className="w-full sm:w-auto inline-flex items-center justify-center font-semibold text-white border border-slate-400 hover:border-white px-6 py-3.5 rounded-card text-base"
              >
                <PhoneCall className="w-4 h-4 mr-2 text-brand-green-light" aria-hidden="true" />
                <span>{companyInfo.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
