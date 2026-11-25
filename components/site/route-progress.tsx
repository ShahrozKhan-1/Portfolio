"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

/**
 * A thin signal line that runs across the top of the viewport whenever an
 * internal link is followed, and completes once the new route is committed.
 *
 * Route skeletons (`loading.tsx`) cover the page body; this covers the moment
 * in between so a click never feels like it was ignored.
 */
export function RouteProgress() {
  const pathname = usePathname()
  const [active, setActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const frame = useRef<number | null>(null)
  const timeout = useRef<number | null>(null)

  useEffect(() => {
    const stop = () => {
      if (frame.current !== null) {
        cancelAnimationFrame(frame.current)
        frame.current = null
      }
    }

    const run = () => {
      stop()
      const tick = () => {
        setProgress((value) => {
          const next = value + (0.92 - value) * 0.08
          return next > 0.9 ? 0.9 : next
        })
        frame.current = requestAnimationFrame(tick)
      }
      frame.current = requestAnimationFrame(tick)
    }

    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      const anchor = (event.target as Element | null)?.closest?.("a")
      if (!anchor) return
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return

      const href = anchor.getAttribute("href")
      if (!href || !href.startsWith("/") || href.startsWith("/#")) return

      const [path] = href.split("#")
      if (!path || path === window.location.pathname) return

      if (timeout.current !== null) window.clearTimeout(timeout.current)
      setProgress(0.08)
      setActive(true)
      run()
    }

    document.addEventListener("click", onClick, true)
    return () => {
      document.removeEventListener("click", onClick, true)
      stop()
      if (timeout.current !== null) window.clearTimeout(timeout.current)
    }
  }, [])

  useEffect(() => {
    if (!active) return

    setProgress(1)
    if (frame.current !== null) {
      cancelAnimationFrame(frame.current)
      frame.current = null
    }

    timeout.current = window.setTimeout(() => {
      setActive(false)
      setProgress(0)
    }, 280)

    return () => {
      if (timeout.current !== null) window.clearTimeout(timeout.current)
    }
    // Only react to committed navigations.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[95] h-[2px] motion-reduce:hidden"
    >
      <div
        className="h-full origin-left bg-primary transition-[transform,opacity] duration-300 ease-out"
        style={{
          transform: `scaleX(${progress})`,
          opacity: active ? 1 : 0,
          boxShadow: "0 0 12px rgba(200, 250, 79, 0.7)",
        }}
      />
    </div>
  )
}
