import React, { useState, useEffect } from "react";
import { Storage } from "@plasmohq/storage";
import { sendToBackground, type MessagesMetadata } from "@plasmohq/messaging";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~components/ui/select";
import { cn } from "~lib/utils";

const storage = new Storage();

interface DropdownProps {
  label: string;
  options: {
    value: string;
    label: string;
  }[];
  onChange: (value: string) => void;
  variant?: 'default' | 'glass' | 'neon';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  error?: string;
  className?: string;
  placeholder?: string;
  icon?: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ 
  label, 
  options, 
  onChange, 
  variant = 'default',
  size = 'md',
  disabled = false,
  error,
  className,
  placeholder = "Select an option",
  icon
}) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [timestampSeconds, setTimestampSeconds] = useState(0);

  const handleOptionChange = async (newOptionValue: string) => {
    setSelectedOption(options.find(option => option.value === newOptionValue));
    onChange(newOptionValue);

    try {
      storage.set('selectedDropdownOption', newOptionValue);
      
      // Convert dropdown value to seconds for f_TPR parameter
      const timeMap: { [key: string]: number } = {
        "30m": 1800,
        "1h": 3600,
        "5h": 18000,
        "12h": 43200,
        "24h": 86400,
        "36h": 129600,
        "48h": 172800,
        "4d": 345600,
        "7d": 604800
      };
      
      const seconds = timeMap[newOptionValue];
      if (seconds) {
        await sendToBackground({
          name: "update-dropdown-timestamp",
          body: { seconds },
        });
      }
    } catch (error) {
      console.error("Failed to update dropdown option:", error);
    }
  };
  
  useEffect(() => {
    const fetchSelectedOption = async () => {
      try {
        const selectedOptionValue = await storage.get('selectedDropdownOption');
        const selectedOption = options.find(option => option.value === selectedOptionValue);
        if (selectedOption) {
          setSelectedOption(selectedOption);
        }
      } catch (error) {
        console.error("Failed to fetch selected dropdown option:", error);
      }
    };

    const fetchUrl = async () => {
      try {
        const { url } = await sendToBackground({
          name: "get-current-url",
        });

        console.log("FETCHED URL", url)

        if(url && (url.includes("/jobs/collections") || url.includes("/jobs/search"))) {
          // Check if f_TPR parameter exists
          if(url.includes("f_TPR=")) {
            console.log("MUST REPLACE PARAMS")
            const fTPRMatch = url.match(/f_TPR=r([^&]+)/);
            const fTPRValue = fTPRMatch ? fTPRMatch[1] : null;

            if (fTPRValue) {
              const seconds = parseInt(fTPRValue, 10);
              setTimestampSeconds(seconds)
              
              // Find matching option based on seconds
              const timeMap: { [key: string]: number } = {
                "30m": 1800,
                "1h": 3600,
                "5h": 18000,
                "12h": 43200,
                "24h": 86400,
                "36h": 129600,
                "48h": 172800,
                "4d": 345600,
                "7d": 604800
              };
              
              const matchingOption = Object.entries(timeMap).find(([_, secs]) => secs === seconds);
              if (matchingOption) {
                const [value] = matchingOption;
                const option = options.find(opt => opt.value === value);
                if (option) {
                  setSelectedOption(option);
                }
              }
            }
          } else {
            console.log("MUST ADD PARAMS")
          }
        }
      } catch (error) {
        console.error("Failed to fetch URL:", error);
      }
    };

    fetchUrl();
    fetchSelectedOption();
  }, [options]);

  // Update selected option when options change (language switch)
  useEffect(() => {
    if (selectedOption && options.length > 0) {
      const updatedOption = options.find(option => option.value === selectedOption.value);
      if (updatedOption) {
        setSelectedOption(updatedOption);
      }
    }
  }, [options]);



  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return {
          trigger: cn(
            'glass-effect backdrop-blur-xl',
            'bg-glass-white-10 border-glass-white-20 text-white/90',
            'hover:bg-glass-white-20 hover:border-glass-white-30',
            'focus:bg-glass-white-20 focus:border-neon-cyan-500/50',
            'focus:ring-2 focus:ring-neon-cyan-500/30',
            'data-[placeholder]:text-white/60'
          ),
          content: cn(
            'glass-effect backdrop-blur-xl border-glass-white-20',
            'bg-glass-white-10 text-white/90'
          )
        };
      
      case 'neon':
        return {
          trigger: cn(
            'bg-dark-800/50 border-neon-cyan-500/30 text-neon-cyan-100',
            'backdrop-blur-xl transition-all duration-300',
            'hover:border-neon-cyan-500/50 hover:bg-dark-700/60',
            'hover:shadow-neon-cyan/20',
            'focus:border-neon-cyan-500 focus:bg-dark-700/70',
            'focus:shadow-neon-cyan focus:ring-2 focus:ring-neon-cyan-500/50',
            'data-[placeholder]:text-neon-cyan-500/60'
          ),
          content: cn(
            'bg-dark-800/90 border-neon-cyan-500/30 text-neon-cyan-100',
            'backdrop-blur-xl shadow-neon-cyan/20'
          )
        };
      
      default:
        return {
          trigger: cn(
            'bg-background border-border text-foreground',
            'hover:border-border-hover hover:bg-surface-hover',
            'focus:border-ring focus:ring-2 focus:ring-ring/30',
            'data-[placeholder]:text-muted-foreground',
            // Dark mode styles
            'dark:bg-dark-800/30 dark:border-dark-600/50 dark:text-white/90',
            'dark:backdrop-blur-sm dark:hover:bg-dark-700/40',
            'dark:hover:border-dark-500/60 dark:focus:border-neon-cyan-500/40',
            'dark:focus:shadow-neon-cyan/10 dark:data-[placeholder]:text-white/50'
          ),
          content: cn(
            'bg-popover border-border text-popover-foreground',
            'dark:bg-dark-800/90 dark:border-dark-600/50 dark:text-white/90',
            'dark:backdrop-blur-xl'
          )
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'h-9 px-3 text-sm';
      case 'lg':
        return 'h-12 px-4 text-lg';
      default: // md
        return 'h-10 px-3.5 text-base';
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <div className={cn('space-y-2 group', className)}>
      {/* Label with modern styling */}
      <label className={cn(
        'text-sm font-semibold transition-colors duration-200',
        'text-foreground dark:text-white/90',
        error && 'text-destructive dark:text-red-400',
        disabled && 'opacity-50 cursor-not-allowed'
      )}>
        {label}
      </label>
      
      {/* Select container with error state */}
      <div className="relative">
        <Select 
          value={selectedOption?.value} 
          onValueChange={handleOptionChange}
          disabled={disabled}
        >
          <SelectTrigger className={cn(
            'w-full rounded-xl transition-all duration-300 outline-none',
            getSizeStyles(),
            variantStyles.trigger,
            icon && 'pl-10',
            error && cn(
              'border-destructive dark:border-red-500/60',
              'focus:border-destructive dark:focus:border-red-500',
              'focus:ring-destructive/30 dark:focus:ring-red-500/30'
            ),
            disabled && cn(
              'opacity-50 cursor-not-allowed',
              'hover:border-border dark:hover:border-dark-600/50'
            )
          )}>
            {/* Icon */}
            {icon && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <div className={cn(
                  'transition-colors duration-200',
                  variant === 'neon' ? 'text-neon-cyan-500/80' :
                  variant === 'glass' ? 'text-white/70' :
                  'text-muted-foreground dark:text-white/60',
                  error && 'text-destructive dark:text-red-400'
                )}>
                  {icon}
                </div>
              </div>
            )}
            
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          
          <SelectContent className={cn(
            'rounded-xl shadow-lg border',
            variantStyles.content,
            'animate-scale-in'
          )}>
            {options.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className={cn(
                  'rounded-lg transition-all duration-200 cursor-pointer',
                  'hover:bg-surface-hover focus:bg-surface-hover',
                  variant === 'glass' && 'hover:bg-glass-white-20 focus:bg-glass-white-20',
                  variant === 'neon' && cn(
                    'hover:bg-neon-cyan-500/20 focus:bg-neon-cyan-500/20',
                    'hover:text-neon-cyan-100 focus:text-neon-cyan-100'
                  ),
                  variant === 'default' && cn(
                    'dark:hover:bg-dark-700/60 dark:focus:bg-dark-700/60'
                  )
                )}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Error icon */}
        {error && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2 pointer-events-none">
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
        
        {/* Shimmer effect for glass and neon variants */}
        {(variant === 'glass' || variant === 'neon') && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none rounded-xl overflow-hidden transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer-slow" />
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <p 
          className="text-sm text-destructive dark:text-red-400 animate-slide-down"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Dropdown;

