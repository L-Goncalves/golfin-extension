/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./popup.tsx",
    "./components/**/*.{ts,tsx}",
    "./content-scripts/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./background/**/*.{ts,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 2025 Dark Mode Color Palette
        dark: {
          // Deep blacks and rich grays
          950: '#0a0a0b',
          900: '#0d0d0f',
          850: '#111113',
          800: '#151518',
          750: '#1a1a1e',
          700: '#1f1f24',
          650: '#24242a',
          600: '#2a2a32',
          550: '#30303a',
          500: '#363642',
          450: '#3c3c4a',
          400: '#424252',
          350: '#48485a',
          300: '#4e4e62',
          250: '#54546a',
          200: '#5a5a72',
          150: '#60607a',
          100: '#666682',
          50: '#6c6c8a'
        },
        // Neon accent colors
        neon: {
          cyan: {
            50: '#e0fffe',
            100: '#b8fffc',
            200: '#8dfff8',
            300: '#5efff3',
            400: '#36ffec',
            500: '#00ffe5', // Primary neon cyan
            600: '#00e6cc',
            700: '#00ccb3',
            800: '#00b399',
            900: '#009980'
          },
          purple: {
            50: '#f4e8ff',
            100: '#e6c7ff',
            200: '#d5a3ff',
            300: '#c17dff',
            400: '#ac5cff',
            500: '#9333ff', // Primary neon purple
            600: '#7c2dd4',
            700: '#6425aa',
            800: '#4d1d80',
            900: '#361556'
          },
          pink: {
            50: '#ffe8f8',
            100: '#ffc8ee',
            200: '#ffa5e3',
            300: '#ff7dd7',
            400: '#ff58ca',
            500: '#ff2db8', // Primary neon pink
            600: '#e6249f',
            700: '#cc1a86',
            800: '#b3116d',
            900: '#990954'
          },
          blue: {
            50: '#e8f4ff',
            100: '#c8e5ff',
            200: '#a5d4ff',
            300: '#7dc1ff',
            400: '#58acff',
            500: '#2d94ff', // Primary neon blue
            600: '#247de6',
            700: '#1a66cc',
            800: '#114fb3',
            900: '#093899'
          },
          green: {
            50: '#e8ffe8',
            100: '#c8ffc8',
            200: '#a5ffa5',
            300: '#7dff7d',
            400: '#58ff58',
            500: '#2dff2d', // Primary neon green
            600: '#24e624',
            700: '#1acc1a',
            800: '#11b311',
            900: '#099909'
          },
          orange: {
            50: '#fff4e8',
            100: '#ffe5c8',
            200: '#ffd4a5',
            300: '#ffc17d',
            400: '#ffac58',
            500: '#ff942d', // Primary neon orange
            600: '#e67d24',
            700: '#cc661a',
            800: '#b34f11',
            900: '#993809'
          }
        },
        // Glassmorphism colors
        glass: {
          white: 'rgba(255, 255, 255, 0.1)',
          'white-10': 'rgba(255, 255, 255, 0.1)',
          'white-20': 'rgba(255, 255, 255, 0.2)',
          'white-30': 'rgba(255, 255, 255, 0.3)',
          dark: 'rgba(0, 0, 0, 0.2)',
          'dark-10': 'rgba(0, 0, 0, 0.1)',
          'dark-20': 'rgba(0, 0, 0, 0.2)',
          'dark-30': 'rgba(0, 0, 0, 0.3)',
          'dark-40': 'rgba(0, 0, 0, 0.4)',
          'dark-50': 'rgba(0, 0, 0, 0.5)',
          cyan: 'rgba(0, 255, 229, 0.1)',
          purple: 'rgba(147, 51, 255, 0.1)',
          pink: 'rgba(255, 45, 184, 0.1)',
          blue: 'rgba(45, 148, 255, 0.1)'
        },
        // Updated existing colors for dark theme
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        // LinkedIn brand colors
        linkedin: {
          primary: '#0a66c2',
          'primary-dark': '#084a94',
          secondary: '#0073b1',
          background: '#f5f5f5',
          border: '#ddd'
        }
      },
      // Modern border radius system
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
        'full': '9999px',
        'glass': '1.25rem',
        'card': '1rem',
        'button': '0.75rem'
      },
      // Enhanced typography
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono Variable', 'JetBrains Mono', 'Consolas', 'monospace'],
        display: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif']
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }]
      },
      // Modern spacing system
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem'
      },
      // Enhanced box shadows with colored glows
      boxShadow: {
        // Glass shadows
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-lg': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        // Neon glows
        'neon-cyan': '0 0 20px rgba(0, 255, 229, 0.3), 0 0 40px rgba(0, 255, 229, 0.2), 0 0 60px rgba(0, 255, 229, 0.1)',
        'neon-purple': '0 0 20px rgba(147, 51, 255, 0.3), 0 0 40px rgba(147, 51, 255, 0.2), 0 0 60px rgba(147, 51, 255, 0.1)',
        'neon-pink': '0 0 20px rgba(255, 45, 184, 0.3), 0 0 40px rgba(255, 45, 184, 0.2), 0 0 60px rgba(255, 45, 184, 0.1)',
        'neon-blue': '0 0 20px rgba(45, 148, 255, 0.3), 0 0 40px rgba(45, 148, 255, 0.2), 0 0 60px rgba(45, 148, 255, 0.1)',
        'neon-green': '0 0 20px rgba(45, 255, 45, 0.3), 0 0 40px rgba(45, 255, 45, 0.2), 0 0 60px rgba(45, 255, 45, 0.1)',
        // Subtle shadows
        'inner-glass': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'dark': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
        'dark-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
        'dark-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        // Modern card shadows
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-focus': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      },
      // Backdrop blur for glassmorphism
      backdropBlur: {
        '4xl': '72px',
        '5xl': '96px',
        '6xl': '120px'
      },
      // Enhanced animations and transitions
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
        '450': '450ms',
        '600': '600ms',
        '800': '800ms',
        '900': '900ms',
        '1200': '1200ms'
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'ease-spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'ease-out-back': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'ease-in-out-back': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      },
      // Modern animations
      animation: {
        // Floating animations
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        // Pulse animations
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        // Glow animations
        'glow': 'glow 2s ease-in-out infinite alternate',
        'glow-cyan': 'glow-cyan 2s ease-in-out infinite alternate',
        'glow-purple': 'glow-purple 2s ease-in-out infinite alternate',
        'glow-pink': 'glow-pink 2s ease-in-out infinite alternate',
        'glow-blue': 'glow-blue 2s ease-in-out infinite alternate',
        // Shimmer effects
        'shimmer': 'shimmer 2.5s linear infinite',
        'shimmer-slow': 'shimmer 4s linear infinite',
        // Scale animations
        'scale-in': 'scale-in 0.2s ease-out',
        'scale-out': 'scale-out 0.2s ease-in',
        // Slide animations
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'slide-left': 'slide-left 0.3s ease-out',
        'slide-right': 'slide-right 0.3s ease-out',
        // Fade animations
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-out': 'fade-out 0.3s ease-in',
        // Bounce animations
        'bounce-in': 'bounce-in 0.6s ease-out',
        'bounce-slow': 'bounce 2s infinite'
      },
      keyframes: {
        // Float animation
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        // Glow animations
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)' },
          '100%': { boxShadow: '0 0 40px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.1)' }
        },
        'glow-cyan': {
          '0%': { boxShadow: '0 0 20px rgba(0, 255, 229, 0.2)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 255, 229, 0.4), 0 0 60px rgba(0, 255, 229, 0.2)' }
        },
        'glow-purple': {
          '0%': { boxShadow: '0 0 20px rgba(147, 51, 255, 0.2)' },
          '100%': { boxShadow: '0 0 40px rgba(147, 51, 255, 0.4), 0 0 60px rgba(147, 51, 255, 0.2)' }
        },
        'glow-pink': {
          '0%': { boxShadow: '0 0 20px rgba(255, 45, 184, 0.2)' },
          '100%': { boxShadow: '0 0 40px rgba(255, 45, 184, 0.4), 0 0 60px rgba(255, 45, 184, 0.2)' }
        },
        'glow-blue': {
          '0%': { boxShadow: '0 0 20px rgba(45, 148, 255, 0.2)' },
          '100%': { boxShadow: '0 0 40px rgba(45, 148, 255, 0.4), 0 0 60px rgba(45, 148, 255, 0.2)' }
        },
        // Shimmer effect
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        // Scale animations
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'scale-out': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' }
        },
        // Slide animations
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'slide-left': {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        'slide-right': {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        // Fade animations
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        // Bounce animation
        'bounce-in': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      // Gradient stops for modern gradients
      gradientColorStops: {
        'glass-start': 'rgba(255, 255, 255, 0.1)',
        'glass-end': 'rgba(255, 255, 255, 0.05)',
        'dark-start': 'rgba(0, 0, 0, 0.2)',
        'dark-end': 'rgba(0, 0, 0, 0.05)'
      }
    }
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        // Glassmorphism utilities
        '.glass': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-card': {
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        },
        // Neon border utilities
        '.border-neon-cyan': {
          borderColor: '#00ffe5',
          boxShadow: '0 0 10px rgba(0, 255, 229, 0.5)',
        },
        '.border-neon-purple': {
          borderColor: '#9333ff',
          boxShadow: '0 0 10px rgba(147, 51, 255, 0.5)',
        },
        '.border-neon-pink': {
          borderColor: '#ff2db8',
          boxShadow: '0 0 10px rgba(255, 45, 184, 0.5)',
        },
        // Text glow utilities
        '.text-glow-cyan': {
          color: '#00ffe5',
          textShadow: '0 0 10px rgba(0, 255, 229, 0.5)',
        },
        '.text-glow-purple': {
          color: '#9333ff',
          textShadow: '0 0 10px rgba(147, 51, 255, 0.5)',
        },
        '.text-glow-pink': {
          color: '#ff2db8',
          textShadow: '0 0 10px rgba(255, 45, 184, 0.5)',
        }
      }
      addUtilities(newUtilities)
    }
  ]
}