'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, Loader2, X, Star, Video, CheckCircle2, AlertTriangle } from 'lucide-react';
import { compressImage } from '@/lib/projects';
import { MAX_PHOTOS, videoEmbed } from '@/lib/media';
import { errorMessage, inputClass, labelClass } from '@/components/admin/ui';

interface MediaFieldsProps {
  idPrefix: string;
  images: string[];
  videoUrl: string;
  onImagesChange: (images: string[]) => void;
  onVideoChange: (url: string) => void;
  /** Signale au formulaire qu'une compression est en cours (bouton Publier désactivé). */
  onBusyChange: (busy: boolean) => void;
  onError: (message: string) => void;
}

/** Photos (jusqu'à 4, la première est la photo principale) et lien vidéo. */
export const MediaFields: React.FC<MediaFieldsProps> = ({
  idPrefix,
  images,
  videoUrl,
  onImagesChange,
  onVideoChange,
  onBusyChange,
  onError,
}) => {
  const [busy, setBusy] = useState(false);
  const remaining = MAX_PHOTOS - images.length;
  const embed = videoEmbed(videoUrl);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length === 0) return;
    if (files.length > remaining) {
      onError(`Maximum ${MAX_PHOTOS} photos : seules les ${remaining} premières ont été ajoutées.`);
    }
    setBusy(true);
    onBusyChange(true);
    try {
      const added: string[] = [];
      for (const file of files.slice(0, remaining)) {
        added.push(await compressImage(file));
      }
      onImagesChange([...images, ...added]);
    } catch (err) {
      onError(errorMessage(err));
    } finally {
      setBusy(false);
      onBusyChange(false);
    }
  };

  const remove = (index: number) => onImagesChange(images.filter((_, i) => i !== index));
  const makeMain = (index: number) => onImagesChange([images[index], ...images.filter((_, i) => i !== index)]);

  return (
    <div className="space-y-5">
      <div>
        <span className={labelClass}>
          Photos ({images.length}/{MAX_PHOTOS})
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {images.map((src, i) => (
            <div key={i} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Photo ${i + 1}`}
                className={`w-full aspect-[4/3] object-cover rounded-card-sm border ${
                  i === 0 ? 'border-brand-green ring-2 ring-brand-green/30' : 'border-line-subtle'
                }`}
              />
              {i === 0 ? (
                <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full bg-brand-green text-white text-[10px] font-bold">
                  Principale
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => makeMain(i)}
                  className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 text-content-primary text-[10px] font-bold shadow-sm hover:bg-white"
                >
                  <Star className="w-3 h-3" aria-hidden="true" />
                  Principale
                </button>
              )}
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={`Retirer la photo ${i + 1}`}
                className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/90 text-red-600 shadow-sm flex items-center justify-center hover:bg-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          {remaining > 0 && (
            <label className="aspect-[4/3] rounded-card-sm border border-dashed border-slate-300 bg-slate-50 hover:border-brand-green hover:bg-brand-green-pale/40 flex flex-col items-center justify-center gap-1 text-content-secondary cursor-pointer transition-colors">
              {busy ? (
                <Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" />
              ) : (
                <ImageIcon className="w-6 h-6" aria-hidden="true" />
              )}
              <span className="text-xs font-semibold">{busy ? 'Compression…' : 'Ajouter des photos'}</span>
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={busy}
                onChange={handleFiles}
                className="sr-only"
              />
            </label>
          )}
        </div>
        <p className="text-xs text-content-muted mt-2">
          Vous pouvez en sélectionner plusieurs à la fois. Format conseillé : paysage (4:3). Les photos sont
          redimensionnées automatiquement.
        </p>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-video`} className={labelClass}>
          Lien de la vidéo (facultatif)
        </label>
        <div className="relative">
          <Video className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <input
            id={`${idPrefix}-video`}
            type="url"
            maxLength={500}
            value={videoUrl}
            onChange={(e) => onVideoChange(e.target.value.trim())}
            placeholder="https://www.tiktok.com/@arisoft5/video/…"
            className={`${inputClass} pl-10`}
          />
        </div>
        {videoUrl &&
          (embed ? (
            <p className="text-xs font-semibold text-brand-green mt-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              Vidéo {embed.platform} reconnue : elle sera lue directement sur le site.
            </p>
          ) : (
            <p className="text-xs font-semibold text-amber-700 mt-2 flex items-start gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>
                Lien non reconnu : il s’affichera comme un simple bouton « Voir la vidéo ». Pour TikTok, ouvrez la
                vidéo dans un navigateur et copiez l’adresse complète (elle contient « /video/ »).
              </span>
            </p>
          ))}
        <p className="text-xs text-content-muted mt-2">
          Publiez d’abord la vidéo sur TikTok, YouTube ou Facebook, puis collez son lien ici.
        </p>
      </div>
    </div>
  );
};
