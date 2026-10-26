import React from 'react';
import Link from 'next/link';
import { MessageSquare, FileText, Wrench, Headphones, ArrowRight } from 'lucide-react';
import { processSteps } from '@/data/content';
import { SectionHeader } from '@/components/shared/SectionHeader';

const stepIcons = [MessageSquare, FileText, Wrench, Headphones];

export const ProcessSection: React.FC = () => {
  return (
    <section className="bg-navy text-white py-16 sm:py-24 relative overflow-hidden" id="comment-ca-se-passe">
      {/* Halo décoratif */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-green/20 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeader
          badge="Simple et sans surprise"
          title="Comment ça se passe ?"
          subtitle="De votre premier message jusqu’au suivi après la livraison, vous savez à chaque étape ce qui vous attend."
          centered={true}
          isDarkTheme={true}
        />

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {processSteps.map((step, index) => {
            const Icon = stepIcons[index] ?? MessageSquare;
            return (
              <li
                key={step.id}
                className="reveal relative bg-navy-light/70 border border-navy-subtle rounded-card p-6 hover:border-brand-green-light/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-card-sm bg-brand-green flex items-center justify-center shadow-md">
                    <Icon className="w-6 h-6 text-white" aria-hidden="true" />
                  </div>
                  <span className="text-3xl font-extrabold text-navy-subtle" aria-hidden="true">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  <span className="sr-only">Étape {index + 1} : </span>
                  {step.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">{step.description}</p>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 text-center">
          <Link
            href="/contact/"
            className="inline-flex items-center font-bold text-sm sm:text-base text-white bg-brand-green hover:bg-brand-green-hover px-6 py-3.5 rounded-card transition-colors shadow-md active:translate-y-0.5"
          >
            <span>Commencer par un devis gratuit</span>
            <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};
