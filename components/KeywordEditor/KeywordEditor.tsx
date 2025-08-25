import { useEffect, useState } from "react"

import { MdEditSquare } from "react-icons/md"
import { IoMdSave } from "react-icons/io";
import { Storage } from "@plasmohq/storage"

import { Button } from "~components/ui/button"
import { Textarea } from "~components/ui/textarea"
import { cn } from "~lib/utils"
import { useTranslation } from "~hooks/useTranslation"
import { useThemeContext } from "~lib/theme-context"

interface KeywordEditorProps {
  variant?: 'default' | 'glass' | 'neon';
  className?: string;
  placeholder?: string;
  title?: string;
}

export const KeywordEditor = ({ 
  variant = 'default',
  className,
  placeholder,
  title
}: KeywordEditorProps) => {
  const { t } = useTranslation();
  const { isDarkMode } = useThemeContext();
  const translatedPlaceholder = placeholder || "Write your keywords here (SEPARATED BY COMMA). Example: Leadership, Management, Strategy";
  const translatedTitle = title || "Keyword Editor";
  const [keywords, setKeywords] = useState("")
  const [keywordsArray, setKeywordsArray] = useState<string[]>([])
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const fetchKeywords = async () => {
      const storage = new Storage()
      const storedKeywords = (await storage.get("keywords")) || []
      
      // Handle both array and string formats for backward compatibility
      if (Array.isArray(storedKeywords)) {
        setKeywordsArray(storedKeywords)
        setKeywords(storedKeywords.join(", "))
      } else if (typeof storedKeywords === "string") {
        setKeywords(storedKeywords)
        setKeywordsArray(storedKeywords.split(",").map(k => k.trim()).filter(k => k))
      } else {
        setKeywords("")
        setKeywordsArray([])
      }
    }

    fetchKeywords()
  }, [isEditing == false])

  const handleAddKeywords = async () => {
    setIsEditing(!isEditing)
    const storage = new Storage()

    const keywordsArr = keywords
      .split(",")
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword !== "")

    if (isEditing) {
      await storage.set("keywords", keywordsArr)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setKeywords(e.target.value)
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return {
          container: cn(
            'glass-card backdrop-blur-xl border-glass-white-20',
            'bg-gradient-to-br from-glass-white-10 to-glass-white-20'
          ),
          header: 'glass-effect p-4 rounded-t-2xl border-b border-glass-white-20',
          content: 'p-6 space-y-6',
          textarea: cn(
            'glass-effect backdrop-blur-sm',
            'bg-glass-white-10 border-glass-white-20 text-white/90',
            'placeholder:text-white/60 resize-none',
            'focus:bg-glass-white-20 focus:border-neon-cyan-500/50',
            'focus:ring-2 focus:ring-neon-cyan-500/30',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          ),
          buttonVariant: 'glass' as const
        };
      
      case 'neon':
        return {
          container: cn(
            'bg-dark-800/50 backdrop-blur-xl border border-neon-cyan-500/30',
            'rounded-2xl shadow-neon-cyan/10'
          ),
          header: 'bg-dark-700/50 p-4 rounded-t-2xl border-b border-neon-cyan-500/20',
          content: 'p-6 space-y-6 bg-dark-800/30',
          textarea: cn(
            'bg-dark-700/50 border-neon-cyan-500/30 text-neon-cyan-100',
            'placeholder:text-neon-cyan-500/60 backdrop-blur-sm resize-none',
            'hover:border-neon-cyan-500/50 hover:bg-dark-600/60',
            'focus:border-neon-cyan-500 focus:bg-dark-700/70',
            'focus:shadow-neon-cyan focus:ring-2 focus:ring-neon-cyan-500/50',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          ),
          buttonVariant: 'neon-cyan' as const
        };
      
      default:
        return {
          container: cn(
            'rounded-2xl shadow-card',
            isDarkMode 
              ? 'bg-dark-800/30 border border-dark-600/50 backdrop-blur-sm'
              : 'bg-white border border-slate-200'
          ),
          header: isDarkMode 
            ? 'bg-dark-700/30 p-4 rounded-t-2xl border-b border-dark-600/50'
            : 'bg-slate-50 p-4 rounded-t-2xl border-b border-slate-200',
          content: 'p-6 space-y-6',
          textarea: cn(
            isDarkMode ? [
              'bg-dark-700/30 border-dark-600/50 text-white/90',
              'placeholder:text-white/50 hover:bg-dark-600/40',
              'focus:border-neon-cyan-500/40 focus:shadow-neon-cyan/10'
            ].join(' ') : [
              'bg-white border-slate-300 text-slate-900',
              'placeholder:text-slate-500 hover:border-slate-400',
              'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30'
            ].join(' '),
            'transition-all duration-300 resize-none',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          ),
          buttonVariant: 'linkedin' as const
        };
    }
  };

  const variantStyles = getVariantStyles();
  const keywordCount = keywordsArray.length;

  return (
    <div className={cn(
      'group transition-all duration-300 overflow-hidden',
      variantStyles.container,
      className
    )}>
      {/* Header */}
      <div className={cn(
        'flex items-center justify-between',
        variantStyles.header
      )}>
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className={cn(
            'p-2 rounded-xl transition-all duration-200',
            variant === 'glass' && 'glass-effect border border-glass-white-30',
            variant === 'neon' && 'bg-neon-cyan-500/20 border border-neon-cyan-500/40',
            variant === 'default' && (isDarkMode ? 'bg-neon-cyan-500/10 border border-neon-cyan-500/20' : 'bg-blue-100 border border-blue-200')
          )}>
            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          
          <div>
            <h3 className={cn(
              'font-bold text-lg transition-colors duration-200',
              variant === 'glass' && 'text-white/90',
              variant === 'neon' && 'text-neon-cyan-100',
              variant === 'default' && (isDarkMode ? 'text-white/90' : 'text-slate-900')
            )}>
              🏷️ {title}
            </h3>
            <p className={cn(
              'text-sm opacity-80 transition-opacity duration-200 group-hover:opacity-100',
              variant === 'glass' && 'text-white/70',
              variant === 'neon' && 'text-neon-cyan-300',
              variant === 'default' && (isDarkMode ? 'text-white/60' : 'text-slate-600')
            )}>
              {keywordCount} {t('ui.keywords')} {isEditing ? `(${t('ui.editing')})` : `(${t('ui.read_only')})`}
            </p>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium',
          isEditing ? (
            variant === 'neon' ? 'bg-neon-orange-500/20 text-neon-orange-300 border border-neon-orange-500/40' :
            variant === 'glass' ? 'glass-effect border border-amber-400/30 text-amber-300' :
            isDarkMode ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-amber-100 text-amber-800 border border-amber-200'
          ) : (
            variant === 'neon' ? 'bg-neon-green-500/20 text-neon-green-300 border border-neon-green-500/40' :
            variant === 'glass' ? 'glass-effect border border-green-400/30 text-green-300' :
            isDarkMode ? 'bg-green-500/20 text-green-300 border border-green-500/40' : 'bg-green-100 text-green-800 border border-green-200'
          )
        )}>
          <div className={cn(
            'w-2 h-2 rounded-full',
            isEditing ? 'bg-current animate-pulse' : 'bg-current'
          )} />
          {isEditing ? t('ui.editing') : t('ui.saved')}
        </div>
      </div>

      {/* Content */}
      <div className={variantStyles.content}>
        {/* Textarea */}
        <div className="relative">
          <Textarea
            id="keywords"
            rows={6}
            value={keywords}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={!isEditing}
            className={cn(
              'w-full min-h-[150px] rounded-xl transition-all duration-300',
              variantStyles.textarea
            )}
            aria-label="Keywords input"
            aria-describedby="keywords-help"
          />
          
          {/* Character counter */}
          <div className={cn(
            'absolute bottom-3 right-3 text-xs opacity-70 transition-opacity duration-200',
            'group-hover:opacity-100',
            variant === 'glass' && 'text-white/60',
            variant === 'neon' && 'text-neon-cyan-400',
            variant === 'default' && (isDarkMode ? 'text-white/60' : 'text-slate-500')
          )}>
            {keywords.length} chars
          </div>
        </div>
        
        {/* Help text */}
        <p 
          id="keywords-help"
          className={cn(
            'text-xs opacity-70 transition-opacity duration-200 group-hover:opacity-90',
            variant === 'glass' && 'text-white/60',
            variant === 'neon' && 'text-neon-cyan-400',
            variant === 'default' && (isDarkMode ? 'text-white/60' : 'text-slate-500')
          )}
        >
          💡 {t('ui.separate_keywords')}
        </p>
        
        {/* Keywords preview (when not editing) */}
        {!isEditing && keywordsArray.length > 0 && (
          <div className="space-y-3">
            <h4 className={cn(
              'text-sm font-semibold',
              variant === 'glass' && 'text-white/80',
              variant === 'neon' && 'text-neon-cyan-200',
              variant === 'default' && (isDarkMode ? 'text-white/80' : 'text-slate-800')
            )}>
              {t('ui.keywords_preview')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {keywordsArray.map((keyword, index) => (
                <span
                  key={index}
                  className={cn(
                    'inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium',
                    'transition-all duration-200 hover:scale-105 animate-slide-in-from-left',
                    variant === 'glass' && 'glass-effect border border-glass-white-30 text-white/80',
                    variant === 'neon' && 'bg-neon-cyan-500/20 border border-neon-cyan-500/40 text-neon-cyan-200',
                    variant === 'default' && (isDarkMode 
                      ? 'bg-neon-cyan-500/20 border border-neon-cyan-500/30 text-neon-cyan-300'
                      : 'bg-blue-100 border border-blue-200 text-blue-800'
                    )
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action button */}
        <div className="flex justify-between items-center pt-2">
          <div className={cn(
            'text-xs flex items-center gap-2',
            variant === 'glass' && 'text-white/60',
            variant === 'neon' && 'text-neon-cyan-400',
            variant === 'default' && (isDarkMode ? 'text-white/60' : 'text-slate-500')
          )}>
            <svg className="w-3.5 h-3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {isEditing ? t('ui.click_save_changes') : t('ui.click_edit_modify')}
          </div>
          
          <Button 
            onClick={handleAddKeywords}
            variant={variantStyles.buttonVariant}
            className="flex items-center gap-2 micro-bounce transition-all duration-300"
            size="lg"
          >
            {isEditing ? (
              <>
                <IoMdSave className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" /> 
                {t('ui.save_changes')}
              </>
            ) : (
              <>
                <MdEditSquare className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" /> 
                {t('ui.edit_keywords')}
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Shimmer effect for glass and neon variants */}
      {(variant === 'glass' || variant === 'neon') && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none rounded-2xl overflow-hidden transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer-slow" />
        </div>
      )}
    </div>
  )
}
