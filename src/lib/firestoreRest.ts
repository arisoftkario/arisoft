// Lecture publique de Firestore côté serveur (API REST), avec cache rafraîchi chaque minute :
// les pages restent générées par le serveur (bon pour Google) et suivent les modifications de l'admin.

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

/** Délai de rafraîchissement des pages après une modification dans l'admin (secondes). */
export const REVALIDATE_SECONDS = 60;

interface RestValue {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  timestampValue?: string;
  arrayValue?: { values?: RestValue[] };
  mapValue?: { fields?: Record<string, RestValue> };
}

function decode(v: RestValue): unknown {
  if (v.stringValue !== undefined) return v.stringValue;
  if (v.integerValue !== undefined) return Number(v.integerValue);
  if (v.doubleValue !== undefined) return v.doubleValue;
  if (v.booleanValue !== undefined) return v.booleanValue;
  if (v.timestampValue !== undefined) return v.timestampValue;
  if (v.arrayValue) return (v.arrayValue.values ?? []).map(decode);
  if (v.mapValue) return decodeFields(v.mapValue.fields);
  return null;
}

function decodeFields(fields: Record<string, RestValue> = {}): Record<string, unknown> {
  return Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, decode(v)]));
}

export interface RestDoc {
  id: string;
  data: Record<string, unknown>;
}

/** Documents d'une collection publique ; null si Firebase est absent ou injoignable. */
export async function readCollection(name: string): Promise<RestDoc[] | null> {
  if (!PROJECT_ID || !API_KEY) return null;
  try {
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${name}?pageSize=300&key=${API_KEY}`,
      { next: { revalidate: REVALIDATE_SECONDS } }
    );
    if (!response.ok) return null;
    const json = await response.json();
    return (json.documents ?? []).map((d: { name: string; fields?: Record<string, RestValue> }) => ({
      id: d.name.split('/').pop() ?? '',
      data: decodeFields(d.fields),
    }));
  } catch {
    return null;
  }
}
