'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  PlusCircle,
  Edit3,
  Trash2,
  Save,
  X,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Heart,
  ExternalLink,
} from 'lucide-react';
import { compressImage } from '@/lib/projects';
import { type Ad, type AdInput, createAd, deleteAd, fetchAds, updateAd } from '@/lib/ads';
import { withBasePath } from '@/lib/basePath';
import { errorMessage, inputClass, labelClass } from '@/components/admin/ui';

const emptyForm: AdInput = { title: '', description: '', badge: '', imageUrl: '' };

export const AdsManager: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // null = formulaire fermé ; '' = nouvelle publicité ; sinon id en cours d'édition
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setAds(await fetchAds());
      setError('');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const flash = (message: string) => {
    setNotice(message);
    setTimeout(() => setNotice(''), 3500);
  };

  const openNew = () => {
    setForm(emptyForm);
    setEditingId('');
    setError('');
  };

  const openEdit = (ad: Ad) => {
    setForm({ title: ad.title, description: ad.description, badge: ad.badge, imageUrl: ad.imageUrl });
    setEditingId(ad.id);
    setError('');
  };

  const closeForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setImageBusy(true);
    try {
      const imageUrl = await compressImage(file);
      setForm((f) => ({ ...f, imageUrl }));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setImageBusy(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const input: AdInput = {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        badge: form.badge.trim(),
      };
      if (editingId) {
        await updateAd(editingId, input);
        flash('Publicité mise à jour. Elle est visible sur le site.');
      } else {
        await createAd(input);
        flash('Publicité publiée ! Elle est maintenant visible sur le site.');
      }
      closeForm();
      await reload();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (ad: Ad) => {
    if (!window.confirm(`Supprimer définitivement la publicité « ${ad.title} » ?`)) return;
    try {
      await deleteAd(ad.id);
      flash('Publicité supprimée.');
      await reload();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-content-primary">Publicités</h2>
          <p className="text-sm text-content-muted">
            Affichées sur l’accueil (3 dernières) et sur la page{' '}
            <a href={withBasePath('/publicites/')} target="_blank" rel="noopener noreferrer" className="text-brand-green font-semibold hover:underline inline-flex items-center gap-0.5">
              Offres <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="self-start sm:self-auto inline-flex items-center font-bold text-sm text-white bg-brand-green hover:bg-brand-green-hover px-4 py-2.5 rounded-card transition-colors shadow-sm"
        >
          <PlusCircle className="w-4 h-4 mr-2" aria-hidden="true" />
          Nouvelle publicité
        </button>
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

      {/* Formulaire */}
      {editingId !== null && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-card-lg p-6 sm:p-8 border border-line-subtle shadow-md space-y-5"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-content-primary">
              {editingId ? 'Modifier la publicité' : 'Nouvelle publicité'}
            </h3>
            <button type="button" onClick={closeForm} aria-label="Fermer" className="text-content-muted hover:text-content-primary">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="sm:col-span-2">
              <label htmlFor="ad-title" className={labelClass}>Titre *</label>
              <input
                id="ad-title"
                required
                maxLength={120}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ex : Kit 4 caméras HD installé à 350 $"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="ad-badge" className={labelClass}>Badge</label>
              <input
                id="ad-badge"
                maxLength={20}
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                placeholder="Ex : -20 %, Nouveau"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="ad-description" className={labelClass}>Texte de la publicité</label>
            <textarea
              id="ad-description"
              rows={4}
              maxLength={1500}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Ce qui est proposé, le prix, la durée de l’offre, comment en profiter…"
              className={`${inputClass} resize-y`}
            />
          </div>

          <div>
            <span className={labelClass}>Photo ou affiche</span>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {form.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.imageUrl} alt="Aperçu" className="w-48 h-36 object-cover rounded-card-sm border border-line-subtle" />
              ) : (
                <div className="w-48 h-36 rounded-card-sm border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400">
                  <ImageIcon className="w-8 h-8" aria-hidden="true" />
                </div>
              )}
              <div className="space-y-2">
                <label className="inline-flex items-center cursor-pointer font-semibold text-sm text-content-primary bg-white border border-line-subtle hover:border-brand-green px-4 py-2.5 rounded-card transition-colors">
                  {imageBusy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" /> : <ImageIcon className="w-4 h-4 mr-2" aria-hidden="true" />}
                  {form.imageUrl ? 'Changer l’image' : 'Choisir une image'}
                  <input type="file" accept="image/*" onChange={handleImage} className="sr-only" />
                </label>
                {form.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, imageUrl: '' })}
                    className="block text-xs font-semibold text-red-700 hover:underline"
                  >
                    Retirer l’image
                  </button>
                )}
                <p className="text-xs text-content-muted">Format conseillé : 4:3 (paysage). Redimensionnée automatiquement.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving || imageBusy}
              className="inline-flex items-center font-bold text-white bg-brand-green hover:bg-brand-green-hover disabled:opacity-60 px-5 py-3 rounded-card transition-colors"
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" /> : <Save className="w-4 h-4 mr-2" aria-hidden="true" />}
              {editingId ? 'Enregistrer' : 'Publier sur le site'}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="font-semibold text-sm text-content-secondary px-4 py-3 rounded-card hover:bg-slate-100"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Liste */}
      {loading ? (
        <div className="flex justify-center py-12 text-content-muted">
          <Loader2 className="w-6 h-6 animate-spin" aria-label="Chargement" />
        </div>
      ) : ads.length === 0 ? (
        <div className="bg-white rounded-card-lg p-10 border border-dashed border-slate-300 text-center text-sm text-content-muted">
          Aucune publicité pour l’instant. La section « Offres » de l’accueil reste masquée.
          <br />
          Cliquez sur <strong>« Nouvelle publicité »</strong> pour publier la première.
        </div>
      ) : (
        <ul className="space-y-3">
          {ads.map((ad) => (
            <li key={ad.id} className="bg-white rounded-card p-4 border border-line-subtle shadow-xs flex items-center gap-4">
              {ad.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ad.imageUrl} alt="" className="w-20 h-16 object-cover rounded-card-sm shrink-0" />
              ) : (
                <div className="w-20 h-16 rounded-card-sm bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                  <ImageIcon className="w-6 h-6" aria-hidden="true" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-content-primary truncate">
                  {ad.badge && <span className="mr-2 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] align-middle">{ad.badge}</span>}
                  {ad.title}
                </p>
                <p className="text-xs text-content-muted flex items-center gap-1 mt-0.5">
                  <Heart className="w-3.5 h-3.5 text-red-500 fill-current" aria-hidden="true" />
                  {ad.likes} J’aime
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => openEdit(ad)}
                  aria-label={`Modifier ${ad.title}`}
                  className="p-2 rounded-card-sm text-content-secondary hover:bg-slate-100 hover:text-content-primary"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(ad)}
                  aria-label={`Supprimer ${ad.title}`}
                  className="p-2 rounded-card-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
