"use client"

import { motion, useScroll, useSpring } from "framer-motion"

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, mass: 0.3 })

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[120] h-[2px] origin-left bg-primary print:hidden"
      style={{ scaleX, boxShadow: "0 0 18px rgba(200,250,79,0.65)" }}
    />
  )
}
