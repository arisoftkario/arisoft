import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { PhoneCall, MessageSquare, MapPin, Clock, Mail, ShieldCheck, Facebook } from 'lucide-react';
import { companyInfo } from '@/data/content';
import { ContactForm } from './ContactForm';
import { TikTokIcon } from '@/components/shared/TikTokIcon';

export const metadata: Metadata = {
  title: 'Contactez ARISOFT · Demande de devis & Assistance',
  description:
    'Contactez directement l’équipe technique ARISOFT par WhatsApp, téléphone ou formulaire. Réponse rapide pour vos projets informatiques et logiciels de gestion.',
};

export default function ContactPage() {
  return (
    <div className="bg-surface-alt min-h-screen">
      {/* En-tête */}
      <section className="bg-navy text-white py-14 sm:py-20 border-b border-navy-light/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-green-light px-3 py-1 rounded-full bg-navy-light border border-navy-subtle mb-4">
              Ligne directe
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
              Parlons de votre projet.
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Devis gratuit. Réponse rapide sur WhatsApp ou par téléphone. Choisissez le canal qui vous convient le mieux.
            </p>
          </div>
        </div>
      </section>

      {/* Contenu Contact */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Colonne Gauche : Formulaire */}
            <div className="lg:col-span-7">
              <Suspense
                fallback={
                  <div className="bg-white rounded-card-lg p-8 border border-line-subtle shadow-md text-center text-sm text-content-secondary">
                    Chargement du formulaire...
                  </div>
                }
              >
                <ContactForm />
              </Suspense>
            </div>

            {/* Colonne Droite : Canaux directs & Carte */}
            <div className="lg:col-span-5 space-y-6">
              {/* Carte Contact Direct */}
              <div className="bg-white rounded-card-lg p-6 sm:p-7 border border-line-subtle shadow-sm space-y-5">
                <h2 className="text-lg font-bold text-content-primary border-b border-line-subtle pb-3">
                  Canaux directs instantanés
                </h2>

                <div className="space-y-3">
                  {/* WhatsApp */}
                  <a
                    href={companyInfo.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-card bg-brand-green-pale border border-green-200 text-brand-green hover:bg-green-100 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-green text-white flex items-center justify-center shrink-0">
                        <MessageSquare className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-content-primary">
                          Discussion WhatsApp
                        </span>
                        <span className="block text-xs text-brand-green font-medium">
                          Réponse immédiate
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold uppercase underline">Écrire →</span>
                  </a>

                  {/* Appel téléphonique */}
                  <a
                    href={companyInfo.phoneRaw}
                    className="flex items-center justify-between p-3.5 rounded-card bg-slate-50 border border-line-subtle text-content-primary hover:bg-slate-100 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center shrink-0">
                        <PhoneCall className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-content-primary">
                          Ligne téléphonique
                        </span>
                        <span className="block text-xs text-content-secondary font-mono">
                          {companyInfo.phoneDisplay}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold uppercase underline text-brand-green">Appeler →</span>
                  </a>
                </div>

                {/* Coordonnées physiques */}
                <div className="pt-4 border-t border-line-subtle space-y-3 text-sm text-content-secondary">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-brand-green shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <span className="font-bold text-content-primary block">Adresse :</span>
                      <span>{companyInfo.address}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-brand-green shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <span className="font-bold text-content-primary block">Horaires de réception :</span>
                      <span>{companyInfo.openingHours}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-brand-green shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <span className="font-bold text-content-primary block">Courriel :</span>
                      <a href={`mailto:${companyInfo.email}`} className="hover:text-brand-green underline-offset-2 hover:underline">
                        {companyInfo.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Facebook className="w-4 h-4 text-brand-green shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <span className="font-bold text-content-primary block">Facebook :</span>
                      <a
                        href={companyInfo.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-brand-green hover:underline underline-offset-2"
                      >
                        Voir notre page et nos actualités →
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <TikTokIcon className="w-4 h-4 text-brand-green shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <span className="font-bold text-content-primary block">TikTok :</span>
                      <a
                        href={companyInfo.tiktokUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-brand-green hover:underline underline-offset-2"
                      >
                        @arisoft5 – nos vidéos →
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emplacement Carte Google Maps */}
              <div className="bg-white rounded-card-lg p-6 border border-line-subtle shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-content-primary mb-3">
                  Localisation de l'agence
                </h3>
                <iframe
                  title={`Carte : ${companyInfo.address}`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(companyInfo.address)}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-[260px] rounded-card border border-line-subtle"
                />
              </div>

              {/* Réassurance */}
              <div className="bg-brand-green-pale/50 rounded-card p-4 border border-green-200 flex items-center gap-3 text-xs text-content-primary">
                <ShieldCheck className="w-5 h-5 text-brand-green shrink-0" aria-hidden="true" />
                <span>
                  Vos informations restent strictement confidentielles et ne sont jamais transmises à des tiers.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
