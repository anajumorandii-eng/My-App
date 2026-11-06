export type ReadingTheme = 'paper' | 'sage' | 'night';
export interface ReadingPreferences { theme: ReadingTheme; fontSize: number; showIndex: boolean; }
export const READING_PREFERENCES_KEY = 'crivo_reading_appearance_v1';
export function readingPreferences(): ReadingPreferences {
  const defaults: ReadingPreferences = { theme: 'paper', fontSize: 20, showIndex: typeof matchMedia === 'undefined' || matchMedia('(min-width: 800px)').matches };
  try {
    const stored = JSON.parse(localStorage.getItem(READING_PREFERENCES_KEY) || 'null');
    if (!stored || typeof stored !== 'object') return defaults;
    return {
      theme: ['paper','sage','night'].includes(stored.theme) ? stored.theme : defaults.theme,
      fontSize: Number.isFinite(stored.fontSize) ? Math.max(16,Math.min(26,stored.fontSize)) : defaults.fontSize,
      showIndex: typeof stored.showIndex === 'boolean' ? stored.showIndex : defaults.showIndex,
    };
  } catch { return defaults; }
}
export function saveReadingPreferences(preferences: ReadingPreferences) {
  try { localStorage.setItem(READING_PREFERENCES_KEY, JSON.stringify(preferences)); } catch { /* A leitura continua quando o navegador bloqueia o armazenamento. */ }
}
