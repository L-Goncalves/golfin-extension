/**
 * Theme management hook with Plasmo storage integration
 * Provides theme state, persistence, and system preference detection
 */

import { useEffect, useState, useCallback } from 'react';
import { Storage } from '@plasmohq/storage';
import { 
  type ThemeMode, 
  type ThemeColors,
  getThemeColors,
  resolveTheme,
  applyTheme,
  getSystemTheme,
  THEME_STORAGE_KEY,
  DEFAULT_THEME_MODE
} from '~lib/theme';

interface UseThemeReturn {
  /** Current theme mode setting */
  mode: ThemeMode;
  /** Resolved theme (light/dark) */
  resolvedTheme: 'light' | 'dark';
  /** Current theme colors */
  colors: ThemeColors;
  /** Whether theme is loading from storage */
  isLoading: boolean;
  /** Set the theme mode */
  setMode: (mode: ThemeMode) => void;
  /** Toggle between light and dark (respects system preference) */
  toggle: () => void;
}

// Initialize Plasmo storage
const storage = new Storage({
  area: 'local'
});

/**
 * Custom hook for theme management with persistence
 */
export const useTheme = (): UseThemeReturn => {
  const [mode, setModeState] = useState<ThemeMode>(DEFAULT_THEME_MODE);
  const [isLoading, setIsLoading] = useState(true);

  // Resolve the actual theme
  const resolvedTheme = resolveTheme(mode);
  const colors = getThemeColors(mode);

  /**
   * Load theme preference from storage
   */
  const loadTheme = useCallback(async () => {
    try {
      const stored = await storage.get(THEME_STORAGE_KEY) as ThemeMode | undefined;
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        setModeState(stored);
      }
    } catch (error) {
      console.warn('Failed to load theme from storage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Save theme preference to storage
   */
  const saveTheme = useCallback(async (newMode: ThemeMode) => {
    try {
      await storage.set(THEME_STORAGE_KEY, newMode);
    } catch (error) {
      console.warn('Failed to save theme to storage:', error);
    }
  }, []);

  /**
   * Set theme mode with persistence
   */
  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    saveTheme(newMode);
  }, [saveTheme]);

  /**
   * Toggle between light and dark themes
   * If system theme is set, toggles to the opposite of current system preference
   */
  const toggle = useCallback(() => {
    if (mode === 'system') {
      const systemTheme = getSystemTheme();
      setMode(systemTheme === 'light' ? 'dark' : 'light');
    } else {
      setMode(mode === 'light' ? 'dark' : 'light');
    }
  }, [mode, setMode]);

  /**
   * Listen for system theme changes
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      // Only trigger re-render if we're using system theme
      if (mode === 'system') {
        setModeState('system'); // Force re-render to update resolved theme
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Fallback for older browsers
    else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [mode]);

  /**
   * Apply theme to document on theme changes
   */
  useEffect(() => {
    if (!isLoading) {
      applyTheme(colors);
      
      // Update meta theme-color for mobile browsers
      const themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (themeColorMeta) {
        themeColorMeta.setAttribute('content', colors.background);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'theme-color';
        meta.content = colors.background;
        document.head.appendChild(meta);
      }

      // Update color-scheme for better browser integration
      document.documentElement.style.colorScheme = resolvedTheme;
    }
  }, [colors, resolvedTheme, isLoading]);

  /**
   * Load theme on mount
   */
  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  return {
    mode,
    resolvedTheme,
    colors,
    isLoading,
    setMode,
    toggle
  };
};

/**
 * Hook for accessing theme colors only (without controls)
 * Useful for components that only need to read theme values
 */
export const useThemeColors = (): ThemeColors => {
  const { colors } = useTheme();
  return colors;
};