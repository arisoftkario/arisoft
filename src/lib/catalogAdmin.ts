import { collection, doc, getDocs, writeBatch } from 'firebase/firestore/lite';
import { db } from '@/lib/firebase';
import { clientLogos, servicesData } from '@/data/content';
import { ServiceItem, ClientItem } from '@/types';
import { byOrder, toClient, toService } from '@/lib/catalog';

// Gestion du catalogue des services et des clients depuis l'admin.
// Tant que rien n'est importé, le site affiche les contenus écrits dans src/data/content.ts.

const SERVICES = 'catalogue';
const CLIENTS = 'clients';

function requireDb() {
  if (!db) throw new Error('Firebase n’est pas configuré (.env.local manquant).');
  return db;
}

export interface Loaded<T> {
  items: T[];
  /** false : rien dans Firebase, les éléments affichés viennent du code. */
  imported: boolean;
}

// --- Services ---

export async function fetchCatalog(): Promise<Loaded<ServiceItem>> {
  const snapshot = await getDocs(collection(requireDb(), SERVICES));
  if (snapshot.empty) return { items: servicesData, imported: false };
  return { items: snapshot.docs.map((d) => toService(d.id, d.data())).sort(byOrder), imported: true };
}

/** Titres des services pour les listes déroulantes de l'admin (catalogue du code en secours). */
export async function fetchServiceTitles(): Promise<string[]> {
  try {
    return (await fetchCatalog()).items.map((s) => s.title);
  } catch {
    return servicesData.map((s) => s.title);
  }
}

function serviceFields(s: ServiceItem, order: number) {
  return {
    title: s.title,
    slug: s.slug,
    shortDescription: s.shortDescription,
    fullDescription: s.fullDescription,
    iconName: s.iconName,
    features: s.features.slice(0, 8),
    ctaLabel: s.ctaLabel ?? '',
    order,
  };
}

/** Copie le catalogue écrit dans le code vers Firebase pour pouvoir le modifier. */
export async function importCatalog(): Promise<void> {
  const batch = writeBatch(requireDb());
  servicesData.forEach((s, i) => batch.set(doc(requireDb(), SERVICES, s.id), serviceFields(s, i)));
  await batch.commit();
}

export async function saveService(s: ServiceItem): Promise<void> {
  const batch = writeBatch(requireDb());
  batch.set(doc(requireDb(), SERVICES, s.id), serviceFields(s, s.order ?? 0));
  await batch.commit();
}

/** Supprime un service ainsi que ses photos. */
export async function deleteService(id: string): Promise<void> {
  const batch = writeBatch(requireDb());
  batch.delete(doc(requireDb(), SERVICES, id));
  batch.delete(doc(requireDb(), 'services', id));
  batch.delete(doc(requireDb(), 'servicesMedias', id));
  await batch.commit();
}

/** Enregistre un nouvel ordre d'affichage (position dans la liste). */
export async function reorderServices(items: ServiceItem[]): Promise<void> {
  const batch = writeBatch(requireDb());
  items.forEach((s, i) => batch.set(doc(requireDb(), SERVICES, s.id), serviceFields(s, i)));
  await batch.commit();
}

// --- Clients ---

export async function fetchClients(): Promise<Loaded<ClientItem>> {
  const snapshot = await getDocs(collection(requireDb(), CLIENTS));
  if (snapshot.empty) return { items: clientLogos, imported: false };
  return { items: snapshot.docs.map((d) => toClient(d.id, d.data())).sort(byOrder), imported: true };
}

function clientFields(c: ClientItem, order: number) {
  return { name: c.name, activity: c.activity, location: c.location, logo: c.logo, order };
}

export async function importClients(): Promise<void> {
  const batch = writeBatch(requireDb());
  clientLogos.forEach((c, i) => batch.set(doc(requireDb(), CLIENTS, c.id), clientFields(c, i)));
  await batch.commit();
}

export async function saveClient(c: ClientItem): Promise<void> {
  const batch = writeBatch(requireDb());
  batch.set(doc(requireDb(), CLIENTS, c.id), clientFields(c, c.order ?? 0));
  await batch.commit();
}

export async function deleteClient(id: string): Promise<void> {
  const batch = writeBatch(requireDb());
  batch.delete(doc(requireDb(), CLIENTS, id));
  await batch.commit();
}

export async function reorderClients(items: ClientItem[]): Promise<void> {
  const batch = writeBatch(requireDb());
  items.forEach((c, i) => batch.set(doc(requireDb(), CLIENTS, c.id), clientFields(c, i)));
  await batch.commit();
}
