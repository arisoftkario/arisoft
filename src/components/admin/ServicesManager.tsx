'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Edit3, Save, X, CheckCircle2, AlertTriangle, Loader2, Image as ImageIcon, Video, ExternalLink } from 'lucide-react';
import { servicesData } from '@/data/content';
import { ServiceItem } from '@/types';
import { fetchCatalog } from '@/lib/catalogAdmin';
import { type ServiceMedia, fetchServiceMedias, saveServiceMedia } from '@/lib/services';
import { withBasePath } from '@/lib/basePath';
import { errorMessage } from '@/components/admin/ui';
import { MediaFields } from '@/components/admin/MediaFields';

const emptyMedia: ServiceMedia = { images: [], videoUrl: '' };

export const ServicesManager: React.FC = () => {
  const [medias, setMedias] = useState<Record<string, ServiceMedia>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // Service en cours de modification (null = aucun)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceMedia>(emptyMedia);
  const [saving, setSaving] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);

  const [services, setServices] = useState<ServiceItem[]>(servicesData);

  const reload = useCallback(async () => {
    setLoading(true);
    const [loadedMedias, catalog] = await Promise.all([
      fetchServiceMedias(),
      fetchCatalog().catch(() => ({ items: servicesData })),
    ]);
    setMedias(loadedMedias);
    setServices(catalog.items);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const flash = (message: string) => {
    setNotice(message);
    setTimeout(() => setNotice(''), 3500);
  };

  const openEdit = (id: string) => {
    setForm(medias[id] ?? emptyMedia);
    setEditingId(id);
    setError('');
  };

  const closeForm = () => {
    setEditingId(null);
    setForm(emptyMedia);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setSaving(true);
    setError('');
    try {
      await saveServiceMedia(editingId, form);
      flash('Photos du service enregistrées. Elles sont visibles sur le site.');
      closeForm();
      await reload();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-content-primary">Photos des services</h2>
        <p className="text-sm text-content-muted">
          La photo principale s’affiche sur la carte du service à l’accueil ; toutes les photos et la vidéo sur la page{' '}
          <a href={withBasePath('/services/')} target="_blank" rel="noopener noreferrer" className="text-brand-green font-semibold hover:underline inline-flex items-center gap-0.5">
            Services <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
          .
        </p>
      </div>

      {notice && (
        <div className="p-4 rounded-card bg-brand-green-pale border border-green-300 text-sm font-semibold text-brand-green flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
          {notice}
        </div>
      )}
      {error && (
        <div className="p-4 rounded-card bg-red-50 border border-red-200 text-sm font-semibold text-red-700 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0" aria-hidden="true" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12 text-content-muted">
          <Loader2 className="w-6 h-6 animate-spin" aria-label="Chargement" />
        </div>
      ) : (
        <ul className="space-y-3">
          {services.map((service) => {
            const media = medias[service.id] ?? emptyMedia;
            const isEditing = editingId === service.id;
            return (
              <li key={service.id} className="bg-white rounded-card border border-line-subtle shadow-xs">
                <div className="p-4 flex items-center gap-4">
                  {media.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={media.images[0]} alt="" className="w-20 h-16 object-cover rounded-card-sm shrink-0" />
                  ) : (
                    <div className="w-20 h-16 rounded-card-sm bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                      <ImageIcon className="w-6 h-6" aria-hidden="true" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-content-primary truncate">{service.title}</p>
                    <p className="text-xs text-content-muted flex items-center gap-2 mt-0.5">
                      <span>
                        {media.images.length === 0
                          ? 'Aucune photo'
                          : `${media.images.length} photo${media.images.length > 1 ? 's' : ''}`}
                      </span>
                      {media.videoUrl && (
                        <span className="inline-flex items-center gap-1">
                          · <Video className="w-3.5 h-3.5" aria-hidden="true" /> vidéo
                        </span>
                      )}
                    </p>
                  </div>
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => openEdit(service.id)}
                      className="shrink-0 inline-flex items-center font-semibold text-sm text-content-primary bg-white border border-line-subtle hover:border-brand-green px-3 py-2 rounded-card-sm transition-colors"
                    >
                      <Edit3 className="w-4 h-4 mr-1.5" aria-hidden="true" />
                      {media.images.length || media.videoUrl ? 'Modifier' : 'Ajouter des photos'}
                    </button>
                  )}
                </div>

                {isEditing && (
                  <form onSubmit={handleSave} className="border-t border-line-subtle p-4 sm:p-6 space-y-5">
                    <MediaFields
                      idPrefix={`service-${service.id}`}
                      images={form.images}
                      videoUrl={form.videoUrl}
                      onImagesChange={(images) => setForm((f) => ({ ...f, images }))}
                      onVideoChange={(videoUrl) => setForm((f) => ({ ...f, videoUrl }))}
                      onBusyChange={setImageBusy}
                      onError={setError}
                    />
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={saving || imageBusy}
                        className="inline-flex items-center font-bold text-white bg-brand-green hover:bg-brand-green-hover disabled:opacity-60 px-5 py-3 rounded-card transition-colors"
                      >
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" /> : <Save className="w-4 h-4 mr-2" aria-hidden="true" />}
                        Enregistrer
                      </button>
                      <button
                        type="button"
                        onClick={closeForm}
                        className="inline-flex items-center font-semibold text-sm text-content-secondary px-4 py-3 rounded-card hover:bg-slate-100"
                      >
                        <X className="w-4 h-4 mr-1.5" aria-hidden="true" />
                        Annuler
                      </button>
                    </div>
                  </form>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
