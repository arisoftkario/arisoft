'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Megaphone, X } from 'lucide-react';
import { isFirebaseConfigured } from '@/lib/firebase';
import { type Ad, announceNewAds, fetchAds, getLastSeenAd, markAdsSeen } from '@/lib/ads';

const CHECK_EVERY_MS = 5 * 60 * 1000;

/**
 * Vérifie à l'ouverture (puis toutes les 5 min et au retour sur l'app) si une publicité
 * a été publiée depuis la dernière visite : notification verte + pastille + badge d'icône.
 */
export const NewAdsNotifier: React.FC = () => {
  const pathname = usePathname();
  const [latest, setLatest] = useState<Ad | null>(null);
  const [count, setCount] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const check = useCallback(async () => {
    if (!isFirebaseConfigured) return;
    try {
      const ads = await fetchAds(10);
      if (ads.length === 0) return;
      const lastSeen = getLastSeenAd();
      if (lastSeen === null) {
        // Première visite : tout est « déjà vu », on ne notifiera que les prochaines publications
        markAdsSeen(ads);
        return;
      }
      const fresh = ads.filter((ad) => ad.createdAt > lastSeen);
      setCount(fresh.length);
      setLatest(fresh[0] ?? null);
      announceNewAds(fresh.length);
    } catch {
      // Hors-ligne : on réessaiera au prochain passage
    }
  }, []);

  useEffect(() => {
    check();
    const timer = window.setInterval(check, CHECK_EVERY_MS);
    const onVisible = () => document.visibilityState === 'visible' && check();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [check]);

  // Sur la page Offres, tout est vu : la notification disparaît
  useEffect(() => {
    if (pathname?.startsWith('/publicites')) {
      setCount(0);
      setLatest(null);
    }
  }, [pathname]);

  if (!latest || count === 0 || dismissed || pathname?.startsWith('/publicites')) return null;

  return (
    <div
      role="status"
      className="fixed z-50 top-24 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-brand-green text-white rounded-card-lg shadow-2xl p-4 flex items-center gap-3 animate-[slideDown_.35s_ease-out]"
    >
      <span className="relative flex w-10 h-10 shrink-0 rounded-full bg-white/15 items-center justify-center">
        <Megaphone className="w-5 h-5" aria-hidden="true" />
        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-white text-brand-green text-[11px] font-extrabold flex items-center justify-center">
          {count}
        </span>
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-green-pale">
          {count > 1 ? `${count} nouvelles offres` : 'Nouvelle offre publiée'}
        </p>
        <p className="font-extrabold text-sm truncate">{latest.title}</p>
      </div>
      <Link
        href={`/publicites/#pub-${latest.id}`}
        className="shrink-0 text-xs font-bold bg-white text-brand-green px-3 py-2 rounded-card-sm hover:bg-brand-green-pale"
      >
        Voir
      </Link>
      <button type="button" onClick={() => setDismissed(true)} aria-label="Fermer" className="text-white/80 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
