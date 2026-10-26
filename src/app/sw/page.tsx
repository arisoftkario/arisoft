import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageSquare, PhoneCall, ShieldCheck, ChevronDown, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { companyInfo, fullAddress, softwareModules } from '@/data/content';
import { swHero, swServices, swModuleTitles, swSteps, swAdvantages, swFaq } from '@/data/content-sw';
import { pageMetadata } from '@/lib/seo';
import { ServiceIcon } from '@/components/shared/ServiceIcon';
import { ModuleIcon } from '@/components/shared/ModuleIcon';
import { SectionHeader } from '@/components/shared/SectionHeader';

const title = 'ARISOFT · Huduma za kompyuta na usimamizi wa biashara';
const description =
  'ARISOFT, Butembo: programu za usimamizi wa biashara, tovuti, programu za simu, kamera za ulinzi, mitandao ya kompyuta, usalama wa mtandao na uchapishaji wa nguo. Makisio ya bei bure.';

export const metadata: Metadata = {
  ...pageMetadata('/sw/', title, description),
  alternates: { canonical: '/sw/', languages: { fr: '/', sw: '/sw/' } },
};

const whatsappHref = `${companyInfo.whatsappUrl}?text=${encodeURIComponent(swHero.whatsappMessage)}`;

export default function SwahiliHomePage() {
  return (
    <div lang="sw">
      {/* Hero */}
      <section className="bg-navy text-white pt-10 sm:pt-16 pb-16 sm:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -left-40 w-[28rem] h-[28rem] rounded-full bg-brand-green/25 blur-3xl" />
          <div className="absolute inset-0 hero-grid" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-light border border-navy-subtle text-xs sm:text-sm font-semibold text-brand-green-light">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
            {swHero.badge}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15]">{swHero.headline}</h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">{swHero.subtitle}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center font-bold text-white bg-brand-green hover:bg-brand-green-hover py-4 px-7 rounded-card shadow-md transition-colors"
            >
              <MessageSquare className="w-5 h-5 mr-2" aria-hidden="true" />
              {swHero.whatsapp}
            </a>
            <a
              href={companyInfo.phoneRaw}
              className="inline-flex items-center justify-center font-bold text-white border-2 border-slate-400 hover:border-white py-3.5 px-7 rounded-card transition-colors"
            >
              <PhoneCall className="w-4 h-4 mr-2 text-brand-green-light" aria-hidden="true" />
              {swHero.call} ({companyInfo.phoneDisplay})
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-300 pt-2">
            {swHero.reassurance.map((item) => (
              <span key={item} className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-green-light" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Huduma */}
      <section className="bg-surface-alt py-16 sm:py-24 border-b border-line-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Huduma zetu"
            title="Kila kitu biashara yako inahitaji, mahali pamoja."
            centered={true}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {swServices.map((service) => (
              <div key={service.id} className="reveal bg-white rounded-card p-6 border border-line-subtle shadow-sm">
                <div className="w-12 h-12 rounded-card-sm bg-brand-green-pale flex items-center justify-center mb-4">
                  <ServiceIcon name={service.iconName} className="w-6 h-6 text-brand-green" />
                </div>
                <h3 className="text-lg font-bold text-content-primary mb-2">{service.title}</h3>
                <p className="text-sm text-content-secondary leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programu ya usimamizi */}
      <section className="py-16 sm:py-24 border-b border-line-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Programu ya usimamizi ARISOFT"
            title="Programu inayolingana na kazi yako"
            subtitle="Chagua sekta yako ili kuona maelezo zaidi (kwa Kifaransa)."
            centered={true}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {softwareModules.map((m) => (
              <Link
                key={m.id}
                href={`/logiciel-de-gestion/${m.slug}/`}
                hrefLang="fr"
                className="group flex items-center gap-2.5 bg-surface-alt rounded-card-sm p-4 border border-line-subtle hover:border-brand-green transition-colors"
              >
                <ModuleIcon id={m.id} className="w-5 h-5 text-brand-green shrink-0" />
                <span className="text-sm font-bold text-content-primary group-hover:text-brand-green">
                  {swModuleTitles[m.id] ?? m.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hatua */}
      <section className="bg-navy text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="Rahisi na wazi" title="Tunavyofanya kazi" centered={true} isDarkTheme={true} />
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {swSteps.map((step, index) => (
              <li key={step.title} className="reveal bg-navy-light/70 border border-navy-subtle rounded-card p-6">
                <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-brand-green font-extrabold mb-4">
                  {index + 1}
                </span>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Kwa nini ARISOFT */}
      <section className="py-16 sm:py-24 border-b border-line-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="Ahadi yetu" title="Kwa nini uchague ARISOFT?" centered={true} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {swAdvantages.map((item) => (
              <div key={item.title} className="reveal bg-surface-alt rounded-card p-6 border border-line-subtle">
                <CheckCircle2 className="w-7 h-7 text-brand-green mb-3" aria-hidden="true" />
                <h3 className="text-lg font-bold text-content-primary mb-2">{item.title}</h3>
                <p className="text-sm text-content-secondary leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Maswali */}
      <section className="bg-surface-alt py-16 sm:py-24 border-b border-line-subtle">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="Maswali yanayoulizwa mara nyingi" title="Una maswali?" centered={true} />
          <div className="space-y-3">
            {swFaq.map((item) => (
              <details
                key={item.question}
                className="reveal group bg-white rounded-card border border-line-subtle open:border-brand-green/40 open:shadow-md"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-5 font-bold text-content-primary [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <ChevronDown className="w-5 h-5 shrink-0 text-brand-green transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="px-5 pb-5 -mt-1 text-sm sm:text-base text-content-secondary leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Mawasiliano */}
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy text-white rounded-card-lg p-8 sm:p-12 shadow-xl text-center space-y-5">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold">Tuzungumze kuhusu mradi wako.</h2>
            <p className="text-slate-300">Makisio ya bei bure. Jibu la haraka kwenye WhatsApp au kwa simu.</p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center font-bold text-white bg-brand-green hover:bg-brand-green-hover py-4 px-7 rounded-card shadow-md transition-colors"
            >
              <MessageSquare className="w-5 h-5 mr-2" aria-hidden="true" />
              {swHero.whatsapp}
            </a>
            <div className="flex flex-col sm:flex-row justify-center gap-x-6 gap-y-2 text-sm text-slate-300 pt-2">
              <span className="flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4 text-brand-green-light shrink-0" aria-hidden="true" />
                {fullAddress}
              </span>
              <span className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-brand-green-light shrink-0" aria-hidden="true" />
                Jumatatu – Jumamosi, 08h30 – 17h00
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
