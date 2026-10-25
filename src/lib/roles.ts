import { FirebaseError } from 'firebase/app';
import { doc, getDoc } from 'firebase/firestore/lite';
import { db } from '@/lib/firebase';

/**
 * admin : tous les droits. agent : publie et modifie publicités, réalisations et photos
 * des services, sans rien supprimer ni gérer catalogue, clients, commentaires et avis.
 * Les règles Firestore appliquent les mêmes limites côté serveur.
 */
export type StaffRole = 'admin' | 'agent';

/** Rôle du compte connecté ; null s'il n'est pas dans la collection « admins ». */
export async function fetchStaffRole(uid: string): Promise<StaffRole | null> {
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, 'admins', uid));
    if (!snap.exists()) return null;
    return snap.data().role === 'agent' ? 'agent' : 'admin';
  } catch (err) {
    // Anciennes règles (lecture de « admins » interdite) : elles traitent encore tout compte comme admin
    if (err instanceof FirebaseError && err.code === 'permission-denied') return 'admin';
    throw err;
  }
}
