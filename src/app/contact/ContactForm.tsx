'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { servicesData, companyInfo } from '@/data/content';

export const ContactForm: React.FC = () => {
  const searchParams = useSearchParams();
  const initialService = searchParams.get('service') || '';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: initialService || servicesData[0].title,
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Préparation du message pré-rempli pour WhatsApp
    const messageText = `Bonjour ARISOFT, je souhaite un devis :
- Nom : ${formData.name}
- Téléphone : ${formData.phone}
- Service souhaité : ${formData.service}
- Détails : ${formData.message || 'Non précisé'}`;

    const whatsappDirectUrl = `${companyInfo.whatsappUrl}?text=${encodeURIComponent(messageText)}`;
    
    // Ouvre WhatsApp dans un nouvel onglet
    window.open(whatsappDirectUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-card-lg p-6 sm:p-8 border border-line-subtle shadow-md">
      <div className="border-b border-line-subtle pb-4 mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-green">
          Devis gratuit & sans engagement
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-content-primary mt-1">
          Formulaire de demande de devis
        </h2>
        <p className="text-xs sm:text-sm text-content-secondary mt-1">
          Remplissez ce formulaire court. Vous serez automatiquement mis en relation sur WhatsApp ou contacté par téléphone.
        </p>
      </div>

      {isSubmitted && (
        <div className="mb-6 p-4 rounded-card bg-brand-green-pale border border-green-300 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-sm">
            <span className="font-bold text-brand-green block">
              Demande initiée avec succès !
            </span>
            <span className="text-content-secondary">
              Votre message a été transmis vers notre messagerie WhatsApp. Notre équipe vous répondra très rapidement.
            </span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nom complet */}
        <div>
          <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-content-primary mb-1.5">
            Votre nom ou nom de l'entreprise <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex : Martin Mukendi / Établissements ABC"
            className="w-full px-4 py-3 rounded-card-sm border border-line-subtle text-content-primary bg-slate-50 focus:bg-white focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm transition-colors"
          />
        </div>

        {/* Numéro de téléphone */}
        <div>
          <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-content-primary mb-1.5">
            Numéro de téléphone (WhatsApp) <span className="text-red-600">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Ex : +243 980 000 000"
            className="w-full px-4 py-3 rounded-card-sm border border-line-subtle text-content-primary bg-slate-50 focus:bg-white focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm transition-colors"
          />
        </div>

        {/* Service souhaité */}
        <div>
          <label htmlFor="service" className="block text-xs font-bold uppercase tracking-wider text-content-primary mb-1.5">
            Service souhaité <span className="text-red-600">*</span>
          </label>
          <select
            id="service"
            value={formData.service}
            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
            className="w-full px-4 py-3 rounded-card-sm border border-line-subtle text-content-primary bg-slate-50 focus:bg-white focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm transition-colors"
          >
            {servicesData.map((s) => (
              <option key={s.id} value={s.title}>
                {s.title}
              </option>
            ))}
            <option value="Projet global sur mesure">Projet global multi-services</option>
          </select>
        </div>

        {/* Message / Détails du projet */}
        <div>
          <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-content-primary mb-1.5">
            Détails de votre besoin (optionnel)
          </label>
          <textarea
            id="message"
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Décrivez brièvement votre activité, le nombre de postes, de caméras ou de modules nécessaires..."
            className="w-full px-4 py-3 rounded-card-sm border border-line-subtle text-content-primary bg-slate-50 focus:bg-white focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm transition-colors resize-y"
          />
        </div>

        {/* Bouton d'envoi principal */}
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center font-bold text-white bg-brand-green hover:bg-brand-green-hover py-4 px-6 rounded-card transition-colors duration-150 shadow-sm active:translate-y-0.5 text-base"
        >
          <Send className="w-5 h-5 mr-2" aria-hidden="true" />
          <span>Envoyer la demande de devis</span>
        </button>

        <p className="text-center text-xs text-content-muted">
          Réponse garantie sous 30 minutes pendant nos heures d'ouverture.
        </p>
      </form>
    </div>
  );
};
