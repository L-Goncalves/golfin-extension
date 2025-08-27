import * as React from "react"

import { cn } from "~lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium", 
          "placeholder:text-muted-foreground transition-all duration-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "hover:border-border-hover focus:border-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Dark mode styles
          "dark:bg-dark-800/30 dark:border-dark-600/50 dark:text-white/90",
          "dark:placeholder:text-white/50 dark:backdrop-blur-sm",
          "dark:hover:bg-dark-700/40 dark:hover:border-dark-500/60",
          "dark:focus:bg-dark-700/50 dark:focus:border-neon-cyan-500/40",
          "dark:focus:shadow-neon-cyan/10 dark:focus:ring-neon-cyan-500/30",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }