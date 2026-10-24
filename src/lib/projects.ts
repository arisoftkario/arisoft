import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore/lite';
import { db } from '@/lib/firebase';
import { ProjectItem } from '@/types';

const COLLECTION = 'realisations';

export type ProjectInput = Omit<ProjectItem, 'id' | 'imagePlaceholder'>;

function requireDb() {
  if (!db) throw new Error('Firebase n’est pas configuré (.env.local manquant).');
  return db;
}

export async function fetchProjects(): Promise<ProjectItem[]> {
  const snapshot = await getDocs(
    query(collection(requireDb(), COLLECTION), orderBy('createdAt', 'desc'))
  );
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title ?? '',
      clientName: data.clientName ?? '',
      serviceCategory: data.serviceCategory ?? '',
      description: data.description ?? '',
      imageUrl: data.imageUrl || undefined,
      imagePlaceholder: '[Photo du projet]',
    };
  });
}

export async function createProject(input: ProjectInput): Promise<void> {
  await addDoc(collection(requireDb(), COLLECTION), {
    ...input,
    imageUrl: input.imageUrl ?? '',
    createdAt: serverTimestamp(),
  });
}

export async function updateProject(id: string, input: ProjectInput): Promise<void> {
  await updateDoc(doc(requireDb(), COLLECTION, id), {
    ...input,
    imageUrl: input.imageUrl ?? '',
  });
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(requireDb(), COLLECTION, id));
}

/**
 * Redimensionne et compresse une photo en JPEG pour qu'elle tienne dans un
 * document Firestore (limite 1 Mo), sans avoir besoin de Firebase Storage.
 */
export async function compressImage(file: File, maxWidth = 1200): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Impossible de traiter l’image.');
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  // Réduit la qualité jusqu'à passer sous ~700 Ko
  for (const quality of [0.82, 0.7, 0.6, 0.5, 0.4]) {
    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    if (dataUrl.length < 700_000) return dataUrl;
  }
  throw new Error('Image trop lourde, même après compression. Essayez une photo plus petite.');
}
