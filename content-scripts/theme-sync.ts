// Theme synchronization for content scripts
// This ensures LinkedIn integration works properly with both light and dark themes

import { Storage } from "@plasmohq/storage"

const storage = new Storage({ area: 'local' })
const THEME_STORAGE_KEY = 'golfin-theme'

// Theme-aware LinkedIn integration
export class ThemeSync {
  private currentTheme: 'light' | 'dark' = 'dark'
  private observer: MutationObserver | null = null

  constructor() {
    this.initializeTheme()
    this.setupThemeListener()
  }

  private async initializeTheme() {
    try {
      // Get saved theme preference
      const savedTheme = await storage.get(THEME_STORAGE_KEY) as string
      const systemPreference = this.getSystemTheme()
      
      // Determine current theme
      this.currentTheme = this.resolveTheme(savedTheme, systemPreference)
      
      // Apply theme to LinkedIn interface
      this.applyLinkedInTheme()
      
    } catch (error) {
      console.warn('Failed to initialize theme sync:', error)
      this.currentTheme = this.getSystemTheme()
      this.applyLinkedInTheme()
    }
  }

  private getSystemTheme(): 'light' | 'dark' {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'dark'
  }

  private resolveTheme(savedTheme: string, systemTheme: 'light' | 'dark'): 'light' | 'dark' {
    if (!savedTheme || savedTheme === 'system') {
      return systemTheme
    }
    return savedTheme === 'light' ? 'light' : 'dark'
  }

  private setupThemeListener() {
    // Listen for theme changes from popup
    storage.watch({
      [THEME_STORAGE_KEY]: (c) => {
        if (c.newValue !== c.oldValue) {
          this.currentTheme = this.resolveTheme(c.newValue, this.getSystemTheme())
          this.applyLinkedInTheme()
        }
      }
    })

    // Listen for system theme changes
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', (e) => {
        // Only update if following system preference
        this.initializeTheme()
      })
    }
  }

  private applyLinkedInTheme() {
    const root = document.documentElement

    // Add theme class to LinkedIn page
    root.classList.remove('golfin-light', 'golfin-dark')
    root.classList.add(`golfin-${this.currentTheme}`)

    // Set data attribute for CSS selectors
    root.setAttribute('data-golfin-theme', this.currentTheme)

    // Apply theme-specific styles to our extension elements
    this.updateExtensionElements()

    // Adjust LinkedIn UI colors based on theme
    this.adjustLinkedInColors()
  }

  private updateExtensionElements() {
    // Find all our extension elements and update their classes
    const extensionElements = document.querySelectorAll('[data-golfin-element]')
    
    extensionElements.forEach(element => {
      const el = element as HTMLElement
      
      // Update glassmorphism effects based on theme
      if (this.currentTheme === 'light') {
        el.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.7)')
        el.style.setProperty('--glass-border', 'rgba(0, 0, 0, 0.1)')
        el.style.setProperty('--glass-shadow', '0 8px 32px rgba(0, 0, 0, 0.1)')
      } else {
        el.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.1)')
        el.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.2)')
        el.style.setProperty('--glass-shadow', '0 8px 32px rgba(0, 0, 0, 0.3)')
      }
    })
  }

  private adjustLinkedInColors() {
    // Get theme-appropriate colors for LinkedIn integration
    const colors = this.getThemeColors()
    
    // Apply colors to LinkedIn's CSS variables if they exist
    const root = document.documentElement
    
    // Preserve LinkedIn's theme preference but enhance with our colors
    if (colors.primary) {
      root.style.setProperty('--golfin-primary', colors.primary)
    }
    if (colors.accent) {
      root.style.setProperty('--golfin-accent', colors.accent)
    }
    if (colors.background) {
      root.style.setProperty('--golfin-background', colors.background)
    }
  }

  private getThemeColors() {
    if (this.currentTheme === 'light') {
      return {
        primary: '#00c7b3',
        accent: '#8b5cf6', 
        background: 'rgba(255, 255, 255, 0.95)',
        foreground: '#222222',
        border: 'rgba(0, 0, 0, 0.1)'
      }
    } else {
      return {
        primary: '#00ffe5',
        accent: '#9333ff',
        background: 'rgba(10, 10, 11, 0.95)',
        foreground: '#ffffff',
        border: 'rgba(255, 255, 255, 0.2)'
      }
    }
  }

  // Public method to get current theme
  public getCurrentTheme(): 'light' | 'dark' {
    return this.currentTheme
  }

  // Public method to check if extension should use dark styling
  public isDarkMode(): boolean {
    return this.currentTheme === 'dark'
  }

  // Public method to get theme-appropriate CSS classes
  public getThemeClasses(element: 'card' | 'button' | 'text' | 'border'): string {
    const darkClasses = {
      card: 'bg-dark-900/90 border-dark-700/50 text-dark-100 backdrop-blur-lg',
      button: 'bg-neon-cyan-500/20 border-neon-cyan-500/30 text-neon-cyan-400 hover:bg-neon-cyan-500/30',
      text: 'text-dark-200',
      border: 'border-dark-700/50'
    }

    const lightClasses = {
      card: 'bg-white/90 border-slate-200/50 text-slate-900 backdrop-blur-lg',
      button: 'bg-primary/20 border-primary/30 text-primary hover:bg-primary/30',
      text: 'text-slate-700',
      border: 'border-slate-200/50'
    }

    return this.currentTheme === 'dark' ? darkClasses[element] : lightClasses[element]
  }

  // Clean up
  public destroy() {
    if (this.observer) {
      this.observer.disconnect()
    }
  }
}

