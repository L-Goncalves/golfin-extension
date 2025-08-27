import React, { useRef, useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '~lib/utils'
import { useTranslation } from '~hooks/useTranslation'

// Positioning types for comprehensive tooltip system
type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'
type TooltipAlignment = 'start' | 'center' | 'end'
type TooltipPlacement = `${TooltipPosition}-${TooltipAlignment}` | TooltipPosition

// Viewport and measurement interfaces
interface ViewportMeasurement {
  width: number
  height: number
  scrollX: number
  scrollY: number
}

interface ElementBounds {
  top: number
  left: number
  right: number
  bottom: number
  width: number
  height: number
  centerX: number
  centerY: number
}

interface TooltipDimensions {
  width: number
  height: number
  maxWidth: number
  estimatedHeight: number
}

// Position calculation result with collision detection
interface PositionResult {
  position: TooltipPosition
  alignment: TooltipAlignment
  coordinates: { top: number; left: number }
  arrowPosition: { top?: number; left?: number; right?: number; bottom?: number }
  isConstrained: boolean
  hasOverflow: boolean
  confidence: number // 0-1, how well this position fits
  adjustmentReason?: string[]
}

interface AdvancedTooltipProps {
  content: string
  children: React.ReactNode
  className?: string
  preferredPosition?: TooltipPosition
  preferredAlignment?: TooltipAlignment
  maxWidth?: number
  margin?: number
  offset?: number
  allowFlip?: boolean
  allowShift?: boolean
  containerSelector?: string
  detectPortuguese?: boolean
  showArrow?: boolean
  trigger?: 'hover' | 'click' | 'focus'
  delayShow?: number
  delayHide?: number
  onShow?: () => void
  onHide?: () => void
}

export const AdvancedTooltip = ({
  content,
  children,
  className,
  preferredPosition = 'top',
  preferredAlignment = 'center',
  maxWidth = 280,
  margin = 16,
  offset = 8,
  allowFlip = true,
  allowShift = true,
  containerSelector,
  detectPortuguese = true,
  showArrow = true,
  trigger = 'hover',
  delayShow = 100,
  delayHide = 300,
  onShow,
  onHide
}: AdvancedTooltipProps) => {
  const [positionResult, setPositionResult] = useState<PositionResult | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipDimensions, setTooltipDimensions] = useState<TooltipDimensions>({ 
    width: 0, 
    height: 0, 
    maxWidth, 
    estimatedHeight: 0 
  })
  
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const measurementRef = useRef<HTMLDivElement>(null)
  const showTimeoutRef = useRef<NodeJS.Timeout>()
  const hideTimeoutRef = useRef<NodeJS.Timeout>()
  const resizeObserverRef = useRef<ResizeObserver>()

  // Advanced viewport and element measurement system
  const getViewportMeasurement = useCallback((): ViewportMeasurement => {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollX: window.scrollX || window.pageXOffset,
      scrollY: window.scrollY || window.pageYOffset
    }
  }, [])

  const getElementBounds = useCallback((element: HTMLElement, viewport: ViewportMeasurement): ElementBounds => {
    const rect = element.getBoundingClientRect()
    return {
      top: rect.top + viewport.scrollY,
      left: rect.left + viewport.scrollX,
      right: rect.right + viewport.scrollX,
      bottom: rect.bottom + viewport.scrollY,
      width: rect.width,
      height: rect.height,
      centerX: rect.left + viewport.scrollX + rect.width / 2,
      centerY: rect.top + viewport.scrollY + rect.height / 2
    }
  }, [])

  const getContainerBounds = useCallback((viewport: ViewportMeasurement): ElementBounds => {
    if (containerSelector) {
      const container = document.querySelector(containerSelector) as HTMLElement
      if (container) {
        return getElementBounds(container, viewport)
      }
    }
    
    // Default to viewport bounds for browser extension contexts
    return {
      top: viewport.scrollY,
      left: viewport.scrollX,
      right: viewport.scrollX + viewport.width,
      bottom: viewport.scrollY + viewport.height,
      width: viewport.width,
      height: viewport.height,
      centerX: viewport.scrollX + viewport.width / 2,
      centerY: viewport.scrollY + viewport.height / 2
    }
  }, [containerSelector, getElementBounds])

  // Get current language from global hook
  const { currentLanguage } = useTranslation()

  // Language-specific text optimization
  const optimizeForLanguage = useCallback((text: string): { adjustedMaxWidth: number; estimatedHeight: number } => {
    if (!detectPortuguese) return { adjustedMaxWidth: maxWidth, estimatedHeight: 40 }
    
    // Language-specific width adjustments
    const languageWidthMultipliers: Record<string, number> = {
      portuguese: 1.25, // Portuguese has longer words
      english: 1.0,     // English is baseline
      spanish: 1.15,    // Spanish slightly longer
      french: 1.2,      // French moderately longer
      // Add more languages as needed
    }
    
    const multiplier = languageWidthMultipliers[currentLanguage] || 1.0
    
    if (multiplier > 1.0) {
      // Language tends to have longer words, so we increase max width
      const words = text.split(' ')
      const avgWordLength = words.reduce((acc, word) => acc + word.length, 0) / words.length
      const adjustedMaxWidth = Math.min(maxWidth * (avgWordLength > 8 ? multiplier : multiplier * 0.92), 340)
      
      // Estimate height based on text length and width
      const charsPerLine = adjustedMaxWidth / 8 // Approximate characters per line
      const lines = Math.ceil(text.length / charsPerLine)
      const estimatedHeight = Math.max(40, lines * 22 + 24) // 22px line height + padding
      
      return { adjustedMaxWidth, estimatedHeight }
    }
    
    return { adjustedMaxWidth: maxWidth, estimatedHeight: 40 }
  }, [detectPortuguese, maxWidth, currentLanguage])

  // Mathematical formulas for precise positioning calculations
  const calculatePositionCoordinates = useCallback((
    position: TooltipPosition,
    triggerBounds: ElementBounds,
    tooltipDims: TooltipDimensions,
    alignment: TooltipAlignment = 'center'
  ): { top: number; left: number } => {
    let top: number, left: number
    
    // Vertical positioning formulas
    switch (position) {
      case 'top':
        top = triggerBounds.top - tooltipDims.height - offset
        break
      case 'bottom':
        top = triggerBounds.bottom + offset
        break
      case 'left':
      case 'right':
        // Vertical centering for side positions with alignment adjustments
        const verticalCenter = triggerBounds.top + (triggerBounds.height - tooltipDims.height) / 2
        switch (alignment) {
          case 'start':
            top = triggerBounds.top
            break
          case 'end':
            top = triggerBounds.bottom - tooltipDims.height
            break
          case 'center':
          default:
            top = verticalCenter
            break
        }
        break
    }
    
    // Horizontal positioning formulas
    switch (position) {
      case 'top':
      case 'bottom':
        // Horizontal alignment for top/bottom positions
        switch (alignment) {
          case 'start':
            left = triggerBounds.left
            break
          case 'end':
            left = triggerBounds.right - tooltipDims.width
            break
          case 'center':
          default:
            left = triggerBounds.centerX - tooltipDims.width / 2
            break
        }
        break
      case 'left':
        left = triggerBounds.left - tooltipDims.width - offset
        break
      case 'right':
        left = triggerBounds.right + offset
        break
    }
    
    return { top, left }
  }, [offset])

  // Collision detection algorithm for all 4 directions
  const checkCollision = useCallback((
    position: TooltipPosition,
    triggerBounds: ElementBounds,
    tooltipDims: TooltipDimensions,
    containerBounds: ElementBounds,
    alignment: TooltipAlignment = 'center'
  ): { hasCollision: boolean; overflowAreas: string[]; confidence: number; severity: number } => {
    const coords = calculatePositionCoordinates(position, triggerBounds, tooltipDims, alignment)
    const tooltipBounds = {
      top: coords.top,
      left: coords.left,
      right: coords.left + tooltipDims.width,
      bottom: coords.top + tooltipDims.height
    }
    
    const overflowAreas: string[] = []
    let confidence = 1.0
    let totalOverflow = 0
    
    // Check all boundaries with margin and calculate overflow severity
    const overflows = {
      top: Math.max(0, containerBounds.top + margin - tooltipBounds.top),
      bottom: Math.max(0, tooltipBounds.bottom - (containerBounds.bottom - margin)),
      left: Math.max(0, containerBounds.left + margin - tooltipBounds.left),
      right: Math.max(0, tooltipBounds.right - (containerBounds.right - margin))
    }
    
    Object.entries(overflows).forEach(([side, overflow]) => {
      if (overflow > 0) {
        overflowAreas.push(side)
        totalOverflow += overflow
        // Reduce confidence based on overflow severity
        const severityFactor = Math.min(1, overflow / (side === 'left' || side === 'right' ? tooltipDims.width : tooltipDims.height))
        confidence -= severityFactor * 0.4
      }
    })
    
    return {
      hasCollision: overflowAreas.length > 0,
      overflowAreas,
      confidence: Math.max(0, confidence),
      severity: totalOverflow
    }
  }, [calculatePositionCoordinates, margin])

  // Dynamic arrow positioning system that adjusts to tooltip placement
  const calculateArrowPosition = useCallback((
    position: TooltipPosition,
    alignment: TooltipAlignment,
    triggerBounds: ElementBounds,
    tooltipCoords: { top: number; left: number },
    tooltipDims: TooltipDimensions
  ): { top?: number; left?: number; right?: number; bottom?: number } => {
    const arrowSize = 8
    const arrowOffset = 4 // Minimum distance from edge
    
    switch (position) {
      case 'top':
        return {
          bottom: -arrowSize,
          left: Math.max(
            arrowOffset,
            Math.min(
              tooltipDims.width - arrowOffset - arrowSize,
              triggerBounds.centerX - tooltipCoords.left - arrowSize / 2
            )
          )
        }
      case 'bottom':
        return {
          top: -arrowSize,
          left: Math.max(
            arrowOffset,
            Math.min(
              tooltipDims.width - arrowOffset - arrowSize,
              triggerBounds.centerX - tooltipCoords.left - arrowSize / 2
            )
          )
        }
      case 'left':
        return {
          right: -arrowSize,
          top: Math.max(
            arrowOffset,
            Math.min(
              tooltipDims.height - arrowOffset - arrowSize,
              triggerBounds.centerY - tooltipCoords.top - arrowSize / 2
            )
          )
        }
      case 'right':
        return {
          left: -arrowSize,
          top: Math.max(
            arrowOffset,
            Math.min(
              tooltipDims.height - arrowOffset - arrowSize,
              triggerBounds.centerY - tooltipCoords.top - arrowSize / 2
            )
          )
        }
    }
  }, [])

  // Apply constraint adjustments to improve positioning
  const applyConstraintAdjustments = useCallback((
    result: PositionResult,
    containerBounds: ElementBounds,
    tooltipDims: TooltipDimensions,
    triggerBounds: ElementBounds
  ): PositionResult => {
    let { coordinates } = result
    const adjustmentReasons: string[] = []
    let adjusted = false
    
    // Calculate max allowable adjustments to avoid moving tooltip too far from trigger
    const maxHorizontalShift = tooltipDims.width * 0.8
    const maxVerticalShift = tooltipDims.height * 0.8
    
    // Horizontal adjustments with limits
    const leftOverflow = containerBounds.left + margin - coordinates.left
    const rightOverflow = coordinates.left + tooltipDims.width - (containerBounds.right - margin)
    
    if (leftOverflow > 0 && leftOverflow <= maxHorizontalShift) {
      coordinates.left += leftOverflow
      adjustmentReasons.push(`Shifted right by ${leftOverflow}px to avoid left overflow`)
      adjusted = true
    } else if (rightOverflow > 0 && rightOverflow <= maxHorizontalShift) {
      coordinates.left -= rightOverflow
      adjustmentReasons.push(`Shifted left by ${rightOverflow}px to avoid right overflow`)
      adjusted = true
    }
    
    // Vertical adjustments with limits
    const topOverflow = containerBounds.top + margin - coordinates.top
    const bottomOverflow = coordinates.top + tooltipDims.height - (containerBounds.bottom - margin)
    
    if (topOverflow > 0 && topOverflow <= maxVerticalShift) {
      coordinates.top += topOverflow
      adjustmentReasons.push(`Shifted down by ${topOverflow}px to avoid top overflow`)
      adjusted = true
    } else if (bottomOverflow > 0 && bottomOverflow <= maxVerticalShift) {
      coordinates.top -= bottomOverflow
      adjustmentReasons.push(`Shifted up by ${bottomOverflow}px to avoid bottom overflow`)
      adjusted = true
    }
    
    if (adjusted) {
      // Recalculate arrow position after adjustments
      result.arrowPosition = calculateArrowPosition(
        result.position,
        result.alignment,
        triggerBounds,
        coordinates,
        tooltipDims
      )
      result.isConstrained = true
      result.adjustmentReason = adjustmentReasons
    }
    
    return { ...result, coordinates }
  }, [calculateArrowPosition, margin])

  // Intelligent position selection with priority system and comprehensive scoring
  const findBestPosition = useCallback((
    triggerBounds: ElementBounds,
    tooltipDims: TooltipDimensions,
    containerBounds: ElementBounds
  ): PositionResult => {
    const positions: TooltipPosition[] = allowFlip 
      ? [preferredPosition, ...(['top', 'bottom', 'right', 'left'] as TooltipPosition[]).filter(p => p !== preferredPosition)]
      : [preferredPosition]
    
    const alignments: TooltipAlignment[] = allowShift
      ? [preferredAlignment, ...(['center', 'start', 'end'] as TooltipAlignment[]).filter(a => a !== preferredAlignment)]
      : [preferredAlignment]
    
    let bestResult: PositionResult | null = null
    let bestScore = -1
    
    // Try all position and alignment combinations
    positions.forEach((pos, posIndex) => {
      alignments.forEach((align, alignIndex) => {
        const collision = checkCollision(pos, triggerBounds, tooltipDims, containerBounds, align)
        const coords = calculatePositionCoordinates(pos, triggerBounds, tooltipDims, align)
        
        // Comprehensive scoring algorithm
        let score = collision.confidence
        
        // Preference bonuses
        if (pos === preferredPosition) score += 0.3
        if (align === preferredAlignment) score += 0.15
        
        // Position priority (prefer vertical positions for readability)
        if (pos === 'top' || pos === 'bottom') score += 0.1
        
        // Penalize flipping and shifting based on distance from preference
        if (pos !== preferredPosition && allowFlip) score -= posIndex * 0.05
        if (align !== preferredAlignment && allowShift) score -= alignIndex * 0.03
        
        // Space availability bonus (prefer positions with more available space)
        const availableSpace = calculateAvailableSpace(pos, triggerBounds, containerBounds)
        score += Math.min(0.2, availableSpace / Math.max(tooltipDims.width, tooltipDims.height))
        
        // Visibility bonus (prefer positions where tooltip is more visible)
        const visibilityScore = calculateVisibilityScore(coords, tooltipDims, containerBounds)
        score += visibilityScore * 0.15
        
        if (score > bestScore) {
          bestScore = score
          bestResult = {
            position: pos,
            alignment: align,
            coordinates: coords,
            arrowPosition: calculateArrowPosition(pos, align, triggerBounds, coords, tooltipDims),
            isConstrained: collision.hasCollision,
            hasOverflow: collision.overflowAreas.length > 0,
            confidence: collision.confidence
          }
        }
      })
    })
    
    // Apply constraint adjustments if needed
    if (bestResult && bestResult.confidence < 0.7) {
      bestResult = applyConstraintAdjustments(bestResult, containerBounds, tooltipDims, triggerBounds)
    }
    
    return bestResult || createFallbackPosition(triggerBounds, tooltipDims, containerBounds)
  }, [
    allowFlip, allowShift, preferredPosition, preferredAlignment,
    checkCollision, calculatePositionCoordinates, calculateArrowPosition,
    applyConstraintAdjustments
  ])

  // Calculate available space in a given direction
  const calculateAvailableSpace = useCallback((
    position: TooltipPosition,
    triggerBounds: ElementBounds,
    containerBounds: ElementBounds
  ): number => {
    switch (position) {
      case 'top':
        return triggerBounds.top - containerBounds.top - margin
      case 'bottom':
        return containerBounds.bottom - triggerBounds.bottom - margin
      case 'left':
        return triggerBounds.left - containerBounds.left - margin
      case 'right':
        return containerBounds.right - triggerBounds.right - margin
      default:
        return 0
    }
  }, [margin])

  // Calculate visibility score based on how much of tooltip is visible
  const calculateVisibilityScore = useCallback((
    coords: { top: number; left: number },
    tooltipDims: TooltipDimensions,
    containerBounds: ElementBounds
  ): number => {
    const tooltipBounds = {
      top: coords.top,
      left: coords.left,
      right: coords.left + tooltipDims.width,
      bottom: coords.top + tooltipDims.height
    }
    
    const visibleArea = Math.max(0,
      (Math.min(tooltipBounds.right, containerBounds.right) - Math.max(tooltipBounds.left, containerBounds.left)) *
      (Math.min(tooltipBounds.bottom, containerBounds.bottom) - Math.max(tooltipBounds.top, containerBounds.top))
    )
    
    const totalArea = tooltipDims.width * tooltipDims.height
    return totalArea > 0 ? visibleArea / totalArea : 0
  }, [])

  // Create fallback position when no good position is found
  const createFallbackPosition = useCallback((
    triggerBounds: ElementBounds,
    tooltipDims: TooltipDimensions,
    containerBounds: ElementBounds
  ): PositionResult => {
    // Use the position with most available space as fallback
    const spaces = {
      top: calculateAvailableSpace('top', triggerBounds, containerBounds),
      bottom: calculateAvailableSpace('bottom', triggerBounds, containerBounds),
      left: calculateAvailableSpace('left', triggerBounds, containerBounds),
      right: calculateAvailableSpace('right', triggerBounds, containerBounds)
    }
    
    const bestFallbackPosition = Object.entries(spaces).reduce((max, [pos, space]) => 
      space > max.space ? { position: pos as TooltipPosition, space } : max,
      { position: 'top' as TooltipPosition, space: -1 }
    ).position
    
    const coords = calculatePositionCoordinates(bestFallbackPosition, triggerBounds, tooltipDims, 'center')
    
    return {
      position: bestFallbackPosition,
      alignment: 'center',
      coordinates: coords,
      arrowPosition: calculateArrowPosition(bestFallbackPosition, 'center', triggerBounds, coords, tooltipDims),
      isConstrained: true,
      hasOverflow: true,
      confidence: 0.1,
      adjustmentReason: ['Fallback positioning due to insufficient space']
    }
  }, [calculateAvailableSpace, calculatePositionCoordinates, calculateArrowPosition])

  // Main positioning update function with comprehensive calculations
  const updateTooltipPosition = useCallback(() => {
    if (!triggerRef.current || !measurementRef.current) return
    
    const viewport = getViewportMeasurement()
    const triggerBounds = getElementBounds(triggerRef.current, viewport)
    const containerBounds = getContainerBounds(viewport)
    
    // Get optimized dimensions for Portuguese text
    const { adjustedMaxWidth, estimatedHeight } = optimizeForLanguage(content)
    
    // Measure actual tooltip dimensions
    const measurementEl = measurementRef.current
    measurementEl.style.visibility = 'hidden'
    measurementEl.style.position = 'absolute'
    measurementEl.style.top = '-9999px'
    measurementEl.style.left = '-9999px'
    measurementEl.style.maxWidth = `${adjustedMaxWidth}px`
    measurementEl.style.width = 'max-content'
    measurementEl.innerHTML = content.replace(/\n/g, '<br>')
    
    // Force layout calculation
    measurementEl.offsetHeight
    
    const actualDimensions: TooltipDimensions = {
      width: Math.max(120, Math.min(adjustedMaxWidth, measurementEl.offsetWidth + 32)), // Add padding
      height: Math.max(40, measurementEl.offsetHeight + 24), // Add padding
      maxWidth: adjustedMaxWidth,
      estimatedHeight
    }
    
    setTooltipDimensions(actualDimensions)
    
    // Find the best position using intelligent algorithm
    const bestPosition = findBestPosition(triggerBounds, actualDimensions, containerBounds)
    setPositionResult(bestPosition)
  }, [
    getViewportMeasurement, getElementBounds, getContainerBounds,
    optimizeForLanguage, content, findBestPosition
  ])

  // Throttled scroll and resize handlers
  const throttledUpdatePosition = useCallback(() => {
    if (isVisible) {
      updateTooltipPosition()
    }
  }, [isVisible, updateTooltipPosition])

  // Show/hide handlers with delays
  const showTooltip = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = undefined
    }
    
    if (showTimeoutRef.current) return
    
    showTimeoutRef.current = setTimeout(() => {
      updateTooltipPosition()
      setIsVisible(true)
      onShow?.()
    }, delayShow)
  }, [updateTooltipPosition, onShow, delayShow])

  const hideTooltip = useCallback(() => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current)
      showTimeoutRef.current = undefined
    }
    
    if (hideTimeoutRef.current) return
    
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false)
      onHide?.()
    }, delayHide)
  }, [onHide, delayHide])

  const toggleTooltip = useCallback(() => {
    if (isVisible) {
      hideTooltip()
    } else {
      showTooltip()
    }
  }, [isVisible, showTooltip, hideTooltip])

  // Event handlers based on trigger type
  const getEventHandlers = () => {
    switch (trigger) {
      case 'hover':
        return {
          onMouseEnter: showTooltip,
          onMouseLeave: hideTooltip
        }
      case 'click':
        return {
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation()
            toggleTooltip()
          }
        }
      case 'focus':
        return {
          onFocus: showTooltip,
          onBlur: hideTooltip
        }
      default:
        return {}
    }
  }

  // Setup event listeners and cleanup
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(throttledUpdatePosition, 16) // ~60fps
    }

    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(throttledUpdatePosition, 100) // Debounced
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (trigger === 'click' && isVisible) {
        const target = event.target as Element
        if (!triggerRef.current?.contains(target) && !tooltipRef.current?.contains(target)) {
          hideTooltip()
        }
      }
    }

    if (isVisible) {
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', handleResize)
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isVisible, trigger, throttledUpdatePosition, hideTooltip])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current)
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    }
  }, [])

  // Arrow styles based on position and calculated arrow position
  const getArrowStyles = () => {
    if (!showArrow || !positionResult?.arrowPosition) return {}
    
    const { position } = positionResult
    const arrow = positionResult.arrowPosition
    const arrowSize = 8
    
    const baseStyles = {
      position: 'absolute' as const,
      width: 0,
      height: 0,
      zIndex: 1,
    }
    
    switch (position) {
      case 'top':
        return {
          ...baseStyles,
          bottom: arrow.bottom,
          left: arrow.left,
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`,
          borderTop: `${arrowSize}px solid rgba(0, 0, 0, 0.95)`,
        }
      case 'bottom':
        return {
          ...baseStyles,
          top: arrow.top,
          left: arrow.left,
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid rgba(0, 0, 0, 0.95)`,
        }
      case 'left':
        return {
          ...baseStyles,
          right: arrow.right,
          top: arrow.top,
          borderTop: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid transparent`,
          borderLeft: `${arrowSize}px solid rgba(0, 0, 0, 0.95)`,
        }
      case 'right':
        return {
          ...baseStyles,
          left: arrow.left,
          top: arrow.top,
          borderTop: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid rgba(0, 0, 0, 0.95)`,
        }
    }
  }

  // Portal-rendered tooltip with comprehensive positioning
  const tooltipContent = (
    <div 
      ref={tooltipRef}
      className={cn(
        'fixed px-4 py-3 transition-all duration-200 ease-out pointer-events-none',
        'whitespace-normal text-sm font-medium leading-relaxed',
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
        className
      )}
      style={{
        top: positionResult?.coordinates.top ?? 0,
        left: positionResult?.coordinates.left ?? 0,
        maxWidth: `${tooltipDimensions.maxWidth}px`,
        zIndex: 999999,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        color: '#ffffff',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: `
          0 25px 50px -12px rgba(0, 0, 0, 0.6),
          0 0 0 1px rgba(255, 255, 255, 0.05),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
        background: `
          linear-gradient(135deg, 
            rgba(0, 0, 0, 0.95) 0%, 
            rgba(20, 20, 20, 0.95) 50%, 
            rgba(0, 0, 0, 0.95) 100%
          )
        `,
      }}
      role="tooltip"
      aria-hidden={!isVisible}
      data-position={positionResult?.position}
      data-alignment={positionResult?.alignment}
      data-constrained={positionResult?.isConstrained}
      data-confidence={positionResult?.confidence.toFixed(2)}
    >
      {content}
      
      {/* Dynamic arrow */}
      {showArrow && <div style={getArrowStyles()} />}
    </div>
  )

  // Hidden measurement element for accurate dimension calculation
  const measurementElement = (
    <div
      ref={measurementRef}
      style={{
        position: 'absolute',
        visibility: 'hidden',
        whiteSpace: 'normal',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '500',
        lineHeight: '1.4',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  )

  return (
    <>
      <div 
        ref={triggerRef} 
        className="relative inline-block"
        {...getEventHandlers()}
      >
        {children}
      </div>
      
      {/* Portal for tooltip rendering */}
      {typeof document !== 'undefined' && createPortal(
        <>
          {tooltipContent}
          {measurementElement}
        </>,
        document.body
      )}
    </>
  )
}

// Export types for external use
export type { 
  TooltipPosition, 
  TooltipAlignment, 
  TooltipPlacement, 
  PositionResult,
  AdvancedTooltipProps
}