"use client"

import { useEffect, useRef } from "react"

/**
 * A soft, lagging light that follows the pointer, adding material depth on
 * desktop without replacing the native cursor.
 */
export function PointerGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (!window.matchMedia("(pointer: fine)").matches) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let raf = 0
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let tx = x
    let ty = y
    let active = false

    const onMove = (event: PointerEvent) => {
      tx = event.clientX
      ty = event.clientY
      if (!active) {
        active = true
        node.style.opacity = "1"
        raf = window.requestAnimationFrame(loop)
      }
    }

    const loop = () => {
      x += (tx - x) * 0.09
      y += (ty - y) * 0.09
      node.style.transform = `translate3d(${x - 320}px, ${y - 320}px, 0)`
      if (Math.abs(tx - x) < 0.6 && Math.abs(ty - y) < 0.6) {
        // Settled: stop the loop until the pointer moves again.
        active = false
        return
      }
      raf = window.requestAnimationFrame(loop)
    }

    const onLeave = () => {
      node.style.opacity = "0"
      active = false
      window.cancelAnimationFrame(raf)
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    document.addEventListener("pointerleave", onLeave)

    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="absolute left-0 top-0 h-[640px] w-[640px] opacity-0 transition-opacity duration-700"
      style={{
        background:
          "radial-gradient(circle at center, rgba(200,250,79,0.05), rgba(140,124,255,0.045) 34%, transparent 62%)",
        transform: "translate3d(-1000px,-1000px,0)",
        willChange: "transform",
      }}
    />
  )
}
