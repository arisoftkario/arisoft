import React from 'react';
import { ChevronDown, MessageSquare } from 'lucide-react';
import { companyInfo, faqItems } from '@/data/content';
import { SectionHeader } from '@/components/shared/SectionHeader';

export const FaqSection: React.FC = () => {
  // Données structurées FAQPage : les questions peuvent apparaître directement dans Google.
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <section className="bg-surface-alt py-16 sm:py-24 border-y border-line-subtle" id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Questions fréquentes"
          title="Vous vous posez des questions ?"
          subtitle="Voici les réponses à celles que nos clients nous posent le plus souvent."
          centered={true}
        />

        <div className="space-y-3">
          {faqItems.map((item) => (
            <details
              key={item.question}
              className="reveal group bg-white rounded-card border border-line-subtle open:border-brand-green/40 open:shadow-md transition-shadow"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-5 font-bold text-content-primary [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <ChevronDown
                  className="w-5 h-5 shrink-0 text-brand-green transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="px-5 pb-5 -mt-1 text-sm sm:text-base text-content-secondary leading-relaxed">
                {item.answer}
              </p>
            </details>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-content-secondary">
          Une autre question ?{' '}
          <a
            href={companyInfo.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center font-bold text-brand-green hover:text-brand-green-hover underline underline-offset-2"
          >
            <MessageSquare className="w-4 h-4 mr-1" aria-hidden="true" />
            Posez-la-nous sur WhatsApp
          </a>
        </p>
      </div>
    </section>
  );
};
