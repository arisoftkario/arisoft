import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore/lite';
import { db } from '@/lib/firebase';
import { readImages } from '@/lib/media';

const COLLECTION = 'publicites';

export interface Ad {
  id: string;
  title: string;
  description: string;
  /** Petit badge mis en avant (ex : « -20 % », « Nouveau »). */
  badge: string;
  /** Jusqu'à 4 photos (data URL JPEG compressées). */
  images: string[];
  /** Lien d'une vidéo TikTok, YouTube ou Facebook, vide si aucune. */
  videoUrl: string;
  likes: number;
  /** Date de publication en millisecondes. */
  createdAt: number;
}

export type AdInput = Pick<Ad, 'title' | 'description' | 'badge' | 'images' | 'videoUrl'>;

function requireDb() {
  if (!db) throw new Error('Firebase n’est pas configuré (.env.local manquant).');
  return db;
}

export async function fetchAds(max?: number): Promise<Ad[]> {
  const base = query(collection(requireDb(), COLLECTION), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(max ? query(base, limit(max)) : base);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title ?? '',
      description: data.description ?? '',
      badge: data.badge ?? '',
      images: readImages(data),
      videoUrl: data.videoUrl ?? '',
      likes: typeof data.likes === 'number' ? data.likes : 0,
      createdAt: data.createdAt?.toMillis?.() ?? 0,
    };
  });
}

export async function createAd(input: AdInput): Promise<string> {
  const ref = await addDoc(collection(requireDb(), COLLECTION), {
    ...input,
    // Ancien champ à photo unique : laissé vide (les photos sont dans « images »)
    imageUrl: '',
    likes: 0,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateAd(id: string, input: AdInput): Promise<void> {
  await updateDoc(doc(requireDb(), COLLECTION, id), { ...input, imageUrl: '' });
}

export async function deleteAd(id: string): Promise<void> {
  await deleteDoc(doc(requireDb(), COLLECTION, id));
}

// --- Signalement des nouvelles publicités (pastille verte, badge de l'icône) ---

const LAST_SEEN_KEY = 'arisoft_last_seen_ad';
export const NEW_ADS_EVENT = 'arisoft:new-ads';

export function getLastSeenAd(): number | null {
  try {
    const v = localStorage.getItem(LAST_SEEN_KEY);
    return v === null ? null : Number(v);
  } catch {
    return null;
  }
}

/** Marque toutes les publicités comme vues : retire la pastille et le badge de l'icône. */
export function markAdsSeen(ads: Ad[]): void {
  const newest = ads.reduce((max, ad) => Math.max(max, ad.createdAt), 0);
  try {
    if (newest > (getLastSeenAd() ?? 0)) localStorage.setItem(LAST_SEEN_KEY, String(newest));
  } catch {
    // Stockage indisponible
  }
  announceNewAds(0);
}

/** Informe l'en-tête et l'icône de l'application installée du nombre de nouveautés. */
export function announceNewAds(count: number): void {
  window.dispatchEvent(new CustomEvent(NEW_ADS_EVENT, { detail: count }));
  const nav = navigator as Navigator & {
    setAppBadge?: (n?: number) => Promise<void>;
    clearAppBadge?: () => Promise<void>;
  };
  if (count > 0) nav.setAppBadge?.(count).catch(() => {});
  else nav.clearAppBadge?.().catch(() => {});
}
