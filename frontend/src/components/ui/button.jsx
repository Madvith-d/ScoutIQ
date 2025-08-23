import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = {
  default:
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-xs hover:opacity-90",
  secondary:
    "bg-secondary text-secondary-foreground hover:opacity-90",
  ghost:
    "hover:bg-accent hover:text-foreground",
  outline:
    "border border-input bg-transparent hover:bg-accent hover:text-foreground",
  destructive:
    "bg-destructive text-destructive-foreground hover:opacity-90",
}

function Button({ className, variant = "default", asChild = false, ...props }) {
  const Comp = asChild ? "span" : "button"
  return (
    <Comp
      data-slot="button"
      className={cn(
        "h-9 px-4 py-2",
        buttonVariants[variant] || buttonVariants.default,
        className,
      )}
      {...props}
    />
  )
}

export { Button }
