import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore/lite';
import { db } from '@/lib/firebase';
import { withBasePath } from '@/lib/basePath';

/** Collections dont les publications peuvent être aimées, partagées et commentées. */
export type PostType = 'publicites' | 'realisations';

const COMMENTS = 'commentaires';
const NAME_KEY = 'arisoft_comment_name';

// Ancienne clé conservée pour les publicités : les « J'aime » déjà donnés restent mémorisés.
const LIKED_KEYS: Record<PostType, string> = {
  publicites: 'arisoft_liked_ads',
  realisations: 'arisoft_liked_realisations',
};

// Ancre de chaque publication sur sa page (lien partagé).
const POST_PAGES: Record<PostType, { path: string; prefix: string }> = {
  publicites: { path: '/publicites/', prefix: 'pub-' },
  realisations: { path: '/realisations/', prefix: 'real-' },
};

function requireDb() {
  if (!db) throw new Error('Firebase n’est pas configuré (.env.local manquant).');
  return db;
}

export function postAnchor(type: PostType, id: string): string {
  return `${POST_PAGES[type].prefix}${id}`;
}

export function postShareUrl(type: PostType, id: string): string {
  return `${window.location.origin}${withBasePath(POST_PAGES[type].path)}#${postAnchor(type, id)}`;
}

// --- J'aime ---

/** Ajoute (+1) ou retire (-1) un « J'aime ». Les règles Firestore n'autorisent que ce champ. */
export async function changeLikes(type: PostType, id: string, delta: 1 | -1): Promise<void> {
  await updateDoc(doc(requireDb(), type, id), { likes: increment(delta) });
}

// « J'aime » mémorisés sur l'appareil du visiteur (un seul par publication et par navigateur).
export function getLiked(type: PostType): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(LIKED_KEYS[type]) || '[]'));
  } catch {
    return new Set();
  }
}

export function saveLiked(type: PostType, ids: Set<string>): void {
  try {
    localStorage.setItem(LIKED_KEYS[type], JSON.stringify([...ids]));
  } catch {
    // Stockage indisponible (navigation privée) : le J'aime reste valable pour la session.
  }
}

// --- Commentaires ---

export interface Comment {
  id: string;
  targetType: PostType;
  targetId: string;
  name: string;
  message: string;
  /** Date en millisecondes. */
  createdAt: number;
}

function toComment(id: string, data: Record<string, unknown>): Comment {
  const createdAt = data.createdAt as { toMillis?: () => number } | undefined;
  return {
    id,
    targetType: data.targetType as PostType,
    targetId: (data.targetId as string) ?? '',
    name: (data.name as string) ?? '',
    message: (data.message as string) ?? '',
    createdAt: createdAt?.toMillis?.() ?? Date.now(),
  };
}

const oldestFirst = (a: Comment, b: Comment) => a.createdAt - b.createdAt;

/** Commentaires d'un type de publication, regroupés par publication (une seule lecture par fil). */
export async function fetchComments(type: PostType): Promise<Record<string, Comment[]>> {
  const snapshot = await getDocs(query(collection(requireDb(), COMMENTS), where('targetType', '==', type)));
  const byPost: Record<string, Comment[]> = {};
  for (const d of snapshot.docs) {
    const c = toComment(d.id, d.data());
    (byPost[c.targetId] ??= []).push(c);
  }
  Object.values(byPost).forEach((list) => list.sort(oldestFirst));
  return byPost;
}

/** Tous les commentaires, du plus récent au plus ancien (admin). */
export async function fetchAllComments(): Promise<Comment[]> {
  const snapshot = await getDocs(collection(requireDb(), COMMENTS));
  return snapshot.docs.map((d) => toComment(d.id, d.data())).sort((a, b) => b.createdAt - a.createdAt);
}

export async function addComment(type: PostType, targetId: string, name: string, message: string): Promise<Comment> {
  const ref = await addDoc(collection(requireDb(), COMMENTS), {
    targetType: type,
    targetId,
    name,
    message,
    createdAt: serverTimestamp(),
  });
  return { id: ref.id, targetType: type, targetId, name, message, createdAt: Date.now() };
}

export async function deleteComment(id: string): Promise<void> {
  await deleteDoc(doc(requireDb(), COMMENTS, id));
}

/** Nom du visiteur, retenu pour ses prochains commentaires. */
export function getCommentName(): string {
  try {
    return localStorage.getItem(NAME_KEY) ?? '';
  } catch {
    return '';
  }
}

export function saveCommentName(name: string): void {
  try {
    localStorage.setItem(NAME_KEY, name);
  } catch {
    // Stockage indisponible
  }
}
