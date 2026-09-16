"use client"

import { useEffect, useRef } from "react"

const STAR_COUNT = 150

export function StarBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const fragment = document.createDocumentFragment()

    for (let index = 0; index < STAR_COUNT; index += 1) {
      const star = document.createElement("span")
      const size = Math.random() * 2 + 1

      star.className = "star-background__star"
      star.style.width = `${size}px`
      star.style.height = `${size}px`
      star.style.top = `${Math.random() * 100}%`
      star.style.left = `${Math.random() * 100}%`
      star.style.animationDuration = `${Math.random() * 3 + 2}s`
      star.style.animationDelay = `${Math.random() * 5}s`
      star.style.backgroundColor = Math.random() > 0.5 ? "#ffffff" : "#dbeafe"
      fragment.appendChild(star)
    }

    container.appendChild(fragment)

    return () => {
      container.replaceChildren()
    }
  }, [])

  return <div id="star-container" ref={containerRef} aria-hidden="true" />
}
