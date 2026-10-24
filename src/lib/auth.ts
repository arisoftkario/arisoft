import { getAuth, type Auth } from 'firebase/auth';
import { app } from '@/lib/firebase';

// Séparé de firebase.ts pour ne charger l'authentification que sur la page admin.
export const auth: Auth | null = app ? getAuth(app) : null;
