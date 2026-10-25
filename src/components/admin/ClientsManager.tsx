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
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';
import { ClientItem } from '@/types';
import { deleteClient, fetchClients, importClients, reorderClients, saveClient } from '@/lib/catalogAdmin';
import { slugify } from '@/lib/catalog';
import { compressImage } from '@/lib/projects';
import { withBasePath } from '@/lib/basePath';
import { errorMessage, inputClass, labelClass } from '@/components/admin/ui';

type ClientForm = Pick<ClientItem, 'name' | 'activity' | 'location' | 'logo'>;

const emptyForm: ClientForm = { name: '', activity: '', location: '', logo: '' };

// Logo du site (/images/clients/…) ou publié depuis l'admin (data URL)
const logoSrc = (logo: string) => (logo.startsWith('/') ? withBasePath(logo) : logo);

export const ClientsManager: React.FC = () => {
  const [items, setItems] = useState<ClientItem[]>([]);
  const [imported, setImported] = useState(true);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [logoBusy, setLogoBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // null = formulaire fermé ; '' = nouveau client ; sinon id en cours d'édition
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ClientForm>(emptyForm);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const loaded = await fetchClients();
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

  const openEdit = (c: ClientItem) => {
    setForm({ name: c.name, activity: c.activity, location: c.location, logo: c.logo });
    setEditingId(c.id);
    setError('');
  };

  const closeForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setLogoBusy(true);
    try {
      // Un logo n'a pas besoin d'être grand : ~60 Ko suffisent
      const logo = await compressImage(file, 400, 60_000);
      setForm((f) => ({ ...f, logo }));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLogoBusy(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const existing = items.find((c) => c.id === editingId);
    let id = existing?.id ?? slugify(`${form.name} ${form.activity}`);
    while (!existing && items.some((c) => c.id === id)) id = `${id}-2`;

    const client: ClientItem = {
      id,
      name: form.name.trim(),
      activity: form.activity.trim(),
      location: form.location.trim(),
      logo: form.logo,
      order: existing?.order ?? items.length,
    };
    const ok = await run(
      () => saveClient(client),
      existing ? 'Client mis à jour. Visible sur le site d’ici une minute.' : 'Client ajouté. Visible sur le site d’ici une minute.'
    );
    if (ok) closeForm();
  };

  const handleDelete = (c: ClientItem) => {
    if (!window.confirm(`Retirer « ${c.name} » de la liste des clients ?`)) return;
    run(() => deleteClient(c.id), 'Client retiré.');
  };

  const move = (index: number, delta: -1 | 1) => {
    const next = [...items];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    setItems(next);
    run(() => reorderClients(next), 'Ordre des clients enregistré.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-content-primary">Ils nous font confiance</h2>
          <p className="text-sm text-content-muted">
            Entreprises affichées sur l’accueil et la page{' '}
            <a href={withBasePath('/realisations/')} target="_blank" rel="noopener noreferrer" className="text-brand-green font-semibold hover:underline inline-flex items-center gap-0.5">
              Réalisations <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
            .
          </p>
        </div>
        {imported && (
          <button
            type="button"
            onClick={openNew}
            className="self-start sm:self-auto inline-flex items-center font-bold text-sm text-white bg-brand-green hover:bg-brand-green-hover px-4 py-2.5 rounded-card transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4 mr-2" aria-hidden="true" />
            Ajouter un client
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
            Les clients ci-dessous sont ceux du site actuel. Importez-les une fois pour pouvoir les modifier et en ajouter
            d’autres.
          </p>
          <button
            type="button"
            disabled={busy}
            onClick={() => run(importClients, 'Clients importés : vous pouvez maintenant les modifier.')}
            className="inline-flex items-center font-bold text-sm text-white bg-navy hover:bg-navy-light disabled:opacity-60 px-4 py-2.5 rounded-card transition-colors"
          >
            {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" /> : <Download className="w-4 h-4 mr-2" aria-hidden="true" />}
            Importer les clients ({items.length})
          </button>
        </div>
      )}

      {/* Formulaire */}
      {editingId !== null && (
        <form onSubmit={handleSave} className="bg-white rounded-card-lg p-6 sm:p-8 border border-line-subtle shadow-md space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-content-primary">
              {editingId ? 'Modifier le client' : 'Nouveau client'}
            </h3>
            <button type="button" onClick={closeForm} aria-label="Fermer" className="text-content-muted hover:text-content-primary">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="space-y-2 shrink-0">
              <span className={labelClass}>Logo</span>
              {form.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoSrc(form.logo)} alt="Aperçu du logo" className="w-28 h-28 object-contain rounded-card-sm border border-line-subtle bg-white" />
              ) : (
                <div className="w-28 h-28 rounded-card-sm border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400">
                  <ImageIcon className="w-8 h-8" aria-hidden="true" />
                </div>
              )}
              <label className="inline-flex items-center cursor-pointer font-semibold text-xs text-content-primary bg-white border border-line-subtle hover:border-brand-green px-3 py-2 rounded-card-sm transition-colors">
                {logoBusy ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" aria-hidden="true" /> : <ImageIcon className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />}
                {form.logo ? 'Changer' : 'Choisir le logo'}
                <input type="file" accept="image/*" onChange={handleLogo} className="sr-only" />
              </label>
            </div>

            <div className="flex-1 w-full space-y-4">
              <div>
                <label htmlFor="client-name" className={labelClass}>Nom de l’entreprise *</label>
                <input
                  id="client-name"
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex : KISUSI COMPANY"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="client-activity" className={labelClass}>Activité ou prestation réalisée</label>
                <input
                  id="client-activity"
                  maxLength={100}
                  value={form.activity}
                  onChange={(e) => setForm({ ...form, activity: e.target.value })}
                  placeholder="Ex : Logiciel de gestion de stock"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="client-location" className={labelClass}>Ville ou slogan</label>
                <input
                  id="client-location"
                  maxLength={100}
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Ex : Butembo, Nord-Kivu"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={busy || logoBusy}
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
      ) : items.length === 0 ? (
        <div className="bg-white rounded-card-lg p-10 border border-dashed border-slate-300 text-center text-sm text-content-muted">
          Aucun client pour l’instant. Cliquez sur « Ajouter un client ».
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((c, i) => (
            <li key={c.id} className="bg-white rounded-card p-4 border border-line-subtle shadow-xs flex items-center gap-4">
              {c.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoSrc(c.logo)} alt="" className="w-14 h-14 object-contain rounded-card-sm border border-line-subtle bg-white shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-card-sm bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                  <ImageIcon className="w-6 h-6" aria-hidden="true" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-content-primary truncate">{c.name}</p>
                <p className="text-xs text-content-muted truncate">
                  {[c.activity, c.location].filter(Boolean).join(' · ')}
                </p>
              </div>
              {imported && (
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={busy || i === 0}
                    aria-label={`Monter ${c.name}`}
                    className="p-2 rounded-card-sm text-content-secondary hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={busy || i === items.length - 1}
                    aria-label={`Descendre ${c.name}`}
                    className="p-2 rounded-card-sm text-content-secondary hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(c)}
                    aria-label={`Modifier ${c.name}`}
                    className="p-2 rounded-card-sm text-content-secondary hover:bg-slate-100 hover:text-content-primary"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(c)}
                    aria-label={`Retirer ${c.name}`}
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