// Create global instance
export const themeSync = new ThemeSync()

// Helper functions for content scripts
export function getThemeAwareClasses(element: 'card' | 'button' | 'text' | 'border'): string {
  return themeSync.getThemeClasses(element)
}

export function isDarkTheme(): boolean {
  return themeSync.isDarkMode()
}

export function getCurrentTheme(): 'light' | 'dark' {
  return themeSync.getCurrentTheme()
}

// CSS styles for theme-aware extension elements
export const themeAwareStyles = `
.golfin-dark {
  --golfin-glass-bg: rgba(255, 255, 255, 0.08);
  --golfin-glass-border: rgba(255, 255, 255, 0.2);
  --golfin-glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  --golfin-text: #ffffff;
  --golfin-text-muted: #a0a0a0;
  --golfin-neon-cyan: #00ffe5;
  --golfin-neon-purple: #9333ff;
  --golfin-neon-pink: #ff2db8;
}

.golfin-light {
  --golfin-glass-bg: rgba(255, 255, 255, 0.7);
  --golfin-glass-border: rgba(0, 0, 0, 0.1);
  --golfin-glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  --golfin-text: #222222;
  --golfin-text-muted: #666666;
  --golfin-neon-cyan: #00c7b3;
  --golfin-neon-purple: #8b5cf6;
  --golfin-neon-pink: #ec4899;
}

/* Extension element base styles */
[data-golfin-element] {
  background: var(--golfin-glass-bg);
  border: 1px solid var(--golfin-glass-border);
  box-shadow: var(--golfin-glass-shadow);
  backdrop-filter: blur(20px);
  color: var(--golfin-text);
  transition: all 0.3s ease;
}

[data-golfin-element]:hover {
  transform: translateY(-2px);
  box-shadow: 
    var(--golfin-glass-shadow),
    0 0 20px var(--golfin-neon-cyan);
}

/* Button styles */
[data-golfin-button] {
  background: linear-gradient(135deg, var(--golfin-neon-cyan), var(--golfin-neon-purple));
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

[data-golfin-button]:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px var(--golfin-neon-cyan);
}

/* Card styles */
[data-golfin-card] {
  background: var(--golfin-glass-bg);
  border: 1px solid var(--golfin-glass-border);
  border-radius: 16px;
  padding: 16px;
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
}

[data-golfin-card]::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--golfin-neon-cyan), transparent);
  opacity: 0.6;
}
`