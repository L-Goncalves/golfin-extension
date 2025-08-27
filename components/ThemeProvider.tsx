/**
 * Theme Context Provider for the extension
 * Provides theme state and controls throughout the component tree
 */

import React, { createContext, useContext, type ReactNode } from 'react';
import { useTheme, type UseThemeReturn } from '~hooks/useTheme';

// Create theme context
const ThemeContext = createContext<UseThemeReturn | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  /** Optional default theme mode */
  defaultTheme?: 'light' | 'dark' | 'system';
}

/**
 * Theme Provider Component
 * Wraps the app with theme context and applies CSS variables
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'system'
}) => {
  const theme = useTheme();

  // Apply transition class to enable smooth theme changes
  React.useEffect(() => {
    const root = document.documentElement;
    
    // Add transition class after initial load to prevent flash
    if (!theme.isLoading) {
      const timeoutId = setTimeout(() => {
        root.classList.add('theme-transition');
      }, 100);
      
      return () => {
        clearTimeout(timeoutId);
        root.classList.remove('theme-transition');
      };
    }
  }, [theme.isLoading]);

  // Show loading state or render children
  if (theme.isLoading) {
    return (
      <div className="theme-loading" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        background: 'var(--color-background, #ffffff)',
        color: 'var(--color-foreground, #000000)'
      }}>
        <div className="loading-spinner" style={{
          width: '24px',
          height: '24px',
          border: '2px solid var(--color-border, #e2e8f0)',
          borderTop: '2px solid var(--color-primary, #3b82f6)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access theme context
 * Must be used within a ThemeProvider
 */
export const useThemeContext = (): UseThemeReturn => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  
  return context;
};

/**
 * Higher-order component to inject theme props
 */
export function withTheme<P extends object>(
  Component: React.ComponentType<P & { theme: UseThemeReturn }>
) {
  const WrappedComponent = (props: P) => {
    const theme = useThemeContext();
    return <Component {...props} theme={theme} />;
  };
  
  WrappedComponent.displayName = `withTheme(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

/**
 * Theme-aware component wrapper
 * Automatically applies theme classes and data attributes
 */
interface ThemedProps {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const Themed: React.FC<ThemedProps> = ({
  children,
  className = '',
  as: Component = 'div'
}) => {
  const { resolvedTheme, mode } = useThemeContext();
  
  return React.createElement(
    Component,
    {
      className: `theme-${resolvedTheme} ${className}`.trim(),
      'data-theme': resolvedTheme,
      'data-theme-mode': mode,
    },
    children
  );
};