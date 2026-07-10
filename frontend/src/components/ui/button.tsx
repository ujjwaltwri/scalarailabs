import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "danger" | "ghost" | "super"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-wide active:border-b-0 active:translate-y-[4px]"
    
    const variants = {
      default: "bg-white text-slate-500 border-2 border-b-4 border-slate-200 hover:bg-slate-100",
      primary: "bg-[#58cc02] text-white border-b-4 border-[#58a700] hover:bg-[#46a302]",
      secondary: "bg-[#1cb0f6] text-white border-b-4 border-[#1899d6] hover:bg-[#1483b8]",
      danger: "bg-[#ff4b4b] text-white border-b-4 border-[#ea2b2b] hover:bg-[#e01e1e]",
      super: "bg-[#ffc800] text-white border-b-4 border-[#e5b400] hover:bg-[#e0b000]",
      ghost: "bg-transparent text-slate-500 border-2 border-transparent hover:bg-slate-100 active:translate-y-0 active:border-b-0",
    }
    
    const sizes = {
      default: "h-12 px-4 py-2",
      sm: "h-9 px-3",
      lg: "h-14 px-8 text-lg",
      icon: "h-12 w-12",
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
