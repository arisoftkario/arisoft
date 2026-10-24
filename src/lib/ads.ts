import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore/lite';
import { db } from '@/lib/firebase';
import { withBasePath } from '@/lib/basePath';

const COLLECTION = 'publicites';
const LIKED_KEY = 'arisoft_liked_ads';

export interface Ad {
  id: string;
  title: string;
  description: string;
  /** Petit badge mis en avant (ex : « -20 % », « Nouveau »). */
  badge: string;
  /** Photo (data URL JPEG compressée), vide si aucune. */
  imageUrl: string;
  likes: number;
  /** Date de publication en millisecondes. */
  createdAt: number;
}

export type AdInput = Pick<Ad, 'title' | 'description' | 'badge' | 'imageUrl'>;

function requireDb() {
  if (!db) throw new Error('Firebase n’est pas configuré (.env.local manquant).');
  return db;
}

export async function fetchAds(): Promise<Ad[]> {
  const snapshot = await getDocs(
    query(collection(requireDb(), COLLECTION), orderBy('createdAt', 'desc'))
  );
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title ?? '',
      description: data.description ?? '',
      badge: data.badge ?? '',
      imageUrl: data.imageUrl ?? '',
      likes: typeof data.likes === 'number' ? data.likes : 0,
      createdAt: data.createdAt?.toMillis?.() ?? 0,
    };
  });
}

export async function createAd(input: AdInput): Promise<void> {
  await addDoc(collection(requireDb(), COLLECTION), {
    ...input,
    likes: 0,
    createdAt: serverTimestamp(),
  });
}

export async function updateAd(id: string, input: AdInput): Promise<void> {
  await updateDoc(doc(requireDb(), COLLECTION, id), { ...input });
}

export async function deleteAd(id: string): Promise<void> {
  await deleteDoc(doc(requireDb(), COLLECTION, id));
}

/** Ajoute (+1) ou retire (-1) un « J'aime ». Les règles Firestore n'autorisent que ce champ. */
export async function changeAdLikes(id: string, delta: 1 | -1): Promise<void> {
  await updateDoc(doc(requireDb(), COLLECTION, id), { likes: increment(delta) });
}

// « J'aime » mémorisés sur l'appareil du visiteur (un seul par publicité et par navigateur).
export function getLikedAds(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(LIKED_KEY) || '[]'));
  } catch {
    return new Set();
  }
}

export function saveLikedAds(ids: Set<string>): void {
  try {
    localStorage.setItem(LIKED_KEY, JSON.stringify([...ids]));
  } catch {
    // Stockage indisponible (navigation privée) : le J'aime reste valable pour la session.
  }
}

export function adShareUrl(id: string): string {
  return `${window.location.origin}${withBasePath('/publicites/')}#pub-${id}`;
}
