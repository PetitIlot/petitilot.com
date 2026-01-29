import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'subtle'
}

function Badge({ className = "", variant = 'default', ...props }: BadgeProps) {
  const baseStyles = `
    inline-flex items-center rounded-[12px] px-3 py-1.5
    text-xs font-medium
    transition-colors duration-200
  `.replace(/\s+/g, ' ').trim()

  const variants = {
    default: "bg-sage text-white",
    secondary: "bg-terracotta text-white",
    outline: "border border-[var(--border-strong)] text-foreground bg-transparent",
    subtle: "bg-foreground/5 text-foreground-secondary"
  }

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    />
  )
}

export { Badge }
