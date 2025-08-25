import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Storage } from "@plasmohq/storage";
import { sendToBackground } from "@plasmohq/messaging";
import { cn } from "~lib/utils";
import { useTranslation } from "~hooks/useTranslation";

// Safe storage initialization with error handling
let storage: Storage | null = null;
try {
  storage = new Storage();
} catch (error) {
  console.error("Failed to initialize storage:", error);
}

// Color validation utilities
const COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
const DEFAULT_COLOR = "#0a66c2";

// Type definitions with strict validation
interface ColorPickerProps {
  className?: string;
  variant?: 'default' | 'glass' | 'neon';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showPreview?: boolean;
  disabled?: boolean;
  onColorChange?: (color: string) => void;
  fallbackColor?: string;
}

interface ColorPickerState {
  color: string;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

// Error boundary for ColorPicker
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

class ColorPickerErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ColorPicker Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
          <p className="text-red-700 dark:text-red-300 text-sm font-medium">⚠️ Color picker error</p>
          <p className="text-red-600 dark:text-red-400 text-xs mt-1">Using fallback color</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Utility functions with comprehensive error handling
const colorUtils = {
  /**
   * Validates and sanitizes color input
   * @param color - Input color string
   * @param fallback - Fallback color if validation fails
   * @returns Valid hex color string
   */
  validateColor: (color: unknown, fallback: string = DEFAULT_COLOR): string => {
    try {
      // Handle null/undefined
      if (!color) return fallback;
      
      // Ensure it's a string
      if (typeof color !== 'string') return fallback;
      
      // Trim whitespace
      const trimmed = color.trim();
      if (!trimmed) return fallback;
      
      // Validate hex color format
      if (!COLOR_REGEX.test(trimmed)) return fallback;
      
      return trimmed;
    } catch (error) {
      console.error('Color validation error:', error);
      return fallback;
    }
  },
  
  /**
   * Safely converts color to uppercase
   * @param color - Input color
   * @returns Uppercase color string
   */
  toUpperCase: (color: string): string => {
    try {
      return color?.toUpperCase?.() || DEFAULT_COLOR.toUpperCase();
    } catch {
      return DEFAULT_COLOR.toUpperCase();
    }
  },
  
  /**
   * Checks if two colors are equal
   * @param color1 - First color
   * @param color2 - Second color
   * @returns Boolean indicating equality
   */
  areEqual: (color1: string, color2: string): boolean => {
    try {
      const c1 = colorUtils.validateColor(color1);
      const c2 = colorUtils.validateColor(color2);
      return c1.toLowerCase() === c2.toLowerCase();
    } catch {
      return false;
    }
  }
};

// Async operation wrapper with error handling
const safeAsync = {
  /**
   * Safely executes storage operations
   */
  storage: {
    get: async (key: string, fallback: string = DEFAULT_COLOR): Promise<string> => {
      try {
        if (!storage) return fallback;
        const value = await storage.get(key);
        return colorUtils.validateColor(value, fallback);
      } catch (error) {
        console.error('Storage get error:', error);
        return fallback;
      }
    },
    
    set: async (key: string, value: string): Promise<boolean> => {
      try {
        if (!storage) return false;
        const validColor = colorUtils.validateColor(value);
        await storage.set(key, validColor);
        return true;
      } catch (error) {
        console.error('Storage set error:', error);
        return false;
      }
    }
  },
  
  /**
   * Safely executes background script calls
   */
  background: {
    getThemeColor: async (fallback: string = DEFAULT_COLOR): Promise<string> => {
      try {
        const response = await sendToBackground({
          name: "get-theme-color",
        });
        
        if (response?.colors?.brandColor) {
          return colorUtils.validateColor(response.colors.brandColor, fallback);
        }
        
        return fallback;
      } catch (error) {
        console.error('Background get theme color error:', error);
        return fallback;
      }
    },
    
    updateThemeColor: async (color: string): Promise<boolean> => {
      try {
        const validColor = colorUtils.validateColor(color);
        await sendToBackground({
          name: "update-theme-color",
          body: { color: validColor },
        });
        return true;
      } catch (error) {
        console.error('Background update theme color error:', error);
        return false;
      }
    }
  }
};

// Main ColorPicker component with comprehensive safety
const ColorPickerCore: React.FC<ColorPickerProps> = ({ 
  className,
  variant = 'default',
  size = 'md',
  label,
  showPreview = true,
  disabled = false,
  onColorChange,
  fallbackColor = DEFAULT_COLOR
}) => {
  const { t } = useTranslation();
  const translatedLabel = label || t('ui.theme_color');
  // State with proper initialization
  const [state, setState] = useState<ColorPickerState>({
    color: colorUtils.validateColor(fallbackColor),
    isLoading: true,
    error: null,
    isInitialized: false
  });
  
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);
  
  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);
  
  // Safe state updater
  const updateState = useCallback((updates: Partial<ColorPickerState>) => {
    if (!mountedRef.current) return;
    
    setState(prevState => ({
      ...prevState,
      ...updates,
      // Always validate color when updating
      ...(updates.color && {
        color: colorUtils.validateColor(updates.color, fallbackColor)
      })
    }));
  }, [fallbackColor]);
  
  // Safe color setter with validation
  const setValidColor = useCallback((newColor: unknown) => {
    try {
      const validColor = colorUtils.validateColor(newColor, fallbackColor);
      updateState({ color: validColor, error: null });
      onColorChange?.(validColor);
    } catch (error) {
      console.error('Error setting color:', error);
      updateState({ 
        color: fallbackColor, 
        error: 'Failed to set color'
      });
    }
  }, [fallbackColor, onColorChange, updateState]);

  // Initialize color from storage or background
  useEffect(() => {
    let isCancelled = false;
    
    const initializeColor = async () => {
      if (!mountedRef.current) return;
      
      try {
        updateState({ isLoading: true, error: null });
        
        // Step 1: Try to get last saved color from storage
        const lastColor = await safeAsync.storage.get('lastColor', fallbackColor);
        
        if (isCancelled || !mountedRef.current) return;
        
        // If we got a valid color from storage, use it
        if (lastColor && lastColor !== fallbackColor) {
          updateState({ 
            color: lastColor, 
            isLoading: false, 
            isInitialized: true 
          });
          console.log('ColorPicker: Loaded color from storage:', lastColor);
          return;
        }
        
        // Step 2: Try to get theme color from background script
        const themeColor = await safeAsync.background.getThemeColor(fallbackColor);
        
        if (isCancelled || !mountedRef.current) return;
        
        updateState({ 
          color: themeColor, 
          isLoading: false, 
          isInitialized: true 
        });
        
        // Save the fetched color to storage for next time
        if (themeColor !== fallbackColor) {
          await safeAsync.storage.set('lastColor', themeColor);
          console.log('ColorPicker: Loaded and saved color from background:', themeColor);
        }
        
      } catch (error) {
        console.error('ColorPicker initialization error:', error);
        
        if (!mountedRef.current) return;
        
        updateState({ 
          color: fallbackColor, 
          isLoading: false, 
          error: 'Failed to load color settings',
          isInitialized: true 
        });
      }
    };
    
    initializeColor();
    
    return () => {
      isCancelled = true;
    };
  }, [fallbackColor, updateState]);
  

  // Handle color changes with debouncing and error handling
  const handleColorChange = useCallback((newColor: unknown) => {
    try {
      // Immediately update UI with validated color
      setValidColor(newColor);
      
      // Clear existing timeout
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      
      // Debounce the expensive operations
      debounceTimeout.current = setTimeout(async () => {
        if (!mountedRef.current) return;
        
        try {
          const validatedColor = colorUtils.validateColor(newColor, fallbackColor);
          
          // Update storage and background in parallel
          const [storageSuccess, backgroundSuccess] = await Promise.allSettled([
            safeAsync.storage.set('lastColor', validatedColor),
            safeAsync.background.updateThemeColor(validatedColor)
          ]);
          
          // Log results without blocking UI
          if (storageSuccess.status === 'fulfilled' && storageSuccess.value) {
            console.log('ColorPicker: Saved color to storage:', validatedColor);
          } else {
            console.warn('ColorPicker: Failed to save color to storage');
          }
          
          if (backgroundSuccess.status === 'fulfilled' && backgroundSuccess.value) {
            console.log('ColorPicker: Updated background theme color:', validatedColor);
          } else {
            console.warn('ColorPicker: Failed to update background theme color');
          }
          
        } catch (error) {
          console.error('ColorPicker: Failed to persist color changes:', error);
          // Don't update UI state here - user already sees the new color
        }
      }, 700);
      
    } catch (error) {
      console.error('ColorPicker: Error handling color change:', error);
      updateState({ error: 'Failed to update color' });
    }
  }, [setValidColor, fallbackColor, updateState]);

  // Memoized style calculations for performance
  const sizeStyles = useMemo(() => {
    try {
      switch (size) {
        case 'sm':
          return {
            picker: 'w-8 h-8',
            preview: 'w-6 h-6',
            text: 'text-xs'
          };
        case 'lg':
          return {
            picker: 'w-12 h-12',
            preview: 'w-10 h-10',
            text: 'text-base'
          };
        default: // md
          return {
            picker: 'w-10 h-10',
            preview: 'w-8 h-8',
            text: 'text-sm'
          };
      }
    } catch (error) {
      console.error('Error calculating size styles:', error);
      // Return safe defaults
      return {
        picker: 'w-10 h-10',
        preview: 'w-8 h-8',
        text: 'text-sm'
      };
    }
  }, [size]);

  const variantStyles = useMemo(() => {
    try {
      switch (variant) {
        case 'glass':
          return {
            container: cn(
              'glass-effect backdrop-blur-xl rounded-2xl p-4',
              'border border-glass-white-20'
            ),
            picker: cn(
              'glass-effect backdrop-blur-sm',
              'border-2 border-glass-white-30 rounded-xl',
              'hover:border-glass-white-40 hover:shadow-glass',
              'focus:border-neon-cyan-500/50 focus:shadow-neon-cyan'
            ),
            label: 'text-white/90 font-semibold'
          };
        
        case 'neon':
          return {
            container: cn(
              'bg-dark-800/50 backdrop-blur-xl rounded-2xl p-4',
              'border border-neon-cyan-500/30 shadow-neon-cyan/10'
            ),
            picker: cn(
              'bg-dark-700/50 backdrop-blur-sm',
              'border-2 border-neon-cyan-500/40 rounded-xl',
              'hover:border-neon-cyan-500/60 hover:shadow-neon-cyan/30',
              'focus:border-neon-cyan-500 focus:shadow-neon-cyan'
            ),
            label: 'text-neon-cyan-100 font-semibold'
          };
        
        default:
          return {
            container: cn(
              'bg-background border border-border rounded-2xl p-4',
              'dark:bg-dark-800/30 dark:border-dark-600/50 dark:backdrop-blur-sm'
            ),
            picker: cn(
              'bg-surface border-2 border-border rounded-xl',
              'hover:border-border-hover hover:shadow-card-hover',
              'focus:border-ring focus:shadow-card-focus',
              'dark:bg-dark-700/50 dark:border-dark-600/50',
              'dark:hover:border-dark-500/70 dark:focus:border-neon-cyan-500/40'
            ),
            label: 'text-foreground dark:text-white/90 font-semibold'
          };
      }
    } catch (error) {
      console.error('Error calculating variant styles:', error);
      // Return safe default styles
      return {
        container: 'bg-background border border-border rounded-2xl p-4',
        picker: 'bg-surface border-2 border-border rounded-xl hover:border-border-hover focus:border-ring',
        label: 'text-foreground font-semibold'
      };
    }
  }, [variant]);

  // Preset colors with safe access
  const presetColors = useMemo(() => [
    { name: 'LinkedIn Blue', color: '#0a66c2' },
    { name: 'Neon Cyan', color: '#00ffe5' },
    { name: 'Purple', color: '#9333ff' },
    { name: 'Pink', color: '#ff2db8' },
  ], []);
  
  // Loading state
  if (state.isLoading) {
    return (
      <div className={cn(
        'group transition-all duration-300 animate-pulse',
        variantStyles.container,
        className
      )}>
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            'h-4 bg-current/20 rounded',
            sizeStyles.text === 'text-xs' ? 'w-20' : sizeStyles.text === 'text-base' ? 'w-28' : 'w-24'
          )} />
          {showPreview && (
            <div className={cn(
              'rounded-lg bg-current/20',
              sizeStyles.preview
            )} />
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className={cn(
            'rounded-xl bg-current/20',
            sizeStyles.picker
          )} />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-current/20 rounded w-16" />
            <div className="h-2 bg-current/10 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'group transition-all duration-300 my-4',
      variantStyles.container,
      disabled && 'opacity-50 cursor-not-allowed',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={cn(
          'font-semibold transition-colors duration-200',
          sizeStyles.text,
          variantStyles.label
        )}>
          🎨 {translatedLabel}
        </h3>
        
        {showPreview && (
          <div className="flex items-center gap-2">
            <span className={cn(
              'text-xs opacity-70 transition-opacity duration-200',
              'group-hover:opacity-100',
              variantStyles.label
            )}>
              {t('ui.preview')}
            </span>
            <div 
              className={cn(
                'rounded-lg border-2 transition-all duration-300',
                sizeStyles.preview,
                'shadow-inner',
                variant === 'neon' && 'shadow-neon-glow',
                variant === 'glass' && 'border-glass-white-30',
                variant === 'default' && 'border-border dark:border-dark-600/50'
              )}
              style={{ backgroundColor: state.color }}
              title={`Current color: ${colorUtils.toUpperCase(state.color)}`}
            />
          </div>
        )}
      </div>
      
      {/* Color Picker Section */}
      <div className="flex items-center gap-4">
        {/* Color Input */}
        <div className="relative group/picker">
          <input
            type="color"
            value={state.color}
            onChange={(event) => {
              try {
                handleColorChange(event.target.value);
              } catch (error) {
                console.error('Color input change error:', error);
              }
            }}
            disabled={disabled || state.isLoading}
            className={cn(
              'cursor-pointer transition-all duration-300 micro-bounce',
              'overflow-hidden appearance-none',
              sizeStyles.picker,
              variantStyles.picker,
              (disabled || state.isLoading) && 'cursor-not-allowed opacity-50'
            )}
            style={{
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              padding: 0,
              border: 'none',
              outline: 'none'
            }}
            aria-label={`Choose ${label?.toLowerCase?.() || 'theme color'}`}
            title={`Current: ${colorUtils.toUpperCase(state.color)}`}
          />
          
          {/* Glow effect for neon variant */}
          {variant === 'neon' && (
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover/picker:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div 
                className="w-full h-full rounded-xl blur-md animate-glow-pulse"
                style={{ backgroundColor: state.color }}
              />
            </div>
          )}
          
          {/* Shimmer effect for glass variant */}
          {variant === 'glass' && (
            <div className="absolute inset-0 opacity-0 group-hover/picker:opacity-100 pointer-events-none rounded-xl overflow-hidden transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          )}
        </div>
        
        {/* Color Info */}
        <div className="flex-1 space-y-2">
          <div className={cn(
            'text-xs font-mono opacity-80 transition-opacity duration-200',
            'group-hover:opacity-100',
            variantStyles.label
          )}>
            {colorUtils.toUpperCase(state.color)}
          </div>
          
          <p className={cn(
            'text-xs opacity-70 transition-opacity duration-200',
            'group-hover:opacity-90',
            variantStyles.label
          )}>
            {t('ui.select_linkedin')}
          </p>
        </div>
      </div>
      
      {/* Quick Color Presets */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-current/10">
        <span className={cn(
          'text-xs font-medium opacity-70',
          variantStyles.label
        )}>
          {t('ui.presets')}
        </span>
        {presetColors.map((preset) => (
          <button
            key={preset.name}
            data-color-preset="true"
            onClick={() => {
              try {
                handleColorChange(preset.color);
              } catch (error) {
                console.error('Preset color selection error:', error);
              }
            }}
            disabled={disabled || state.isLoading}
            className={cn(
              'w-6 h-6 rounded-lg border-2 transition-all duration-200 relative overflow-hidden',
              'hover:scale-110 active:scale-95 micro-bounce',
              variant === 'glass' && 'border-glass-white-30 hover:border-glass-white-50',
              variant === 'neon' && 'border-neon-cyan-500/40 hover:border-neon-cyan-500/70',
              variant === 'default' && 'border-border hover:border-border-hover dark:border-dark-600/50 dark:hover:border-dark-500/70',
              colorUtils.areEqual(state.color, preset.color) && cn(
                'ring-2 ring-offset-2 scale-105',
                variant === 'glass' && 'ring-white/30 ring-offset-transparent',
                variant === 'neon' && 'ring-neon-cyan-500/50 ring-offset-dark-800',
                variant === 'default' && 'ring-primary/50 ring-offset-background'
              ),
              (disabled || state.isLoading) && 'cursor-not-allowed opacity-50 hover:scale-100'
            )}
            style={{ 
              backgroundColor: preset.color,
              // Override any global button styles that might interfere
              background: `${preset.color} !important`,
            }}
            title={preset.name}
            aria-label={`Apply ${preset.name} color`}
          >
            {/* Add an inner div to ensure color visibility */}
            <div 
              className="absolute inset-0 w-full h-full rounded-md"
              style={{ backgroundColor: preset.color }}
            />
          </button>
        ))}
      </div>
      
      {/* Error Display */}
      {state.error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
          <p className="text-red-700 dark:text-red-300 text-xs">
            ⚠️ {state.error}
          </p>
        </div>
      )}
    </div>
  );
};

// Main ColorPicker component wrapped in error boundary
const ColorPicker: React.FC<ColorPickerProps> = (props) => {
  return (
    <ColorPickerErrorBoundary>
      <ColorPickerCore {...props} />
    </ColorPickerErrorBoundary>
  );
};

export default ColorPicker;
export type { ColorPickerProps };
export { colorUtils, safeAsync, ColorPickerErrorBoundary };
