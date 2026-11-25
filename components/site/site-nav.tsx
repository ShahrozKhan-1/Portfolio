"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, Menu, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { LocalTime } from "@/components/site/local-time"
import type { Profile, Project } from "@/lib/site-types"

const CommandPalette = dynamic(
  () => import("@/components/site/command-palette").then((mod) => mod.CommandPalette),
  { ssr: false },
)

const prefetchPalette = () => {
  void import("@/components/site/command-palette")
}

const SECTION_LABELS: Record<string, string> = {
  home: "Home",
  about: "About",
  skills: "Skills",
  projects: "Work",
  contact: "Contact",
}

type SiteNavProps = {
  sections: string[]
  projects: Project[]
  profile: Profile
  variant?: "home" | "inner"
}

export function SiteNav({ sections, projects, profile, variant = "home" }: SiteNavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState(variant === "home" ? "home" : "")
  const [menuOpen, setMenuOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [isMac, setIsMac] = useState(true)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const reduce = useReducedMotion()

  const prefix = variant === "home" ? "" : "/"

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setIsMac(/mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent))
  }, [])

  useEffect(() => {
    if (variant !== "home") return
    const elements = Array.from(document.querySelectorAll<HTMLElement>("section[id]"))
    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (intersecting?.target.id) setActive(intersecting.target.id)
      },
      { rootMargin: "-42% 0px -50% 0px", threshold: [0, 0.2, 0.6] },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [variant])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setPaletteOpen((open) => !open)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  // Mobile menu: lock scroll, trap focus, close on Escape, restore focus on exit.
  useEffect(() => {
    if (!menuOpen) return
    const trigger = menuButtonRef.current
    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = "hidden"
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
        return
      }
      if (event.key !== "Tab") return

      const focusable = menuRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable?.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const activeElement = document.activeElement

      if (event.shiftKey && (activeElement === first || activeElement === closeRef.current)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.documentElement.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
      trigger?.focus()
    }
  }, [menuOpen])

  const hrefFor = (section: string) => `${prefix}#${section}`

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink via-ink/70 to-transparent"
        />
        <div className="shell relative">
          <div
            className={cn(
              "mt-3 flex items-center justify-between gap-2 rounded-full border px-2.5 py-2 transition-all duration-500 sm:mt-4 sm:px-3",
              scrolled
                ? "border-white/[0.09] bg-ink/80 shadow-[0_24px_70px_-32px_rgba(0,0,0,0.95)] backdrop-blur-xl"
                : "border-white/[0.05] bg-ink/30 backdrop-blur-md",
            )}
          >
            <Link href="/" className="group flex min-h-10 items-center gap-2.5 rounded-full pl-1 pr-2">
              <span
                aria-hidden="true"
                className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-primary font-display text-[12px] font-bold tracking-tight text-primary-foreground"
              >
                SK
                <span className="absolute inset-0 -translate-x-full bg-white/40 transition-transform duration-700 ease-expo group-hover:translate-x-full" />
              </span>
              <span className="hidden text-[13px] font-medium tracking-tight text-white/90 sm:block">
                Shahroz Khan<span className="text-primary">.</span>
              </span>
              <span className="sr-only">home</span>
            </Link>

            <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
              {sections.map((section) => {
                const isActive = active === section
                return (
                  <Link
                    key={section}
                    href={hrefFor(section)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-[13px] transition-colors duration-300",
                      isActive ? "text-white" : "text-white/55 hover:text-white",
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        aria-hidden="true"
                        layoutId="nav-active-pill"
                        className="absolute inset-0 -z-10 rounded-full border border-white/10 bg-white/[0.06]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                    {SECTION_LABELS[section] ?? section}
                  </Link>
                )
              })}
            </nav>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPaletteOpen(true)}
                onPointerEnter={prefetchPalette}
                onFocus={prefetchPalette}
                aria-keyshortcuts="Control+K Meta+K"
                title="Search the site (Ctrl+K or ⌘K)"
                className="hidden h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 text-[13px] text-white/70 transition-colors hover:border-white/20 hover:text-white md:flex"
              >
                <Search aria-hidden="true" className="h-3.5 w-3.5" />
                <span>Search</span>
                <kbd
                  aria-hidden="true"
                  className="ml-1 rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[0.6rem] text-white/60"
                >
                  {isMac ? "⌘K" : "Ctrl K"}
                </kbd>
              </button>

              <Link
                href={hrefFor("contact")}
                className="group hidden h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-all duration-300 hover:shadow-[0_12px_30px_-8px_rgba(200,250,79,0.55)] sm:flex"
              >
                Let&apos;s talk
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>

              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={menuOpen}
                aria-controls="site-menu"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/80 transition-colors hover:bg-white/[0.08] lg:hidden"
              >
                <Menu aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            key="mobile-menu"
            id="site-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-[130] flex flex-col bg-ink lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 grid-bg opacity-[0.35]" aria-hidden="true" />
            <div className="relative flex h-full flex-col overflow-y-auto px-5 pb-8 pt-4 sm:px-8">
              <div className="flex items-center justify-between">
                <span className="eyebrow">Menu</span>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white transition-colors hover:bg-white/[0.1]"
                >
                  <X aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>

              <nav aria-label="Mobile" className="mt-8 flex flex-1 flex-col justify-center gap-1">
                {sections.map((section, index) => {
                  const isActive = active === section
                  return (
                    <motion.div
                      key={section}
                      initial={reduce ? undefined : { opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.06 + index * 0.055,
                        duration: 0.6,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        href={hrefFor(section)}
                        onClick={() => setMenuOpen(false)}
                        aria-current={isActive ? "page" : undefined}
                        className="group flex items-baseline gap-4 border-b border-white/[0.07] py-3.5"
                      >
                        <span aria-hidden="true" className="font-mono text-[0.6rem] text-primary/80">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="font-display text-[clamp(1.9rem,9vw,2.75rem)] leading-none tracking-tight text-white/85 transition-colors group-hover:text-primary">
                          {SECTION_LABELS[section] ?? section}
                        </span>
                        <ArrowUpRight
                          aria-hidden="true"
                          className="ml-auto h-4 w-4 self-center text-white/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                        />
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>

              <div className="mt-8 space-y-5">
                <Link
                  href={hrefFor("contact")}
                  onClick={() => setMenuOpen(false)}
                  className="btn-signal w-full justify-center"
                >
                  Start a project
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </Link>

                <a
                  href={`mailto:${profile.email}`}
                  aria-label={`Email ${profile.email}`}
                  className="block break-all font-display text-lg tracking-tight text-white/80 transition-colors hover:text-primary"
                >
                  {profile.email}
                </a>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] pt-4">
                  <div className="flex gap-6 font-mono text-[0.65rem] uppercase tracking-label text-white/55">
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="py-1 transition-colors hover:text-primary"
                    >
                      GitHub
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="py-1 transition-colors hover:text-primary"
                    >
                      LinkedIn
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                    <Link
                      href="/resume"
                      onClick={() => setMenuOpen(false)}
                      className="py-1 transition-colors hover:text-primary"
                    >
                      Résumé
                    </Link>
                  </div>
                  <LocalTime className="font-mono text-[0.65rem] uppercase tracking-label text-white/60" />
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {paletteOpen ? (
        <CommandPalette
          open
          onOpenChange={setPaletteOpen}
          sections={sections}
          projects={projects}
          profile={profile}
        />
      ) : null}
    </>
  )
}
