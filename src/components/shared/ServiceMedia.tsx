'use client';

import React, { useEffect, useState } from 'react';
import { type ServiceMedia, fetchServiceCovers, fetchServiceMedias } from '@/lib/services';
import { MediaGallery } from '@/components/shared/MediaGallery';

/** Photo en haut de la carte d'un service sur l'accueil (rien tant qu'aucune n'est publiée). */
export const ServiceCover: React.FC<{ serviceId: string; title: string }> = ({ serviceId, title }) => {
  const [cover, setCover] = useState<string | null>(null);
  useEffect(() => {
    fetchServiceCovers().then((covers) => setCover(covers[serviceId] ?? null));
  }, [serviceId]);
  if (!cover) return null;

  return (
    // Déborde sur les marges intérieures de la carte pour occuper toute la largeur
    <div className="-mx-6 -mt-6 sm:-mx-7 sm:-mt-7 mb-5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={cover} alt={title} loading="lazy" className="w-full h-40 object-cover border-b border-line-subtle" />
    </div>
  );
};

/** Photos et vidéo d'un service sur la page Services (rien tant qu'aucune n'est publiée). */
export const ServiceGallery: React.FC<{ serviceId: string; title: string }> = ({ serviceId, title }) => {
  const [media, setMedia] = useState<ServiceMedia | null>(null);
  useEffect(() => {
    fetchServiceMedias().then((medias) => setMedia(medias[serviceId] ?? null));
  }, [serviceId]);
  if (!media || (media.images.length === 0 && !media.videoUrl)) return null;

  return (
    <div className="rounded-card overflow-hidden border border-line-subtle bg-surface-alt pb-3">
      <MediaGallery
        images={media.images}
        videoUrl={media.videoUrl}
        alt={title}
        frameClass="aspect-video"
        placeholder={null}
      />
    </div>
  );
};
