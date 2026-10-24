import React from 'react';
import Link from 'next/link';
import { UserCheck, MapPin, GraduationCap, ShieldCheck, ArrowRight } from 'lucide-react';
import { advantagesData } from '@/data/content';
import { SectionHeader } from '@/components/shared/SectionHeader';

const renderAdvantageIcon = (iconName: string) => {
  const iconProps = { className: 'w-6 h-6 text-brand-green', 'aria-hidden': true };
  switch (iconName) {
    case 'UserCheck':
      return <UserCheck {...iconProps} />;
    case 'MapPin':
      return <MapPin {...iconProps} />;
    case 'GraduationCap':
      return <GraduationCap {...iconProps} />;
    case 'ShieldCheck':
      return <ShieldCheck {...iconProps} />;
    default:
      return <ShieldCheck {...iconProps} />;
  }
};

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="bg-white py-16 sm:py-24 border-b border-line-subtle" id="pourquoi-arisoft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Notre engagement"
          title="Pourquoi choisir ARISOFT ?"
          subtitle="Nous combinons expertise technique, réactivité terrain et rigueur pour sécuriser le fonctionnement de votre entreprise."
          centered={true}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {advantagesData.map((advantage, index) => (
            <div
              key={advantage.id}
              className="bg-surface-alt rounded-card p-6 border border-line-subtle flex flex-col justify-between hover:border-brand-green/30 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-card-sm bg-white border border-line-subtle flex items-center justify-center shadow-xs">
                    {renderAdvantageIcon(advantage.iconName)}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-content-primary mb-2">
                  {advantage.title}
                </h3>
                <p className="text-sm text-content-secondary leading-relaxed">
                  {advantage.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-line-subtle/60">
                <span className="text-xs font-semibold text-brand-green">
                  Garantie qualité ARISOFT
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-card border border-green-200 bg-brand-green-pale/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-extrabold text-content-primary text-base sm:text-lg">
              Une urgence informatique ou un projet à chiffrer immédiatement ?
            </h4>
            <p className="text-sm text-content-secondary mt-0.5">
              Nos conseillers vous répondent directement sur WhatsApp ou par appel.
            </p>
          </div>
          <Link
            href="/contact/"
            className="shrink-0 inline-flex items-center font-bold text-sm text-white bg-brand-green hover:bg-brand-green-hover px-5 py-3 rounded-card transition-colors shadow-xs"
          >
            <span>Obtenir une réponse rapide</span>
            <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};
