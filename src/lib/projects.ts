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
import { PHOTO_MAX_CHARS, readImages } from '@/lib/media';

const COLLECTION = 'realisations';

export type ProjectInput = Pick<ProjectItem, 'title' | 'clientName' | 'serviceCategory' | 'description'> & {
  images: string[];
  videoUrl: string;
};

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
      images: readImages(data),
      videoUrl: data.videoUrl ?? '',
      likes: typeof data.likes === 'number' ? data.likes : 0,
      imagePlaceholder: '',
    };
  });
}

export async function createProject(input: ProjectInput): Promise<string> {
  const ref = await addDoc(collection(requireDb(), COLLECTION), {
    ...input,
    // Ancien champ à photo unique : laissé vide (les photos sont dans « images »)
    imageUrl: '',
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProject(id: string, input: ProjectInput): Promise<void> {
  await updateDoc(doc(requireDb(), COLLECTION, id), {
    ...input,
    imageUrl: '',
  });
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(requireDb(), COLLECTION, id));
}

/**
 * Redimensionne et compresse une photo en JPEG pour que les 4 photos tiennent
 * ensemble dans un document Firestore (limite 1 Mo), sans Firebase Storage.
 */
export async function compressImage(
  file: Blob,
  maxWidth = 1000,
  maxChars = PHOTO_MAX_CHARS
): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Impossible de traiter l’image.');
  // Fond blanc : les logos PNG transparents ne deviennent pas noirs en JPEG
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  // Réduit la qualité jusqu'à passer sous la taille maximale (~200 Ko par défaut)
  for (const quality of [0.8, 0.7, 0.6, 0.5, 0.4, 0.3]) {
    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    if (dataUrl.length < maxChars) return dataUrl;
  }
  throw new Error('Image trop lourde, même après compression. Essayez une photo plus petite.');
}
