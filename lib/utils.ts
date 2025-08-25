import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Theme-aware utility functions
export const themeAware = {
  // Get appropriate text color based on background
  textColor: (isDark: boolean, variant: 'primary' | 'secondary' | 'muted' = 'primary') => {
    const colors = {
      primary: isDark ? 'text-foreground' : 'text-foreground',
      secondary: isDark ? 'text-foreground-secondary' : 'text-foreground-secondary', 
      muted: isDark ? 'text-muted-foreground' : 'text-muted-foreground'
    }
    return colors[variant]
  },
  
  // Get appropriate background color
  backgroundColor: (isDark: boolean, variant: 'surface' | 'card' | 'subtle' = 'surface') => {
    const colors = {
      surface: isDark ? 'bg-surface' : 'bg-surface',
      card: isDark ? 'bg-card' : 'bg-card',
      subtle: isDark ? 'bg-surface/50' : 'bg-surface/50'
    }
    return colors[variant]
  },
  
  // Get appropriate border color
  borderColor: (isDark: boolean, state: 'default' | 'hover' | 'focus' = 'default') => {
    const colors = {
      default: isDark ? 'border-border' : 'border-border',
      hover: isDark ? 'border-border-hover' : 'border-border-hover',
      focus: isDark ? 'border-border-focus' : 'border-border-focus'
    }
    return colors[state]
  },
  
  // Get glass effect classes based on theme
  glassEffect: (isDark: boolean, intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
    const base = 'backdrop-blur-lg backdrop-saturate-150'
    const backgrounds = {
      light: isDark ? 'bg-white/5' : 'bg-white/60',
      medium: isDark ? 'bg-white/10' : 'bg-white/70',
      heavy: isDark ? 'bg-white/15' : 'bg-white/80'
    }
    const borders = {
      light: isDark ? 'border-white/10' : 'border-black/10',
      medium: isDark ? 'border-white/20' : 'border-black/15',
      heavy: isDark ? 'border-white/30' : 'border-black/20'
    }
    
    return `${base} ${backgrounds[intensity]} ${borders[intensity]}`
  }
}

// Animation utility functions
export const animations = {
  // Staggered animation delays for lists
  staggerDelay: (index: number, baseDelay: number = 100) => {
    return `${baseDelay + (index * 50)}ms`
  },
  
  // Get spring animation classes
  spring: (trigger: 'hover' | 'focus' | 'active' = 'hover') => {
    const base = 'transition-transform duration-300 ease-spring'
    const transforms = {
      hover: 'hover:scale-105 hover:-translate-y-1',
      focus: 'focus:scale-105 focus:-translate-y-1', 
      active: 'active:scale-95'
    }
    return `${base} ${transforms[trigger]}`
  },
  
  // Entrance animation classes
  entrance: (direction: 'up' | 'down' | 'left' | 'right' | 'scale' = 'up') => {
    const animations = {
      up: 'animate-slide-up',
      down: 'animate-slide-down',
      left: 'animate-slide-left',
      right: 'animate-slide-right',
      scale: 'animate-scale-in'
    }
    return animations[direction]
  }
}

// Accessibility utilities
export const a11y = {
  // Focus ring styles
  focusRing: (color: string = 'primary') => {
    return `focus:outline-none focus:ring-2 focus:ring-${color}/50 focus:ring-offset-2 focus:ring-offset-background`
  }
}