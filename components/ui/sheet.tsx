'use client'

import * as React from "react"
import { createPortal } from "react-dom"

interface SheetContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextValue | undefined>(undefined)

function Sheet({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (isControlled) {
        onOpenChange?.(newOpen)
      } else {
        setInternalOpen(newOpen)
      }
    },
    [isControlled, onOpenChange]
  )

  return (
    <SheetContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange }}>
      {children}
    </SheetContext.Provider>
  )
}

function SheetTrigger({
  asChild,
  children,
  className = "",
}: {
  asChild?: boolean
  children: React.ReactNode
  className?: string
}) {
  const context = React.useContext(SheetContext)
  if (!context) throw new Error("SheetTrigger must be used within Sheet")

  const handleClick = () => context.onOpenChange(true)

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
    } as any)
  }

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  )
}

function SheetContent({
  side = "right",
  className = "",
  children,
}: {
  side?: "left" | "right"
  className?: string
  children: React.ReactNode
}) {
  const context = React.useContext(SheetContext)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!context) throw new Error("SheetContent must be used within Sheet")

  if (!context.open || !mounted) return null

  const sideStyles = {
    right: "right-4 top-4 bottom-4 w-[280px] translate-x-0 animate-slide-in-right rounded-[24px]",
    left: "left-4 top-4 bottom-4 w-[280px] translate-x-0 animate-slide-in-left rounded-[24px]",
  }

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-[8px] animate-fade-in"
        onClick={() => context.onOpenChange(false)}
      />
      {/* Panel */}
      <div
        className={`fixed z-[60] p-6 shadow-apple-elevated liquid-glass ${sideStyles[side]} ${className}`}
      >
        {children}
      </div>
    </>,
    document.body
  )
}

export { Sheet, SheetTrigger, SheetContent }
