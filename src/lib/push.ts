import { doc, serverTimestamp, setDoc } from 'firebase/firestore/lite';
import { db } from '@/lib/firebase';
import { withBasePath } from '@/lib/basePath';

// Abonnements aux notifications : un document par navigateur abonné.
const COLLECTION = 'abonnes';
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? '';

export type PushState = 'unsupported' | 'denied' | 'subscribed' | 'available';

export function isPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window &&
    Boolean(VAPID_PUBLIC_KEY) &&
    Boolean(db)
  );
}

/** iPhone/iPad : les notifications ne marchent que si le site est installé sur l'écran d'accueil. */
export function needsIosInstall(): boolean {
  if (typeof window === 'undefined') return false;
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const standalone = window.matchMedia('(display-mode: standalone)').matches;
  return ios && !standalone;
}

async function registration(): Promise<ServiceWorkerRegistration> {
  // En local (npm run dev), le service worker n'est pas encore enregistré
  return (await navigator.serviceWorker.getRegistration()) ?? navigator.serviceWorker.register(withBasePath('/sw.js'));
}

export async function getPushState(): Promise<PushState> {
  if (!isPushSupported()) return 'unsupported';
  if (Notification.permission === 'denied') return 'denied';
  const reg = await navigator.serviceWorker.getRegistration();
  const sub = await reg?.pushManager.getSubscription();
  return sub && Notification.permission === 'granted' ? 'subscribed' : 'available';
}

function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padded = (base64 + '='.repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

/** Identifiant stable d'un abonnement : empreinte de son adresse d'envoi (évite les doublons). */
async function subscriptionId(endpoint: string): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(endpoint));
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Demande l'autorisation puis enregistre l'abonnement. Renvoie le nouvel état. */
export async function subscribeToPush(): Promise<PushState> {
  if (!isPushSupported() || !db) return 'unsupported';
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return permission === 'denied' ? 'denied' : 'available';

  const reg = await registration();
  await navigator.serviceWorker.ready;
  const sub =
    (await reg.pushManager.getSubscription()) ??
    (await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    }));

  const json = sub.toJSON();
  try {
    await setDoc(doc(db, COLLECTION, await subscriptionId(sub.endpoint)), {
      endpoint: sub.endpoint,
      p256dh: json.keys?.p256dh ?? '',
      auth: json.keys?.auth ?? '',
      createdAt: serverTimestamp(),
    });
  } catch {
    // Déjà enregistré (les règles refusent la modification d'un abonnement existant)
  }
  return 'subscribed';
}

export async function unsubscribeFromPush(): Promise<PushState> {
  const reg = await navigator.serviceWorker.getRegistration();
  const sub = await reg?.pushManager.getSubscription();
  // Le serveur supprimera l'abonnement de Firestore au prochain envoi (adresse expirée)
  await sub?.unsubscribe();
  return 'available';
}
