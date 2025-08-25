import React from 'react'
import { cn } from '~/lib/utils'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'subtle'
  neonGlow?: 'cyan' | 'purple' | 'pink' | 'blue' | 'none'
  blur?: 'sm' | 'md' | 'lg' | 'xl'
}

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  neonGlow?: 'cyan' | 'purple' | 'pink' | 'blue' | 'none'
  blur?: 'sm' | 'md' | 'lg' | 'xl'
}

const glowClasses = {
  cyan: 'border-neon-cyan-500/30 shadow-neon-cyan',
  purple: 'border-neon-purple-500/30 shadow-neon-purple', 
  pink: 'border-neon-pink-500/30 shadow-neon-pink',
  blue: 'border-neon-blue-500/30 shadow-neon-blue',
  none: ''
}

const blurClasses = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg', 
  xl: 'backdrop-blur-xl'
}

export function GlassCard({ 
  children, 
  className,
  variant = 'default',
  neonGlow = 'none',
  blur = 'lg',
  ...props 
}: GlassCardProps) {
  const variantClasses = {
    default: 'bg-white/5 border-white/10',
    elevated: 'bg-white/10 border-white/20 shadow-2xl',
    subtle: 'bg-white/3 border-white/5'
  }

  return (
    <div 
      className={cn(
        'glass-card rounded-3xl p-6 border backdrop-saturate-150',
        blurClasses[blur],
        variantClasses[variant],
        neonGlow !== 'none' && glowClasses[neonGlow],
        'transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function GlassPanel({
  children,
  className, 
  neonGlow = 'none',
  blur = 'lg',
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        'glass-effect rounded-2xl p-4 border border-white/10 bg-white/5',
        blurClasses[blur],
        'backdrop-saturate-150',
        neonGlow !== 'none' && glowClasses[neonGlow],
        'transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}