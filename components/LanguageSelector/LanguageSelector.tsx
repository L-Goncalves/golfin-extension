import React from "react"
import { useTranslation, type Language } from "~hooks/useTranslation"
import { Button } from "~components/ui/button"
import { cn } from "~lib/utils"
import { useThemeContext } from "~lib/theme-context"

export const LanguageSelector: React.FC = () => {
  const { currentLanguage, changeLanguage, t } = useTranslation()
  const { isDarkMode } = useThemeContext()

  const handleLanguageChange = (language: Language) => {
    changeLanguage(language)
  }

  return (
    <div className={`flex items-center gap-0.5 mb-0 p-1 rounded-2xl min-w-[200px] max-w-[240px] w-auto ${isDarkMode ? 'bg-glass-dark-10 border-glass-white-20' : 'bg-glass-white-10 border-slate-200'} border backdrop-blur-xl shadow-glass animate-slide-down overflow-visible`}>
      {/* Compact Label */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <div className={cn(
          "w-2 h-2 rounded-full transition-all duration-500 animate-pulse-slow",
          currentLanguage === "portuguese" 
            ? "bg-neon-cyan-500 shadow-neon-cyan animate-glow-cyan" 
            : "bg-neon-purple-500 shadow-neon-purple animate-glow-purple"
        )}></div>
        <label className={`text-xs font-medium ${isDarkMode ? 'text-dark-100' : 'text-slate-900'} select-none whitespace-nowrap min-w-[65px] flex-shrink-0 text-center`}>
          {t("language")}
        </label>
      </div>

      {/* Compact Language toggle */}
      <div className={`flex items-center gap-0.5 ${isDarkMode ? 'bg-glass-dark-20' : 'bg-glass-white-20'} border ${isDarkMode ? 'border-glass-white-10' : 'border-glass-dark-10'} rounded-xl p-0.5 backdrop-blur-lg ${isDarkMode ? 'shadow-dark' : 'shadow-light'} relative group flex-shrink-0 min-w-[90px]`}>
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan-500/5 to-neon-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
        
        {/* Portuguese Button - More compact */}
        <button
          className={cn(
            "relative z-10 flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-xs font-semibold",
            "transition-all duration-400 ease-out-back cursor-pointer micro-bounce",
            "hover:transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-neon-cyan-500/50",
            currentLanguage === "portuguese" 
              ? [
                  // Active state
                  "bg-gradient-to-r from-neon-cyan-500/30 to-neon-blue-500/30",
                  "text-white border border-neon-cyan-500/40",
                  "shadow-neon-cyan backdrop-blur-xl",
                  "before:absolute before:inset-0 before:bg-gradient-to-r before:from-neon-cyan-500/10 before:to-neon-blue-500/10 before:rounded-lg"
                ]
              : [
                  // Inactive state
                  `bg-transparent ${isDarkMode ? 'text-dark-200' : 'text-slate-500'}`,
                  `hover:bg-glass-white-10 ${isDarkMode ? 'hover:text-white' : 'hover:text-slate-700'}`,
                  "hover:border hover:border-glass-white-20",
                  "hover:shadow-dark hover:backdrop-blur-lg"
                ]
          )}
          onClick={() => handleLanguageChange("portuguese")}
        >
          <span className="text-base animate-float-slow">🇧🇷</span>
          <span>PT</span>
          {currentLanguage === "portuguese" && (
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-lg"></div>
          )}
        </button>

        {/* English Button - More compact */}
        <button
          className={cn(
            "relative z-10 flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-xs font-semibold",
            "transition-all duration-400 ease-out-back cursor-pointer micro-bounce",
            "hover:transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-neon-purple-500/50",
            currentLanguage === "english" 
              ? [
                  // Active state
                  "bg-gradient-to-r from-neon-purple-500/30 to-neon-pink-500/30",
                  "text-white border border-neon-purple-500/40",
                  "shadow-neon-purple backdrop-blur-xl",
                  "before:absolute before:inset-0 before:bg-gradient-to-r before:from-neon-purple-500/10 before:to-neon-pink-500/10 before:rounded-lg"
                ]
              : [
                  // Inactive state
                  `bg-transparent ${isDarkMode ? 'text-dark-200' : 'text-slate-500'}`,
                  `hover:bg-glass-white-10 ${isDarkMode ? 'hover:text-white' : 'hover:text-slate-700'}`,
                  "hover:border hover:border-glass-white-20",
                  "hover:shadow-dark hover:backdrop-blur-lg"
                ]
          )}
          onClick={() => handleLanguageChange("english")}
        >
          <span className="text-base animate-float-slow">🇺🇸</span>
          <span>EN</span>
          {currentLanguage === "english" && (
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-lg"></div>
          )}
        </button>
      </div>
    </div>
  )
}