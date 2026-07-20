'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore
} from 'react';

type Theme = 'dark' | 'light';

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const THEME_STORAGE_KEY = 'apex-theme';

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const background = theme === 'light' ? '#f8f9f2' : '#131313';
  const color = theme === 'light' ? '#20221d' : '#e5e2e1';

  root.dataset.theme = theme;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
  root.style.backgroundColor = background;
  root.style.color = color;

  const initialThemeStyle = document.getElementById('apex-initial-theme');
  if (initialThemeStyle) {
    initialThemeStyle.textContent =
      `html,body{background-color:${background};color:${color};color-scheme:${theme};}`;
  }
}

function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'dark';
}

function readServerTheme(): Theme {
  return 'dark';
}

function subscribeToThemeChanges(onStoreChange: () => void) {
  const handleThemeChange = () => onStoreChange();
  const handleStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) {
      applyTheme(readStoredTheme());
      onStoreChange();
    }
  };

  window.addEventListener('apex-theme-change', handleThemeChange);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener('apex-theme-change', handleThemeChange);
    window.removeEventListener('storage', handleStorage);
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore<Theme>(
    subscribeToThemeChanges,
    readStoredTheme,
    readServerTheme
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((nextTheme: Theme) => {
    applyTheme(nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    window.dispatchEvent(new Event('apex-theme-change'));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [setTheme, theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme
    }),
    [setTheme, theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
