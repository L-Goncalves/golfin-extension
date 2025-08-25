import React from "react";
import { Button } from "~components/ui/button";
import { cn } from "~lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: 'default' | 'glass' | 'neon';
  size?: 'sm' | 'md' | 'lg';
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisible?: number;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  variant = 'default',
  size = 'md',
  showFirstLast = true,
  showPrevNext = true,
  maxVisible = 7,
  className
}) => {
  // Calculate visible page range
  const getVisiblePages = () => {
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }
    
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(currentPage - half, 1);
    let end = Math.min(start + maxVisible - 1, totalPages);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(end - maxVisible + 1, 1);
    }
    
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  };

  const visiblePages = getVisiblePages();
  const showLeftEllipsis = visiblePages[0] > 2;
  const showRightEllipsis = visiblePages[visiblePages.length - 1] < totalPages - 1;

  const getVariantStyles = (isActive: boolean = false) => {
    switch (variant) {
      case 'glass':
        if (isActive) {
          return cn(
            'glass-effect backdrop-blur-xl',
            'bg-gradient-to-r from-neon-cyan-500/80 to-neon-purple-500/80',
            'border-glass-white-30 text-white shadow-neon-cyan',
            'hover:from-neon-cyan-400/90 hover:to-neon-purple-400/90'
          );
        }
        return cn(
          'glass-effect backdrop-blur-sm',
          'bg-glass-white-10 border-glass-white-20 text-white/80',
          'hover:bg-glass-white-20 hover:border-glass-white-30 hover:text-white',
          'hover:shadow-glass-lg'
        );
      
      case 'neon':
        if (isActive) {
          return cn(
            'bg-gradient-to-r from-neon-cyan-500 to-neon-purple-500',
            'border-neon-cyan-400 text-white shadow-neon-cyan',
            'hover:from-neon-cyan-400 hover:to-neon-purple-400 animate-glow-pulse'
          );
        }
        return cn(
          'bg-dark-700/50 border-neon-cyan-500/30 text-neon-cyan-100',
          'hover:border-neon-cyan-500/50 hover:bg-dark-600/60',
          'hover:shadow-neon-cyan/20 hover:text-neon-cyan-50'
        );
      
      default:
        if (isActive) {
          return cn(
            'bg-primary text-primary-foreground border-primary',
            'hover:bg-primary/90',
            'dark:bg-neon-cyan-500 dark:text-dark-900 dark:border-neon-cyan-400'
          );
        }
        return cn(
          'bg-background border-border text-foreground',
          'hover:bg-surface-hover hover:border-border-hover',
          'dark:bg-dark-700/30 dark:border-dark-600/50 dark:text-white/90',
          'dark:hover:bg-dark-600/50 dark:hover:border-dark-500/70'
        );
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'h-8 w-8 text-xs';
      case 'lg':
        return 'h-12 w-12 text-base';
      default: // md
        return 'h-10 w-10 text-sm';
    }
  };

  const buttonBaseClasses = cn(
    'rounded-xl font-semibold transition-all duration-300 micro-bounce',
    'flex items-center justify-center border',
    'hover:scale-105 active:scale-95',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    getSizeStyles()
  );

  const ellipsisClasses = cn(
    'flex items-center justify-center',
    getSizeStyles(),
    'text-muted-foreground dark:text-white/50'
  );

  if (totalPages <= 1) return null;

  return (
    <nav className={cn(
      'flex items-center justify-center gap-1',
      className
    )} aria-label="Pagination">
      {/* First page button */}
      {showFirstLast && currentPage > 1 && (
        <button
          onClick={() => onPageChange(1)}
          className={cn(buttonBaseClasses, getVariantStyles(false))}
          aria-label="Go to first page"
        >
          <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Previous page button */}
      {showPrevNext && currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className={cn(buttonBaseClasses, getVariantStyles(false))}
          aria-label="Go to previous page"
        >
          <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* First page number (if not in visible range) */}
      {showLeftEllipsis && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={cn(buttonBaseClasses, getVariantStyles(false))}
            aria-label="Go to page 1"
          >
            1
          </button>
          <div className={ellipsisClasses} aria-hidden="true">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14" />
            </svg>
          </div>
        </>
      )}

      {/* Visible page numbers */}
      {visiblePages.map((page, index) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          disabled={page === currentPage}
          className={cn(
            buttonBaseClasses,
            getVariantStyles(page === currentPage),
            page === currentPage && 'cursor-default',
            'animate-slide-in-from-top'
          )}
          style={{ animationDelay: `${index * 50}ms` }}
          aria-label={`Go to page ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {/* Last page number (if not in visible range) */}
      {showRightEllipsis && (
        <>
          <div className={ellipsisClasses} aria-hidden="true">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14" />
            </svg>
          </div>
          <button
            onClick={() => onPageChange(totalPages)}
            className={cn(buttonBaseClasses, getVariantStyles(false))}
            aria-label={`Go to page ${totalPages}`}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next page button */}
      {showPrevNext && currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className={cn(buttonBaseClasses, getVariantStyles(false))}
          aria-label="Go to next page"
        >
          <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Last page button */}
      {showFirstLast && currentPage < totalPages && (
        <button
          onClick={() => onPageChange(totalPages)}
          className={cn(buttonBaseClasses, getVariantStyles(false))}
          aria-label="Go to last page"
        >
          <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </nav>
  );
};

export default Pagination;
