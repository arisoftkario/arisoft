import React from 'react';
import { MapPin, Clock, MessageSquare, PhoneCall } from 'lucide-react';
import { companyInfo } from '@/data/content';

export const ContactBanner: React.FC = () => {
  return (
    <section className="bg-white py-16 sm:py-24" id="contact-banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Carte marine arrondie */}
        <div className="bg-navy text-white rounded-card-lg p-8 sm:p-12 lg:p-14 border border-navy-light shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Colonne Gauche : Titre & Réassurance */}
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-green-light px-3 py-1 rounded-full bg-navy-light border border-navy-subtle">
                Prise de contact directe
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Parlons de votre projet.
              </h2>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                Devis gratuit. Réponse rapide sur WhatsApp ou par téléphone.
              </p>

              <div className="pt-2 space-y-2.5 text-sm text-slate-300">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-brand-green-light shrink-0" aria-hidden="true" />
                  <span>Adresse : {companyInfo.address}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-brand-green-light shrink-0" aria-hidden="true" />
                  <span>Horaires : {companyInfo.openingHours}</span>
                </div>
              </div>
            </div>

            {/* Colonne Droite : Boutons d'action WhatsApp & Appeler */}
            <div className="lg:col-span-5 flex flex-col gap-3.5 sm:w-80 lg:w-full lg:max-w-sm ml-auto">
              {/* Bouton WhatsApp */}
              <a
                href={companyInfo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Écrire à ARISOFT sur WhatsApp"
                className="w-full inline-flex items-center justify-center font-bold text-white bg-brand-green hover:bg-brand-green-hover py-4 px-6 rounded-card transition-colors duration-150 shadow-md active:translate-y-0.5 text-base"
              >
                <MessageSquare className="w-5 h-5 mr-2.5 shrink-0" aria-hidden="true" />
                <span>Écrire sur WhatsApp</span>
              </a>

              {/* Bouton Appeler */}
              <a
                href={companyInfo.phoneRaw}
                aria-label={`Appeler le ${companyInfo.phoneDisplay}`}
                className="w-full inline-flex items-center justify-center font-bold text-white border-2 border-slate-400 hover:border-white hover:bg-white/10 py-3.5 px-6 rounded-card transition-colors duration-150 active:translate-y-0.5 text-base"
              >
                <PhoneCall className="w-4 h-4 mr-2.5 shrink-0 text-brand-green-light" aria-hidden="true" />
                <span>Appeler ({companyInfo.phoneDisplay})</span>
              </a>

              <p className="text-center text-xs text-slate-400 mt-1">
                Aucun engagement requis · Réponse rapide
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
