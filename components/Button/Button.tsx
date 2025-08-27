import React from 'react';
import { Button as ShadcnButton } from '~components/ui/button';
import { cn } from '~lib/utils';

interface IProps {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'neon-cyan' | 'neon-purple' | 'neon-pink' | 'glass' | 'linkedin' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    loading?: boolean;
    'aria-label'?: string;
    'aria-describedby'?: string;
}

export const Button = (props: IProps) => {
  const { 
    children, 
    onClick, 
    className, 
    disabled = false, 
    variant = 'primary', 
    size = 'md',
    loading = false,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    ...restProps
  } = props;

  // Clone children to add icon styling if needed
  const processChildren = (children: React.ReactNode): React.ReactNode => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        // If it's a React Fragment with multiple children, process each child
        if (child.type === React.Fragment) {
          return React.cloneElement(child, {
            children: React.Children.map(child.props.children, (fragmentChild, index) => {
              // First child gets icon styling (icons are typically first)
              if (index === 0 && React.isValidElement(fragmentChild)) {
                return React.cloneElement(fragmentChild, {
                  className: cn(fragmentChild.props.className, 'mr-2 transition-transform duration-300 group-hover:scale-110'),
                  style: { ...fragmentChild.props.style }
                });
              }
              return fragmentChild;
            })
          });
        }
        // If it's a direct icon component, add margin and animation
        if (typeof child.type === 'function' || typeof child.type === 'object') {
          return React.cloneElement(child, {
            className: cn(child.props.className, 'mr-2 transition-transform duration-300 group-hover:scale-110')
          });
        }
      }
      return child;
    });
  };

  // Enhanced variant styles for 2025 design system
  const getVariantStyles = () => {
    switch (variant) {
      case 'neon-cyan':
        return cn(
          'glass-button group relative overflow-hidden',
          'bg-gradient-to-r from-neon-cyan-600/20 to-neon-cyan-500/30',
          'border-neon-cyan-500/40 text-neon-cyan-100',
          'hover:shadow-neon-cyan hover:border-neon-cyan-400',
          'hover:bg-gradient-to-r hover:from-neon-cyan-500/30 hover:to-neon-cyan-400/40',
          'active:scale-95 active:shadow-neon-cyan',
          disabled && 'opacity-50 cursor-not-allowed hover:shadow-none'
        );
      
      case 'neon-purple':
        return cn(
          'glass-button group relative overflow-hidden',
          'bg-gradient-to-r from-neon-purple-600/20 to-neon-purple-500/30',
          'border-neon-purple-500/40 text-neon-purple-100',
          'hover:shadow-neon-purple hover:border-neon-purple-400',
          'hover:bg-gradient-to-r hover:from-neon-purple-500/30 hover:to-neon-purple-400/40',
          'active:scale-95 active:shadow-neon-purple',
          disabled && 'opacity-50 cursor-not-allowed hover:shadow-none'
        );
      
      case 'neon-pink':
        return cn(
          'glass-button group relative overflow-hidden',
          'bg-gradient-to-r from-neon-pink-600/20 to-neon-pink-500/30',
          'border-neon-pink-500/40 text-neon-pink-100',
          'hover:shadow-neon-pink hover:border-neon-pink-400',
          'hover:bg-gradient-to-r hover:from-neon-pink-500/30 hover:to-neon-pink-400/40',
          'active:scale-95 active:shadow-neon-pink',
          disabled && 'opacity-50 cursor-not-allowed hover:shadow-none'
        );
      
      case 'glass':
        return cn(
          'glass-button group relative overflow-hidden',
          'bg-glass-white-10 border-glass-white-20',
          'text-white/90 backdrop-blur-xl',
          'hover:bg-glass-white-20 hover:border-glass-white-30',
          'hover:shadow-glass-lg hover:text-white',
          'active:scale-95',
          disabled && 'opacity-50 cursor-not-allowed'
        );
      
      case 'secondary':
        return cn(
          'glass-button group relative overflow-hidden',
          'bg-dark-700/50 border-dark-600/50',
          'text-dark-100 backdrop-blur-xl',
          'hover:bg-dark-600/60 hover:border-dark-500/60',
          'hover:shadow-dark-lg hover:text-white',
          'active:scale-95',
          disabled && 'opacity-50 cursor-not-allowed'
        );
      
      case 'linkedin':
        return cn(
          'glass-button group relative overflow-hidden',
          'bg-gradient-to-r from-linkedin-primary/80 to-linkedin-secondary/80',
          'border-linkedin-primary/60 text-white backdrop-blur-xl',
          'hover:from-linkedin-primary hover:to-linkedin-secondary',
          'hover:border-linkedin-primary hover:shadow-lg hover:shadow-linkedin-primary/25',
          'active:from-linkedin-primary-dark active:to-linkedin-primary',
          'active:scale-95 transition-all duration-300',
          disabled && 'opacity-50 cursor-not-allowed hover:shadow-none'
        );
        
      case 'ghost':
        return cn(
          'group relative overflow-hidden rounded-xl',
          'bg-transparent text-foreground hover:text-foreground',
          'hover:bg-surface-hover dark:hover:bg-white/5',
          'transition-all duration-300 ease-out',
          'border border-transparent hover:border-border',
          'dark:border-transparent dark:hover:border-white/10',
          'hover:backdrop-blur-sm active:scale-95',
          disabled && 'opacity-50 cursor-not-allowed'
        );
        
      case 'outline':
        return cn(
          'group relative overflow-hidden rounded-xl',
          'bg-transparent border-2 border-border backdrop-blur-sm',
          'text-foreground hover:text-foreground',
          'dark:border-white/20 dark:text-white/90',
          'hover:bg-surface-hover hover:border-border-hover',
          'dark:hover:bg-white/5 dark:hover:border-white/30',
          'hover:backdrop-blur-md transition-all duration-300 ease-out',
          'active:scale-95',
          disabled && 'opacity-50 cursor-not-allowed'
        );
      
      default: // primary
        return cn(
          'glass-button group relative overflow-hidden',
          'bg-gradient-to-r from-neon-cyan-500/30 to-neon-purple-500/30',
          'border-glass-white-20 text-white',
          'hover:from-neon-cyan-500/40 hover:to-neon-purple-500/40',
          'hover:border-neon-cyan-500/50 hover:shadow-neon-cyan',
          'active:scale-95',
          disabled && 'opacity-50 cursor-not-allowed'
        );
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm rounded-lg';
      case 'lg':
        return 'px-6 py-3 text-lg rounded-2xl';
      case 'xl':
        return 'px-8 py-4 text-xl rounded-2xl';
      default: // md
        return 'px-4 py-2 text-base rounded-xl';
    }
  };

  return (
    <button
      onClick={onClick} 
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      className={cn(
        // Base styles with modern design system
        'flex items-center justify-center font-semibold cursor-pointer text-center',
        'transition-all duration-400 ease-out-back',
        'relative overflow-hidden micro-bounce',
        // Focus styles for accessibility
        'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2',
        'focus:ring-offset-background',
        // Modern glassmorphism and animations (only for glass variants)
        (variant === 'glass' || variant === 'primary') && [
          'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent',
          'before:translate-x-[-200%] before:transition-transform before:duration-700',
          'hover:before:translate-x-[200%]'
        ],
        // Loading state
        loading && 'pointer-events-none',
        // Size and variant styles
        getSizeStyles(),
        getVariantStyles(),
        className
      )}
      {...restProps}
    >
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
      </div>
      
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-inherit">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" 
               aria-hidden="true" />
        </div>
      )}
      
      {/* Content with enhanced icon processing */}
      <span className={cn(
        'relative z-10 flex items-center transition-opacity duration-200',
        loading && 'opacity-0'
      )}>
        {processChildren(children)}
      </span>
    </button>
  );
};
