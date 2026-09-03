"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DEFAULT_SITE_DATA } from "@/lib/site-defaults"
import type { SiteData } from "@/lib/site-types"
import {
  siDocker,
  siDjango,
  siFastapi,
  siN8n,
  siPostgresql,
  siPython,
  siRedis,
  siSelenium,
  siZapier,
} from "simple-icons"
import {
  Github,
  Linkedin,
  Mail,
  Download,
  ExternalLink,
  Menu,
  X,
  ArrowRight,
  Code,
  Database,
  FigmaIcon,
  Server,
  Smartphone,
  Terminal,
  Coffee,
  Bug,
  Zap,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { sendContactEmail } from "./actions/contact"

type BrandIcon = {
  path: string
  hex: string
}

const brandSkillIcons: Record<string, BrandIcon> = {
  python: siPython,
  django: siDjango,
  fastapi: siFastapi,
  postgresql: siPostgresql,
  selenium: siSelenium,
  docker: siDocker,
  redis: siRedis,
  automation: siZapier,
  zapier: siZapier,
  n8n: siN8n,
}

function SkillBrandIcon({ icon, className }: { icon: BrandIcon; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 24 24"
      className={className}
      style={{ color: `#${icon.hex}` }}
    >
      <path fill="currentColor" d={icon.path} />
    </svg>
  )
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [contactState, setContactState] = useState<{ success: boolean; message: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [siteData, setSiteData] = useState<SiteData>(DEFAULT_SITE_DATA)
  const [displayedCode, setDisplayedCode] = useState("")

  // Developer-specific animations
  const [currentCode, setCurrentCode] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [debugMode, setDebugMode] = useState(false)
  const [coffeeCount, setCoffeeCount] = useState(0)
  const profile = siteData.profile
  const skills = siteData.skills
  const projects = siteData.projects
  const reviews = siteData.reviews

const codeSnippets = [
  "developer = 'Shahroz Khan'",
  "import django",
  "from fastapi import FastAPI",
  "def build_solution(problem):",
  "    return clean_code",
  "async def scale(app):",
  "    await app.grow()",
  "try: ship(feature)",
  "except Bug: debug()",
  "tests = 'passing'",
  "deployment = 'successful'",
]

  const developerStates = [
    { icon: <Code className="h-4 w-4" />, text: "Coding", color: "text-green-500" },
    { icon: <Coffee className="h-4 w-4" />, text: "Caffeinating", color: "text-amber-500" },
    { icon: <Bug className="h-4 w-4" />, text: "Debugging", color: "text-red-500" },
    { icon: <Zap className="h-4 w-4" />, text: "Optimizing", color: "text-blue-500" },
    { icon: <Terminal className="h-4 w-4" />, text: "Deploying", color: "text-purple-500" },
  ]

  const [currentState, setCurrentState] = useState(0)
  const skillIcons = {
    code: <Code className="h-8 w-8" />,
    database: <Database className="h-8 w-8" />,
    figma: <FigmaIcon className="h-8 w-8" />,
    server: <Server className="h-8 w-8" />,
    smartphone: <Smartphone className="h-8 w-8" />,
    terminal: <Terminal className="h-8 w-8" />,
    zap: <Zap className="h-8 w-8" />,
  } as const

  const getBrandSkillIcon = (skill: SiteData["skills"][number]) => {
    const normalizedName = skill.name.trim().toLowerCase()
    const normalizedKey = skill.iconKey.trim().toLowerCase()
    return brandSkillIcons[normalizedName] ?? brandSkillIcons[normalizedKey] ?? null
  }

  const getFallbackSkillIcon = (skill: SiteData["skills"][number]) => {
    return skillIcons[skill.iconKey as keyof typeof skillIcons] ?? <Code className="h-8 w-8" />
  }

  useEffect(() => {
    const code = codeSnippets[currentCode]
    let index = 0

    setDisplayedCode("")

    const typingInterval = setInterval(() => {
      if (index < code.length) {
        setDisplayedCode(code.slice(0, index + 1))
        index++
      } else {
        clearInterval(typingInterval)
      }
    }, 50)

    return () => clearInterval(typingInterval)
  }, [currentCode])

  useEffect(() => {
    let isMounted = true

    const loadSiteData = async () => {
      try {
        const response = await fetch("/api/site-data", { cache: "no-store" })
        if (!response.ok) {
          return
        }

        const data = (await response.json()) as SiteData
        if (isMounted && data) {
          setSiteData(data)
        }
      } catch {
        // Keep the bundled defaults if the JSON source is unavailable.
      }
    }

    loadSiteData()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]")

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 },
    )

    sections.forEach((section) => {
      observerRef.current?.observe(section)
    })

    return () => {
      sections.forEach((section) => {
        observerRef.current?.unobserve(section)
      })
    }
  }, [])

  // Code typing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCode((prev) => (prev + 1) % codeSnippets.length)
      setIsTyping(false)
      setTimeout(() => setIsTyping(true), 100)
    }, 3000)

    return () => clearInterval(interval)
  }, [codeSnippets.length])

  // Developer state rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentState((prev) => (prev + 1) % developerStates.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [developerStates.length])

  // Debug mode toggle
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I")) {
        e.preventDefault()
        setDebugMode(!debugMode)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [debugMode])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  const handleContactSubmit = async (
  event: React.FormEvent<HTMLFormElement>
) => {
  event.preventDefault()
  setIsSubmitting(true)
  setContactState(null)

  const form = event.currentTarget
  const formData = new FormData(form)

  try {
    const result = await sendContactEmail(formData)
    setContactState(result)

    if (result.success) {
      form.reset()
    }
  } catch (error) {
    console.error("Form submission error:", error)
    setContactState({
      success: false,
      message: "An unexpected error occurred. Please try again.",
    })
  } finally {
    setIsSubmitting(false)
  }
}

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 relative">
      {/* Debug Mode Overlay */}
      <AnimatePresence>
        {debugMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-4 right-4 z-50 bg-black text-green-400 p-4 rounded-lg font-mono text-sm border border-green-500"
          >
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="h-4 w-4" />
              <span>DEBUG MODE</span>
            </div>
            <div>Coffee consumed: {coffeeCount} ☕</div>
            <div>Current state: {developerStates[currentState].text}</div>
            <div>Lines of code: 42,069</div>
            <button onClick={() => setDebugMode(false)} className="text-red-400 hover:text-red-300 mt-2">
              [ESC] Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 dark:opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-10 w-72 h-72 bg-yellow-300 dark:bg-yellow-900 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          <div className="absolute -bottom-8 right-20 w-72 h-72 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-6000"></div>
        </div>

        {/* Floating Code Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { symbol: "{ }", left: 10, top: 20, rotate: 45, duration: 12 },
            { symbol: "< />", left: 80, top: 15, rotate: 120, duration: 15 },
            { symbol: "( )", left: 25, top: 70, rotate: 200, duration: 13 },
            { symbol: "[ ]", left: 70, top: 75, rotate: 280, duration: 17 },
            { symbol: "=> {}", left: 90, top: 45, rotate: 160, duration: 14 },
            { symbol: "fn()", left: 5, top: 50, rotate: 320, duration: 16 },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="absolute text-slate-300 dark:text-slate-700 font-mono text-xs opacity-20"
              style={{
                left: `${item.left}%`,
                top: `${item.top}%`,
              }}
              initial={{
                rotate: item.rotate,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [item.rotate, item.rotate + 360],
                opacity: [0.2, 0.1, 0.2],
              }}
              transition={{
                duration: item.duration,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 2,
                ease: "easeInOut",
              }}
            >
              {item.symbol}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b backdrop-blur-lg bg-white/70 dark:bg-slate-950/70 supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-slate-950/70">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="font-bold text-xl flex items-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500">
              {profile.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            {["home", "about", "skills", "projects", "contact"].map((section) => (
              <Link
                key={section}
                href={`#${section}`}
                className={`text-sm font-medium transition-colors relative ${activeSection === section
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-slate-700 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400"
                  }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
                {activeSection === section && (
                  <motion.span
                    layoutId="activeSection"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500"
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <Link href={profile.githubUrl} target="_blank" aria-label="GitHub">
                <Github className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <Link href={profile.linkedinUrl} target="_blank" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="default"
              className="hidden md:flex rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 dark:from-purple-500 dark:to-pink-500 dark:hover:from-purple-600 dark:hover:to-pink-600"
              asChild
            >
              <Link href="#contact">
                <Mail className="mr-2 h-4 w-4" /> Contact Me
              </Link>
            </Button>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-16 inset-x-0 bg-white dark:bg-slate-950 border-b shadow-lg"
          >
            <nav className="container py-4 flex flex-col">
              {["home", "about", "skills", "projects", "contact"].map((section) => (
                <Link
                  key={section}
                  href={`#${section}`}
                  className={`py-3 px-4 text-sm font-medium ${activeSection === section
                      ? "text-purple-600 dark:text-purple-400 bg-slate-100 dark:bg-slate-900 rounded-md"
                      : "text-slate-700 dark:text-slate-300"
                    }`}
                  onClick={closeMenu}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </Link>
              ))}
              <Button
                variant="default"
                className="mt-4 mx-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 dark:from-purple-500 dark:to-pink-500 dark:hover:from-purple-600 dark:hover:to-pink-600"
                asChild
              >
                <Link href="#contact">
                  <Mail className="mr-2 h-4 w-4" /> Contact Me
                </Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section id="home" className="py-20 md:py-22 relative overflow-hidden">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-3 lg:grid-cols-[1fr_400px] lg:gap-5 xl:grid-cols-[1fr_500px]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col justify-center space-y-6"
              >
                <div className="space-y-2">
                  {/* Developer Status Badge */}
                  <motion.div
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 mb-4"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <motion.span
                      className="relative flex h-2 w-2 mr-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
                    </motion.span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={currentState}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`flex items-center gap-1 ${developerStates[currentState].color}`}
                      >
                        {developerStates[currentState].icon}
                        {developerStates[currentState].text}...
                      </motion.span>
                    </AnimatePresence>
                  </motion.div>

                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    <motion.span
                      className="block"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      Hi, I&apos;m {profile.name}
                    </motion.span>
                    <motion.span
                      className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      {profile.role}
                    </motion.span>
                  </h1>

                  {/* Typing Code Animation */}
                  <motion.div
                    className="bg-slate-900 dark:bg-slate-800 rounded-lg p-4 font-mono text-sm text-green-400 border border-slate-700 max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <span className="text-slate-400 text-xs">terminal</span>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentCode}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center"
                      >
                        <span className="text-purple-400">$</span>
                        <span className="ml-2">
                          {displayedCode}
                        </span>

                        <motion.span
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{
                            duration: 0.8,
                            repeat: Number.POSITIVE_INFINITY,
                          }}
                          className="ml-1 text-white"
                        >
                          |
                        </motion.span>
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>

                  <motion.p
                    className="max-w-[600px] text-slate-700 dark:text-slate-300 md:text-xl mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    {profile.headline}
                  </motion.p>
                </div>

                <motion.div
                  className="flex flex-col gap-3 min-[400px]:flex-row"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <Button
                    className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 dark:from-purple-500 dark:to-pink-500 dark:hover:from-purple-600 dark:hover:to-pink-600 text-white"
                    size="lg"
                    asChild
                  >
                    <Link href="#contact" className="group">
                      Get in Touch
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  {/* <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full bg-transparent group"
                    asChild
                    onClick={() => setCoffeeCount((prev) => prev + 1)}
                  >
                    <Link href="/resume">
                      <Download className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                      Download Resume
                    </Link>
                  </Button> */}
                </motion.div>

                <motion.div
                  className="flex items-center gap-4 mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <div className="text-sm text-slate-600 dark:text-slate-400">Follow me on:</div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full h-9 w-9 bg-transparent hover:scale-110 transition-transform"
                      asChild
                    >
                      <Link href={profile.githubUrl} target="_blank" aria-label="GitHub">
                        <Github className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full h-9 w-9 bg-transparent hover:scale-110 transition-transform"
                      asChild
                    >
                      <Link
                        href={profile.linkedinUrl}
                        target="_blank"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative mx-auto lg:order-last"
              >
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 blur-2xl opacity-20"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                  <div className="relative bg-white dark:bg-slate-900 rounded-full p-2 shadow-xl">
                    <img
                      alt={profile.name}
                      className="aspect-square overflow-hidden rounded-full object-cover object-center sm:w-full border-4 border-white dark:border-slate-900"
                      height="500"
                      src={profile.imageUrl || "/avatar.png"}
                      width="500"
                    />
                  </div>
                  <motion.div
                    className="absolute -bottom-4 -right-4 bg-white dark:bg-slate-800 rounded-full p-3 shadow-lg"
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full p-2">
                      <Code className="h-6 w-6" />
                    </div>
                  </motion.div>

                  {/* Floating Developer Icons */}
                  {[
                    { icon: <Coffee className="h-4 w-4" />, position: "top-4 left-4", delay: 0 },
                    { icon: <Bug className="h-4 w-4" />, position: "top-4 right-4", delay: 1 },
                    { icon: <Terminal className="h-4 w-4" />, position: "bottom-4 left-4", delay: 2 },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className={`absolute ${item.position} bg-slate-800 text-green-400 p-2 rounded-full shadow-lg`}
                      animate={{
                        y: [0, -15, 0],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2 + index,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: item.delay,
                        ease: "easeInOut",
                      }}
                    >
                      {item.icon}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 md:py-22 relative">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-12 lg:grid-cols-2 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-2xl opacity-10 -z-10"></div>
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center mb-6">
                      <motion.div
                        className="h-1 flex-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                      <div className="px-4 text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500">
                        About Me
                      </div>
                      <motion.div
                        className="h-1 flex-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 1, delay: 0.4 }}
                      />
                    </div>
                    <div className="space-y-4">
                      <motion.p
                        className="text-slate-700 dark:text-slate-300 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {profile.about}
                      </motion.p>
                      <motion.p
                        className="text-slate-700 dark:text-slate-300 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        {profile.summary}
                      </motion.p>
                      <div className="pt-4">
                        <motion.h3
                          className="text-lg font-semibold mb-3"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                        >
                          What I bring to the table:
                        </motion.h3>
                        <ul className="space-y-2">
                          {[
                            "Backend development with Django, Flask, and FastAPI",
                            "RESTful API design and integration",
                            "Web scraping with Selenium and BeautifulSoup",
                            "PostgreSQL, Redis, and Docker",
                            "AI and workflow automation integrations",
                          ].map((item, index) => (
                            <motion.li
                              key={index}
                              className="flex items-start"
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.8 + index * 0.1 }}
                            >
                              <motion.div
                                className="mr-2 mt-1 h-5 w-5 flex-shrink-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center"
                                whileHover={{ scale: 1.2, rotate: 360 }}
                                transition={{ duration: 0.3 }}
                              >
                                <svg
                                  className="h-3 w-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="3"
                                    d="M5 13l4 4L19 7"
                                  ></path>
                                </svg>
                              </motion.div>
                              <span className="text-slate-700 dark:text-slate-300">{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-bold leading-tight">
                    Turning{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500">
                      Ideas
                    </span>{" "}
                    into{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500">
                      Reality
                    </span>
                  </h2>
                  <p className="text-slate-700 dark:text-slate-300 text-lg">{profile.summary}</p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { number: "1+", label: "Year Experience" },
                      { number: String(projects.length), label: "Featured Projects" },
                      { number: String(skills.length), label: "Core Frameworks" },
                      { number: "10+", label: "Tools & Services" },
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-md border border-slate-200 dark:border-slate-800"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <motion.div
                          className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                        >
                          {stat.number}
                        </motion.div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20 md:py-22 relative">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 mb-4">
                My Expertise
              </div>
              <h2 className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                Technical{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500">
                  Skills
                </span>
              </h2>
              <p className="mt-4 text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
                My technology stack is carefully chosen to deliver high-performance, scalable, and maintainable
                applications.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {skills.map((skill, index) => {
                const brandIcon = getBrandSkillIcon(skill)

                return (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{
                      y: -10,
                      scale: 1.05,
                      rotateY: 10,
                    }}
                    className="group cursor-pointer"
                  >
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-800 h-full flex flex-col items-center justify-center text-center transition-all duration-300 group-hover:shadow-xl">
                      <motion.div
                        className={
                          brandIcon
                            ? "mb-4 rounded-full bg-white/95 p-3 text-slate-900 shadow-md ring-1 ring-slate-200/80 dark:bg-slate-950/90 dark:text-slate-100 dark:ring-slate-700/60"
                            : `mb-4 rounded-full bg-gradient-to-r ${skill.accent} p-3 text-white`
                        }
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        {brandIcon ? (
                          <SkillBrandIcon icon={brandIcon} className="h-8 w-8" />
                        ) : (
                          getFallbackSkillIcon(skill)
                        )}
                      </motion.div>
                      <h3 className="text-lg font-semibold mb-2 tech-tag">{skill.name}</h3>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 md:py-22 relative">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 mb-4">
                My Work
              </div>
              <h2 className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                Featured{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500">
                  Projects
                </span>
              </h2>
              <p className="mt-4 text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
                A showcase of my recent work, demonstrating my skills and expertise in web development.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    y: -10,
                    rotateX: 5,
                    rotateY: 5,
                  }}
                  className="group cursor-pointer"
                >
                  <Card className="overflow-hidden border-0 shadow-lg h-full transform-gpu">
                    <div className="relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6"
                        initial={{ y: 20 }}
                        whileHover={{ y: 0 }}
                      >
                        <Button
                          variant="default"
                          size="sm"
                          className="gap-2 bg-white text-slate-900 hover:bg-slate-100"
                          asChild
                        >
                          <Link href={project.linkUrl || "#"}>
                            View Project <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      </motion.div>
                      <motion.img
                        src={project.imageUrl?.trim() || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-48 object-cover"
                        onError={(event) => {
                          event.currentTarget.onerror = null
                          event.currentTarget.src = "/placeholder.svg"
                        }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-slate-700 dark:text-slate-300 mb-4 line-clamp-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter(Boolean)
                          .map((tag, tagIndex) => (
                            <motion.div
                              key={tag}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ delay: tagIndex * 0.1 }}
                              whileHover={{ scale: 1.1 }}
                            >
                              <Badge
                                variant="secondary"
                                className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 font-mono text-xs"
                              >
                                {tag}
                              </Badge>
                            </motion.div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button variant="outline" size="lg" className="rounded-full group bg-transparent">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 md:py-22 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 relative">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 mb-4">
                Client Feedback
              </div>
              <h2 className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                What People{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500">
                  Say
                </span>
              </h2>
              <p className="mt-4 text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
                Don&apos;t just take my word for it. Here&apos;s what clients have to say about working with me.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <Card className="h-full border-0 shadow-lg bg-white dark:bg-slate-900">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                          <motion.div
                            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 blur-sm opacity-50"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          />
                          <img
                            src={testimonial.avatarUrl || "/placeholder-user.jpg"}
                            alt={testimonial.name}
                            className="relative w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-900"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold">{testimonial.name}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{testimonial.role}</p>
                        </div>
                      </div>
                      <div className="mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <motion.span
                            key={star}
                            className="text-yellow-500"
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: star * 0.1 }}
                            whileHover={{ scale: 1.2 }}
                          >
                            ★
                          </motion.span>
                        ))}
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 italic">{`"${testimonial.content}"`}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 md:py-22 relative">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex flex-col justify-center space-y-6"
              >
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 mb-2 w-fit">
                  Get in Touch
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Let&apos;s Build Something{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500">
                    Amazing
                  </span>{" "}
                  Together
                </h2>
                <p className="text-slate-700 dark:text-slate-300 md:text-lg">
                  Have a project in mind? Let&apos;s discuss how I can help bring your ideas to life. I&apos;m open to backend development opportunities and collaborative projects.
                </p>
                <div className="space-y-4 mt-6">
                  <motion.div
                    className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 shadow-md border border-slate-200 dark:border-slate-800"
                    whileHover={{ scale: 1.02, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-2 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-slate-700 dark:text-slate-300">{profile.email}</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-2xl opacity-10 -z-10"></div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-xl font-bold mb-6">Send Me a Message</h3>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Name *
                        </label>
                        <input
                          id="name"
                          name="name"
                          required
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Your name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Email *
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Your email"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="subject"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Subject *
                      </label>
                      <input
                        id="subject"
                        name="subject"
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Subject"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="message"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Your message"
                      />
                    </div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-md bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 dark:from-purple-500 dark:to-pink-500 dark:hover:from-purple-600 dark:hover:to-pink-600 text-white disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="inline-block mr-2"
                          >
                            ⚡
                          </motion.span>
                        ) : null}
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </motion.div>
                  </form>

                  {contactState && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-4 p-4 rounded-md ${contactState.success
                          ? "bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
                          : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
                        }`}
                    >
                      {contactState.message}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-white dark:bg-slate-950">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex flex-col items-center gap-4 md:items-start md:gap-2">
              <Link href="/" className="font-bold text-xl flex items-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500">
                  {profile.name}
                </span>
              </Link>
              <p className="text-center text-sm leading-loose text-slate-600 dark:text-slate-400 md:text-left">
                © 2026 {profile.name}. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <Link href={profile.githubUrl} target="_blank" aria-label="GitHub">
                  <Github className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <Link
                  href={profile.linkedinUrl}
                  target="_blank"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

