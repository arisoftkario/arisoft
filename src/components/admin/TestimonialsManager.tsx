'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Trash2, CheckCircle2, AlertTriangle, Loader2, Eye, EyeOff, ExternalLink } from 'lucide-react';
import {
  type Testimonial,
  deleteTestimonial,
  fetchAllTestimonials,
  setTestimonialApproved,
} from '@/lib/testimonials';
import { withBasePath } from '@/lib/basePath';
import { Stars } from '@/components/shared/Testimonials';
import { errorMessage } from '@/components/admin/ui';

function formatDate(ms: number): string {
  if (!ms) return '';
  return new Date(ms).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export const TestimonialsManager: React.FC = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await fetchAllTestimonials());
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

  const toggleApproved = async (t: Testimonial) => {
    setBusyId(t.id);
    try {
      await setTestimonialApproved(t.id, !t.approved);
      flash(t.approved ? 'Avis masqué du site.' : 'Avis publié ! Il est maintenant visible sur le site.');
      await reload();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (t: Testimonial) => {
    if (!window.confirm(`Supprimer définitivement l’avis de « ${t.name} » ?`)) return;
    try {
      await deleteTestimonial(t.id);
      flash('Avis supprimé.');
      await reload();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const pending = items.filter((t) => !t.approved).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-content-primary">
          Avis clients
          {pending > 0 && (
            <span className="ml-2 align-middle px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
              {pending} en attente
            </span>
          )}
        </h2>
        <p className="text-sm text-content-muted">
          Envoyés par vos clients depuis la page{' '}
          <a href={withBasePath('/avis/')} target="_blank" rel="noopener noreferrer" className="text-brand-green font-semibold hover:underline inline-flex items-center gap-0.5">
            Avis <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
          . Un avis n’apparaît sur le site qu’après avoir cliqué sur « Publier ».
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
      ) : items.length === 0 ? (
        <div className="bg-white rounded-card-lg p-10 border border-dashed border-slate-300 text-center text-sm text-content-muted">
          Aucun avis pour l’instant. La section « Avis clients » de l’accueil reste masquée.
          <br />
          Envoyez le lien <strong>arisoft.vercel.app/avis/</strong> à vos clients satisfaits (WhatsApp, SMS…).
        </div>
      ) : (
        <ul className="space-y-3">
          {/* En attente d'abord */}
          {[...items].sort((a, b) => Number(a.approved) - Number(b.approved)).map((t) => (
            <li
              key={t.id}
              className={`bg-white rounded-card p-4 sm:p-5 border shadow-xs ${t.approved ? 'border-line-subtle' : 'border-amber-300'}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Stars rating={t.rating} />
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        t.approved ? 'bg-brand-green-pale text-brand-green' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {t.approved ? 'Publié' : 'En attente'}
                    </span>
                    <span className="text-xs text-content-muted">{formatDate(t.createdAt)}</span>
                  </div>
                  <p className="text-sm text-content-secondary whitespace-pre-line">« {t.message} »</p>
                  <p className="text-sm font-bold text-content-primary">
                    {t.name}
                    {t.company && <span className="font-normal text-content-muted"> · {t.company}</span>}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleApproved(t)}
                    disabled={busyId === t.id}
                    className={`inline-flex items-center font-bold text-xs px-3 py-2 rounded-card-sm transition-colors disabled:opacity-60 ${
                      t.approved
                        ? 'text-content-secondary bg-white border border-line-subtle hover:border-slate-400'
                        : 'text-white bg-brand-green hover:bg-brand-green-hover'
                    }`}
                  >
                    {busyId === t.id ? (
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" aria-hidden="true" />
                    ) : t.approved ? (
                      <EyeOff className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                    ) : (
                      <Eye className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                    )}
                    {t.approved ? 'Masquer' : 'Publier'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(t)}
                    aria-label={`Supprimer l’avis de ${t.name}`}
                    className="p-2 rounded-card-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
