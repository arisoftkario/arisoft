'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Globe, X } from 'lucide-react';
import { siteLanguages } from '@/data/languages';
import {
  LANGUAGE_EVENT,
  detectDeviceLanguage,
  hasLanguageChoice,
  isCrawler,
  loadGoogleTranslate,
  rememberChoice,
  setTranslation,
} from '@/lib/translate';

/**
 * Premier passage : le site s'affiche dans la langue de l'appareil du visiteur.
 * Une seule fois : ensuite, c'est le choix du visiteur (sélecteur 🌐) qui compte.
 */
export const AutoLanguage: React.FC = () => {
  const pathname = usePathname();
  const [applied, setApplied] = useState<string | null>(null);

  useEffect(() => {
    if (isCrawler() || hasLanguageChoice()) return;
    const code = detectDeviceLanguage();
    rememberChoice(code ?? 'fr');
    if (!code || code === 'fr') return;

    const onSwahiliPage = pathname?.startsWith('/sw');
    if (code === 'sw') {
      // Version swahili écrite à la main pour l'accueil ; les autres pages passent par Google.
      if (pathname === '/') {
        window.location.replace('/sw/');
        return;
      }
      if (onSwahiliPage) return;
    } else if (onSwahiliPage) {
      // Visiteur d'une autre langue arrivé sur /sw/ : on traduit depuis l'accueil français.
      setTranslation(code);
      window.location.replace('/');
      return;
    }

    setTranslation(code);
    loadGoogleTranslate();
    window.dispatchEvent(new CustomEvent(LANGUAGE_EVENT, { detail: code }));
    setApplied(code);
    // Une seule fois, au premier chargement.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!applied) return;
    const timer = window.setTimeout(() => setApplied(null), 10000);
    return () => window.clearTimeout(timer);
  }, [applied]);

  if (!applied) return null;
  const language = siteLanguages.find((l) => l.code === applied);

  const backToFrench = () => {
    rememberChoice('fr');
    setTranslation(null);
    window.location.reload();
  };

  return (
    <div
      role="status"
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[55] w-[calc(100%-2rem)] max-w-md bg-navy text-white rounded-card shadow-2xl border border-navy-subtle px-4 py-3 flex items-center gap-3"
    >
      <Globe className="w-5 h-5 text-brand-green-light shrink-0" aria-hidden="true" />
      <p className="text-sm flex-1">
        Page traduite automatiquement :{' '}
        <strong className="notranslate" translate="no">{language?.name ?? applied}</strong>
      </p>
      <button
        type="button"
        onClick={backToFrench}
        translate="no"
        className="notranslate text-xs font-bold text-brand-green-light hover:text-white underline underline-offset-2 shrink-0"
      >
        Français
      </button>
      <button type="button" onClick={() => setApplied(null)} aria-label="Fermer" className="text-slate-400 hover:text-white shrink-0">
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
};
