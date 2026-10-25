'use client';

import React, { useEffect, useState } from 'react';
import { Star, Quote, Send, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { companyInfo } from '@/data/content';
import { isFirebaseConfigured } from '@/lib/firebase';
import {
  type Testimonial,
  type TestimonialInput,
  fetchApprovedTestimonials,
  submitTestimonial,
} from '@/lib/testimonials';
import { errorMessage, inputClass, labelClass } from '@/components/admin/ui';
import { WhatsAppIcon } from '@/components/shared/WhatsAppIcon';

/** Charge les avis validés une fois ; null pendant le chargement. */
export function useTestimonials(): Testimonial[] | null {
  const [items, setItems] = useState<Testimonial[] | null>(isFirebaseConfigured ? null : []);
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    fetchApprovedTestimonials()
      .then(setItems)
      .catch(() => setItems([]));
  }, []);
  return items;
}

export const Stars: React.FC<{ rating: number; className?: string }> = ({ rating, className = 'w-4 h-4' }) => (
  <div className="flex gap-0.5" role="img" aria-label={`${rating} étoile${rating > 1 ? 's' : ''} sur 5`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        className={`${className} ${n <= rating ? 'text-amber-400 fill-current' : 'text-slate-300'}`}
        aria-hidden="true"
      />
    ))}
  </div>
);

interface TestimonialsGridProps {
  items: Testimonial[];
  limit?: number;
}

export const TestimonialsGrid: React.FC<TestimonialsGridProps> = ({ items, limit }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {items.slice(0, limit ?? items.length).map((t) => (
      <figure
        key={t.id}
        className="bg-white rounded-card-lg p-6 sm:p-7 border border-line-subtle shadow-sm flex flex-col"
      >
        <div className="flex items-center justify-between mb-4">
          <Stars rating={t.rating} />
          <Quote className="w-6 h-6 text-brand-green/30" aria-hidden="true" />
        </div>
        <blockquote className="text-sm text-content-secondary leading-relaxed flex-1 whitespace-pre-line">
          « {t.message} »
        </blockquote>
        <figcaption className="mt-5 pt-4 border-t border-line-subtle">
          <p className="font-bold text-content-primary">{t.name}</p>
          {t.company && <p className="text-xs text-content-muted">{t.company}</p>}
        </figcaption>
      </figure>
    ))}
  </div>
);

const emptyForm: TestimonialInput = { name: '', company: '', rating: 5, message: '' };

/** Formulaire public : l'avis part en attente et n'apparaît qu'après validation dans l'admin. */
export const TestimonialForm: React.FC = () => {
  const [form, setForm] = useState<TestimonialInput>(emptyForm);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  // Sans Firebase, l'avis ne peut pas être enregistré : on le recueille sur WhatsApp.
  if (!isFirebaseConfigured) {
    const text = encodeURIComponent('Bonjour ARISOFT, voici mon avis sur vos services : ');
    return (
      <div className="bg-white rounded-card-lg p-6 sm:p-8 border border-line-subtle shadow-sm text-center">
        <a
          href={`${companyInfo.whatsappUrl}?text=${text}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center font-bold text-white bg-brand-green hover:bg-brand-green-hover px-6 py-3.5 rounded-card transition-colors"
        >
          <WhatsAppIcon className="w-5 h-5 mr-2" />
          Envoyer mon avis sur WhatsApp
        </a>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      await submitTestimonial({
        name: form.name.trim(),
        company: form.company.trim(),
        rating: form.rating,
        message: form.message.trim(),
      });
      setSent(true);
      setForm(emptyForm);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-white rounded-card-lg p-8 border border-line-subtle shadow-sm text-center">
        <CheckCircle2 className="w-10 h-10 text-brand-green mx-auto mb-3" aria-hidden="true" />
        <p className="text-lg font-extrabold text-content-primary mb-1">Merci pour votre avis !</p>
        <p className="text-sm text-content-secondary">Il sera publié sur le site après relecture par notre équipe.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-card-lg p-6 sm:p-8 border border-line-subtle shadow-sm space-y-5"
    >
      <div>
        <span className={labelClass}>Votre note *</span>
        <div className="flex gap-1" role="radiogroup" aria-label="Note sur 5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={form.rating === n}
              aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
              onClick={() => setForm({ ...form, rating: n })}
              className="p-1 rounded hover:scale-110 transition-transform"
            >
              <Star
                className={`w-7 h-7 ${n <= form.rating ? 'text-amber-400 fill-current' : 'text-slate-300'}`}
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="avis-name" className={labelClass}>Votre nom *</label>
          <input
            id="avis-name"
            required
            maxLength={80}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ex : Jean K."
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="avis-company" className={labelClass}>Entreprise ou fonction</label>
          <input
            id="avis-company"
            maxLength={100}
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            placeholder="Ex : Gérant, Boutique ABC"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="avis-message" className={labelClass}>Votre avis *</label>
        <textarea
          id="avis-message"
          required
          rows={4}
          minLength={10}
          maxLength={1000}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Le service reçu, ce qui a changé pour votre activité…"
          className={`${inputClass} resize-y`}
        />
      </div>

      {error && (
        <div className="p-3 rounded-card bg-red-50 border border-red-200 text-sm font-semibold text-red-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={sending}
        className="w-full sm:w-auto inline-flex items-center justify-center font-bold text-white bg-brand-green hover:bg-brand-green-hover disabled:opacity-60 px-6 py-3.5 rounded-card transition-colors"
      >
        {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" /> : <Send className="w-4 h-4 mr-2" aria-hidden="true" />}
        Envoyer mon avis
      </button>
      <p className="text-xs text-content-muted">Votre avis est relu avant publication. Seuls votre nom et votre entreprise sont affichés.</p>
    </form>
  );
};
