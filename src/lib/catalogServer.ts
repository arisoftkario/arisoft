import { clientLogos, servicesData } from '@/data/content';
import { ServiceItem, ClientItem } from '@/types';
import { readCollection } from '@/lib/firestoreRest';
import { byOrder, toClient, toService } from '@/lib/catalog';

/** Catalogue des services : celui de l'admin, sinon celui du code (avant le premier import). */
export async function getServices(): Promise<ServiceItem[]> {
  const docs = await readCollection('catalogue');
  if (!docs || docs.length === 0) return servicesData;
  return docs.map((d) => toService(d.id, d.data)).sort(byOrder);
}

/** Entreprises qui font confiance à ARISOFT : celles de l'admin, sinon celles du code. */
export async function getClients(): Promise<ClientItem[]> {
  const docs = await readCollection('clients');
  if (!docs || docs.length === 0) return clientLogos;
  return docs.map((d) => toClient(d.id, d.data)).sort(byOrder);
}
