import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, MessageSquare, LayoutDashboard, Briefcase } from 'lucide-react';
import { companyInfo } from '@/data/content';

export const metadata: Metadata = {
  title: 'Page introuvable · ARISOFT',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="bg-navy text-white py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-green-light px-3 py-1 rounded-full bg-navy-light border border-navy-subtle mb-4">
          Erreur 404
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
          Cette page n’existe pas.
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-10">
          Le lien est peut-être ancien ou mal saisi. Voici où trouver ce que vous cherchez :
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center font-bold text-white bg-brand-green hover:bg-brand-green-hover py-3.5 px-5 rounded-card transition-colors duration-150"
          >
            <Home className="w-4 h-4 mr-2 shrink-0" aria-hidden="true" />
            Accueil
          </Link>
          <Link
            href="/services/"
            className="inline-flex items-center justify-center font-bold text-white border-2 border-slate-400 hover:border-white hover:bg-white/10 py-3 px-5 rounded-card transition-colors duration-150"
          >
            <LayoutDashboard className="w-4 h-4 mr-2 shrink-0 text-brand-green-light" aria-hidden="true" />
            Nos services
          </Link>
          <Link
            href="/realisations/"
            className="inline-flex items-center justify-center font-bold text-white border-2 border-slate-400 hover:border-white hover:bg-white/10 py-3 px-5 rounded-card transition-colors duration-150"
          >
            <Briefcase className="w-4 h-4 mr-2 shrink-0 text-brand-green-light" aria-hidden="true" />
            Réalisations
          </Link>
        </div>

        <a
          href={companyInfo.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-semibold text-brand-green-light hover:text-white transition-colors"
        >
          <MessageSquare className="w-4 h-4 mr-2 shrink-0" aria-hidden="true" />
          Besoin d’aide ? Écrivez-nous sur WhatsApp
        </a>
      </div>
    </section>
  );
}
