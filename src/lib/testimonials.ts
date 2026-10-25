import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore/lite';
import { db } from '@/lib/firebase';

const COLLECTION = 'avis';

export interface Testimonial {
  id: string;
  name: string;
  /** Entreprise ou fonction du client, facultatif. */
  company: string;
  /** Note de 1 à 5 étoiles. */
  rating: number;
  message: string;
  /** Visible sur le site seulement après validation par un admin. */
  approved: boolean;
  /** Date d'envoi en millisecondes. */
  createdAt: number;
}

export type TestimonialInput = Pick<Testimonial, 'name' | 'company' | 'rating' | 'message'>;

function requireDb() {
  if (!db) throw new Error('Firebase n’est pas configuré (.env.local manquant).');
  return db;
}

function toTestimonial(id: string, data: Record<string, unknown>): Testimonial {
  const createdAt = data.createdAt as { toMillis?: () => number } | undefined;
  return {
    id,
    name: (data.name as string) ?? '',
    company: (data.company as string) ?? '',
    rating: typeof data.rating === 'number' ? data.rating : 5,
    message: (data.message as string) ?? '',
    approved: data.approved === true,
    createdAt: createdAt?.toMillis?.() ?? 0,
  };
}

const newestFirst = (a: Testimonial, b: Testimonial) => b.createdAt - a.createdAt;

/** Avis validés, affichés au public (tri côté client : pas d'index composite à créer). */
export async function fetchApprovedTestimonials(): Promise<Testimonial[]> {
  const snapshot = await getDocs(
    query(collection(requireDb(), COLLECTION), where('approved', '==', true))
  );
  return snapshot.docs.map((d) => toTestimonial(d.id, d.data())).sort(newestFirst);
}

/** Tous les avis, y compris en attente (réservé aux admins). */
export async function fetchAllTestimonials(): Promise<Testimonial[]> {
  const snapshot = await getDocs(collection(requireDb(), COLLECTION));
  return snapshot.docs.map((d) => toTestimonial(d.id, d.data())).sort(newestFirst);
}

/** Avis envoyé par un visiteur : toujours en attente de validation. */
export async function submitTestimonial(input: TestimonialInput): Promise<void> {
  await addDoc(collection(requireDb(), COLLECTION), {
    ...input,
    approved: false,
    createdAt: serverTimestamp(),
  });
}

export async function setTestimonialApproved(id: string, approved: boolean): Promise<void> {
  await updateDoc(doc(requireDb(), COLLECTION, id), { approved });
}

export async function deleteTestimonial(id: string): Promise<void> {
  await deleteDoc(doc(requireDb(), COLLECTION, id));
}
