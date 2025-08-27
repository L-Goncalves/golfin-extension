import React, { createContext, useContext, useEffect, useState } from 'react'
import { Storage } from '@plasmohq/storage'

type Theme = 'dark' | 'light' | 'system'
type ResolvedTheme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isDarkMode: boolean
  isLightMode: boolean
  systemPreference: ResolvedTheme
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const storage = new Storage({ area: 'local' })
const STORAGE_KEY = 'golfin-theme'

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = STORAGE_KEY,
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [systemPreference, setSystemPreference] = useState<ResolvedTheme>('dark')
  const [mounted, setMounted] = useState(false)

  // Get system theme preference
  const getSystemTheme = (): ResolvedTheme => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'dark'
  }

  // Resolve theme (handle system preference)
  const resolvedTheme: ResolvedTheme = 
    theme === 'system' 
      ? systemPreference 
      : theme as ResolvedTheme

  const isDarkMode = resolvedTheme === 'dark'
  const isLightMode = resolvedTheme === 'light'

  // Initialize theme from storage
  useEffect(() => {
    const initTheme = async () => {
      try {
        const savedTheme = await storage.get(storageKey)
        if (savedTheme && ['dark', 'light', 'system'].includes(savedTheme)) {
          setThemeState(savedTheme as Theme)
        }
      } catch (error) {
        console.error('Failed to load theme from storage:', error)
      }
      setMounted(true)
    }
    
    initTheme()
  }, [storageKey])

  // Update system preference
  useEffect(() => {
    if (!enableSystem) return

    const updateSystemTheme = () => {
      setSystemPreference(getSystemTheme())
    }

    updateSystemTheme()

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => updateSystemTheme()

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [enableSystem])

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement

    // Add transition class if needed
    if (!disableTransitionOnChange) {
      root.classList.add('theme-transition')
    }

    // Apply theme
    root.classList.remove('light', 'dark')
    root.classList.add(resolvedTheme)

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        resolvedTheme === 'dark' ? '#0a0a0b' : '#ffffff'
      )
    }

    // Remove transition class after animation
    if (!disableTransitionOnChange) {
      const timeout = setTimeout(() => {
        root.classList.remove('theme-transition')
      }, 300)
      return () => clearTimeout(timeout)
    }
  }, [resolvedTheme, mounted, disableTransitionOnChange])

  // Save theme to storage
  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme)
    try {
      await storage.set(storageKey, newTheme)
    } catch (error) {
      console.error('Failed to save theme to storage:', error)
    }
  }

  // Toggle between themes
  const toggleTheme = () => {
    const nextTheme = 
      theme === 'dark' ? 'light' : 
      theme === 'light' ? 'system' : 
      'dark'
    setTheme(nextTheme)
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div style={{
        width: '500px',
        minHeight: '600px',
        background: '#0a0a0b',
        color: '#e2e8f0',
        fontFamily: 'Inter, system-ui, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '2px solid #00ffe5',
          borderTop: '2px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ fontSize: '14px', opacity: 0.8 }}>Loading...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDarkMode,
    isLightMode,
    systemPreference
  }

  return (
    <ThemeContext.Provider value={value} {...props}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeContext() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }
  return context
}

// Export a simple hook that can be used outside the provider
export function useThemeColors() {
  // This can work outside the provider and just returns default colors
  const isDark = typeof window !== 'undefined' && 
    window.document.documentElement.classList.contains('dark')
  
  return {
    background: isDark ? '#0a0a0b' : '#ffffff',
    foreground: isDark ? '#e2e8f0' : '#0f172a',
    primary: isDark ? '#60a5fa' : '#3b82f6',
    secondary: isDark ? '#1e293b' : '#f1f5f9',
    accent: isDark ? '#c084fc' : '#a855f7',
    muted: isDark ? '#1e293b' : '#f1f5f9',
    border: isDark ? '#334155' : '#e2e8f0'
  }
}