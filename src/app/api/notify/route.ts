import webpush from 'web-push';
import { companyInfo } from '@/data/content';

// Envoie une notification à tous les abonnés (appelé par l'admin après une publication).
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const FIRESTORE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

interface Subscriber {
  /** Chemin complet du document Firestore (pour le supprimer s'il a expiré). */
  name: string;
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

const json = (data: unknown, status = 200) => Response.json(data, { status });

const text = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

export async function POST(request: Request) {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey || !PROJECT_ID) {
    return json({ error: 'Notifications non configurées : clés VAPID absentes des variables Vercel.' }, 500);
  }

  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return json({ error: 'Connexion admin requise.' }, 401);

  const input = await request.json().catch(() => ({}));
  const title = text(input.title, 120);
  const body = text(input.body, 200);
  const url = text(input.url, 300);
  if (!title || !url.startsWith('/')) return json({ error: 'Notification invalide.' }, 400);

  // Lecture des abonnés avec le jeton de l'admin : les règles Firestore la refusent à tout autre compte.
  const subscribers: Subscriber[] = [];
  let pageToken = '';
  do {
    const response = await fetch(
      `${FIRESTORE}/abonnes?pageSize=300${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.status === 401 || response.status === 403) {
      return json({ error: 'Accès refusé : seul un administrateur peut envoyer des notifications.' }, 403);
    }
    if (!response.ok) return json({ error: 'Impossible de lire la liste des abonnés.' }, 502);
    const page = await response.json();
    for (const d of page.documents ?? []) {
      const f = d.fields ?? {};
      if (!f.endpoint?.stringValue) continue;
      subscribers.push({
        name: d.name,
        endpoint: f.endpoint.stringValue,
        keys: { p256dh: f.p256dh?.stringValue ?? '', auth: f.auth?.stringValue ?? '' },
      });
    }
    pageToken = page.nextPageToken ?? '';
  } while (pageToken);

  webpush.setVapidDetails(`mailto:${companyInfo.email}`, publicKey, privateKey);
  const payload = JSON.stringify({ title, body, url });

  const results = await Promise.allSettled(
    subscribers.map((s) => webpush.sendNotification({ endpoint: s.endpoint, keys: s.keys }, payload, { TTL: 86_400 }))
  );

  // Abonnements expirés (navigateur désinstallé, notifications retirées) : on les supprime
  const expired = subscribers.filter((s, i) => {
    const r = results[i];
    return r.status === 'rejected' && [404, 410].includes((r.reason as { statusCode?: number }).statusCode ?? 0);
  });
  await Promise.allSettled(
    expired.map((s) =>
      fetch(`https://firestore.googleapis.com/v1/${s.name}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
    )
  );

  const sent = results.filter((r) => r.status === 'fulfilled').length;
  return json({ sent, failed: results.length - sent });
}
