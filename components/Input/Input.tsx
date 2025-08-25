import * as React from "react";
import { Input as ShadcnInput } from "~components/ui/input";
import { cn } from "~lib/utils";

interface IProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
  type?: string;
  disabled?: boolean;
  error?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'glass' | 'neon';
  size?: 'sm' | 'md' | 'lg';
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export const Input = (props: IProps) => {
  const { 
    label, 
    placeholder, 
    value, 
    onChange, 
    className, 
    type = "text",
    disabled = false,
    error,
    icon,
    variant = "default",
    size = "md",
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    ...restProps
  } = props;

  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return cn(
          'futuristic-input glass-effect',
          'bg-glass-white-10 border-glass-white-20 text-white/90',
          'placeholder:text-white/60 backdrop-blur-xl',
          'hover:bg-glass-white-20 hover:border-glass-white-30',
          'focus:bg-glass-white-20 focus:border-neon-cyan-500/50',
          'focus:shadow-neon-cyan focus:ring-2 focus:ring-neon-cyan-500/30'
        );
      
      case 'neon':
        return cn(
          'futuristic-input relative',
          'bg-dark-800/50 border-neon-cyan-500/30 text-neon-cyan-100',
          'placeholder:text-neon-cyan-500/60 backdrop-blur-xl',
          'hover:border-neon-cyan-500/50 hover:bg-dark-700/60',
          'focus:border-neon-cyan-500 focus:bg-dark-700/70',
          'focus:shadow-neon-cyan focus:ring-2 focus:ring-neon-cyan-500/50',
          'hover:shadow-neon-cyan/20 transition-all duration-300'
        );
      
      default:
        return cn(
          'rounded-xl border transition-all duration-300 ease-out',
          'bg-background border-border text-foreground',
          'placeholder:text-muted-foreground',
          'hover:border-border-hover hover:bg-surface-hover',
          'focus:border-ring focus:bg-surface-focus',
          'focus:ring-2 focus:ring-ring/30 focus:ring-offset-0',
          // Dark mode specific styles
          'dark:bg-dark-800/30 dark:border-dark-600/50 dark:text-white/90',
          'dark:placeholder:text-white/50 dark:backdrop-blur-sm',
          'dark:hover:bg-dark-700/40 dark:hover:border-dark-500/60',
          'dark:focus:bg-dark-700/50 dark:focus:border-neon-cyan-500/40',
          'dark:focus:shadow-neon-cyan/10'
        );
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm h-9';
      case 'lg':
        return 'px-4 py-3 text-lg h-12';
      default: // md
        return 'px-3.5 py-2.5 text-base h-10';
    }
  };

  return (
    <div className="space-y-2 group">
      {/* Label with modern styling */}
      <label className={cn(
        'text-sm font-semibold transition-colors duration-200',
        'text-foreground dark:text-white/90',
        error && 'text-destructive dark:text-red-400',
        disabled && 'opacity-50 cursor-not-allowed'
      )}>
        {label}
      </label>
      
      {/* Input container with icon support */}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <div className={cn(
              'transition-colors duration-200',
              'text-muted-foreground dark:text-white/60',
              error && 'text-destructive dark:text-red-400'
            )}>
              {icon}
            </div>
          </div>
        )}
        
        <ShadcnInput
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          aria-label={ariaLabel || label}
          aria-describedby={error ? `${label}-error` : ariaDescribedBy}
          aria-invalid={!!error}
          className={cn(
            // Base styles
            'w-full transition-all duration-300 outline-none',
            // Icon padding
            icon && 'pl-10',
            // Size styles
            getSizeStyles(),
            // Variant styles
            getVariantStyles(),
            // Error state
            error && cn(
              'border-destructive dark:border-red-500/60',
              'focus:border-destructive dark:focus:border-red-500',
              'focus:ring-destructive/30 dark:focus:ring-red-500/30'
            ),
            // Disabled state
            disabled && cn(
              'opacity-50 cursor-not-allowed',
              'hover:border-border dark:hover:border-dark-600/50'
            ),
            className
          )}
          {...restProps}
        />
        
        {/* Error icon */}
        {error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg
              className="w-4 h-4 text-destructive dark:text-red-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        )}
        
        {/* Shimmer effect for glass variant */}
        {(variant === 'glass' || variant === 'neon') && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none rounded-inherit overflow-hidden transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer-slow" />
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <p 
          id={`${label}-error`}
          className="text-sm text-destructive dark:text-red-400 animate-slide-down"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};
  