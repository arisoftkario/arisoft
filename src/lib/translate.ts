import { siteLanguages } from '@/data/languages';

// Traduction automatique : le cookie « googtrans » (/fr/<langue>) est lu par le script Google Traduction.
const COOKIE = 'googtrans';

export function readTranslation(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/]*\/([^;]+)/);
  return match && match[1] !== 'fr' ? decodeURIComponent(match[1]) : null;
}

export function setTranslation(code: string | null) {
  const host = window.location.hostname;
  // Google pose aussi le cookie sur le domaine : on efface toutes les variantes.
  for (const domain of ['', `; domain=${host}`, `; domain=.${host}`]) {
    document.cookie = `${COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
  }
  if (code) document.cookie = `${COOKIE}=/fr/${code}; path=/`;
}

declare global {
  interface Window {
    googleTranslateInit?: () => void;
    google?: { translate: { TranslateElement: new (options: object, id: string) => unknown } };
  }
}

// La traduction Google remplace les textes de la page : sans ce garde-fou, React plante
// en voulant retirer ou insérer un nœud qui a été déplacé (bug connu de React).
function protectDomFromTranslation() {
  const proto = Node.prototype as Node & { __arisoftPatched?: boolean };
  if (proto.__arisoftPatched) return;
  proto.__arisoftPatched = true;
  const removeChild = proto.removeChild;
  proto.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) return child;
    return removeChild.call(this, child) as T;
  };
  const insertBefore = proto.insertBefore;
  proto.insertBefore = function <T extends Node>(this: Node, node: T, ref: Node | null): T {
    if (ref && ref.parentNode !== this) return node;
    return insertBefore.call(this, node, ref) as T;
  };
}

export function loadGoogleTranslate() {
  if (document.getElementById('google-translate-script')) return;
  protectDomFromTranslation();
  // Conteneur caché du widget Google (unique, même si le sélecteur est affiché deux fois).
  const holder = document.createElement('div');
  holder.id = 'google_translate_element';
  holder.hidden = true;
  document.body.appendChild(holder);
  window.googleTranslateInit = () => {
    if (!window.google) return;
    new window.google.translate.TranslateElement({ pageLanguage: 'fr', autoDisplay: false }, 'google_translate_element');
  };
  const script = document.createElement('script');
  script.id = 'google-translate-script';
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateInit';
  script.async = true;
  document.body.appendChild(script);
}

/** Événement envoyé quand la langue de l'appareil vient d'être appliquée (détail : code). */
export const LANGUAGE_EVENT = 'arisoft:language';

// Choix de langue mémorisé (manuel ou détecté) : la détection automatique ne s'applique qu'une fois.
const CHOICE_COOKIE = 'arisoft_lang';

export function hasLanguageChoice(): boolean {
  return /(?:^|;\s*)arisoft_lang=/.test(document.cookie);
}

export function rememberChoice(code: string) {
  document.cookie = `${CHOICE_COOKIE}=${encodeURIComponent(code)}; path=/; max-age=31536000; samesite=lax`;
}

// Codes du navigateur qui diffèrent de ceux de Google Traduction.
const BROWSER_ALIASES: Record<string, string> = {
  zh: 'zh-CN',
  'zh-SG': 'zh-CN',
  'zh-HK': 'zh-TW',
  'zh-MO': 'zh-TW',
  nb: 'no',
  nn: 'no',
  fil: 'tl',
  iw: 'he',
};

/** Première langue de l'appareil proposée par le site (ordre de préférence du navigateur), sinon null. */
export function detectDeviceLanguage(): string | null {
  const supported = new Set(siteLanguages.map((l) => l.code));
  const preferred = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const tag of preferred) {
    if (!tag) continue;
    const [base, region] = tag.split('-');
    const candidates = [region ? `${base.toLowerCase()}-${region.toUpperCase()}` : '', base.toLowerCase()];
    for (const c of candidates) {
      const code = BROWSER_ALIASES[c] ?? c;
      if (code && supported.has(code)) return code;
    }
  }
  return null;
}

/** Robots d'indexation et outils d'audit : ils doivent toujours voir le site en français. */
export function isCrawler(): boolean {
  return /bot|crawl|spider|slurp|lighthouse|headless|facebookexternalhit|whatsapp|preview/i.test(navigator.userAgent);
}
