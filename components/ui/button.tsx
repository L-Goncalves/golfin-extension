import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 micro-bounce",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-neon-cyan-500 dark:text-dark-900 dark:hover:bg-neon-cyan-400 dark:shadow-neon-cyan/20",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:bg-red-600 dark:hover:bg-red-500",
        outline:
          "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground dark:border-dark-600/50 dark:bg-transparent dark:text-white/90 dark:hover:bg-dark-700/50 dark:hover:border-dark-500/70",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-dark-700/50 dark:text-white/90 dark:hover:bg-dark-600/60",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-dark-700/30 dark:text-white/80 dark:hover:text-white",
        link: "text-primary underline-offset-4 hover:underline dark:text-neon-cyan-400 dark:hover:text-neon-cyan-300",
        // Modern glassmorphism variants
        glass: "glass-button bg-glass-white-10 border-glass-white-20 text-white/90 hover:bg-glass-white-20 hover:border-glass-white-30 hover:shadow-glass-lg backdrop-blur-xl",
        "neon-cyan": "glass-button bg-gradient-to-r from-neon-cyan-600/20 to-neon-cyan-500/30 border-neon-cyan-500/40 text-neon-cyan-100 hover:shadow-neon-cyan hover:border-neon-cyan-400 hover:from-neon-cyan-500/30 hover:to-neon-cyan-400/40",
        "neon-purple": "glass-button bg-gradient-to-r from-neon-purple-600/20 to-neon-purple-500/30 border-neon-purple-500/40 text-neon-purple-100 hover:shadow-neon-purple hover:border-neon-purple-400 hover:from-neon-purple-500/30 hover:to-neon-purple-400/40",
        "neon-pink": "glass-button bg-gradient-to-r from-neon-pink-600/20 to-neon-pink-500/30 border-neon-pink-500/40 text-neon-pink-100 hover:shadow-neon-pink hover:border-neon-pink-400 hover:from-neon-pink-500/30 hover:to-neon-pink-400/40",
        // LinkedIn brand variant with dark mode support
        linkedin: "bg-gradient-to-r from-linkedin-primary/80 to-linkedin-secondary/80 text-white hover:from-linkedin-primary hover:to-linkedin-secondary hover:shadow-lg hover:shadow-linkedin-primary/25 active:from-linkedin-primary-dark active:to-linkedin-primary backdrop-blur-xl border border-linkedin-primary/60",
        // Updated pagination with dark mode
        pagination: "bg-transparent text-muted-foreground hover:bg-surface-hover hover:text-foreground border-0 rounded-full transition-all duration-300 disabled:bg-primary disabled:text-primary-foreground disabled:cursor-not-allowed disabled:border disabled:border-primary disabled:font-bold dark:text-white/70 dark:hover:bg-dark-700/50 dark:hover:text-white dark:disabled:bg-neon-cyan-500 dark:disabled:text-dark-900"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        linkedin: "px-2.5 py-2.5",
        pagination: "h-8 w-8 px-3 py-2 mx-1.5"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }