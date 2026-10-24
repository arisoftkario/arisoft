'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Download, X, Share, PlusSquare, MoreVertical } from 'lucide-react';
import { withBasePath } from '@/lib/basePath';

/** Événement envoyé par le bouton du pied de page pour ouvrir l'installation. */
export const INSTALL_EVENT = 'arisoft:install';

const DISMISS_KEY = 'arisoft_install_dismissed';
const DISMISS_DAYS = 14;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIOS(): boolean {
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

function recentlyDismissed(): boolean {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY) || 0);
    return Date.now() - at < DISMISS_DAYS * 24 * 3600 * 1000;
  } catch {
    return false;
  }
}

export const InstallApp: React.FC = () => {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register(withBasePath('/sw.js')).catch(() => {});
    }
    if (isStandalone()) return;
    setIos(isIOS());

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setDeferred(null);
      setShowBanner(false);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);

    // Proposition automatique après quelques secondes de visite
    const timer = window.setTimeout(() => {
      if (!recentlyDismissed()) setShowBanner(true);
    }, 6000);

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
      window.clearTimeout(timer);
    };
  }, []);

  const install = useCallback(async () => {
    if (deferred) {
      await deferred.prompt();
      await deferred.userChoice;
      setDeferred(null);
      setShowBanner(false);
    } else {
      // iPhone, Firefox, Safari… : pas d'installation en un clic, on explique la marche à suivre
      setShowHelp(true);
    }
  }, [deferred]);

  useEffect(() => {
    const onRequest = () => install();
    window.addEventListener(INSTALL_EVENT, onRequest);
    return () => window.removeEventListener(INSTALL_EVENT, onRequest);
  }, [install]);

  const dismiss = () => {
    setShowBanner(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // Stockage indisponible : la bannière reviendra à la prochaine visite
    }
  };

  // Bannière seulement si l'installation est réellement possible (Chrome/Edge/Android) ou sur iPhone
  const bannerVisible = showBanner && (deferred !== null || ios);

  return (
    <>
      {bannerVisible && (
        <div
          role="dialog"
          aria-label="Installer l’application ARISOFT"
          className="fixed z-50 bottom-4 left-4 right-20 sm:right-auto sm:max-w-sm bg-white rounded-card-lg shadow-2xl border border-line-subtle p-4 flex items-start gap-3"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={withBasePath('/icons/icon-192.png')} alt="" className="w-12 h-12 rounded-card-sm shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-sm text-content-primary">Installer l’application ARISOFT</p>
            <p className="text-xs text-content-secondary mt-0.5">
              Accès en un clic depuis votre écran d’accueil, même avec une connexion faible.
            </p>
            <button
              type="button"
              onClick={install}
              className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-white bg-brand-green hover:bg-brand-green-hover px-3.5 py-2 rounded-card-sm transition-colors"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              Installer
            </button>
          </div>
          <button type="button" onClick={dismiss} aria-label="Plus tard" className="text-content-muted hover:text-content-primary">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {showHelp && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowHelp(false)}
        >
          <div
            role="dialog"
            aria-label="Comment installer l’application"
            className="bg-white rounded-card-lg shadow-2xl max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-extrabold text-content-primary">Installer l’application</p>
              <button type="button" onClick={() => setShowHelp(false)} aria-label="Fermer" className="text-content-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
            {ios ? (
              <ol className="space-y-3 text-sm text-content-secondary">
                <li className="flex items-center gap-3">
                  <Share className="w-5 h-5 text-[#007AFF] shrink-0" aria-hidden="true" />
                  <span>1. Touchez le bouton <strong>Partager</strong> en bas de Safari.</span>
                </li>
                <li className="flex items-center gap-3">
                  <PlusSquare className="w-5 h-5 text-content-primary shrink-0" aria-hidden="true" />
                  <span>2. Choisissez <strong>« Sur l’écran d’accueil »</strong>.</span>
                </li>
                <li className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-brand-green shrink-0" aria-hidden="true" />
                  <span>3. Touchez <strong>Ajouter</strong> : l’icône ARISOFT apparaît.</span>
                </li>
              </ol>
            ) : (
              <ol className="space-y-3 text-sm text-content-secondary">
                <li className="flex items-center gap-3">
                  <MoreVertical className="w-5 h-5 text-content-primary shrink-0" aria-hidden="true" />
                  <span>1. Ouvrez le <strong>menu du navigateur</strong> (⋮ ou ⋯).</span>
                </li>
                <li className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-brand-green shrink-0" aria-hidden="true" />
                  <span>2. Choisissez <strong>« Installer l’application »</strong> ou <strong>« Ajouter à l’écran d’accueil »</strong>.</span>
                </li>
              </ol>
            )}
          </div>
        </div>
      )}
    </>
  );
};

/** Bouton « Installer l'application » (pied de page), masqué si déjà installée. */
export const InstallAppButton: React.FC<{ className?: string }> = ({ className }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => setVisible(!isStandalone()), []);
  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(INSTALL_EVENT))}
      className={className}
    >
      <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
      <span>Installer l’application</span>
    </button>
  );
};
