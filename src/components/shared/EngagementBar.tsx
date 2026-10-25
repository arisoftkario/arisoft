'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Heart, UserPlus, UserCheck, Share2, MessageCircle, Link2, Check, Facebook, Send, Loader2, Bell, BellOff } from 'lucide-react';
import { isFirebaseConfigured } from '@/lib/firebase';
import {
  type Comment,
  type PostType,
  addComment,
  changeLikes,
  fetchComments,
  getCommentName,
  getLiked,
  postShareUrl,
  saveCommentName,
  saveLiked,
} from '@/lib/engagement';
import { needsIosInstall, subscribeToPush, unsubscribeFromPush } from '@/lib/push';
import { usePushState } from '@/components/shared/FollowButton';
import { socialNetworks } from '@/components/shared/SocialLinks';
import { WhatsAppIcon } from '@/components/shared/WhatsAppIcon';

/** Commentaires d'un fil (publicités ou réalisations), chargés une seule fois pour toutes les cartes. */
export function useComments(type: PostType, enabled = true) {
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  useEffect(() => {
    if (!enabled || !isFirebaseConfigured) return;
    fetchComments(type)
      .then(setComments)
      .catch(() => setComments({}));
  }, [type, enabled]);

  const addLocal = useCallback((c: Comment) => {
    setComments((all) => ({ ...all, [c.targetId]: [...(all[c.targetId] ?? []), c] }));
  }, []);

  return { comments, addLocal };
}

function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface EngagementBarProps {
  type: PostType;
  postId: string;
  title: string;
  likes: number;
  comments: Comment[];
  onCommentAdded: (c: Comment) => void;
}

type Panel = 'follow' | 'share' | 'comments' | null;

