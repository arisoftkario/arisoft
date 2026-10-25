'use client';

import React, { useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { videoEmbed } from '@/lib/media';
import { withBasePath } from '@/lib/basePath';

interface MediaGalleryProps {
  images: string[];
  videoUrl?: string;
  alt: string;
  /** Hauteur ou proportions du cadre principal (ex : « aspect-[4/3] »). */
  frameClass: string;
  /** Affiché quand il n'y a ni photo ni vidéo. */
  placeholder: React.ReactNode;
  /** Éléments posés sur le cadre (badge…). */
  children?: React.ReactNode;
}

// Photo du site (/images/…) ou photo publiée depuis l'admin (data URL)
const photoSrc = (src: string) => (src.startsWith('/') ? withBasePath(src) : src);

/**
 * Photo principale avec miniatures, plus une vidéo optionnelle.
 * Le lecteur vidéo n'est chargé qu'au clic, pour économiser les données mobiles.
 */
export const MediaGallery: React.FC<MediaGalleryProps> = ({
  images,
  videoUrl,
  alt,
  frameClass,
  placeholder,
  children,
}) => {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const hasVideo = Boolean(videoUrl);
  const embed = videoEmbed(videoUrl);
  const count = images.length + (hasVideo ? 1 : 0);
  const showingVideo = hasVideo && index === images.length;

  const select = (i: number) => {
    setIndex(i);
    setPlaying(false);
  };

  let main: React.ReactNode;
  if (count === 0) {
    main = <div className={`w-full ${frameClass}`}>{placeholder}</div>;
  } else if (showingVideo && playing && embed) {
    main = (
      <div className="w-full bg-black">
        <div className={embed.vertical ? 'aspect-[9/16] max-h-[70vh] mx-auto' : 'aspect-video'}>
          <iframe
            src={embed.src}
            title={`Vidéo : ${alt}`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      </div>
    );
  } else if (showingVideo) {
    const label = embed ? `Lire la vidéo ${embed.platform}` : 'Voir la vidéo';
    const poster = (
      <>
        {images[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoSrc(images[0])} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        )}
        <span className="relative w-16 h-16 rounded-full bg-white/95 text-navy flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
          {embed ? <Play className="w-7 h-7 ml-1 fill-current" aria-hidden="true" /> : <ExternalLink className="w-6 h-6" aria-hidden="true" />}
        </span>
        <span className="relative text-sm font-bold text-white">{label}</span>
      </>
    );
    const posterClass = `group relative w-full ${frameClass} bg-navy flex flex-col items-center justify-center gap-3 overflow-hidden`;
    main = embed ? (
      <button type="button" onClick={() => setPlaying(true)} className={posterClass}>
        {poster}
      </button>
    ) : (
      <a href={videoUrl} target="_blank" rel="noopener noreferrer" className={posterClass}>
        {poster}
      </a>
    );
  } else {
    main = (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoSrc(images[index])}
        alt={images.length > 1 ? `${alt} – photo ${index + 1}` : alt}
        loading="lazy"
        className={`w-full ${frameClass} object-cover`}
      />
    );
  }

  return (
    <div>
      <div className="relative">
        {main}
        {!(showingVideo && playing) && children}
      </div>

      {count > 1 && (
        <div className="flex gap-2 px-3 pt-3" role="tablist" aria-label="Photos et vidéo">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={index === i}
              aria-label={`Photo ${i + 1}`}
              onClick={() => select(i)}
              className={`w-14 h-11 rounded-card-sm overflow-hidden border-2 transition-colors ${
                index === i ? 'border-brand-green' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoSrc(src)} alt="" loading="lazy" className="w-full h-full object-cover" />
            </button>
          ))}
          {hasVideo && (
            <button
              type="button"
              role="tab"
              aria-selected={showingVideo}
              aria-label="Vidéo"
              onClick={() => select(images.length)}
              className={`w-14 h-11 rounded-card-sm bg-navy text-white flex items-center justify-center border-2 transition-colors ${
                showingVideo ? 'border-brand-green' : 'border-transparent opacity-80 hover:opacity-100'
              }`}
            >
              <Play className="w-5 h-5 fill-current" aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
