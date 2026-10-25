import { auth } from '@/lib/auth';
import { withBasePath } from '@/lib/basePath';

// Envoi des notifications par l'admin (séparé de push.ts pour ne pas charger
// l'authentification Firebase sur les pages publiques).

export interface NotifyResult {
  sent: number;
  failed: number;
}

/** Admin : prévient tous les abonnés d'une nouvelle publication. */
export async function notifySubscribers(title: string, body: string, path: string): Promise<NotifyResult> {
  const user = auth?.currentUser;
  if (!user) throw new Error('Connectez-vous pour envoyer une notification.');
  const response = await fetch(withBasePath('/api/notify/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await user.getIdToken()}` },
    body: JSON.stringify({ title, body, url: withBasePath(path) }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'L’envoi des notifications a échoué.');
  return data as NotifyResult;
}

/**
 * Prévient les abonnés après une publication et renvoie la fin du message de
 * confirmation. Une erreur d'envoi n'annule pas la publication : elle est signalée.
 */
export async function announcePublication(title: string, body: string, path: string): Promise<string> {
  try {
    const { sent } = await notifySubscribers(title, body, path);
    return sent === 0
      ? ' Aucun abonné à prévenir pour le moment.'
      : ` Notification envoyée à ${sent} abonné${sent > 1 ? 's' : ''}.`;
  } catch (err) {
    return ` (Notification non envoyée : ${err instanceof Error ? err.message : 'erreur inconnue'})`;
  }
}
