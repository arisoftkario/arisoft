'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Bell, BellRing, BellOff, Loader2 } from 'lucide-react';
import { type PushState, getPushState, needsIosInstall, subscribeToPush, unsubscribeFromPush } from '@/lib/push';

// L'en-tête et toutes les publications se mettent à jour ensemble quand le visiteur s'abonne.
const PUSH_EVENT = 'arisoft:push-state';

/** État de l'abonnement aux notifications, partagé dans toute la page. */
export function usePushState() {
  const [state, setState] = useState<PushState | null>(null);
  useEffect(() => {
    getPushState().then(setState).catch(() => setState('unsupported'));
    const onChange = (e: Event) => setState((e as CustomEvent<PushState>).detail);
    window.addEventListener(PUSH_EVENT, onChange);
    return () => window.removeEventListener(PUSH_EVENT, onChange);
  }, []);
  const update = (next: PushState) => window.dispatchEvent(new CustomEvent(PUSH_EVENT, { detail: next }));
  return [state, update] as const;
}

/** Bouton « Suivre ARISOFT » de l'en-tête : abonnement aux notifications depuis n'importe quelle page. */
export const FollowButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [state, setState] = usePushState();
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const following = state === 'subscribed';

  // Ferme la bulle au clic ailleurs
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const onClick = async () => {
    if (state === 'available') {
      setBusy(true);
      try {
        setState(await subscribeToPush());
        // Bulle de confirmation (ou d'explication si le navigateur a refusé)
        setOpen(true);
      } catch {
        setState('unsupported');
        setOpen(true);
      } finally {
        setBusy(false);
      }
      return;
    }
    setOpen((o) => !o);
  };

  const unfollow = async () => {
    setBusy(true);
    try {
      setState(await unsubscribeFromPush());
    } finally {
      setBusy(false);
      setOpen(false);
    }
  };

  const Icon = busy ? Loader2 : following ? BellRing : Bell;
  const label = following ? 'Abonné' : 'Suivre';

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={onClick}
        disabled={busy || state === null}
        aria-expanded={open}
        aria-label={following ? 'Vous suivez ARISOFT' : 'Suivre ARISOFT : recevoir les nouvelles offres'}
        title={following ? 'Vous suivez ARISOFT' : 'Recevoir une notification à chaque nouvelle offre'}
        className={
          compact
            ? `p-2.5 rounded-card-sm bg-navy-light border transition-colors ${
                following ? 'text-brand-green-light border-brand-green' : 'text-slate-300 border-navy-subtle hover:text-white'
              }`
            : `inline-flex items-center gap-1.5 text-xs font-semibold py-1.5 px-2.5 rounded-lg border transition-colors ${
                following
                  ? 'text-brand-green-light border-brand-green'
                  : 'text-slate-300 border-navy-subtle hover:text-white hover:border-brand-green'
              }`
        }
      >
        <Icon className={`${compact ? 'w-5 h-5' : 'w-3.5 h-3.5'} ${busy ? 'animate-spin' : ''}`} aria-hidden="true" />
        {!compact && <span>{label}</span>}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white text-content-primary rounded-card shadow-xl border border-line-subtle p-4 text-sm z-50">
          {following ? (
            <div className="space-y-2">
              <p className="font-bold text-brand-green flex items-center gap-1.5">
                <BellRing className="w-4 h-4" aria-hidden="true" />
                Vous suivez ARISOFT
              </p>
              <p className="text-xs text-content-secondary">
                Vous recevrez une notification à chaque nouvelle offre ou réalisation.
              </p>
              <button
                type="button"
                onClick={unfollow}
                disabled={busy}
                className="inline-flex items-center gap-1 text-xs font-semibold text-content-muted hover:text-red-700 hover:underline"
              >
                <BellOff className="w-3.5 h-3.5" aria-hidden="true" />
                Ne plus suivre
              </button>
            </div>
          ) : state === 'denied' ? (
            <p className="text-xs text-content-secondary">
              Les notifications sont bloquées pour ce site. Autorisez-les dans les réglages du navigateur (icône à
              gauche de l’adresse du site), puis réessayez.
            </p>
          ) : (
            <p className="text-xs text-content-secondary">
              {needsIosInstall()
                ? 'Sur iPhone : touchez Partager puis « Sur l’écran d’accueil », ouvrez ARISOFT depuis cette icône, puis touchez Suivre.'
                : 'Ce navigateur ne permet pas de recevoir nos notifications. Suivez-nous sur Facebook, TikTok ou Instagram (liens en bas de page).'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
