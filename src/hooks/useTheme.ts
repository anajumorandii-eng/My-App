import { useCallback, useEffect, useState } from 'react';
import { applyTheme, getStoredTheme, persistTheme, resolveInitialTheme, systemPrefersDark, Theme } from '../design-system/theme';

// The inline script in index.html already applied the resolved theme before
// first paint (avoids a light->dark flash); this just brings React's state
// in sync with that and gives the rest of the app a way to flip it.
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => resolveInitialTheme(getStoredTheme(), systemPrefersDark()));

  useEffect(() => {
    applyTheme(theme);
    persistTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, isDark: theme === 'dark', toggleTheme };
}
