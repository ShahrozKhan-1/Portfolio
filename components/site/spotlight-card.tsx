"use client"

import { useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type SpotlightCardProps = {
  children: ReactNode
  className?: string
}

/**
 * Card with a pointer-tracked highlight. Updates CSS variables directly on the
 * node so React never re-renders on mouse movement.
 */
export function SpotlightCard({ children, className }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = ref.current
    if (!node || event.pointerType === "touch") return
    const rect = node.getBoundingClientRect()
    node.style.setProperty("--mx", `${event.clientX - rect.left}px`)
    node.style.setProperty("--my", `${event.clientY - rect.top}px`)
  }

  return (
    <div ref={ref} onPointerMove={handlePointerMove} className={cn("spotlight", className)}>
      {children}
    </div>
  )
}
