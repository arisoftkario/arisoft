'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import {
  Lock,
  LogOut,
  PlusCircle,
  Edit3,
  Trash2,
  Save,
  X,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Megaphone,
  Briefcase,
  MessageSquareQuote,
} from 'lucide-react';
import { isFirebaseConfigured } from '@/lib/firebase';
import { auth } from '@/lib/auth';
import {
  compressImage,
  createProject,
  deleteProject,
  fetchProjects,
  updateProject,
  type ProjectInput,
} from '@/lib/projects';
import { servicesData } from '@/data/content';
import { errorMessage, inputClass, labelClass } from '@/components/admin/ui';
import { AdsManager } from '@/components/admin/AdsManager';
import { TestimonialsManager } from '@/components/admin/TestimonialsManager';
import { ProjectItem } from '@/types';

const emptyForm: ProjectInput = {
  title: '',
  clientName: '',
  serviceCategory: servicesData[0].title,
  description: '',
  imageUrl: undefined,
};


export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
  }, []);

  if (!isFirebaseConfigured) {
    return (
      <AdminShell>
        <div className="p-5 rounded-card bg-amber-50 border border-amber-200 text-sm text-amber-900 flex gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-bold mb-1">Firebase n’est pas encore configuré.</p>
            <p>
              Copiez <code>.env.local.example</code> en <code>.env.local</code>, renseignez les clés de votre
              projet Firebase puis relancez <code>npm run dev</code> ou <code>npm run build</code>.
            </p>
          </div>
        </div>
      </AdminShell>
    );
  }

  if (!authReady) {
    return (
      <AdminShell>
        <div className="flex justify-center py-16 text-content-muted">
          <Loader2 className="w-6 h-6 animate-spin" aria-label="Chargement" />
        </div>
      </AdminShell>
    );
  }

  return <AdminShell>{user ? <Dashboard user={user} /> : <LoginForm />}</AdminShell>;
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface-alt min-h-[70vh] py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-card-lg p-6 sm:p-8 border border-line-subtle shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-card-sm bg-navy flex items-center justify-center">
          <Lock className="w-5 h-5 text-brand-green-light" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-content-primary">Espace administration</h1>
          <p className="text-xs text-content-muted">Connexion réservée à l’équipe ARISOFT</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input
            id="email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="password" className={labelClass}>Mot de passe</label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        {error && <p className="text-sm text-red-700 font-medium">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center font-bold text-white bg-brand-green hover:bg-brand-green-hover disabled:opacity-60 py-3.5 rounded-card transition-colors"
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />}
          Se connecter
        </button>
      </form>
    </div>
  );
}

