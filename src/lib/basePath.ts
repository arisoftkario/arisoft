// next/image n'ajoute pas le basePath aux images statiques : on le préfixe nous-mêmes.
export function withBasePath(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${path}`;
}
