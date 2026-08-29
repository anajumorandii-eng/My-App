export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'crivo_theme';
const THEME_COLOR: Record<Theme, string> = { light: '#FBF8F2', dark: '#10251F' };

// Pure decision: given what's stored (if anything) and the OS preference,
// which theme should render? Split out from the DOM/storage reads below so
// it's testable with plain values instead of a real localStorage/matchMedia.
export function resolveInitialTheme(stored: Theme | null, systemPrefersDark: boolean): Theme {
  if (stored === 'light' || stored === 'dark') return stored;
  return systemPrefersDark ? 'dark' : 'light';
}

export function getStoredTheme(storage: Pick<Storage, 'getItem'> = window.localStorage): Theme | null {
  const value = storage.getItem(STORAGE_KEY);
  return value === 'light' || value === 'dark' ? value : null;
}

export function systemPrefersDark(media: (query: string) => { matches: boolean } = window.matchMedia.bind(window)): boolean {
  return media('(prefers-color-scheme: dark)').matches;
}

export function persistTheme(theme: Theme, storage: Pick<Storage, 'setItem'> = window.localStorage): void {
  storage.setItem(STORAGE_KEY, theme);
}

// Minimal shape this needs from `document` — lets tests pass a plain object
// instead of requiring a real DOM (jsdom).
export interface ThemeTarget {
  documentElement: { classList: { toggle: (name: string, force: boolean) => void } };
  getElementById: (id: string) => { setAttribute: (name: string, value: string) => void } | null;
}

export function applyTheme(theme: Theme, doc: ThemeTarget = document): void {
  doc.documentElement.classList.toggle('dark', theme === 'dark');
  doc.getElementById('theme-color-meta')?.setAttribute('content', THEME_COLOR[theme]);
}
