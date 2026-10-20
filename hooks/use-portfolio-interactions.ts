"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Project } from "@/lib/site-types"

export function usePortfolioInteractions(projects: Project[]) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [debugMode, setDebugMode] = useState(false)
  const [coffeeCount, setCoffeeCount] = useState(0)

  useEffect(() => {
    const prefetchTimer = window.setTimeout(() => {
      projects.forEach((project) => router.prefetch(`/projects/${project.slug}`))
    }, 1500)

    return () => window.clearTimeout(prefetchTimer)
  }, [projects, router])

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]")
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "F12" || (event.ctrlKey && event.shiftKey && event.key === "I")) {
        event.preventDefault()
        setDebugMode((isEnabled) => !isEnabled)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [])

  return {
    isMenuOpen,
    activeSection,
    debugMode,
    coffeeCount,
    toggleMenu: () => setIsMenuOpen((isOpen) => !isOpen),
    closeMenu: () => setIsMenuOpen(false),
    closeDebugMode: () => setDebugMode(false),
    incrementCoffeeCount: () => setCoffeeCount((count) => count + 1),
    prefetchProject: (slug: string) => router.prefetch(`/projects/${slug}`),
    navigateToProject: (slug: string) => router.push(`/projects/${slug}`),
  }
}
