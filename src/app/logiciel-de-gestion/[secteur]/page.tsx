import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, ArrowRight, Play, MonitorCheck, GraduationCap, Headphones, ChevronRight } from 'lucide-react';
import { softwareModules, companyInfo, processSteps, siteUrl } from '@/data/content';
import { pageMetadata } from '@/lib/seo';
import { ModuleIcon } from '@/components/shared/ModuleIcon';
import { SectionHeader } from '@/components/shared/SectionHeader';

// Une page par secteur, générée à la compilation : les autres adresses renvoient une 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return softwareModules.map((m) => ({ secteur: m.slug }));
}

type Props = { params: Promise<{ secteur: string }> };

const findModule = (slug: string) => softwareModules.find((m) => m.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const mod = findModule((await params).secteur);
  if (!mod) return {};
  return pageMetadata(
    `/logiciel-de-gestion/${mod.slug}/`,
    `${mod.seoTitle} à ${companyInfo.city} · ARISOFT`,
    `${mod.seoTitle} pour ${mod.audience}. ${mod.subtitle}. Installation, formation et assistance à ${companyInfo.city} (${companyInfo.province}). Démonstration gratuite.`,
  );
}

export default async function SectorPage({ params }: Props) {
  const mod = findModule((await params).secteur);
  if (!mod) notFound();

  const pageUrl = `${siteUrl}/logiciel-de-gestion/${mod.slug}/`;
  const demoUrl = `${companyInfo.whatsappUrl}?text=${encodeURIComponent(
    `Bonjour ARISOFT, je souhaite une démonstration du logiciel de gestion ${mod.title}.`,
  )}`;
  const others = softwareModules.filter((m) => m.id !== mod.id);

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: mod.seoTitle,
      serviceType: 'Logiciel de gestion',
      description: mod.description,
      url: pageUrl,
      audience: { '@type': 'Audience', audienceType: mod.audience },
      areaServed: { '@type': 'City', name: companyInfo.city },
      provider: { '@type': 'LocalBusiness', name: companyInfo.name, telephone: companyInfo.phone, url: siteUrl },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${siteUrl}/` },
        { '@type': 'ListItem', position: 2, name: 'Logiciel de gestion', item: `${siteUrl}/logiciel-de-gestion/` },
        { '@type': 'ListItem', position: 3, name: mod.title, item: pageUrl },
      ],
    },
  ];

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      {/* En-tête du secteur */}
      <section className="bg-navy text-white py-12 sm:py-20 border-b border-navy-light/60 relative overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-green/20 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <nav aria-label="Fil d’Ariane" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1 text-xs text-slate-400">
              <li><Link href="/" className="hover:text-white">Accueil</Link></li>
              <li aria-hidden="true"><ChevronRight className="w-3 h-3" /></li>
              <li><Link href="/logiciel-de-gestion/" className="hover:text-white">Logiciel de gestion</Link></li>
              <li aria-hidden="true"><ChevronRight className="w-3 h-3" /></li>
              <li className="text-slate-200" aria-current="page">{mod.title}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-5">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-green-light px-3 py-1 rounded-full bg-navy-light border border-navy-subtle">
                <ModuleIcon id={mod.id} className="w-4 h-4" />
                Module {mod.title}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {mod.seoTitle} à {companyInfo.city}
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">{mod.description}</p>
              <p className="text-sm text-slate-400">
                Pour les {mod.audience}.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center font-bold text-white bg-brand-green hover:bg-brand-green-hover py-3.5 px-6 rounded-card transition-colors shadow-md"
                >
                  <Play className="w-4 h-4 fill-current mr-2" aria-hidden="true" />
                  <span>Demander une démo gratuite</span>
                </a>
                <Link
                  href={`/contact/?service=Logiciel%20de%20gestion&module=${encodeURIComponent(mod.title)}`}
                  className="inline-flex items-center justify-center font-semibold text-white border border-slate-400 hover:border-white py-3.5 px-6 rounded-card transition-colors text-sm"
                >
                  <span>Demander un devis</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 bg-navy-light/80 border border-navy-subtle rounded-card p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-brand-green-light">Inclus avec le logiciel</h2>
              <ul className="space-y-3 text-sm text-slate-200">
                <li className="flex items-start gap-2.5">
                  <MonitorCheck className="w-5 h-5 text-brand-green-light shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Installation sur vos ordinateurs, en local ou en réseau</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <GraduationCap className="w-5 h-5 text-brand-green-light shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Formation de votre personnel sur place</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Headphones className="w-5 h-5 text-brand-green-light shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Assistance par téléphone et WhatsApp</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="py-16 sm:py-20 bg-surface-alt border-b border-line-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge={mod.subtitle}
            title={`Ce que le module ${mod.title} fait pour vous`}
          />
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mod.features.map((feature) => (
              <li
                key={feature}
                className="reveal flex items-start gap-3 bg-white rounded-card p-5 border border-line-subtle"
              >
                <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm sm:text-base text-content-primary font-medium">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Déroulement */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="Mise en place" title="De la démonstration à l’utilisation au quotidien" centered={true} />
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {processSteps.map((step, index) => (
              <li key={step.id} className="reveal bg-surface-alt rounded-card p-6 border border-line-subtle">
                <span className="inline-flex w-9 h-9 items-center justify-center rounded-full bg-brand-green text-white font-extrabold mb-3">
                  {index + 1}
                </span>
                <h3 className="font-bold text-content-primary mb-1.5">{step.title}</h3>
                <p className="text-sm text-content-secondary leading-relaxed">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Appel à l'action */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy text-white rounded-card-lg p-8 sm:p-10 text-center space-y-4 shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold">Voyez le module {mod.title} en action</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Un conseiller vous montre le logiciel sur des exemples proches de votre activité. Gratuit et sans engagement.
            </p>
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center font-bold text-white bg-brand-green hover:bg-brand-green-hover px-7 py-3.5 rounded-card shadow-md transition-colors"
            >
              <Play className="w-4 h-4 fill-current mr-2" aria-hidden="true" />
              <span>Demander ma démo sur WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* Autres secteurs (maillage interne) */}
      <section className="py-14 bg-surface-alt border-t border-line-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-extrabold text-content-primary mb-5">Le logiciel ARISOFT existe aussi pour :</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {others.map((m) => (
              <Link
                key={m.id}
                href={`/logiciel-de-gestion/${m.slug}/`}
                className="group flex items-center gap-2.5 bg-white rounded-card-sm p-3.5 border border-line-subtle hover:border-brand-green transition-colors"
              >
                <ModuleIcon id={m.id} className="w-5 h-5 text-brand-green shrink-0" />
                <span className="text-sm font-bold text-content-primary group-hover:text-brand-green">{m.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
