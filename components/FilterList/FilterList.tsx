import { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

import { Input } from "~components/Input/Input"
import Pagination from "~components/Pagination/Pagination"
import { useTranslation } from "~hooks/useTranslation"
import { cn } from "~lib/utils"

interface FilterListProps {
  type: "domain" | "company" | "searches";
  variant?: 'default' | 'glass' | 'neon';
  className?: string;
}

export const FilterList = ({
  type,
  variant = 'default',
  className
}: FilterListProps) => {
  const { t } = useTranslation()
  const [filters, setFilters] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleDeletion = async (filterToDelete: string) => {
    const updatedFilters = filters.filter((filter) => filter !== filterToDelete)
    setFilters(updatedFilters)

    const storage = new Storage()
    await storage.set(getStorageKey(), updatedFilters)
  }

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index) // Set the copied index
    setTimeout(() => setCopiedIndex(null), 2000) // Reset after 2 seconds
  }

  const getStorageKey = () => {
    if (type === "domain") return "domains"
    if (type === "company") return "companies"
    if (type === "searches") return "searches"
    return ""
  }

  useEffect(() => {
    const fetchFilters = async () => {
      const storage = new Storage()
      const filtersStored: string[] = (await storage.get(getStorageKey())) || []
      setFilters(filtersStored)
    }

    fetchFilters()
  }, [type])

  const filteredFilters = filters.filter((filter) =>
    filter.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredFilters.slice(indexOfFirstItem, indexOfLastItem)

  const totalPages = Math.ceil(filteredFilters.length / itemsPerPage)

  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return {
          container: 'glass-card backdrop-blur-xl border-glass-white-20',
          header: 'glass-effect p-6 rounded-t-2xl border-b border-glass-white-20',
          content: 'p-6 bg-glass-white-10',
          item: cn(
            'glass-effect backdrop-blur-sm border-glass-white-20',
            'hover:border-glass-white-30 hover:bg-glass-white-20'
          ),
          text: 'text-white/90',
          warning: 'text-amber-300/90'
        };
      
      case 'neon':
        return {
          container: 'bg-dark-800/50 backdrop-blur-xl border border-neon-cyan-500/30 rounded-2xl shadow-neon-cyan/10',
          header: 'bg-dark-700/50 p-6 rounded-t-2xl border-b border-neon-cyan-500/20',
          content: 'p-6 bg-dark-800/30',
          item: cn(
            'bg-dark-700/40 border border-neon-cyan-500/30 backdrop-blur-sm',
            'hover:border-neon-cyan-500/50 hover:bg-dark-600/50 hover:shadow-neon-cyan/20'
          ),
          text: 'text-neon-cyan-100',
          warning: 'text-neon-orange-400'
        };
      
      default:
        return {
          container: 'bg-background border border-border rounded-2xl shadow-card dark:bg-dark-800/30 dark:border-dark-600/50',
          header: 'bg-surface p-6 rounded-t-2xl border-b border-border dark:bg-dark-700/30 dark:border-dark-600/50',
          content: 'p-6',
          item: cn(
            'bg-surface border border-border',
            'hover:border-border-hover hover:bg-surface-hover hover:shadow-card-hover',
            'dark:bg-dark-700/30 dark:border-dark-600/50',
            'dark:hover:border-dark-500/70 dark:hover:bg-dark-600/40'
          ),
          text: 'text-foreground dark:text-white/90',
          warning: 'text-amber-600 dark:text-amber-400'
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <div className={cn(
      'space-y-0 overflow-hidden transition-all duration-300',
      variantStyles.container,
      className
    )}>
      {/* Header Section */}
      <div className={cn(
        'space-y-4',
        variantStyles.header
      )}>
        <div className="flex items-center gap-3">
          {/* Icon based on type */}
          <div className={cn(
            'p-2 rounded-xl transition-colors duration-200',
            variant === 'glass' && 'glass-effect border border-glass-white-30',
            variant === 'neon' && 'bg-neon-cyan-500/20 border border-neon-cyan-500/40',
            variant === 'default' && 'bg-primary/10 border border-primary/20'
          )}>
            {type === "domain" ? (
              <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            ) : type === "company" ? (
              <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
          
          <h2 className={cn(
            'text-xl font-bold transition-colors duration-200',
            variantStyles.text
          )}>
            {type === "domain"
              ? t("tabjobs.tabs.domains")
              : type === "company"
                ? t("tabjobs.tabs.companies")
                : t("tabjobs.tabs.searches")}
          </h2>
        </div>
        
        <div className={cn(
          'space-y-3 text-sm opacity-90',
          variantStyles.text
        )}>
          <p>
            {t("filterlist.general_tip")}
          </p>
          {type === "searches" && (
            <div className="space-y-2 p-3 rounded-xl bg-current/5 border border-current/10">
              <p>
                {t("filterlist.searches_tip1")}
              </p>
              <p>
                {t("filterlist.searches_tip2")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className={cn(
        'space-y-6',
        variantStyles.content
      )}>
        {/* Search Input */}
        <Input
          label={t("filterlist.search_label")}
          placeholder={t("filterlist.search_placeholder")}
          value={searchTerm}
          onChange={(value) => setSearchTerm(value)}
          variant={variant === 'default' ? 'default' : variant}
          icon={
            <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />
        
        {/* Items List or Empty State */}
        {currentItems.length === 0 ? (
          <div className={cn(
            'text-center py-12 space-y-4',
            'border-2 border-dashed rounded-xl',
            variant === 'glass' && 'border-glass-white-20 bg-glass-white-10',
            variant === 'neon' && 'border-neon-cyan-500/30 bg-neon-cyan-500/5',
            variant === 'default' && 'border-border dark:border-dark-600/50 bg-surface dark:bg-dark-700/20'
          )}>
            <div className={cn(
              'w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4',
              variant === 'glass' && 'glass-effect border border-glass-white-30',
              variant === 'neon' && 'bg-neon-cyan-500/20 border border-neon-cyan-500/40',
              variant === 'default' && 'bg-muted dark:bg-dark-600/50'
            )}>
              <svg className="w-8 h-8 opacity-50" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <p className={cn(
                'font-semibold',
                variantStyles.warning
              )}>
                {t("filterlist.no_items")}
              </p>
              <p className={cn(
                'text-sm opacity-80',
                variantStyles.text
              )}>
                {type == "searches" ? (
                  t("filterlist.no_searches_tip")
                ) : (
                  t("filterlist.no_items_tip")
                )}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {currentItems.map((filter, index) => (
              <div
                key={`${filter}-${index}`}
                className={cn(
                  'group relative p-4 rounded-xl transition-all duration-300',
                  'flex items-center justify-between gap-4',
                  'animate-slide-in-from-left',
                  variantStyles.item,
                  type === "searches" && cn(
                    'cursor-copy hover:scale-[1.02] micro-bounce',
                    copiedIndex === index && 'ring-2 ring-offset-2 ring-green-500/50'
                  )
                )}
                onClick={() => type === "searches" && handleCopy(filter, index)}
                title={filter}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Content */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Type indicator */}
                  <div className={cn(
                    'w-2 h-2 rounded-full flex-shrink-0',
                    variant === 'glass' && 'bg-white/60',
                    variant === 'neon' && 'bg-neon-cyan-400',
                    variant === 'default' && 'bg-primary dark:bg-neon-cyan-400'
                  )} />
                  
                  {/* Text content */}
                  <span className={cn(
                    'font-medium truncate transition-colors duration-200',
                    variantStyles.text,
                    type === "searches" && 'select-none',
                    copiedIndex === index && 'text-green-400'
                  )}>
                    {copiedIndex === index
                      ? t("filterlist.copied_message")
                      : filter.slice(0, 60)}
                  </span>
                  
                  {/* Copy indicator for searches */}
                  {type === "searches" && (
                    <div className={cn(
                      'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                      'text-xs px-2 py-1 rounded-md',
                      variant === 'glass' && 'bg-glass-white-20 text-white/80',
                      variant === 'neon' && 'bg-neon-cyan-500/20 text-neon-cyan-300',
                      variant === 'default' && 'bg-muted text-muted-foreground'
                    )}>
                      Click to copy
                    </div>
                  )}
                </div>
                
                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletion(filter);
                  }}
                  className={cn(
                    'p-2 rounded-lg transition-all duration-200 flex-shrink-0',
                    'opacity-0 group-hover:opacity-100 hover:scale-110 micro-bounce',
                    'focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2',
                    variant === 'glass' && cn(
                      'glass-effect border border-red-400/30 text-red-300',
                      'hover:border-red-400/50 hover:bg-red-500/20',
                      'focus:ring-red-400/50'
                    ),
                    variant === 'neon' && cn(
                      'bg-red-500/20 border border-red-400/40 text-red-300',
                      'hover:border-red-400/60 hover:bg-red-500/30 hover:shadow-red-500/20',
                      'focus:ring-red-400/50'
                    ),
                    variant === 'default' && cn(
                      'bg-destructive/10 border border-destructive/20 text-destructive',
                      'hover:bg-destructive/20 hover:border-destructive/40',
                      'focus:ring-destructive/50 dark:bg-red-500/20 dark:text-red-400'
                    )
                  )}
                  title={t("filterlist.delete_button")}
                  aria-label={`Delete ${filter}`}
                >
                  <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pt-4 border-t border-current/10">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              variant={variant}
            />
          </div>
        )}
      </div>
    </div>
  )
}
