"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

const STORAGE_KEY = "sk-intro-v1"

/**
 * A short, cinematic intro curtain. Plays once per browser session and is
 * skipped entirely for visitors who prefer reduced motion.
 */
export function Preloader() {
  const prefersReducedMotion = useReducedMotion()
  const [phase, setPhase] = useState<"loading" | "leaving" | "done">("loading")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const alreadySeen = window.sessionStorage.getItem(STORAGE_KEY)
    if (prefersReducedMotion || alreadySeen) {
      setPhase("done")
      return
    }

    let frame = 0
    const duration = 1000
    const start = performance.now()
    const originalOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = "hidden"

    const tick = (now: number) => {
      const elapsed = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - elapsed, 3)
      setProgress(Math.round(eased * 100))
      if (elapsed < 1) {
        frame = window.requestAnimationFrame(tick)
      } else {
        window.setTimeout(() => setPhase("leaving"), 220)
      }
    }

    frame = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frame)
      document.documentElement.style.overflow = originalOverflow
    }
  }, [prefersReducedMotion])

  useEffect(() => {
    if (phase !== "leaving") return
    window.sessionStorage.setItem(STORAGE_KEY, "1")
    document.documentElement.style.overflow = ""
    const timer = window.setTimeout(() => setPhase("done"), 950)
    return () => window.clearTimeout(timer)
  }, [phase])

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="preloader"
          className="preloader fixed inset-0 z-[150] flex flex-col justify-between bg-ink px-5 py-6 print:hidden sm:px-8 lg:px-12"
          initial={{ y: 0 }}
          animate={phase === "leaving" ? { y: "-100%" } : { y: 0 }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        >
          <div className="flex items-center justify-between">
            <span className="eyebrow text-white/50">Shahroz Khan — Portfolio</span>
            <span className="eyebrow text-white/50">Lahore, PK</span>
          </div>

          <div className="flex flex-col gap-6">
            <div className="overflow-hidden">
              <motion.p
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="font-display text-[clamp(2.5rem,8vw,6rem)] leading-[0.9] tracking-tightest text-white"
              >
                Backend systems,
                <span className="font-serif italic text-primary"> built to last.</span>
              </motion.p>
            </div>

            <div className="flex items-end justify-between gap-6">
              <div className="w-full max-w-md">
                <div className="mb-3 flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-label text-white/40">
                  <span>Initialising interface</span>
                  <span>{String(progress).padStart(3, "0")}%</span>
                </div>
                <div className="h-px w-full bg-white/15">
                  <motion.div
                    className="h-px bg-primary"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: "linear" }}
                  />
                </div>
              </div>
              <span className="font-display text-[clamp(3rem,7vw,5rem)] leading-none tabular-nums text-white/90">
                {String(progress).padStart(3, "0")}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-label text-white/35">
            <span>Python · Django · FastAPI</span>
            <span className="hidden sm:inline">Scroll to explore</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
