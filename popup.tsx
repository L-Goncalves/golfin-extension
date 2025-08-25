import React, { useEffect, useState } from "react"
import { Storage } from "@plasmohq/storage"

import { Button } from "~components/Button/Button"
import { TabFeed } from "~components/TabFeed/TabFeed"
import Tabs from "~components/Tabs/Tabs"

// @ts-ignore
import icon from "./assets/icon.png"
import { deleteAllStorage, getAllStorageItems } from "./content-scripts/storage"

import "~style.css"

import { MdOutlineLogout, MdSettings, MdDashboard } from "react-icons/md"
import { RiSparklingFill, RiLinkedinBoxFill } from "react-icons/ri"
import { HiSparkles } from "react-icons/hi2"

import { InputToggle } from "~components/InputToggle/InputToggle"
import { TabConnections } from "~components/TabConnections/TabConnections"
import { TabJobs } from "~components/TabJobs/TabJobs"
// import { autoApply } from "~content-scripts/jobs" // Not used in popup
import { isDev } from "~global"
import { useTranslation } from "~hooks/useTranslation"
import { LanguageSelector } from "~components/LanguageSelector/LanguageSelector"
import { ThemeProvider, useThemeContext } from "~lib/theme-context"
import { SimpleThemeToggle } from "~components/ui/theme-toggle"
import { GlassCard, GlassPanel } from "~components/ui/glass-card"

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 Extension Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          width: '500px',
          minHeight: '600px',
          padding: '20px',
          background: '#1a1a1a',
          color: '#ff6b6b',
          fontFamily: 'system-ui'
        }}>
          <h1>🚨 Extension Error</h1>
          <details style={{ marginTop: '10px' }}>
            <summary>Error Details</summary>
            <pre style={{ 
              background: '#2a2a2a', 
              padding: '10px', 
              borderRadius: '4px',
              fontSize: '12px',
              marginTop: '10px'
            }}>
              {this.state.error?.toString()}
            </pre>
          </details>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: '#ff6b6b',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              marginTop: '10px',
              cursor: 'pointer'
            }}
          >
            Reload Extension
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

function IndexPopup() {
  // Initialize critical styles and theme immediately
  useEffect(() => {
    // Apply emergency fallbacks immediately
    const root = document.documentElement
    const body = document.body
    
    // Ensure body is visible with fallback theme
    body.style.cssText = `
      width: 500px !important;
      min-height: 600px !important;
      background: hsl(220 15% 6%) !important;
      color: hsl(213 31% 91%) !important;
      display: block !important;
      opacity: 1 !important;
      margin: 0 !important;
      padding: 0 !important;
      font-family: Inter, system-ui, sans-serif !important;
    `
    
    // Apply dark theme class as fallback
    if (!root.classList.contains('light') && !root.classList.contains('dark')) {
      root.classList.add('dark')
    }
    
    // Add theme-transition class for smooth changes
    body.classList.add('theme-transition')
    
    console.log('🚀 Emergency theme fallbacks applied')
    
    return () => {
      body.classList.remove('theme-transition')
    }
  }, [])

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" enableSystem disableTransitionOnChange={false}>
        <IndexPopupContent />
      </ThemeProvider>
    </ErrorBoundary>
  )
}

