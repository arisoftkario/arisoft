'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Check, Globe, Search } from 'lucide-react';
import { siteLanguages } from '@/data/languages';
import { LANGUAGE_EVENT, loadGoogleTranslate, readTranslation, rememberChoice, setTranslation } from '@/lib/translate';

/** Choix de la langue : FR et SW traduits à la main, toutes les autres par Google Traduction. */
export const LanguageSelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [auto, setAuto] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const isSwahili = pathname?.startsWith('/sw') ?? false;
  const current = isSwahili ? 'sw' : auto ?? 'fr';

  useEffect(() => {
    const code = readTranslation();
    setAuto(code);
    if (code && !isSwahili) loadGoogleTranslate();
    // Langue de l'appareil détectée au premier passage (AutoLanguage).
    const onDetected = (e: Event) => setAuto((e as CustomEvent<string>).detail);
    window.addEventListener(LANGUAGE_EVENT, onDetected);
    return () => window.removeEventListener(LANGUAGE_EVENT, onDetected);
  }, [isSwahili]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const choose = (code: string) => {
    setOpen(false);
    if (code === current) return;
    rememberChoice(code);
    if (code === 'sw') {
      setTranslation(null);
      window.location.assign('/sw/');
      return;
    }
    setTranslation(code === 'fr' ? null : code);
    // Recharger pour que la page reparte du texte français d'origine.
    if (isSwahili) window.location.assign('/');
    else window.location.reload();
  };

  const q = query.trim().toLowerCase();
  const languages = q
    ? siteLanguages.filter((l) => l.name.toLowerCase().includes(q) || l.label.toLowerCase().includes(q) || l.code === q)
    : siteLanguages;

  return (
    <div className="relative notranslate" ref={panelRef} translate="no">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Choisir la langue / Language"
        className={`flex items-center gap-1.5 font-bold text-slate-200 hover:text-white border border-navy-subtle hover:border-brand-green transition-colors ${
          compact ? 'p-2.5 rounded-card-sm bg-navy-light text-xs' : 'py-1.5 px-2.5 rounded-lg text-xs'
        }`}
      >
        <Globe className={compact ? 'w-5 h-5' : 'w-4 h-4'} aria-hidden="true" />
        <span className={compact ? 'sr-only' : 'uppercase'}>{current.split('-')[0]}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] bg-white text-content-primary rounded-card shadow-2xl border border-line-subtle z-[60] overflow-hidden">
          <div className="p-3 border-b border-line-subtle">
            <label className="flex items-center gap-2 px-3 py-2 rounded-card-sm bg-surface-alt border border-line-subtle focus-within:border-brand-green">
              <Search className="w-4 h-4 text-content-muted shrink-0" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Langue / Language…"
                aria-label="Rechercher une langue"
                className="w-full bg-transparent text-sm focus:outline-none"
                autoFocus
              />
            </label>
          </div>
          <ul role="listbox" aria-label="Langues" className="max-h-80 overflow-y-auto py-1">
            {languages.map((lang, i) => (
              <li key={lang.code}>
                {!q && i === 2 && (
                  <p className="px-4 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-content-muted border-t border-line-subtle">
                    Traduction automatique
                  </p>
                )}
                <button
                  type="button"
                  role="option"
                  aria-selected={lang.code === current}
                  onClick={() => choose(lang.code)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-2 text-left text-sm hover:bg-surface-alt"
                >
                  <span>
                    <span className="font-semibold">{lang.name}</span>
                    {lang.name !== lang.label && <span className="text-content-muted text-xs ml-1.5">{lang.label}</span>}
                  </span>
                  {lang.code === current && <Check className="w-4 h-4 text-brand-green shrink-0" aria-hidden="true" />}
                </button>
              </li>
            ))}
            {languages.length === 0 && (
              <li className="px-4 py-3 text-sm text-content-muted">
                Langue absente : utilisez la traduction de votre navigateur.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
