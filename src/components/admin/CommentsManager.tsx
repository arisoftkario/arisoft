'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Trash2, CheckCircle2, AlertTriangle, Loader2, ExternalLink, Megaphone, Briefcase } from 'lucide-react';
import { type Comment, deleteComment, fetchAllComments, postAnchor } from '@/lib/engagement';
import { fetchAds } from '@/lib/ads';
import { fetchProjects } from '@/lib/projects';
import { withBasePath } from '@/lib/basePath';
import { errorMessage } from '@/components/admin/ui';

function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export const CommentsManager: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  // Titre de chaque publication, pour savoir où le commentaire a été laissé
  const [titles, setTitles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [all, ads, projects] = await Promise.all([fetchAllComments(), fetchAds(), fetchProjects()]);
      setComments(all);
      setTitles(Object.fromEntries([...ads, ...projects].map((p) => [p.id, p.title])));
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

  const handleDelete = async (c: Comment) => {
    if (!window.confirm(`Supprimer le commentaire de « ${c.name} » ?`)) return;
    try {
      await deleteComment(c.id);
      setNotice('Commentaire supprimé.');
      setTimeout(() => setNotice(''), 3500);
      setComments((list) => list.filter((x) => x.id !== c.id));
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-content-primary">Commentaires</h2>
        <p className="text-sm text-content-muted">
          Les commentaires des visiteurs sont publiés immédiatement. Supprimez ici ceux qui sont indésirables (publicité,
          insultes…).
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
      ) : comments.length === 0 ? (
        <div className="bg-white rounded-card-lg p-10 border border-dashed border-slate-300 text-center text-sm text-content-muted">
          Aucun commentaire pour l’instant.
        </div>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => {
            const isAd = c.targetType === 'publicites';
            const Icon = isAd ? Megaphone : Briefcase;
            const href = withBasePath(`/${c.targetType}/#${postAnchor(c.targetType, c.targetId)}`);
            return (
              <li key={c.id} className="bg-white rounded-card p-4 sm:p-5 border border-line-subtle shadow-xs flex items-start gap-4">
                <div className="flex-1 min-w-0 space-y-1">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-brand-green hover:underline inline-flex items-center gap-1"
                  >
                    <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                    {isAd ? 'Publicité' : 'Réalisation'} : {titles[c.targetId] ?? 'publication supprimée'}
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                  <p className="text-sm text-content-secondary whitespace-pre-line break-words">« {c.message} »</p>
                  <p className="text-xs text-content-muted">
                    <span className="font-bold text-content-primary">{c.name}</span> · {formatDate(c.createdAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(c)}
                  aria-label={`Supprimer le commentaire de ${c.name}`}
                  className="p-2 rounded-card-sm text-red-600 hover:bg-red-50 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
