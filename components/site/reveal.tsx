"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  once?: boolean
}

export function Reveal({ children, className, delay = 0, y = 24, once = true }: RevealProps) {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <div className={className} data-anim>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      data-anim
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/** Headline line that slides up from behind a mask. */
export function LineMask({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()

  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        data-anim
        className={cn("block will-change-transform", className)}
        initial={reduce ? undefined : { y: "115%", rotate: 2 }}
        animate={reduce ? undefined : { y: 0, rotate: 0 }}
        transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  )
}

export function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      data-anim
      className={className}
      initial={reduce ? undefined : { opacity: 0, filter: "blur(6px)" }}
      animate={reduce ? undefined : { opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
