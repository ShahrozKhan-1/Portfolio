"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"

const terminalLines = [
  'python developer.py',
  'from ideas import scalable_solutions',
  'await build_api(framework="FastAPI")',
  'automate_tasks(efficiency="maximum")',
  'deploy(solution, confidence=True)',
  'print("Turning ideas into reality 🚀")',
]

function randomDelay(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function TerminalTypingAnimation() {
  const [visibleText, setVisibleText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const commandViewportRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches)

    updateMotionPreference()
    mediaQuery.addEventListener("change", updateMotionPreference)
    return () => mediaQuery.removeEventListener("change", updateMotionPreference)
  }, [])

  useEffect(() => {
    if (reducedMotion) {
      setVisibleText(terminalLines[0])
      setIsTyping(false)
      return
    }

    let lineIndex = 0
    let characterIndex = 0
    let deleting = false
    let timer: number
    let cancelled = false

    const scheduleNextCharacter = (delay: number) => {
      timer = window.setTimeout(() => {
        if (cancelled) return

        const characters = Array.from(terminalLines[lineIndex])
        if (deleting) {
          characterIndex -= 1
          setVisibleText(characters.slice(0, characterIndex).join(""))

          if (characterIndex === 0) {
            deleting = false
            lineIndex = (lineIndex + 1) % terminalLines.length
            setIsTyping(false)
            scheduleNextCharacter(randomDelay(250, 400))
            return
          }
        } else {
          characterIndex += 1
          setVisibleText(characters.slice(0, characterIndex).join(""))

          if (characterIndex === characters.length) {
            deleting = true
            setIsTyping(false)
            scheduleNextCharacter(randomDelay(1800, 2200))
            return
          }
        }

        setIsTyping(true)
        scheduleNextCharacter(deleting ? randomDelay(25, 35) : randomDelay(55, 75))
      }, delay)
    }

    scheduleNextCharacter(0)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [reducedMotion])

  useLayoutEffect(() => {
    const viewport = commandViewportRef.current
    const cursor = cursorRef.current
    if (!viewport || !cursor) return

    const viewportBounds = viewport.getBoundingClientRect()
    const cursorBounds = cursor.getBoundingClientRect()
    const rightOverflow = cursorBounds.right - viewportBounds.right
    const leftOverflow = cursorBounds.left - viewportBounds.left

    if (rightOverflow > 0) {
      viewport.scrollLeft += rightOverflow + 12
    } else if (leftOverflow < 0) {
      viewport.scrollLeft = Math.max(0, viewport.scrollLeft + leftOverflow - 12)
    }
  }, [visibleText])

  return (
    <div className="terminal-window" role="group" aria-label="Animated Python terminal">
      <div className="terminal-header" aria-hidden="true">
        <div className="terminal-window-controls">
          <span className="terminal-window-control terminal-window-control-red" />
          <span className="terminal-window-control terminal-window-control-yellow" />
          <span className="terminal-window-control terminal-window-control-green" />
        </div>
        <span className="terminal-title">terminal</span>
      </div>
      <div className="terminal-command-row" aria-live="off">
        <span className="terminal-prompt" aria-hidden="true">$</span>
        <div className="terminal-command-viewport" ref={commandViewportRef}>
          <span className="terminal-command" aria-label={visibleText}>
            <span>{visibleText}</span>
            <span
              ref={cursorRef}
              className={`terminal-cursor${isTyping && !reducedMotion ? " terminal-cursor-active" : ""}`}
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </div>
  )
}
