import { FirebaseError } from 'firebase/app';

export function errorMessage(err: unknown): string {
  if (err instanceof FirebaseError) {
    switch (err.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
      case 'auth/invalid-email':
        return 'Email ou mot de passe incorrect.';
      case 'auth/too-many-requests':
        return 'Trop de tentatives. Réessayez dans quelques minutes.';
      case 'auth/network-request-failed':
      case 'unavailable':
        return 'Connexion internet indisponible.';
      case 'permission-denied':
        return 'Accès refusé par Firebase : ce compte est absent de la collection « admins », ou les règles Firestore ne sont pas à jour (recollez firestore.rules dans Firestore → Règles).';
    }
  }
  return err instanceof Error ? err.message : 'Une erreur inattendue est survenue.';
}

export const inputClass =
  'w-full px-4 py-3 rounded-card-sm border border-line-subtle text-content-primary bg-slate-50 focus:bg-white focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm transition-colors';
export const labelClass = 'block text-xs font-bold uppercase tracking-wider text-content-primary mb-1.5';
