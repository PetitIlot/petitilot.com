import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center font-medium
      transition-all duration-200 ease-apple
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/40 focus-visible:ring-offset-2
      disabled:pointer-events-none disabled:opacity-50
      active:scale-[0.98]
    `.replace(/\s+/g, ' ').trim()

    const variants = {
      default: "bg-sage text-white hover:bg-sage-dark rounded-[16px]",
      secondary: "bg-foreground text-white hover:bg-foreground/90 rounded-[16px]",
      ghost: "hover:bg-black/5 dark:hover:bg-white/5 text-foreground dark:text-foreground-dark rounded-[12px]",
      outline: "border border-[var(--border)] bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-foreground dark:text-foreground-dark rounded-[16px]"
    }

    const sizes = {
      default: "h-11 px-6 text-body",
      sm: "h-9 px-4 text-callout",
      lg: "h-12 px-8 text-body-large",
      icon: "h-10 w-10"
    }

    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
