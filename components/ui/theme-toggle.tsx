import React from 'react'
import { useThemeContext } from '~/lib/theme-context'
import { cn } from '~/lib/utils'
import { 
  MdDarkMode, 
  MdLightMode, 
  MdSettingsBrightness, 
  MdAutoAwesome 
} from 'react-icons/md'
import { HiSparkles, HiSun, HiMoon, HiComputerDesktop } from 'react-icons/hi2'

interface ThemeToggleProps {
  variant?: 'default' | 'compact' | 'icon' | 'floating'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showLabels?: boolean
  animate?: boolean
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg'
}

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6'
}

export function ThemeToggle({ 
  variant = 'default',
  size = 'md',
  className,
  showLabels = false,
  animate = true
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme, systemPreference } = useThemeContext()

  const getThemeIcon = (currentTheme: string, resolved: string) => {
    const iconClass = iconSizes[size]
    
    switch (currentTheme) {
      case 'light':
        return <HiSun className={cn(iconClass, 'text-yellow-500')} />
      case 'dark':
        return <HiMoon className={cn(iconClass, 'text-blue-400')} />
      case 'system':
        return <HiComputerDesktop className={cn(iconClass, 'text-purple-400')} />
      default:
        return resolved === 'dark' 
          ? <HiMoon className={cn(iconClass, 'text-blue-400')} /> 
          : <HiSun className={cn(iconClass, 'text-yellow-500')} />
    }
  }

  const getThemeLabel = (currentTheme: string) => {
    switch (currentTheme) {
      case 'light': return 'Light'
      case 'dark': return 'Dark'
      case 'system': return 'System'
      default: return 'Theme'
    }
  }

  const cycleTheme = () => {
    const themeOrder: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system']
    const currentIndex = themeOrder.indexOf(theme as any)
    const nextIndex = (currentIndex + 1) % themeOrder.length
    setTheme(themeOrder[nextIndex])
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={cycleTheme}
        className={cn(
          'relative rounded-xl transition-all duration-300 ease-out',
          'glass-button hover:scale-105 active:scale-95',
          'border border-glass-white-20 hover:border-neon-cyan-500/30',
          'bg-glass-white-10 hover:bg-glass-white-20',
          'hover:shadow-neon-cyan hover:shadow-lg',
          'focus:outline-none focus:ring-2 focus:ring-neon-cyan-500/50 focus:ring-offset-2',
          'focus:ring-offset-dark-900',
          sizeClasses[size],
          animate && 'animate-bounce-in',
          className
        )}
        aria-label={`Switch to next theme (current: ${getThemeLabel(theme)})`}
        title={`Current: ${getThemeLabel(theme)} • Click to cycle themes`}
      >
        <div className={cn(
          'flex items-center justify-center transition-transform duration-300',
          animate && 'hover:rotate-12'
        )}>
          {getThemeIcon(theme, resolvedTheme)}
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 
                      hover:opacity-100 bg-gradient-to-r from-neon-cyan-500/10 to-neon-purple-500/10 
                      animate-pulse" />
      </button>
    )
  }

  if (variant === 'floating') {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={cycleTheme}
          className={cn(
            'relative rounded-full transition-all duration-500 ease-out',
            'glass-card border-2 border-neon-cyan-500/20 hover:border-neon-cyan-500/50',
            'bg-gradient-to-br from-glass-white-10 to-glass-white-20',
            'hover:scale-110 active:scale-95',
            'shadow-2xl hover:shadow-neon-cyan',
            'focus:outline-none focus:ring-4 focus:ring-neon-cyan-500/30',
            'animate-float',
            'w-14 h-14',
            className
          )}
          aria-label={`Switch theme (current: ${getThemeLabel(theme)})`}
        >
          <div className="flex items-center justify-center">
            {getThemeIcon(theme, resolvedTheme)}
          </div>
          
          {/* Magic sparkle effect */}
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r 
                        from-neon-pink-500 to-neon-purple-500 animate-pulse 
                        flex items-center justify-center">
            <HiSparkles className="w-3 h-3 text-white animate-spin-slow" />
          </div>
          
          {/* Animated ring */}
          <div className="absolute inset-0 rounded-full border-2 border-neon-cyan-500/30 
                        animate-ping opacity-75" />
        </button>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1 glass-card border border-glass-white-20 
                    bg-glass-white-10 rounded-2xl p-1">
        {(['light', 'dark', 'system'] as const).map((themeOption) => {
          const isActive = theme === themeOption
          return (
            <button
              key={themeOption}
              onClick={() => setTheme(themeOption)}
              className={cn(
                'relative rounded-xl transition-all duration-300 ease-out',
                'focus:outline-none focus:ring-2 focus:ring-neon-cyan-500/50',
                sizeClasses[size],
                isActive 
                  ? 'bg-gradient-to-br from-neon-cyan-500/20 to-neon-purple-500/20 '
                    + 'border-2 border-neon-cyan-500/50 shadow-neon-cyan'
                  : 'hover:bg-glass-white-20 border-2 border-transparent '
                    + 'hover:border-glass-white-30'
              )}
              aria-label={`Switch to ${themeOption} theme`}
              aria-pressed={isActive}
            >
              <div className={cn(
                'flex items-center justify-center transition-transform duration-200',
                isActive && animate && 'scale-110'
              )}>
                {getThemeIcon(themeOption, resolvedTheme)}
              </div>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r 
                              from-neon-cyan-500/10 to-neon-purple-500/10 
                              animate-pulse" />
              )}
            </button>
          )
        })}
      </div>
    )
  }

  // Default variant - full featured
  return (
    <div className={cn(
      'glass-card border border-glass-white-20 bg-glass-white-10 rounded-2xl p-4 space-y-3',
      className
    )}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan-500/20 
                      to-neon-purple-500/20 flex items-center justify-center">
          <MdAutoAwesome className="w-4 h-4 text-neon-cyan-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Theme</h3>
          <p className="text-xs text-muted-foreground">
            Current: {getThemeLabel(theme)}
            {theme === 'system' && ` (${systemPreference})`}
          </p>
        </div>
      </div>

      {/* Theme options */}
      <div className="grid grid-cols-3 gap-2">
        {(['light', 'dark', 'system'] as const).map((themeOption) => {
          const isActive = theme === themeOption
          return (
            <button
              key={themeOption}
              onClick={() => setTheme(themeOption)}
              className={cn(
                'relative flex flex-col items-center gap-2 p-3 rounded-xl',
                'transition-all duration-300 ease-out',
                'focus:outline-none focus:ring-2 focus:ring-neon-cyan-500/50',
                'hover:scale-105 active:scale-95',
                isActive 
                  ? 'bg-gradient-to-br from-neon-cyan-500/20 to-neon-purple-500/20 '
                    + 'border-2 border-neon-cyan-500/50 shadow-neon-cyan'
                  : 'hover:bg-glass-white-20 border-2 border-transparent '
                    + 'hover:border-glass-white-30'
              )}
              aria-label={`Switch to ${themeOption} theme`}
              aria-pressed={isActive}
            >
              {/* Icon */}
              <div className={cn(
                'transition-transform duration-200',
                isActive && animate && 'scale-110'
              )}>
                {getThemeIcon(themeOption, resolvedTheme)}
              </div>
              
              {/* Label */}
              {showLabels && (
                <span className={cn(
                  'text-xs font-medium capitalize transition-colors duration-200',
                  isActive ? 'text-neon-cyan-400' : 'text-muted-foreground'
                )}>
                  {themeOption}
                </span>
              )}
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r 
                              from-neon-cyan-500/5 to-neon-purple-500/5 
                              animate-pulse" />
              )}
            </button>
          )
        })}
      </div>

      {/* System preference indicator */}
      {theme === 'system' && (
        <div className="text-xs text-muted-foreground text-center bg-glass-white-10 
                      rounded-lg p-2 border border-glass-white-20">
          Following system preference: <span className="font-medium capitalize text-foreground">
            {systemPreference}
          </span>
        </div>
      )}
    </div>
  )
}

// Utility component for simple theme switching
export function SimpleThemeToggle({ className }: { className?: string }) {
  return <ThemeToggle variant="icon" size="md" className={className} />
}

// Floating action button for theme switching
export function FloatingThemeToggle({ className }: { className?: string }) {
  return <ThemeToggle variant="floating" className={className} />
}

// Compact theme selector for toolbars
export function CompactThemeToggle({ className }: { className?: string }) {
  return <ThemeToggle variant="compact" size="sm" className={className} />
}
