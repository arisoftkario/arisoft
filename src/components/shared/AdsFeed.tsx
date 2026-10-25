'use client';

import React, { useEffect, useState } from 'react';
import { Megaphone } from 'lucide-react';
import { companyInfo } from '@/data/content';
import { isFirebaseConfigured } from '@/lib/firebase';
import { type Ad, fetchAds } from '@/lib/ads';
import { postAnchor } from '@/lib/engagement';
import { WhatsAppIcon } from '@/components/shared/WhatsAppIcon';
import { MediaGallery } from '@/components/shared/MediaGallery';
import { EngagementBar, useComments } from '@/components/shared/EngagementBar';

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
  const { comments, addLocal } = useComments('publicites', ads.length > 0);

  // Lien partagé vers une publicité précise : défile jusqu'à elle
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#pub-')) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [ads]);

  const visible = ads.slice(0, limit ?? ads.length);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
      {visible.map((ad) => {
        const interestedUrl = `${companyInfo.whatsappUrl}?text=${encodeURIComponent(
          `Bonjour ARISOFT, je suis intéressé(e) par votre offre : « ${ad.title} ».`
        )}`;

        return (
          <article
            key={ad.id}
            id={postAnchor('publicites', ad.id)}
            className="bg-white rounded-card-lg overflow-hidden border border-line-subtle shadow-sm flex flex-col scroll-mt-28 target:ring-2 target:ring-brand-green"
          >
            <MediaGallery
              images={ad.images}
              videoUrl={ad.videoUrl}
              alt={ad.title}
              frameClass="aspect-[4/3]"
              placeholder={
                <div className="w-full h-full bg-gradient-to-br from-navy to-navy-subtle flex items-center justify-center">
                  <Megaphone className="w-14 h-14 text-brand-green-light" aria-hidden="true" />
                </div>
              }
            >
              {ad.badge && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-extrabold shadow-md">
                  {ad.badge}
                </span>
              )}
            </MediaGallery>

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

              <EngagementBar
                type="publicites"
                postId={ad.id}
                title={ad.title}
                likes={ad.likes}
                comments={comments[ad.id] ?? []}
                onCommentAdded={addLocal}
              />
            </div>
          </article>
        );
      })}
    </div>
  );
};
