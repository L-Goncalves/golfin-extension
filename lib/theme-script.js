// Theme initialization script to prevent FOUC (Flash of Unstyled Content)
// This script should run as early as possible in the document head

(function() {
  'use strict';
  
  const STORAGE_KEY = 'golfin-theme';
  
  // Get system preference
  function getSystemTheme() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark'; // Default to dark if unable to detect
  }
  
  // Get stored theme preference
  function getStoredTheme() {
    try {
      // For extension context, we'll use chrome.storage
      if (typeof chrome !== 'undefined' && chrome.storage) {
        // This will be handled by the React component since it's async
        return null;
      }
      
      // Fallback to localStorage for other contexts
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(STORAGE_KEY);
      }
    } catch (error) {
      console.warn('Failed to get stored theme:', error);
    }
    return null;
  }
  
  // Apply theme class immediately
  function applyInitialTheme() {
    const storedTheme = getStoredTheme();
    const systemTheme = getSystemTheme();
    
    // Determine which theme to apply
    let themeToApply = systemTheme; // Default to system preference
    
    if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
      themeToApply = storedTheme === 'system' ? systemTheme : storedTheme;
    }
    
    // Apply theme to document root
    const root = document.documentElement;
    
    // Remove any existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add the appropriate theme class
    root.classList.add(themeToApply);
    
    // Set data attribute for CSS selectors
    root.setAttribute('data-theme', themeToApply);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]') 
      || document.createElement('meta');
    
    if (!metaThemeColor.parentNode) {
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    
    metaThemeColor.content = themeToApply === 'dark' ? '#0a0a0b' : '#ffffff';
    
    // Add color-scheme meta for browser UI
    let colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');
    if (!colorSchemeMeta) {
      colorSchemeMeta = document.createElement('meta');
      colorSchemeMeta.name = 'color-scheme';
      document.head.appendChild(colorSchemeMeta);
    }
    colorSchemeMeta.content = themeToApply;
    
    return themeToApply;
  }
  
  // Listen for system theme changes
  function setupSystemThemeListener() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      mediaQuery.addListener(function(e) {
        // Only update if currently following system preference
        const storedTheme = getStoredTheme();
        if (!storedTheme || storedTheme === 'system') {
          applyInitialTheme();
        }
      });
    }
  }
  
  // Initialize theme immediately
  const appliedTheme = applyInitialTheme();
  
  // Setup system theme listener
  setupSystemThemeListener();
  
  // Expose utility functions for React component
  window.__THEME_INIT__ = {
    getSystemTheme,
    appliedTheme
  };
  
  // Add class to indicate theme script has run
  document.documentElement.classList.add('theme-script-loaded');
  
})();