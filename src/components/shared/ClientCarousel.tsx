'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ClientItem } from '@/types';
import { withBasePath } from '@/lib/basePath';

/** Délai entre deux défilements automatiques. */
const INTERVAL_MS = 4000;

// Logo du site (/images/clients/…) ou publié depuis l'admin (data URL)
const logoSrc = (logo: string) => (logo.startsWith('/') ? withBasePath(logo) : logo);

/** Cartes visibles selon la largeur de l'écran : 1 (téléphone), 2 (tablette), 3 (ordinateur). */
function usePerView(): number {
  const [perView, setPerView] = useState(3);
  useEffect(() => {
    const lg = window.matchMedia('(min-width: 1024px)');
    const sm = window.matchMedia('(min-width: 640px)');
    const update = () => setPerView(lg.matches ? 3 : sm.matches ? 2 : 1);
    update();
    lg.addEventListener('change', update);
    sm.addEventListener('change', update);
    return () => {
      lg.removeEventListener('change', update);
      sm.removeEventListener('change', update);
    };
  }, []);
  return perView;
}

const ClientCard: React.FC<{ client: ClientItem }> = ({ client }) => (
  <div className="h-full bg-white rounded-card-lg border border-line-subtle shadow-sm hover:shadow-md hover:border-brand-green/40 transition-all p-5 flex items-center gap-5">
    {client.logo && (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoSrc(client.logo)}
        alt={`Logo ${client.name}${client.activity ? ` – ${client.activity}` : ''}`}
        width={112}
        height={112}
        loading="lazy"
        className="w-24 h-24 sm:w-28 sm:h-28 object-contain shrink-0"
      />
    )}
    <div className="min-w-0">
      <p className="font-extrabold text-content-primary">{client.name}</p>
      {client.activity && <p className="text-sm font-semibold text-brand-green">{client.activity}</p>}
      {client.location && <p className="text-xs text-content-muted mt-1">{client.location}</p>}
    </div>
  </div>
);

/** Logos des clients : grille fixe jusqu'à 3, diaporama automatique au-delà. */
export const ClientCarousel: React.FC<{ clients: ClientItem[] }> = ({ clients }) => {
  const perView = usePerView();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStart = useRef<number | null>(null);

  const carousel = clients.length > 3;
  const maxIndex = Math.max(0, clients.length - perView);

  const go = useCallback(
    (next: number) => setIndex(next > maxIndex ? 0 : next < 0 ? maxIndex : next),
    [maxIndex]
  );

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Reste dans les bornes quand l'écran change de taille
  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    if (!carousel || paused || reducedMotion || maxIndex === 0) return;
    const timer = setInterval(() => setIndex((i) => (i >= maxIndex ? 0 : i + 1)), INTERVAL_MS);
    return () => clearInterval(timer);
  }, [carousel, paused, reducedMotion, maxIndex]);

  if (!carousel) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
        {clients.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="max-w-6xl mx-auto"
      role="region"
      aria-roledescription="carrousel"
      aria-label="Entreprises qui nous font confiance"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative">
        <div
          className="overflow-hidden"
          onTouchStart={(e) => {
            touchStart.current = e.touches[0].clientX;
            setPaused(true);
          }}
          onTouchEnd={(e) => {
            const start = touchStart.current;
            touchStart.current = null;
            setPaused(false);
            if (start === null) return;
            const dx = e.changedTouches[0].clientX - start;
            if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
          }}
        >
          <ul
            className="flex transition-transform duration-500 ease-out -mx-2.5"
            style={{ transform: `translateX(-${(index * 100) / perView}%)` }}
          >
            {clients.map((client, i) => (
              <li
                key={client.id}
                className="shrink-0 px-2.5"
                style={{ width: `${100 / perView}%` }}
                aria-hidden={i < index || i >= index + perView}
              >
                <ClientCard client={client} />
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Clients précédents"
          className="absolute left-1 sm:left-0 top-1/2 -translate-y-1/2 sm:-translate-x-1/2 w-10 h-10 rounded-full bg-white border border-line-subtle shadow-md text-content-primary hover:text-brand-green hover:border-brand-green flex items-center justify-center transition-colors"
        >
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Clients suivants"
          className="absolute right-1 sm:right-0 top-1/2 -translate-y-1/2 sm:translate-x-1/2 w-10 h-10 rounded-full bg-white border border-line-subtle shadow-md text-content-primary hover:text-brand-green hover:border-brand-green flex items-center justify-center transition-colors"
        >
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-5 flex justify-center gap-2">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-label={`Aller à la position ${i + 1}`}
            aria-current={i === index}
            className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-brand-green' : 'w-2 bg-slate-300 hover:bg-slate-400'}`}
          />
        ))}
      </div>
    </div>
  );
};
