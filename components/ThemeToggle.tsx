/**
 * Modern Theme Toggle Component
 * Beautiful 2025-style toggle switch with smooth animations
 */

import React from 'react';
import { useThemeContext } from './ThemeProvider';

interface ThemeToggleProps {
  /** Size variant of the toggle */
  size?: 'sm' | 'md' | 'lg';
  /** Show labels next to the toggle */
  showLabels?: boolean;
  /** Custom className */
  className?: string;
  /** Show system theme option */
  showSystemOption?: boolean;
}

/**
 * Theme Toggle Switch Component
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  size = 'md',
  showLabels = false,
  className = '',
  showSystemOption = true
}) => {
  const { mode, resolvedTheme, toggle, setMode } = useThemeContext();

  // Size configurations
  const sizeConfig = {
    sm: {
      width: '36px',
      height: '20px',
      thumbSize: '16px',
      thumbOffset: '2px'
    },
    md: {
      width: '48px',
      height: '26px',
      thumbSize: '22px',
      thumbOffset: '2px'
    },
    lg: {
      width: '56px',
      height: '32px',
      thumbSize: '28px',
      thumbOffset: '2px'
    }
  };

  const config = sizeConfig[size];

  const handleToggleClick = () => {
    toggle();
  };

  const handleModeSelect = (selectedMode: 'light' | 'dark' | 'system') => {
    setMode(selectedMode);
  };

  // Simple toggle switch (when system option is disabled)
  if (!showSystemOption) {
    return (
      <div className={`theme-toggle-container ${className}`}>
        {showLabels && (
          <span 
            className="theme-toggle-label"
            style={{
              fontSize: size === 'sm' ? '12px' : size === 'lg' ? '16px' : '14px',
              color: 'var(--color-foreground-muted)',
              marginRight: '8px'
            }}
          >
            {resolvedTheme === 'light' ? '☀️' : '🌙'}
          </span>
        )}
        
        <button
          onClick={handleToggleClick}
          className="theme-toggle-switch"
          aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} theme`}
          style={{
            width: config.width,
            height: config.height,
            background: resolvedTheme === 'dark' 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'var(--color-border)',
            border: 'none',
            borderRadius: config.height,
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            outline: 'none',
            boxShadow: resolvedTheme === 'dark' 
              ? '0 4px 12px rgba(102, 126, 234, 0.3)'
              : '0 2px 8px var(--color-shadow)'
          }}
        >
          <div
            className="theme-toggle-thumb"
            style={{
              width: config.thumbSize,
              height: config.thumbSize,
              background: '#ffffff',
              borderRadius: '50%',
              position: 'absolute',
              top: config.thumbOffset,
              left: resolvedTheme === 'dark' 
                ? `calc(100% - ${config.thumbSize} - ${config.thumbOffset})`
                : config.thumbOffset,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: size === 'sm' ? '8px' : size === 'lg' ? '12px' : '10px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
            }}
          >
            {resolvedTheme === 'light' ? '☀️' : '🌙'}
          </div>
        </button>

        {showLabels && (
          <span 
            className="theme-toggle-label"
            style={{
              fontSize: size === 'sm' ? '12px' : size === 'lg' ? '16px' : '14px',
              color: 'var(--color-foreground-secondary)',
              marginLeft: '8px',
              textTransform: 'capitalize'
            }}
          >
            {resolvedTheme}
          </span>
        )}
      </div>
    );
  }

  // Three-option toggle (light/system/dark)
  return (
    <div className={`theme-toggle-group ${className}`}>
      <div
        className="theme-toggle-options"
        style={{
          display: 'flex',
          background: 'var(--color-background-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          padding: '2px',
          position: 'relative'
        }}
      >
        {/* Background slider */}
        <div
          className="theme-toggle-slider"
          style={{
            position: 'absolute',
            top: '2px',
            left: mode === 'light' ? '2px' : mode === 'system' ? '33.33%' : '66.66%',
            width: '33.33%',
            height: 'calc(100% - 4px)',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)',
            borderRadius: '8px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
            transform: mode === 'system' ? 'translateX(-33.33%)' : mode === 'dark' ? 'translateX(-66.66%)' : 'translateX(0)'
          }}
        />

        {/* Light option */}
        <button
          onClick={() => handleModeSelect('light')}
          className={`theme-option ${mode === 'light' ? 'active' : ''}`}
          style={{
            flex: 1,
            padding: '8px 12px',
            border: 'none',
            background: 'transparent',
            color: mode === 'light' ? 'var(--color-primary-foreground)' : 'var(--color-foreground-secondary)',
            cursor: 'pointer',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          ☀️ Light
        </button>

        {/* System option */}
        <button
          onClick={() => handleModeSelect('system')}
          className={`theme-option ${mode === 'system' ? 'active' : ''}`}
          style={{
            flex: 1,
            padding: '8px 12px',
            border: 'none',
            background: 'transparent',
            color: mode === 'system' ? 'var(--color-primary-foreground)' : 'var(--color-foreground-secondary)',
            cursor: 'pointer',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          💻 Auto
        </button>

        {/* Dark option */}
        <button
          onClick={() => handleModeSelect('dark')}
          className={`theme-option ${mode === 'dark' ? 'active' : ''}`}
          style={{
            flex: 1,
            padding: '8px 12px',
            border: 'none',
            background: 'transparent',
            color: mode === 'dark' ? 'var(--color-primary-foreground)' : 'var(--color-foreground-secondary)',
            cursor: 'pointer',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          🌙 Dark
        </button>
      </div>

      {showLabels && (
        <div style={{
          marginTop: '8px',
          fontSize: '12px',
          color: 'var(--color-foreground-muted)',
          textAlign: 'center'
        }}>
          Currently: {mode === 'system' ? `${resolvedTheme} (system)` : mode}
        </div>
      )}
    </div>
  );
};

/**
 * Simple theme toggle button (icon only)
 */
export const ThemeToggleButton: React.FC<{
  className?: string;
  size?: number;
}> = ({ className = '', size = 24 }) => {
  const { resolvedTheme, toggle } = useThemeContext();

  return (
    <button
      onClick={toggle}
      className={`theme-toggle-button ${className}`}
      aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} theme`}
      style={{
        width: size,
        height: size,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.7,
        transition: 'all 0.2s ease',
        color: 'var(--color-foreground-secondary)',
        outline: 'none'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--color-background-tertiary)';
        e.currentTarget.style.color = 'var(--color-foreground)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = 'var(--color-foreground-secondary)';
      }}
    >
      {resolvedTheme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};