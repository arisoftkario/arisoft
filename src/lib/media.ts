/** Nombre maximum de photos par publicité ou réalisation. */
export const MAX_PHOTOS = 4;

/**
 * Taille maximale d'une photo compressée (data URL). Les 4 photos et le texte
 * doivent tenir ensemble dans un document Firestore (limite 1 Mo).
 */
export const PHOTO_MAX_CHARS = 200_000;

export interface VideoEmbed {
  /** Adresse à charger dans l'iframe. */
  src: string;
  platform: 'YouTube' | 'TikTok' | 'Facebook';
  /** Vidéo au format portrait (TikTok, Shorts, Reels). */
  vertical: boolean;
}

/**
 * Transforme le lien d'une vidéo TikTok, YouTube ou Facebook en lecteur intégrable.
 * Renvoie null si le lien n'est pas reconnu : la vidéo est alors proposée en simple lien.
 */
export function videoEmbed(url: string | undefined): VideoEmbed | null {
  if (!url) return null;
  let u: URL;
  try {
    u = new URL(url.trim());
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^(www|m|vm|vt)\./, '');

  if (host === 'youtu.be' || host.endsWith('youtube.com')) {
    const shorts = u.pathname.match(/^\/(shorts|embed|live)\/([\w-]{6,})/);
    const id = host === 'youtu.be' ? u.pathname.slice(1) : shorts?.[2] ?? u.searchParams.get('v');
    if (!id) return null;
    return {
      src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
      platform: 'YouTube',
      vertical: shorts?.[1] === 'shorts',
    };
  }

  if (host.endsWith('tiktok.com')) {
    // Seul le lien complet contient le numéro de la vidéo (pas les liens courts vm.tiktok.com)
    const id = u.pathname.match(/\/video\/(\d+)/)?.[1];
    if (!id) return null;
    return { src: `https://www.tiktok.com/embed/v2/${id}`, platform: 'TikTok', vertical: true };
  }

  if (host.endsWith('facebook.com') || host === 'fb.watch') {
    return {
      src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(u.toString())}&show_text=false&autoplay=true`,
      platform: 'Facebook',
      vertical: u.pathname.includes('/reel'),
    };
  }

  return null;
}

/** Photos d'un document Firestore, y compris les anciens documents à photo unique. */
export function readImages(data: { images?: unknown; imageUrl?: unknown }): string[] {
  if (Array.isArray(data.images)) {
    return data.images.filter((x): x is string => typeof x === 'string' && x !== '').slice(0, MAX_PHOTOS);
  }
  return typeof data.imageUrl === 'string' && data.imageUrl ? [data.imageUrl] : [];
}
