import { Checkbox as ShadcnCheckbox } from "~components/ui/checkbox";
import { Tooltip } from "~components/ui/tooltip";
import { cn } from "~lib/utils";

interface CheckboxProps {
  label: string;
  id: string;
  tooltip?: string;
  tooltipPosition?: 'top' | 'bottom';
  onChange?: (checked: boolean) => void;
  checked: boolean;
  disabled?: boolean;
  variant?: 'default' | 'neon' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  error?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export const Checkbox = ({ 
  label, 
  id, 
  tooltip, 
  tooltipPosition = 'top',
  onChange, 
  checked, 
  disabled = false,
  variant = 'default',
  size = 'md',
  className,
  error,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...restProps
}: CheckboxProps) => {
  const handleCheckboxChange = (newCheckedState: boolean) => {
    if (onChange && !disabled) {
      onChange(newCheckedState);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'neon':
        return cn(
          'data-[state=checked]:bg-neon-cyan-500 data-[state=checked]:border-neon-cyan-400',
          'data-[state=checked]:text-dark-900 data-[state=checked]:shadow-neon-cyan',
          'border-neon-cyan-500/40 hover:border-neon-cyan-500/60',
          'hover:shadow-neon-cyan/20 transition-all duration-300',
          'focus:ring-2 focus:ring-neon-cyan-500/50 focus:ring-offset-0',
          'dark:focus:ring-offset-dark-900'
        );
      
      case 'glass':
        return cn(
          'glass-effect border-glass-white-20',
          'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-neon-cyan-500/80 data-[state=checked]:to-neon-purple-500/80',
          'data-[state=checked]:border-glass-white-30 data-[state=checked]:text-white',
          'hover:border-glass-white-30 hover:bg-glass-white-10',
          'backdrop-blur-sm transition-all duration-300'
        );
      
      default:
        return cn(
          'border-border data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
          'hover:border-border-hover focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'dark:border-dark-600/50 dark:data-[state=checked]:bg-neon-cyan-500',
          'dark:data-[state=checked]:text-dark-900 dark:hover:border-dark-500/70',
          'dark:focus:ring-neon-cyan-500/50 dark:focus:ring-offset-dark-900',
          'transition-all duration-200'
        );
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'h-3.5 w-3.5';
      case 'lg':
        return 'h-5 w-5';
      default: // md
        return 'h-4 w-4';
    }
  };

  const getLabelSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'lg':
        return 'text-base';
      default: // md
        return 'text-sm';
    }
  };

  return (
    <div className={cn(
      'flex items-start relative group',
      disabled && 'opacity-50 cursor-not-allowed',
      className
    )}>
      {/* Checkbox */}
      <ShadcnCheckbox
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={handleCheckboxChange}
        aria-label={ariaLabel || label}
        aria-describedby={error ? `${id}-error` : ariaDescribedBy}
        aria-invalid={!!error}
        className={cn(
          'mr-3 mt-0.5 rounded-md transition-all duration-300 micro-bounce',
          getSizeStyles(),
          getVariantStyles(),
          error && cn(
            'border-destructive dark:border-red-500/60',
            'data-[state=checked]:bg-destructive dark:data-[state=checked]:bg-red-500'
          ),
          disabled && 'cursor-not-allowed opacity-50'
        )}
        {...restProps}
      />
      
      {/* Label and tooltip container */}
      <div className="flex-1 relative">
        <label 
          htmlFor={id}
          className={cn(
            'cursor-pointer font-medium transition-all duration-200 leading-relaxed',
            getLabelSizeStyles(),
            'text-foreground dark:text-white/90',
            checked && 'font-semibold',
            error && 'text-destructive dark:text-red-400',
            disabled && 'cursor-not-allowed opacity-70',
            // Hover effects for interactive states
            !disabled && 'hover:text-foreground/80 dark:hover:text-white'
          )}
        >
          {label}
        </label>
        
        {tooltip && (
          <div className="inline-block ml-1.5">
            <Tooltip content={tooltip} position={tooltipPosition}>
              <svg 
                className={cn(
                  'w-3.5 h-3.5 cursor-help transition-colors duration-200',
                  'text-muted-foreground dark:text-white/50',
                  'hover:text-foreground dark:hover:text-white/80'
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Tooltip>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <p 
            id={`${id}-error`}
            className="text-xs text-destructive dark:text-red-400 mt-1 animate-slide-down"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
      
      {/* Glow effect for neon variant when checked */}
      {variant === 'neon' && checked && (
        <div className="absolute inset-0 rounded-md opacity-20 animate-glow-pulse pointer-events-none">
          <div className="w-full h-full rounded-md bg-gradient-to-r from-neon-cyan-500 to-neon-purple-500 blur-sm"></div>
        </div>
      )}
    </div>
  );
};
