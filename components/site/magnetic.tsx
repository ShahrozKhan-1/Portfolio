"use client"

import { useRef, type ReactNode } from "react"
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

type MagneticProps = {
  children: ReactNode
  className?: string
  strength?: number
}

export function Magnetic({ children, className, strength = 12 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 220, damping: 18, mass: 0.4 })
  const y = useSpring(rawY, { stiffness: 220, damping: 18, mass: 0.4 })

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType !== "mouse") return
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    rawX.set(((event.clientX - rect.left) / rect.width - 0.5) * strength * 2)
    rawY.set(((event.clientY - rect.top) / rect.height - 0.5) * strength * 2)
  }

  const reset = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={reduce ? undefined : { x, y }}
      className={cn("inline-flex", className)}
    >
      {children}
    </motion.div>
  )
}
