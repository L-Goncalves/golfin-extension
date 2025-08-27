/**
 * Theme utilities and constants for the extension
 * Provides theme definitions, CSS variables, and utility functions
 */

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  // Background colors
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  
  // Text colors
  foreground: string;
  foregroundSecondary: string;
  foregroundMuted: string;
  
  // UI element colors
  border: string;
  borderHover: string;
  
  // Interactive elements
  primary: string;
  primaryHover: string;
  primaryForeground: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Component specific
  card: string;
  cardHover: string;
  input: string;
  inputBorder: string;
  inputFocus: string;
  
  // Shadows and overlays
  shadow: string;
  overlay: string;
}

export const lightTheme: ThemeColors = {
  // Background colors
  background: '#ffffff',
  backgroundSecondary: '#f8fafc',
  backgroundTertiary: '#f1f5f9',
  
  // Text colors
  foreground: '#0f172a',
  foregroundSecondary: '#334155',
  foregroundMuted: '#64748b',
  
  // UI element colors
  border: '#e2e8f0',
  borderHover: '#cbd5e1',
  
  // Interactive elements
  primary: '#3b82f6',
  primaryHover: '#2563eb',
  primaryForeground: '#ffffff',
  
  // Status colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#06b6d4',
  
  // Component specific
  card: '#ffffff',
  cardHover: '#f8fafc',
  input: '#ffffff',
  inputBorder: '#d1d5db',
  inputFocus: '#3b82f6',
  
  // Shadows and overlays
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const darkTheme: ThemeColors = {
  // Background colors
  background: '#0f172a',
  backgroundSecondary: '#1e293b',
  backgroundTertiary: '#334155',
  
  // Text colors
  foreground: '#f8fafc',
  foregroundSecondary: '#e2e8f0',
  foregroundMuted: '#94a3b8',
  
  // UI element colors
  border: '#334155',
  borderHover: '#475569',
  
  // Interactive elements
  primary: '#3b82f6',
  primaryHover: '#60a5fa',
  primaryForeground: '#ffffff',
  
  // Status colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#06b6d4',
  
  // Component specific
  card: '#1e293b',
  cardHover: '#334155',
  input: '#1e293b',
  inputBorder: '#475569',
  inputFocus: '#3b82f6',
  
  // Shadows and overlays
  shadow: 'rgba(0, 0, 0, 0.3)',
  overlay: 'rgba(0, 0, 0, 0.7)',
};

export const themeTransition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';

/**
 * Generates CSS custom properties from theme colors
 */
export const generateCSSVariables = (theme: ThemeColors): Record<string, string> => {
  const cssVars: Record<string, string> = {};
  
  Object.entries(theme).forEach(([key, value]) => {
    // Convert camelCase to kebab-case for CSS variables
    const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    cssVars[cssVarName] = value;
  });
  
  return cssVars;
};

/**
 * Applies theme CSS variables to the document root
 */
export const applyTheme = (theme: ThemeColors): void => {
  const root = document.documentElement;
  const cssVars = generateCSSVariables(theme);
  
  Object.entries(cssVars).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
};

/**
 * Detects the user's system theme preference
 */
export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/**
 * Resolves the actual theme based on the theme mode
 */
export const resolveTheme = (mode: ThemeMode): 'light' | 'dark' => {
  if (mode === 'system') {
    return getSystemTheme();
  }
  return mode;
};

/**
 * Gets the theme colors based on the resolved theme
 */
export const getThemeColors = (mode: ThemeMode): ThemeColors => {
  const resolvedTheme = resolveTheme(mode);
  return resolvedTheme === 'dark' ? darkTheme : lightTheme;
};

/**
 * Storage key for persisting theme preference
 */
export const THEME_STORAGE_KEY = 'theme-preference';

/**
 * Default theme mode
 */
export const DEFAULT_THEME_MODE: ThemeMode = 'system';