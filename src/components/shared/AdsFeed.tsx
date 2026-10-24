'use client';

import React, { useEffect, useState } from 'react';
import { Heart, Share2, Link2, Check, Megaphone, Facebook } from 'lucide-react';
import { companyInfo } from '@/data/content';
import { isFirebaseConfigured } from '@/lib/firebase';
import {
  type Ad,
  adShareUrl,
  changeAdLikes,
  fetchAds,
  getLikedAds,
  saveLikedAds,
} from '@/lib/ads';
import { WhatsAppIcon } from '@/components/shared/WhatsAppIcon';

/** Charge les publicités une fois ; null pendant le chargement. */
export function useAds(): Ad[] | null {
  const [ads, setAds] = useState<Ad[] | null>(isFirebaseConfigured ? null : []);
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    fetchAds()
      .then(setAds)
      .catch(() => setAds([]));
  }, []);
  return ads;
}

function formatDate(ms: number): string {
  if (!ms) return '';
  return new Date(ms).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

interface AdsFeedProps {
  ads: Ad[];
  limit?: number;
}

export const AdsFeed: React.FC<AdsFeedProps> = ({ ads, limit }) => {
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [shareOpen, setShareOpen] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setLiked(getLikedAds());
  }, []);

  // Lien partagé vers une publicité précise : défile jusqu'à elle
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#pub-')) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [ads]);

  const toggleLike = async (ad: Ad) => {
    const isLiked = liked.has(ad.id);
    const delta = isLiked ? -1 : 1;
    const next = new Set(liked);
    if (isLiked) next.delete(ad.id);
    else next.add(ad.id);

    // Mise à jour immédiate à l'écran, annulée si Firebase refuse
    setLiked(next);
    setLikes((l) => ({ ...l, [ad.id]: (l[ad.id] ?? ad.likes) + delta }));
    try {
      await changeAdLikes(ad.id, delta);
      saveLikedAds(next);
    } catch {
      setLiked(liked);
      setLikes((l) => ({ ...l, [ad.id]: (l[ad.id] ?? ad.likes) - delta }));
    }
  };

  const share = async (ad: Ad) => {
    const url = adShareUrl(ad.id);
    if (navigator.share) {
      try {
        await navigator.share({ title: ad.title, text: `${ad.title} – ARISOFT`, url });
        return;
      } catch {
        // Partage annulé : on affiche le menu de secours
      }
    }
    setShareOpen(shareOpen === ad.id ? null : ad.id);
  };

  const copyLink = async (ad: Ad) => {
    try {
      await navigator.clipboard.writeText(adShareUrl(ad.id));
      setCopied(ad.id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      window.prompt('Copiez ce lien :', adShareUrl(ad.id));
    }
  };

  const visible = ads.slice(0, limit ?? ads.length);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {visible.map((ad) => {
        const count = likes[ad.id] ?? ad.likes;
        const isLiked = liked.has(ad.id);
        const interestedUrl = `${companyInfo.whatsappUrl}?text=${encodeURIComponent(
          `Bonjour ARISOFT, je suis intéressé(e) par votre offre : « ${ad.title} ».`
        )}`;

        return (
          <article
            key={ad.id}
            id={`pub-${ad.id}`}
            className="bg-white rounded-card-lg overflow-hidden border border-line-subtle shadow-sm flex flex-col scroll-mt-28 target:ring-2 target:ring-brand-green"
          >
            <div className="relative">
              {ad.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ad.imageUrl} alt={ad.title} loading="lazy" className="w-full aspect-[4/3] object-cover" />
              ) : (
                <div className="w-full aspect-[4/3] bg-gradient-to-br from-navy to-navy-subtle flex items-center justify-center">
                  <Megaphone className="w-14 h-14 text-brand-green-light" aria-hidden="true" />
                </div>
              )}
              {ad.badge && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-extrabold shadow-md">
                  {ad.badge}
                </span>
              )}
            </div>

            <div className="p-5 sm:p-6 flex-1 flex flex-col">
              <p className="text-xs text-content-muted mb-1">{formatDate(ad.createdAt)}</p>
              <h3 className="text-lg font-extrabold text-content-primary mb-2">{ad.title}</h3>
              {ad.description && (
                <p className="text-sm text-content-secondary leading-relaxed whitespace-pre-line mb-4">
                  {ad.description}
                </p>
              )}

              <a
                href={interestedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center gap-2 font-bold text-sm text-white bg-[#25D366] hover:bg-[#1ebe5b] py-3 rounded-card transition-colors"
              >
                <WhatsAppIcon className="w-5 h-5" aria-hidden="true" />
                Je suis intéressé(e)
              </a>

              {/* J'aime / Partager */}
              <div className="mt-4 pt-3 border-t border-line-subtle flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleLike(ad)}
                  aria-pressed={isLiked}
                  className={`inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full transition-colors ${
                    isLiked ? 'text-red-600 bg-red-50' : 'text-content-secondary hover:bg-slate-100'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} aria-hidden="true" />
                  <span>J’aime</span>
                  <span className="tabular-nums">{count > 0 ? count : ''}</span>
                </button>

                <button
                  type="button"
                  onClick={() => share(ad)}
                  aria-expanded={shareOpen === ad.id}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-content-secondary hover:bg-slate-100 px-3 py-1.5 rounded-full transition-colors"
                >
                  <Share2 className="w-5 h-5" aria-hidden="true" />
                  Partager
                </button>
              </div>

              {shareOpen === ad.id && (
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-bold">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${ad.title} – ${adShareUrl(ad.id)}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 py-2 rounded-card-sm bg-[#25D366]/10 text-[#128C4B] hover:bg-[#25D366]/20"
                  >
                    <WhatsAppIcon className="w-5 h-5" aria-hidden="true" />
                    WhatsApp
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(adShareUrl(ad.id))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 py-2 rounded-card-sm bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20"
                  >
                    <Facebook className="w-5 h-5" aria-hidden="true" />
                    Facebook
                  </a>
                  <button
                    type="button"
                    onClick={() => copyLink(ad)}
                    className="flex flex-col items-center gap-1 py-2 rounded-card-sm bg-slate-100 text-content-primary hover:bg-slate-200"
                  >
                    {copied === ad.id ? (
                      <Check className="w-5 h-5 text-brand-green" aria-hidden="true" />
                    ) : (
                      <Link2 className="w-5 h-5" aria-hidden="true" />
                    )}
                    {copied === ad.id ? 'Copié !' : 'Copier le lien'}
                  </button>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
};
