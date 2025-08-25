import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "~lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-5 w-5 shrink-0 rounded border transition-all duration-200",
      // Light mode styles
      "border-gray-400/70 bg-white/90 hover:border-gray-500 hover:bg-gray-50",
      // Dark mode styles
      "dark:border-gray-400/50 dark:bg-gray-800/90 dark:hover:border-gray-300 dark:hover:bg-gray-700/80",
      // Checked states - light mode
      "data-[state=checked]:bg-[#057642] data-[state=checked]:border-[#057642]",
      // Checked states - dark mode
      "dark:data-[state=checked]:bg-[#0ea5e9] dark:data-[state=checked]:border-[#0ea5e9]",
      // Focus and interaction states
      "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      // Ensure visibility in both modes
      "relative z-10",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn(
        "flex items-center justify-center text-current",
        // Ensure check mark is visible in both themes
        "text-white dark:text-white"
      )}
    >
      <Check 
        className="h-3 w-3 text-white drop-shadow-sm" 
        strokeWidth={3} 
      />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }