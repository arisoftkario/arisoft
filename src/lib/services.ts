import { collection, doc, getDocs, serverTimestamp, writeBatch } from 'firebase/firestore/lite';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { compressImage } from '@/lib/projects';
import { readImages } from '@/lib/media';

// Deux collections : « services » ne contient qu'une miniature légère par service
// (seule chargée sur l'accueil), « servicesMedias » les photos complètes et la vidéo.
const COVERS = 'services';
const MEDIAS = 'servicesMedias';

/** Miniature de la carte d'accueil : ~60 Ko au lieu de ~200 Ko. */
const COVER_WIDTH = 640;
const COVER_MAX_CHARS = 60_000;

export interface ServiceMedia {
  images: string[];
  videoUrl: string;
}

function requireDb() {
  if (!db) throw new Error('Firebase n’est pas configuré (.env.local manquant).');
  return db;
}

// Une seule lecture par page, même si plusieurs composants les demandent.
let coversCache: Promise<Record<string, string>> | null = null;
let mediasCache: Promise<Record<string, ServiceMedia>> | null = null;

/** Miniatures par identifiant de service ; vide si Firebase est absent ou inaccessible. */
export function fetchServiceCovers(): Promise<Record<string, string>> {
  if (!isFirebaseConfigured) return Promise.resolve({});
  coversCache ??= getDocs(collection(requireDb(), COVERS))
    .then((snap) =>
      Object.fromEntries(
        snap.docs.filter((d) => typeof d.data().cover === 'string' && d.data().cover).map((d) => [d.id, d.data().cover as string])
      )
    )
    .catch(() => ({}));
  return coversCache;
}

/** Photos et vidéo par identifiant de service. */
export function fetchServiceMedias(): Promise<Record<string, ServiceMedia>> {
  if (!isFirebaseConfigured) return Promise.resolve({});
  mediasCache ??= getDocs(collection(requireDb(), MEDIAS))
    .then((snap) =>
      Object.fromEntries(
        snap.docs.map((d) => [d.id, { images: readImages(d.data()), videoUrl: d.data().videoUrl ?? '' }])
      )
    )
    .catch(() => ({}));
  return mediasCache;
}

/** Enregistre les photos d'un service et régénère sa miniature (admin). */
export async function saveServiceMedia(serviceId: string, media: ServiceMedia): Promise<void> {
  const cover = media.images[0]
    ? await compressImage(await (await fetch(media.images[0])).blob(), COVER_WIDTH, COVER_MAX_CHARS)
    : '';
  const batch = writeBatch(requireDb());
  batch.set(doc(requireDb(), COVERS, serviceId), { cover, updatedAt: serverTimestamp() });
  batch.set(doc(requireDb(), MEDIAS, serviceId), { ...media, updatedAt: serverTimestamp() });
  await batch.commit();
  coversCache = null;
  mediasCache = null;
}
