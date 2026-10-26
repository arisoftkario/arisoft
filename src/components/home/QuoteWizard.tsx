'use client';

import React, { useState } from 'react';
import { ArrowLeft, Check, MessageSquare, RotateCcw } from 'lucide-react';
import { companyInfo, softwareModules } from '@/data/content';

type Answers = { service: string; sector: string; size: string; timing: string };

const SIZES = ['Je travaille seul(e)', '2 à 10 personnes', '11 à 50 personnes', 'Plus de 50 personnes'];
const TIMINGS = ['Urgent (cette semaine)', 'Dans le mois', 'Dans les prochains mois', 'Je me renseigne'];
const OTHER_SECTOR = 'Autre activité';

/** Devis en quelques clics : les réponses deviennent un message WhatsApp prêt à envoyer. */
export const QuoteWizard: React.FC<{ services: string[] }> = ({ services }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ service: '', sector: '', size: '', timing: '' });
  const [name, setName] = useState('');

  const questions: { key: keyof Answers; title: string; options: string[] }[] = [
    { key: 'service', title: 'De quoi avez-vous besoin ?', options: services },
    { key: 'sector', title: 'Quelle est votre activité ?', options: [...softwareModules.map((m) => m.title), OTHER_SECTOR] },
    { key: 'size', title: 'Combien de personnes dans votre structure ?', options: SIZES },
    { key: 'timing', title: 'Pour quand ?', options: TIMINGS },
  ];
  const done = step >= questions.length;

  const choose = (key: keyof Answers, value: string) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    setStep((s) => s + 1);
  };

  const restart = () => {
    setAnswers({ service: '', sector: '', size: '', timing: '' });
    setStep(0);
  };

  const message = `Bonjour ARISOFT, je souhaite un devis gratuit.
- Besoin : ${answers.service}
- Activité : ${answers.sector}
- Taille : ${answers.size}
- Délai : ${answers.timing}${name.trim() ? `\n- Nom : ${name.trim()}` : ''}`;

  return (
    <section className="bg-white py-16 sm:py-24 border-b border-line-subtle" id="devis">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 bg-brand-green-pale text-brand-green border border-green-200">
            Devis gratuit en 30 secondes
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-content-primary">
            Obtenez votre devis en 4 clics
          </h2>
          <p className="mt-3 text-base sm:text-lg text-content-secondary">
            Répondez à quelques questions : votre demande arrive directement sur notre WhatsApp.
          </p>
        </div>

        <div className="bg-surface-alt rounded-card-lg border border-line-subtle p-5 sm:p-8 shadow-sm">
          {/* Progression */}
          <div className="flex gap-1.5 mb-6" aria-hidden="true">
            {questions.map((q, i) => (
              <div key={q.key} className={`h-1.5 flex-1 rounded-full ${i < step ? 'bg-brand-green' : 'bg-line-subtle'}`} />
            ))}
          </div>

          {!done ? (
            <fieldset key={step}>
              <legend className="w-full flex items-center justify-between gap-3 mb-4">
                <span className="text-lg sm:text-xl font-extrabold text-content-primary">
                  {questions[step].title}
                </span>
                <span className="text-xs font-semibold text-content-muted shrink-0">
                  {step + 1} / {questions.length}
                </span>
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {questions[step].options.map((option) => {
                  const selected = answers[questions[step].key] === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => choose(questions[step].key, option)}
                      className={`text-left px-4 py-3.5 rounded-card-sm border font-semibold text-sm transition-colors ${
                        selected
                          ? 'border-brand-green bg-brand-green-pale text-brand-green'
                          : 'border-line-subtle bg-white text-content-primary hover:border-brand-green hover:text-brand-green'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="mt-5 inline-flex items-center text-sm font-semibold text-content-secondary hover:text-content-primary"
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5" aria-hidden="true" />
                  Retour
                </button>
              )}
            </fieldset>
          ) : (
            <div className="space-y-5">
              <h3 className="text-lg sm:text-xl font-extrabold text-content-primary">Votre demande est prête</h3>
              <ul className="space-y-2">
                {questions.map((q, i) => (
                  <li key={q.key} className="flex items-start justify-between gap-3 bg-white rounded-card-sm border border-line-subtle px-4 py-3">
                    <span className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-brand-green shrink-0 mt-0.5" aria-hidden="true" />
                      <span>
                        <span className="text-content-muted">{q.title} </span>
                        <span className="font-bold text-content-primary">{answers[q.key]}</span>
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep(i)}
                      className="text-xs font-semibold text-brand-green hover:underline shrink-0"
                    >
                      Modifier
                    </button>
                  </li>
                ))}
              </ul>

              <div>
                <label htmlFor="quote-name" className="block text-xs font-bold uppercase tracking-wider text-content-primary mb-1.5">
                  Votre nom ou entreprise (facultatif)
                </label>
                <input
                  id="quote-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={80}
                  className="w-full px-4 py-3 rounded-card-sm border border-line-subtle bg-white text-content-primary focus:outline-none focus:border-brand-green"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`${companyInfo.whatsappUrl}?text=${encodeURIComponent(message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center font-bold text-white bg-brand-green hover:bg-brand-green-hover py-4 px-6 rounded-card shadow-md transition-colors"
                >
                  <MessageSquare className="w-5 h-5 mr-2" aria-hidden="true" />
                  Envoyer ma demande sur WhatsApp
                </a>
                <button
                  type="button"
                  onClick={restart}
                  className="inline-flex items-center justify-center font-semibold text-sm text-content-secondary bg-white border border-line-subtle hover:border-slate-400 py-3 px-5 rounded-card transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mr-1.5" aria-hidden="true" />
                  Recommencer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
