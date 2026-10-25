'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  PlusCircle,
  Edit3,
  Trash2,
  Save,
  X,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ArrowUp,
  ArrowDown,
  Download,
  ExternalLink,
} from 'lucide-react';
import { ServiceItem } from '@/types';
import { deleteService, fetchCatalog, importCatalog, reorderServices, saveService } from '@/lib/catalogAdmin';
import { slugify } from '@/lib/catalog';
import { withBasePath } from '@/lib/basePath';
import { SERVICE_ICONS, ServiceIcon } from '@/components/shared/ServiceIcon';
import { errorMessage, inputClass, labelClass } from '@/components/admin/ui';

interface ServiceForm {
  title: string;
  iconName: string;
  shortDescription: string;
  fullDescription: string;
  /** Une prestation incluse par ligne. */
  features: string;
  ctaLabel: string;
}

const emptyForm: ServiceForm = {
  title: '',
  iconName: 'LayoutDashboard',
  shortDescription: '',
  fullDescription: '',
  features: '',
  ctaLabel: '',
};

const MAX_FEATURES = 8;

export const CatalogManager: React.FC = () => {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [imported, setImported] = useState(true);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // null = formulaire fermé ; '' = nouveau service ; sinon id en cours d'édition
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const loaded = await fetchCatalog();
      setItems(loaded.items);
      setImported(loaded.imported);
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
    setTimeout(() => setNotice(''), 6000);
  };

  const run = async (action: () => Promise<void>, message: string) => {
    setBusy(true);
    setError('');
    try {
      await action();
      flash(message);
      await reload();
      return true;
    } catch (err) {
      setError(errorMessage(err));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const openNew = () => {
    setForm(emptyForm);
    setEditingId('');
    setError('');
  };

  const openEdit = (s: ServiceItem) => {
    setForm({
      title: s.title,
      iconName: s.iconName,
      shortDescription: s.shortDescription,
      fullDescription: s.fullDescription,
      features: s.features.join('\n'),
      ctaLabel: s.ctaLabel ?? '',
    });
    setEditingId(s.id);
    setError('');
  };

  const closeForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const existing = items.find((s) => s.id === editingId);
    // Nouvel identifiant tiré du titre, rendu unique ; un service existant garde le sien (liens et photos)
    let id = existing?.id ?? slugify(form.title);
    while (!existing && items.some((s) => s.id === id)) id = `${id}-2`;

    const service: ServiceItem = {
      id,
      slug: existing?.slug ?? id,
      title: form.title.trim(),
      iconName: form.iconName,
      shortDescription: form.shortDescription.trim(),
      fullDescription: form.fullDescription.trim(),
      features: form.features
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean)
        .slice(0, MAX_FEATURES),
      ctaLabel: form.ctaLabel.trim() || undefined,
      order: existing?.order ?? items.length,
    };
    const ok = await run(
      () => saveService(service),
      existing ? 'Service mis à jour. Visible sur le site d’ici une minute.' : 'Service ajouté au catalogue. Visible sur le site d’ici une minute.'
    );
    if (ok) closeForm();
  };

  const handleDelete = (s: ServiceItem) => {
    if (!window.confirm(`Retirer « ${s.title} » du catalogue ? Ses photos seront aussi supprimées.`)) return;
    run(() => deleteService(s.id), 'Service retiré du catalogue.');
  };

  const move = (index: number, delta: -1 | 1) => {
    const next = [...items];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    setItems(next);
    run(() => reorderServices(next), 'Ordre du catalogue enregistré.');
  };

  const featureCount = form.features.split('\n').filter((f) => f.trim()).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-content-primary">Catalogue des prestations</h2>
          <p className="text-sm text-content-muted">
            Services affichés sur l’accueil, la page{' '}
            <a href={withBasePath('/services/')} target="_blank" rel="noopener noreferrer" className="text-brand-green font-semibold hover:underline inline-flex items-center gap-0.5">
              Services <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
            , le pied de page et le formulaire de contact.
          </p>
        </div>
        {imported && (
          <button
            type="button"
            onClick={openNew}
            className="self-start sm:self-auto inline-flex items-center font-bold text-sm text-white bg-brand-green hover:bg-brand-green-hover px-4 py-2.5 rounded-card transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4 mr-2" aria-hidden="true" />
            Ajouter un service
          </button>
        )}
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

      {!loading && !imported && (
        <div className="p-5 rounded-card-lg bg-amber-50 border border-amber-200 space-y-3">
          <p className="text-sm text-amber-900">
            Le catalogue ci-dessous est celui du site actuel. Importez-le une fois pour pouvoir modifier, ajouter,
            réordonner ou retirer des services.
          </p>
          <button
            type="button"
            disabled={busy}
            onClick={() => run(importCatalog, 'Catalogue importé : vous pouvez maintenant le modifier.')}
            className="inline-flex items-center font-bold text-sm text-white bg-navy hover:bg-navy-light disabled:opacity-60 px-4 py-2.5 rounded-card transition-colors"
          >
            {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" /> : <Download className="w-4 h-4 mr-2" aria-hidden="true" />}
            Importer le catalogue ({items.length} services)
          </button>
        </div>
      )}

      {/* Formulaire */}
      {editingId !== null && (
        <form onSubmit={handleSave} className="bg-white rounded-card-lg p-6 sm:p-8 border border-line-subtle shadow-md space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-content-primary">
              {editingId ? 'Modifier le service' : 'Nouveau service'}
            </h3>
            <button type="button" onClick={closeForm} aria-label="Fermer" className="text-content-muted hover:text-content-primary">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <label htmlFor="svc-title" className={labelClass}>Nom du service *</label>
            <input
              id="svc-title"
              required
              maxLength={80}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex : Maintenance d’imprimantes"
              className={inputClass}
            />
          </div>

          <div>
            <span className={labelClass}>Icône</span>
            <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
              {Object.entries(SERVICE_ICONS).map(([name, { label }]) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setForm({ ...form, iconName: name })}
                  aria-pressed={form.iconName === name}
                  title={label}
                  className={`aspect-square rounded-card-sm border flex flex-col items-center justify-center gap-0.5 transition-colors ${
                    form.iconName === name
                      ? 'border-brand-green bg-brand-green-pale text-brand-green'
                      : 'border-line-subtle text-content-secondary hover:border-slate-400'
                  }`}
                >
                  <ServiceIcon name={name} className="w-5 h-5" />
                  <span className="text-[9px] font-semibold leading-none">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="svc-short" className={labelClass}>Résumé (carte de l’accueil) *</label>
            <textarea
              id="svc-short"
              required
              rows={2}
              maxLength={300}
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              placeholder="Une ou deux phrases : ce que vous faites et pour qui."
              className={`${inputClass} resize-y`}
            />
          </div>

          <div>
            <label htmlFor="svc-full" className={labelClass}>Description détaillée (page Services)</label>
            <textarea
              id="svc-full"
              rows={4}
              maxLength={2000}
              value={form.fullDescription}
              onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
              className={`${inputClass} resize-y`}
            />
          </div>

          <div>
            <label htmlFor="svc-features" className={labelClass}>
              Ce qui est inclus ({featureCount}/{MAX_FEATURES}), une prestation par ligne
            </label>
            <textarea
              id="svc-features"
              rows={5}
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              placeholder={'Diagnostic sur place\nRemplacement des pièces\nGarantie 3 mois'}
              className={`${inputClass} resize-y`}
            />
            {featureCount > MAX_FEATURES && (
              <p className="text-xs font-semibold text-amber-700 mt-1">Seules les {MAX_FEATURES} premières lignes seront gardées.</p>
            )}
          </div>

          <div>
            <label htmlFor="svc-cta" className={labelClass}>Texte du bouton de devis</label>
            <input
              id="svc-cta"
              maxLength={80}
              value={form.ctaLabel}
              onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
              placeholder="Ex : Demander un devis maintenance"
              className={inputClass}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center font-bold text-white bg-brand-green hover:bg-brand-green-hover disabled:opacity-60 px-5 py-3 rounded-card transition-colors"
            >
              {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" /> : <Save className="w-4 h-4 mr-2" aria-hidden="true" />}
              Enregistrer
            </button>
            <button type="button" onClick={closeForm} className="font-semibold text-sm text-content-secondary px-4 py-3 rounded-card hover:bg-slate-100">
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
      ) : (
        <ul className="space-y-3">
          {items.map((s, i) => (
            <li key={s.id} className="bg-white rounded-card p-4 border border-line-subtle shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-card-sm bg-brand-green-pale border border-green-200 flex items-center justify-center shrink-0">
                <ServiceIcon name={s.iconName} className="w-6 h-6 text-brand-green" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-content-primary truncate">{s.title}</p>
                <p className="text-xs text-content-muted truncate">{s.shortDescription}</p>
              </div>
              {imported && (
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={busy || i === 0}
                    aria-label={`Monter ${s.title}`}
                    className="p-2 rounded-card-sm text-content-secondary hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={busy || i === items.length - 1}
                    aria-label={`Descendre ${s.title}`}
                    className="p-2 rounded-card-sm text-content-secondary hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(s)}
                    aria-label={`Modifier ${s.title}`}
                    className="p-2 rounded-card-sm text-content-secondary hover:bg-slate-100 hover:text-content-primary"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(s)}
                    aria-label={`Retirer ${s.title}`}
                    className="p-2 rounded-card-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
