import React, { createContext, useContext, useEffect, useState } from 'react'
import { Storage } from '@plasmohq/storage'

type Theme = 'dark' | 'light' | 'system'
type ResolvedTheme = 'dark' | 'light'

interface ThemeProviderContextType {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isDarkMode: boolean
  isLightMode: boolean
  systemPreference: ResolvedTheme
}

const ThemeProviderContext = createContext<ThemeProviderContextType | undefined>(undefined)

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
  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemPreference : theme as ResolvedTheme
  const isDarkMode = resolvedTheme === 'dark'
  const isLightMode = resolvedTheme === 'light'

  // Apply theme to document
  const applyTheme = (newTheme: ResolvedTheme) => {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark')
    
    // Disable transitions during theme change if requested
    if (disableTransitionOnChange) {
      const css = document.createElement('style')
      css.appendChild(
        document.createTextNode(
          '* { transition: none !important; animation-duration: 0s !important; }'
        )
      )
      document.head.appendChild(css)
      
      // Re-enable transitions after a short delay
      setTimeout(() => {
        document.head.removeChild(css)
      }, 1)
    }
    
    // Apply new theme class
    root.classList.add(newTheme)
    
    // Set data attribute for CSS selectors
    root.setAttribute('data-theme', newTheme)
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', 
        newTheme === 'dark' ? '#0a0a0b' : '#ffffff'
      )
    }
  }

  // Set theme with persistence
  const setTheme = async (newTheme: Theme) => {
    try {
      await storage.set(storageKey, newTheme)
      setThemeState(newTheme)
    } catch (error) {
      console.warn('Failed to save theme preference:', error)
      setThemeState(newTheme)
    }
  }

  // Toggle between light and dark (ignoring system)
  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  // Listen for system theme changes
  useEffect(() => {
    if (!enableSystem) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const updateSystemPreference = (e: MediaQueryListEvent | MediaQueryList) => {
      setSystemPreference(e.matches ? 'dark' : 'light')
    }

    // Set initial system preference
    updateSystemPreference(mediaQuery)

    // Listen for changes
    mediaQuery.addEventListener('change', updateSystemPreference)

    return () => {
      mediaQuery.removeEventListener('change', updateSystemPreference)
    }
  }, [enableSystem])

  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await storage.get(storageKey) as Theme
        if (savedTheme && ['dark', 'light', 'system'].includes(savedTheme)) {
          setThemeState(savedTheme)
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error)
      }
      setMounted(true)
    }

    loadTheme()
  }, [storageKey])

  // Apply theme when resolved theme changes
  useEffect(() => {
    if (mounted) {
      applyTheme(resolvedTheme)
    }
  }, [resolvedTheme, mounted])

  // Initialize theme immediately to prevent flash
  useEffect(() => {
    const initializeTheme = () => {
      const systemTheme = getSystemTheme()
      setSystemPreference(systemTheme)
      
      // Apply initial theme immediately based on saved preference or system
      const initialTheme = theme === 'system' ? systemTheme : theme as ResolvedTheme
      applyTheme(initialTheme)
    }
    
    initializeTheme()
  }, [])

  // Prevent hydration mismatch
  if (!mounted) {
    return <div className="opacity-0 theme-transition">{children}</div>
  }

  const value: ThemeProviderContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDarkMode,
    isLightMode,
    systemPreference
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

// Hook to use theme context
export function useTheme() {
  const context = useContext(ThemeProviderContext)
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  
  return context
}

// Theme constants for consistent usage
export const THEMES = {
  DARK: 'dark' as const,
  LIGHT: 'light' as const,
  SYSTEM: 'system' as const
}

// Utility functions
export const themeUtils = {
  isDark: (theme: ResolvedTheme) => theme === 'dark',
  isLight: (theme: ResolvedTheme) => theme === 'light',
  getContrastColor: (theme: ResolvedTheme) => theme === 'dark' ? '#ffffff' : '#000000',
  getBackgroundColor: (theme: ResolvedTheme) => theme === 'dark' ? '#0a0a0b' : '#ffffff'
}