function Dashboard({ user }: { user: User }) {
  const [tab, setTab] = useState<'ads' | 'projects' | 'avis'>('ads');
  const tabs = [
    { id: 'ads' as const, label: 'Publicités', Icon: Megaphone },
    { id: 'projects' as const, label: 'Réalisations', Icon: Briefcase },
    { id: 'avis' as const, label: 'Avis', Icon: MessageSquareQuote },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-content-primary">Espace administration</h1>
          <p className="text-sm text-content-muted">Connecté : {user.email}</p>
        </div>
        <button
          type="button"
          onClick={() => auth && signOut(auth)}
          className="self-start sm:self-auto inline-flex items-center font-semibold text-sm text-content-secondary bg-white border border-line-subtle hover:border-slate-400 px-3 py-2.5 rounded-card transition-colors"
        >
          <LogOut className="w-4 h-4 mr-1.5" aria-hidden="true" />
          Déconnexion
        </button>
      </div>

      <div className="flex gap-2 border-b border-line-subtle overflow-x-auto" role="tablist">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 -mb-px transition-colors ${
              tab === id
                ? 'border-brand-green text-brand-green'
                : 'border-transparent text-content-secondary hover:text-content-primary'
            }`}
          >
            <Icon className="w-4 h-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'ads' && <AdsManager />}
      {tab === 'projects' && <ProjectsManager />}
      {tab === 'avis' && <TestimonialsManager />}
    </div>
  );
}

function ProjectsManager() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // null = formulaire fermé ; '' = nouvelle réalisation ; sinon id en cours d'édition
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setProjects(await fetchProjects());
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

  const openEdit = (p: ProjectItem) => {
    setForm({
      title: p.title,
      clientName: p.clientName,
      serviceCategory: p.serviceCategory,
      description: p.description,
      imageUrl: p.imageUrl,
    });
    setEditingId(p.id);
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
      const input: ProjectInput = {
        ...form,
        title: form.title.trim(),
        clientName: form.clientName.trim(),
        description: form.description.trim(),
      };
      if (editingId) {
        await updateProject(editingId, input);
        flash('Réalisation mise à jour. Elle est visible sur le site.');
      } else {
        await createProject(input);
        flash('Réalisation publiée ! Elle est maintenant visible sur le site.');
      }
      closeForm();
      await reload();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: ProjectItem) => {
    if (!window.confirm(`Supprimer définitivement « ${p.title} » du site ?`)) return;
    try {
      await deleteProject(p.id);
      flash('Réalisation supprimée.');
      await reload();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-extrabold text-content-primary">Réalisations publiées</h2>
        <button
          type="button"
          onClick={openNew}
          className="self-start sm:self-auto inline-flex items-center font-bold text-sm text-white bg-brand-green hover:bg-brand-green-hover px-4 py-2.5 rounded-card transition-colors shadow-sm"
        >
          <PlusCircle className="w-4 h-4 mr-2" aria-hidden="true" />
          Publier une réalisation
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

      {/* Formulaire de publication */}
      {editingId !== null && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-card-lg p-6 sm:p-8 border border-line-subtle shadow-md space-y-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-content-primary">
              {editingId ? 'Modifier la réalisation' : 'Nouvelle réalisation'}
            </h2>
            <button type="button" onClick={closeForm} aria-label="Fermer" className="text-content-muted hover:text-content-primary">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="title" className={labelClass}>Titre du projet *</label>
              <input
                id="title"
                required
                maxLength={150}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ex : Vidéosurveillance 16 caméras HD"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="clientName" className={labelClass}>Client</label>
              <input
                id="clientName"
                maxLength={150}
                value={form.clientName}
                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                placeholder="Ex : Établissements ABC"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="serviceCategory" className={labelClass}>Service *</label>
            <select
              id="serviceCategory"
              value={form.serviceCategory}
              onChange={(e) => setForm({ ...form, serviceCategory: e.target.value })}
              className={inputClass}
            >
              {servicesData.map((s) => (
                <option key={s.id} value={s.title}>{s.title}</option>
              ))}
              {!servicesData.some((s) => s.title === form.serviceCategory) && (
                <option value={form.serviceCategory}>{form.serviceCategory}</option>
              )}
            </select>
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>Description *</label>
            <textarea
              id="description"
              required
              rows={4}
              maxLength={2000}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Ce qui a été livré, pour qui, avec quel résultat…"
              className={`${inputClass} resize-y`}
            />
          </div>

          <div>
            <span className={labelClass}>Photo</span>
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
                  {form.imageUrl ? 'Changer la photo' : 'Choisir une photo'}
                  <input type="file" accept="image/*" onChange={handleImage} className="sr-only" />
                </label>
                {form.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, imageUrl: undefined })}
                    className="block text-xs font-semibold text-red-700 hover:underline"
                  >
                    Retirer la photo
                  </button>
                )}
                <p className="text-xs text-content-muted">La photo est redimensionnée automatiquement.</p>
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
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-card-lg p-10 border border-dashed border-slate-300 text-center text-sm text-content-muted">
          Aucune réalisation publiée. Le site affiche pour l’instant les exemples par défaut.
          <br />
          Cliquez sur <strong>« Publier une réalisation »</strong> pour ajouter la première.
        </div>
      ) : (
        <ul className="space-y-3">
          {projects.map((p) => (
            <li
              key={p.id}
              className="bg-white rounded-card p-4 border border-line-subtle shadow-xs flex items-center gap-4"
            >
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imageUrl} alt="" className="w-20 h-16 object-cover rounded-card-sm shrink-0" />
              ) : (
                <div className="w-20 h-16 rounded-card-sm bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                  <ImageIcon className="w-6 h-6" aria-hidden="true" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-content-primary truncate">{p.title}</p>
                <p className="text-xs text-content-muted truncate">
                  {p.serviceCategory}
                  {p.clientName && ` · ${p.clientName}`}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => openEdit(p)}
                  aria-label={`Modifier ${p.title}`}
                  className="p-2 rounded-card-sm text-content-secondary hover:bg-slate-100 hover:text-content-primary"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p)}
                  aria-label={`Supprimer ${p.title}`}
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
}
