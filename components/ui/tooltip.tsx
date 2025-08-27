import React, { useState, useEffect, useRef } from 'react'
import { cn } from '~lib/utils'
import { useTranslation } from '~hooks/useTranslation'

interface TooltipProps {
  content: string
  children: React.ReactNode
  className?: string
  position?: 'top' | 'bottom'
  offset?: number
}

export const Tooltip = ({ 
  content, 
  children, 
  className, 
  position = 'top',
  offset = 10
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [adjustedPosition, setAdjustedPosition] = useState<'top' | 'bottom'>(position)
  const [horizontalOffset, setHorizontalOffset] = useState(0)
  const [maxHeight, setMaxHeight] = useState<number | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  
  // Get current language for dynamic width adjustments
  const { currentLanguage } = useTranslation()

  useEffect(() => {
    if (isVisible && tooltipRef.current && triggerRef.current) {
      const tooltip = tooltipRef.current
      const trigger = triggerRef.current
      
      // Get tab panel container with multiple fallback strategies
      let tabPanel = trigger.closest('[role="tabpanel"]')
      
      // Fallback to other possible containers
      if (!tabPanel) {
        tabPanel = trigger.closest('.tab-connections') || 
                   trigger.closest('.tabfeed') || 
                   trigger.closest('.tab-jobs') ||
                   trigger.closest('main') ||
                   document.querySelector('main')
      }
      
      // If still no container, use viewport as fallback
      if (!tabPanel) {
        tabPanel = document.body
      }

      // Force a reflow to get accurate measurements
      tooltip.style.visibility = 'hidden'
      tooltip.style.display = 'block'
      
      const tooltipRect = tooltip.getBoundingClientRect()
      const tabPanelRect = tabPanel.getBoundingClientRect()
      const triggerRect = trigger.getBoundingClientRect()

      // Check vertical bounds and determine best position
      let finalPosition = position
      
      // Calculate space available above and below trigger within tab bounds
      const spaceAbove = triggerRect.top - tabPanelRect.top
      const spaceBelow = tabPanelRect.bottom - triggerRect.bottom
      
      // Calculate available heights after accounting for padding
      const topAvailableHeight = spaceAbove - 16
      const bottomAvailableHeight = spaceBelow - 16
      
      // SIMPLE LOGIC: Respect preferred position if space allows
      if (position === 'bottom' && spaceBelow >= 80) {
        finalPosition = 'bottom'
      } else if (position === 'top' && spaceAbove >= 80) {
        finalPosition = 'top'
      } else {
        // Otherwise choose the position with more space
        finalPosition = spaceAbove > spaceBelow ? 'top' : 'bottom'
      }

      // Calculate maximum height constraint - ALWAYS constrain when tooltip overflows
      let calculatedMaxHeight = null
      const currentAvailableHeight = finalPosition === 'top' ? topAvailableHeight : bottomAvailableHeight
      
      if (currentAvailableHeight < tooltipRect.height) {
        // Don't over-constrain - only apply if actually needed
        calculatedMaxHeight = Math.max(currentAvailableHeight - 10, 60) // Minimum 60px height
      }

      // Check horizontal bounds and adjust if needed
      let horizontalAdjustment = 0
      const tooltipLeft = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2)
      const tooltipRight = tooltipLeft + tooltipRect.width

      if (tooltipLeft < tabPanelRect.left) {
        horizontalAdjustment = tabPanelRect.left - tooltipLeft + 8 // 8px padding
      } else if (tooltipRight > tabPanelRect.right) {
        horizontalAdjustment = tabPanelRect.right - tooltipRight - 8 // 8px padding
      }

      // Restore visibility
      tooltip.style.visibility = 'visible'
      tooltip.style.display = ''

      setAdjustedPosition(finalPosition)
      setHorizontalOffset(horizontalAdjustment)
      setMaxHeight(calculatedMaxHeight)
    }
  }, [isVisible, position, offset])

  return (
    <div 
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div 
          ref={tooltipRef}
          className={cn(
            'absolute px-3 py-2 text-sm font-medium text-white rounded-lg',
            'transition-all duration-200 ease-out pointer-events-none',
            adjustedPosition === 'top' ? 'bottom-full left-1/2 -translate-x-1/2' : 'top-full left-1/2 -translate-x-1/2',
            className
          )}
          style={{
            [adjustedPosition === 'top' ? 'marginBottom' : 'marginTop']: `${offset}px`,
            zIndex: 999999,
            backgroundColor: '#000000',
            position: 'absolute',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            transform: `translateX(calc(-50% + ${horizontalOffset}px))`,
            // Dynamic max-width based on current language with minimum
            maxWidth: currentLanguage === 'portuguese' ? '280px' : '220px',
            minWidth: '180px',
            maxHeight: maxHeight !== null ? `${maxHeight}px` : undefined,
            overflowY: maxHeight !== null ? 'auto' as const : undefined,
            overflowWrap: maxHeight !== null ? 'break-word' as const : undefined,
            wordBreak: maxHeight !== null ? 'break-word' as const : undefined
          }}
        >
          {content}
        </div>
      )}
    </div>
  )
}