import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getServices } from '@/lib/catalogServer';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { ServiceCover } from '@/components/shared/ServiceMedia';
import { ServiceIcon } from '@/components/shared/ServiceIcon';

export async function ServicesGrid() {
  const servicesData = await getServices();

  return (
    <section className="bg-surface-alt py-16 sm:py-24 border-b border-line-subtle" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Notre catalogue de prestations"
          title="Tout ce dont votre entreprise a besoin, au même endroit."
          subtitle="Des solutions éprouvées sur le terrain, pensées pour fiabiliser votre gestion et propulser vos activités."
          centered={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {servicesData.map((service) => (
            <div
              key={service.id}
              className="reveal bg-white rounded-card overflow-hidden p-6 sm:p-7 border border-line-subtle shadow-sm hover:shadow-md hover:border-brand-green/40 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <ServiceCover serviceId={service.id} title={service.title} />
                <div className="w-12 h-12 rounded-card-sm bg-brand-green-pale flex items-center justify-center mb-5 border border-green-200">
                  <ServiceIcon name={service.iconName} className="w-6 h-6 text-brand-green" />
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
}
