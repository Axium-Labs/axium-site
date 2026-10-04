/**
 * Minimal i18n — route-level static localization (no client state).
 * English lives at the root (/), Chinese under /zh. A string that is
 * localized is typed as B = { en: string; zh: string }.
 */

export type Lang = 'en' | 'zh';

export const LANGS: Lang[] = ['en', 'zh'];

/** header switcher labels */
export const LANG_LABEL: Record<Lang, string> = {
  en: 'EN',
  zh: '中文',
};

/** bilingual string */
export interface B {
  en: string;
  zh: string;
}

/** construct a bilingual string */
export function b(en: string, zh: string): B {
  return { en, zh };
}

/** pick the value for the current language */
export function pick(x: B, lang: Lang): string {
  return lang === 'zh' ? x.zh : x.en;
}

/** which language a given pathname is */
export function langOf(path: string): Lang {
  return path.startsWith('/zh') ? 'zh' : 'en';
}

/** the counterpart URL for the language switch */
export function altPath(path: string, lang: Lang): string {
  if (lang === 'en') return path.replace(/^\/zh/, '') || '/';
  return path === '/' ? '/zh' : `/zh${path}`;
}

/** localize a canonical href (e.g. nav link /docs#cli) for a language */
export function localized(href: string, lang: Lang): string {
  if (lang === 'en') return href;
  return href === '/' ? '/zh' : `/zh${href}`;
}

/** route path without the language prefix, for active-state matching */
export function routeOf(path: string): string {
  return path.replace(/^\/zh/, '') || '/';
}
