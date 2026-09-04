"use client"

import { motion, type Variants } from "framer-motion"
import type { PropsWithChildren } from "react"

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

export function Reveal({ children, className, delay = 0 }: PropsWithChildren<{ className?: string; delay?: number }>) {
  return <motion.div className={className} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.16 }} transition={{ delay }}>
    {children}
  </motion.div>
}

export function Stagger({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <motion.div className={className} variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }}>{children}</motion.div>
}

export function MotionItem({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <motion.div className={className} variants={fadeUp}>{children}</motion.div>
}

export { motion }