/** J'aime, Suivre, Partager et Commenter sous une publication. */
export const EngagementBar: React.FC<EngagementBarProps> = ({
  type,
  postId,
  title,
  likes,
  comments,
  onCommentAdded,
}) => {
  const [count, setCount] = useState(likes);
  const [isLiked, setIsLiked] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [copied, setCopied] = useState(false);

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const [pushState, setPushState] = usePushState();
  const [pushBusy, setPushBusy] = useState(false);
  const following = pushState === 'subscribed';

  const follow = async () => {
    setPushBusy(true);
    try {
      setPushState(await subscribeToPush());
    } catch {
      setPushState('unsupported');
    } finally {
      setPushBusy(false);
    }
  };

  const unfollow = async () => {
    setPushBusy(true);
    try {
      setPushState(await unsubscribeFromPush());
    } finally {
      setPushBusy(false);
    }
  };

  useEffect(() => {
    setIsLiked(getLiked(type).has(postId));
    setName(getCommentName());
  }, [type, postId]);

  const toggle = (p: Panel) => setPanel((current) => (current === p ? null : p));

  const toggleLike = async () => {
    const delta = isLiked ? -1 : 1;
    // Mise à jour immédiate à l'écran, annulée si Firebase refuse
    setIsLiked(!isLiked);
    setCount((c) => c + delta);
    try {
      await changeLikes(type, postId, delta);
      const ids = getLiked(type);
      if (delta === 1) ids.add(postId);
      else ids.delete(postId);
      saveLiked(type, ids);
    } catch {
      setIsLiked(isLiked);
      setCount((c) => c - delta);
    }
  };

  const share = async () => {
    const url = postShareUrl(type, postId);
    if (navigator.share) {
      try {
        await navigator.share({ title, text: `${title} – ARISOFT`, url });
        return;
      } catch {
        // Partage annulé : on affiche le menu de secours
      }
    }
    toggle('share');
  };

  const copyLink = async () => {
    const url = postShareUrl(type, postId);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copiez ce lien :', url);
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const c = await addComment(type, postId, name.trim(), message.trim());
      saveCommentName(name.trim());
      onCommentAdded(c);
      setMessage('');
    } catch {
      setError('Impossible de publier le commentaire pour le moment. Vérifiez votre connexion et réessayez.');
    } finally {
      setSending(false);
    }
  };

  const buttonClass = (active: boolean) =>
    `flex flex-col items-center justify-center gap-0.5 py-2 rounded-card-sm text-xs font-bold transition-colors ${
      active ? 'bg-slate-100 text-content-primary' : 'text-content-secondary hover:bg-slate-100'
    }`;

  return (
    <div className="mt-4 pt-3 border-t border-line-subtle">
      <div className="grid grid-cols-4 gap-1">
        <button
          type="button"
          onClick={toggleLike}
          aria-pressed={isLiked}
          className={`${buttonClass(false)} ${isLiked ? '!text-red-600 bg-red-50' : ''}`}
        >
          <span className="flex items-center gap-1">
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} aria-hidden="true" />
            {count > 0 && <span className="tabular-nums">{count}</span>}
          </span>
          J’aime
        </button>

        <button
          type="button"
          onClick={() => toggle('follow')}
          aria-expanded={panel === 'follow'}
          className={`${buttonClass(panel === 'follow')} ${following ? '!text-brand-green' : ''}`}
        >
          {following ? <UserCheck className="w-5 h-5" aria-hidden="true" /> : <UserPlus className="w-5 h-5" aria-hidden="true" />}
          {following ? 'Abonné' : 'Suivre'}
        </button>

        <button type="button" onClick={share} aria-expanded={panel === 'share'} className={buttonClass(panel === 'share')}>
          <Share2 className="w-5 h-5" aria-hidden="true" />
          Partager
        </button>

        <button type="button" onClick={() => toggle('comments')} aria-expanded={panel === 'comments'} className={buttonClass(panel === 'comments')}>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-5 h-5" aria-hidden="true" />
            {comments.length > 0 && <span className="tabular-nums">{comments.length}</span>}
          </span>
          Commenter
        </button>
      </div>

      {/* Suivre ARISOFT : notifications à chaque nouvelle publication, et réseaux sociaux */}
      {panel === 'follow' && (
        <div className="mt-3 space-y-3">
          <div className="rounded-card-sm bg-brand-green-pale/60 border border-green-200 p-3 text-center space-y-2">
            {following ? (
              <>
                <p className="text-sm font-bold text-brand-green flex items-center justify-center gap-1.5">
                  <Bell className="w-4 h-4" aria-hidden="true" />
                  Vous suivez ARISOFT
                </p>
                <p className="text-xs text-content-secondary">Vous recevrez une notification à chaque nouvelle publication.</p>
                <button
                  type="button"
                  onClick={unfollow}
                  disabled={pushBusy}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-content-muted hover:text-red-700 hover:underline"
                >
                  <BellOff className="w-3.5 h-3.5" aria-hidden="true" />
                  Ne plus suivre
                </button>
              </>
            ) : pushState === 'denied' ? (
              <p className="text-xs text-content-secondary">
                Les notifications sont bloquées pour ce site. Autorisez-les dans les réglages du navigateur (icône à
                gauche de l’adresse du site), puis réessayez.
              </p>
            ) : pushState === 'unsupported' ? (
              <p className="text-xs text-content-secondary">
                {needsIosInstall()
                  ? 'Sur iPhone : touchez Partager puis « Sur l’écran d’accueil », ouvrez ARISOFT depuis cette icône, puis touchez Suivre.'
                  : 'Ce navigateur ne permet pas de recevoir nos notifications. Suivez-nous plutôt sur nos réseaux ci-dessous.'}
              </p>
            ) : (
              <>
                <button
                  type="button"
                  onClick={follow}
                  disabled={pushBusy || pushState === null}
                  className="w-full inline-flex items-center justify-center gap-2 font-bold text-sm text-white bg-brand-green hover:bg-brand-green-hover disabled:opacity-60 py-2.5 rounded-card-sm transition-colors"
                >
                  {pushBusy ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Bell className="w-4 h-4" aria-hidden="true" />}
                  Suivre ARISOFT
                </button>
                <p className="text-xs text-content-secondary">
                  Recevez une notification à chaque nouvelle offre ou réalisation. Gratuit, sans inscription.
                </p>
              </>
            )}
          </div>

          <p className="text-xs text-content-muted text-center">Et sur nos réseaux :</p>
          <div className="grid grid-cols-2 gap-2">
            {socialNetworks.map(({ id, label, href, Icon, className }) => (
              <a
                key={id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-1.5 py-2 rounded-card-sm text-xs font-bold text-white transition ${className}`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Partage de secours (ordinateurs sans partage natif) */}
      {panel === 'share' && (
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-bold">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${title} – ${postShareUrl(type, postId)}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 py-2 rounded-card-sm bg-[#25D366]/10 text-[#128C4B] hover:bg-[#25D366]/20"
          >
            <WhatsAppIcon className="w-5 h-5" aria-hidden="true" />
            WhatsApp
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postShareUrl(type, postId))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 py-2 rounded-card-sm bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20"
          >
            <Facebook className="w-5 h-5" aria-hidden="true" />
            Facebook
          </a>
          <button
            type="button"
            onClick={copyLink}
            className="flex flex-col items-center gap-1 py-2 rounded-card-sm bg-slate-100 text-content-primary hover:bg-slate-200"
          >
            {copied ? <Check className="w-5 h-5 text-brand-green" aria-hidden="true" /> : <Link2 className="w-5 h-5" aria-hidden="true" />}
            {copied ? 'Copié !' : 'Copier le lien'}
          </button>
        </div>
      )}

      {/* Commentaires */}
      {panel === 'comments' && (
        <div className="mt-3 space-y-3">
          {comments.length === 0 ? (
            <p className="text-xs text-content-muted text-center">Soyez le premier à commenter.</p>
          ) : (
            <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {comments.map((c) => (
                <li key={c.id} className="bg-slate-50 rounded-card-sm px-3 py-2">
                  <p className="text-xs">
                    <span className="font-bold text-content-primary">{c.name}</span>
                    <span className="text-content-muted"> · {formatDate(c.createdAt)}</span>
                  </p>
                  <p className="text-sm text-content-secondary whitespace-pre-line break-words">{c.message}</p>
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={submitComment} className="space-y-2">
            <input
              required
              maxLength={60}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom"
              aria-label="Votre nom"
              className="w-full px-3 py-2 rounded-card-sm border border-line-subtle bg-slate-50 focus:bg-white focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm"
            />
            <div className="flex gap-2">
              <textarea
                required
                rows={2}
                maxLength={500}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Votre commentaire…"
                aria-label="Votre commentaire"
                className="flex-1 px-3 py-2 rounded-card-sm border border-line-subtle bg-slate-50 focus:bg-white focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm resize-none"
              />
              <button
                type="submit"
                disabled={sending}
                aria-label="Publier le commentaire"
                className="self-end w-10 h-10 shrink-0 rounded-full bg-brand-green hover:bg-brand-green-hover disabled:opacity-60 text-white flex items-center justify-center transition-colors"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Send className="w-4 h-4" aria-hidden="true" />}
              </button>
            </div>
            {error && <p className="text-xs font-semibold text-red-700">{error}</p>}
          </form>
        </div>
      )}
    </div>
  );
};