function IndexPopupContent() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [initError, setInitError] = useState<string | null>(null)
  
  // Safely get translation and theme context with better error handling
  let t, themeData
  try {
    t = useTranslation()?.t || ((key: string) => key)
  } catch (error) {
    console.warn('Translation hook error:', error)
    t = (key: string) => key
  }
  
  try {
    themeData = useThemeContext()
  } catch (error) {
    console.warn('Theme context error:', error)
    // Robust fallback theme data
    themeData = {
      resolvedTheme: 'dark' as const,
      isDarkMode: true,
      isLightMode: false,
      theme: 'dark' as const,
      setTheme: () => {},
      toggleTheme: () => {},
      systemPreference: 'dark' as const
    }
  }
  
  const { resolvedTheme, isDarkMode, isLightMode } = themeData
  const manifest = typeof chrome !== 'undefined' && chrome.runtime ? chrome.runtime.getManifest() : { version: '0.0.0' }
  const version = manifest.version

  useEffect(() => {
    // Quick entrance animation - don't block on theme
    const timer = setTimeout(() => {
      setIsLoaded(true)
      console.log('✅ Popup loaded with theme:', resolvedTheme)
    }, 50) // Reduced from 100ms to 50ms
    return () => clearTimeout(timer)
  }, []) // Remove resolvedTheme dependency to prevent re-renders
  
  // Show minimal initialization error if any - but don't block
  if (initError) {
    console.warn('Extension initialization warning:', initError)
    // Don't return early - continue with fallback
  }
 
  // Wrap tab components in error boundaries
  const SafeTabFeed = () => {
    try {
      return <TabFeed />
    } catch (error) {
      console.error('TabFeed error:', error)
      return <div className="p-4">Error loading feed tab. Check console for details.</div>
    }
  }

  const SafeTabConnections = () => {
    try {
      return <TabConnections />
    } catch (error) {
      console.error('TabConnections error:', error)
      return <div className="p-4">Error loading connections tab. Check console for details.</div>
    }
  }

  const SafeTabJobs = () => {
    try {
      return <TabJobs />
    } catch (error) {
      console.error('TabJobs error:', error)
      return <div className="p-4">Error loading jobs tab. Check console for details.</div>
    }
  }

  const tabData = [
    { 
      id: "tab1", 
      label: t("tab1"), 
      content: <SafeTabFeed />,
      icon: <MdDashboard className="w-4 h-4" />
    },
    { 
      id: "tab3", 
      label: t("tab3"), 
      content: <SafeTabConnections />,
      icon: <RiLinkedinBoxFill className="w-4 h-4" />
    },
    { 
      id: "tab2", 
      label: t("tab2"), 
      content: <SafeTabJobs />,
      icon: <MdSettings className="w-4 h-4" />
    }
  ]

  return (
    <div 
      className={`
        w-full emergency-fallback
        ${isDarkMode 
          ? 'bg-gradient-to-br from-dark-950 via-dark-900 to-dark-850' 
          : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
        }
        relative overflow-hidden
        transition-all duration-300 ease-out
        ${isLoaded ? 'opacity-100' : 'opacity-80'}
      `}
      style={{
        width: '500px',
        minHeight: '600px',
        background: isDarkMode 
          ? 'linear-gradient(135deg, hsl(220 15% 6%), hsl(220 15% 9%), hsl(220 15% 8%))' 
          : 'linear-gradient(135deg, hsl(210 20% 98%), hsl(0 0% 100%), hsl(210 20% 95%))',
        // Inline emergency styles that override everything
        display: 'block',
        opacity: isLoaded ? '1' : '0.8',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
      role="main"
      aria-label="GolfIn LinkedIn Extension"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs */}
        <div className={`absolute -top-10 -left-10 w-32 h-32 rounded-full animate-float blur-xl ${
          isDarkMode ? 'bg-neon-cyan-500/10' : 'bg-neon-cyan-500/20'
        }`}></div>
        <div className={`absolute top-1/4 -right-10 w-24 h-24 rounded-full animate-float-slow blur-xl ${
          isDarkMode ? 'bg-neon-purple-500/10' : 'bg-neon-purple-500/20'
        }`}></div>
        <div className={`absolute -bottom-10 left-1/3 w-28 h-28 rounded-full animate-float-fast blur-xl ${
          isDarkMode ? 'bg-neon-pink-500/10' : 'bg-neon-pink-500/20'
        }`}></div>
        
        {/* Grid pattern overlay */}
        <div className={`absolute inset-0 ${isDarkMode ? 'opacity-[0.03]' : 'opacity-[0.08]'}`} 
             style={{
               backgroundImage: isDarkMode 
                 ? `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`
                 : `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
               backgroundSize: '20px 20px'
             }}
        ></div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 p-6 space-y-6">
        
        {/* Dev mode indicator */}
        {isDev && (
          <div className="glass-card border border-neon-orange-500/30 bg-neon-orange-500/5 animate-glow-cyan">
            <p className="text-neon-orange-400 text-sm font-medium flex items-center gap-2">
              <RiSparklingFill className="w-4 h-4" />
              {t("developer_mode_active") || "Developer mode is active"}
            </p>
          </div>
        )}

        {/* Header section with glassmorphism */}
        <GlassPanel 
          className="animate-slide-down" 
          neonGlow="cyan"
          aria-labelledby="app-title"
        >
          <div className="flex items-center justify-between min-w-0">
            {/* Logo and brand */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative" role="img" aria-label="GolfIn Logo">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neon-cyan-500 to-neon-purple-500 
                              flex items-center justify-center shadow-neon-cyan animate-glow-cyan">
                  <RiLinkedinBoxFill className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-neon-pink-500 
                              animate-pulse flex items-center justify-center" aria-hidden="true">
                  <HiSparkles className="w-2 h-2 text-white" />
                </div>
              </div>
              
              <div className="space-y-1">
                <h1 
                  id="app-title"
                  className="text-2xl font-bold bg-gradient-to-r from-neon-cyan-400 via-neon-purple-400 to-neon-pink-400 
                           bg-clip-text text-transparent animate-shimmer"
                >
                  GolfIn
                </h1>
                <div className="flex items-center gap-2" role="status" aria-label={`Version ${version}, Online`}>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full border ${
                    isDarkMode 
                      ? 'text-dark-200 bg-dark-800 border-dark-700' 
                      : 'text-slate-600 bg-slate-200 border-slate-300'
                  }`}>
                    v{version}
                  </span>
                  <div 
                    className="w-2 h-2 rounded-full bg-neon-green-400 animate-pulse shadow-neon-green"
                    aria-hidden="true"
                    title="Online"
                  ></div>
                </div>
              </div>
            </div>

            {/* Controls in header */}
            <div className="flex items-center gap-1 animate-slide-left flex-shrink-0">
              <SimpleThemeToggle />
              <LanguageSelector />
            </div>
          </div>
        </GlassPanel>

        {/* Main tabs section */}
        <main className="space-y-4 animate-slide-up">
          <Tabs tabs={tabData} />
        </main>

        {/* Developer tools - only visible in dev mode */}
        {isDev && (
          <div 
            role="region"
            aria-labelledby="dev-tools-title"
          >
            <GlassCard 
              className="border-destructive/30 bg-destructive/5 animate-fade-in p-4"
          >
            <h3 id="dev-tools-title" className="text-sm font-semibold text-destructive mb-3 flex items-center gap-2">
              <MdSettings className="w-4 h-4" aria-hidden="true" />
              {t("ui.developer_tools")}
            </h3>
            <div className="flex gap-2" role="group" aria-label="Developer actions">
              <button 
                onClick={deleteAllStorage}
                className="glass-button text-xs bg-destructive/10 border-destructive/30 text-destructive hover:bg-destructive/20 
                         transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5
                         focus:outline-none focus:ring-2 focus:ring-destructive/50 focus:ring-offset-2
                         focus:ring-offset-background"
                aria-describedby="clear-storage-desc"
              >
                {t("ui.clear_storage")}
                <span id="clear-storage-desc" className="sr-only">{t("ui.clears_storage_desc")}</span>
              </button>
              <button 
                onClick={getAllStorageItems}
                className="glass-button text-xs bg-neon-blue-500/10 border-neon-blue-500/30 text-neon-blue-400 
                         hover:bg-neon-blue-500/20 transition-all duration-300 hover:shadow-neon-blue hover:-translate-y-0.5
                         focus:outline-none focus:ring-2 focus:ring-neon-blue-500/50 focus:ring-offset-2
                         focus:ring-offset-background"
                aria-describedby="view-storage-desc"
              >
                {t("ui.view_storage")}
                <span id="view-storage-desc" className="sr-only">{t("ui.displays_storage_desc")}</span>
              </button>
            </div>
            </GlassCard>
          </div>
        )}

        {/* Footer with subtle branding */}
        <footer 
          className="text-center animate-fade-in" 
          role="contentinfo"
        >
        </footer>
      </div>
    </div>
  )
}

export default IndexPopup