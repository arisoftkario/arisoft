import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Globe,
  Smartphone,
  Cctv,
  Headphones,
  Shirt,
  ArrowRight,
} from 'lucide-react';
import { servicesData } from '@/data/content';
import { SectionHeader } from '@/components/shared/SectionHeader';

const renderServiceIcon = (iconName: string) => {
  const iconProps = { className: 'w-6 h-6 text-brand-green', 'aria-hidden': true };
  switch (iconName) {
    case 'LayoutDashboard':
      return <LayoutDashboard {...iconProps} />;
    case 'Globe':
      return <Globe {...iconProps} />;
    case 'Smartphone':
      return <Smartphone {...iconProps} />;
    case 'Cctv':
      return <Cctv {...iconProps} />;
    case 'Headphones':
      return <Headphones {...iconProps} />;
    case 'Shirt':
      return <Shirt {...iconProps} />;
    default:
      return <LayoutDashboard {...iconProps} />;
  }
};

export const ServicesGrid: React.FC = () => {
  return (
    <section className="bg-surface-alt py-16 sm:py-24 border-b border-line-subtle" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Notre catalogue de prestations"
          title="Tout ce dont votre entreprise a besoin, au même endroit."
          subtitle="Des solutions éprouvées sur le terrain, pensées pour fiabiliser votre gestion et propulser vos activités."
          centered={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {servicesData.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-card p-6 sm:p-7 border border-line-subtle shadow-sm hover:shadow-md hover:border-brand-green/40 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-card-sm bg-brand-green-pale flex items-center justify-center mb-5 border border-green-200">
                  {renderServiceIcon(service.iconName)}
                </div>
                <h3 className="text-xl font-bold text-content-primary mb-2.5">
                  {service.title}
                </h3>
                <p className="text-sm text-content-secondary leading-relaxed mb-6">
                  {service.shortDescription}
                </p>
              </div>

              <div className="pt-4 border-t border-line-subtle flex items-center justify-between">
                <Link
                  href={`/contact/?service=${encodeURIComponent(service.title)}`}
                  className="inline-flex items-center text-sm font-bold text-brand-green hover:text-brand-green-hover group"
                  aria-label={`Demander un devis pour ${service.title}`}
                >
                  <span>Demander un devis</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>

                <Link
                  href={`/services/#${service.slug}`}
                  className="text-xs text-content-muted hover:text-content-primary transition-colors underline"
                >
                  En savoir plus
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bannière de contact rapide sous les services */}
        <div className="mt-12 text-center">
          <p className="text-sm text-content-secondary">
            Vous avez un besoin particulier ou un projet sur mesure ?{' '}
            <Link
              href="/contact/"
              className="font-bold text-brand-green underline hover:text-brand-green-hover ml-1"
            >
              Échangez avec notre équipe technique
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};
