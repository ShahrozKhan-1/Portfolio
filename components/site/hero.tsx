"use client"

import Link from "next/link"
import Image from "next/image"
import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { Marquee } from "@/components/site/marquee"
import { LocalTime } from "@/components/site/local-time"
import { LineMask, FadeIn } from "@/components/site/reveal"
import { Magnetic } from "@/components/site/magnetic"
import type { Profile, Project, Skill } from "@/lib/site-types"

type HeroProps = {
  profile: Profile
  skills: Skill[]
  projects: Project[]
}

const STACK_TICKER = [
  "Python",
  "Django",
  "FastAPI",
  "PostgreSQL",
  "Redis",
  "Docker",
  "Selenium",
  "REST APIs",
  "Automation",
  "AI Integrations",
]

export function Hero({ profile, skills, projects }: HeroProps) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, -90])
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 40])

  const ticker = skills.length
    ? Array.from(new Set([...skills.map((skill) => skill.name), ...STACK_TICKER]))
    : STACK_TICKER

  return (
    <section
      ref={ref}
      id="home"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-28 sm:pt-32"
    >
      {/* Ambient focal glow behind the portrait */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] top-[8%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(200,250,79,0.10),transparent_65%)] blur-2xl"
      />

      <div className="shell relative flex-1">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-10 xl:gap-16">
          <motion.div style={reduce ? undefined : { y: copyY }} className="relative z-10">
            <FadeIn delay={0.05}>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.07] px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-label text-primary">
                  <span className="availability-dot relative h-1.5 w-1.5 rounded-full bg-primary" />
                  Available for work
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-label text-white/40">
                  Lahore, PK
                  <span className="h-3 w-px bg-white/15" />
                  <LocalTime />
                </span>
              </div>
            </FadeIn>

            <h1 className="mt-7 font-display text-display-lg font-medium text-white">
              <LineMask delay={0.12}>Shahroz</LineMask>
              <span className="flex flex-wrap items-baseline gap-x-3">
                <LineMask delay={0.24} className="text-stroke">
                  Khan
                </LineMask>
                <motion.span
                  initial={reduce ? undefined : { opacity: 0, scale: 0.4 }}
                  animate={reduce ? undefined : { opacity: 1, scale: 1 }}
                  transition={{ delay: 0.95, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-2 inline-block h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_24px_rgba(200,250,79,0.8)] sm:h-3.5 sm:w-3.5"
                />
              </span>
            </h1>

            <FadeIn delay={0.5}>
              <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="font-mono text-[0.7rem] uppercase tracking-label text-white/55">
                  Python · Backend Engineer
                </span>
                <span className="h-px w-8 bg-white/20" />
                <span className="font-serif text-xl italic text-white/45">
                  building systems, not just features
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.62}>
              <p className="mt-6 max-w-[34rem] text-pretty text-[1.0625rem] leading-[1.7] text-white/60">
                {profile.headline} I design APIs, data pipelines and automations that stay
                dependable long after launch.
              </p>
            </FadeIn>

            <FadeIn delay={0.74}>
              <div className="mt-9 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-center">
                <Magnetic strength={6} className="w-full min-[420px]:w-auto">
                  <Link href="#projects" className="btn-signal group w-full justify-center min-[420px]:w-auto">
                    Explore selected work
                    <ArrowDownRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                  </Link>
                </Magnetic>
                <Magnetic strength={5} className="w-full min-[420px]:w-auto">
                  <Link href="#contact" className="btn-ghost group w-full justify-center min-[420px]:w-auto">
                    Start a conversation
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </Magnetic>
              </div>
            </FadeIn>
          </motion.div>

          <motion.div
            style={reduce ? undefined : { y: portraitY }}
            className="relative mx-auto w-full max-w-[440px] sm:max-w-[480px] lg:mr-0 lg:ml-auto"
          >
            <FadeIn delay={0.35}>
              <figure className="relative">
                {/* Viewfinder corner brackets */}
                <span aria-hidden="true" className="absolute -left-2.5 -top-2.5 z-20 h-5 w-5 border-l border-t border-primary/60" />
                <span aria-hidden="true" className="absolute -right-2.5 -top-2.5 z-20 h-5 w-5 border-r border-t border-white/25" />
                <span aria-hidden="true" className="absolute -bottom-2.5 -left-2.5 z-20 h-5 w-5 border-b border-l border-white/25" />
                <span aria-hidden="true" className="absolute -bottom-2.5 -right-2.5 z-20 h-5 w-5 border-b border-r border-primary/60" />

                <div className="relative overflow-hidden rounded-[1.75rem] border border-white/12 bg-paper shadow-[0_60px_140px_-50px_rgba(0,0,0,0.95)]">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={profile.imageUrl || "/avatar.png"}
                      alt={`${profile.name}, ${profile.role}`}
                      fill
                      priority
                      sizes="(max-width: 1024px) 90vw, 44vw"
                      className="scale-[1.06] object-cover object-top"
                    />
                    <div className="absolute inset-0 grain opacity-[0.22] mix-blend-multiply" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,transparent_45%,rgba(28,22,14,0.14))]" />

                    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5 font-mono text-[0.55rem] uppercase tracking-label text-ink/40">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-[#6b7f1f]" />
                        Fig. 01 — Portrait
                      </span>
                      <span>31.5°N / 74.3°E</span>
                    </div>

                    <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-ink/10 bg-paper/80 px-5 py-4 backdrop-blur-md">
                      <div className="min-w-0">
                        <p className="truncate font-display text-lg leading-none tracking-tight text-ink">
                          {profile.name}
                        </p>
                        <p className="mt-1.5 truncate font-mono text-[0.55rem] uppercase tracking-label text-ink/50">
                          {profile.role} · Lahore, PK
                        </p>
                      </div>
                      <span className="shrink-0 font-mono text-[0.55rem] uppercase tracking-[0.16em] text-ink/35">
                        01 / 01
                      </span>
                    </figcaption>
                  </div>
                </div>

                {/* Rotating availability seal */}
                <div className="absolute -right-4 -top-7 z-10 grid h-24 w-24 place-items-center rounded-full border border-white/12 bg-ink/90 backdrop-blur-md sm:-right-6 sm:h-28 sm:w-28">
                  <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-spin-slow" aria-hidden="true">
                    <defs>
                      <path
                        id="hero-seal-path"
                        d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0"
                        fill="none"
                      />
                    </defs>
                    <text className="fill-white/45 font-mono text-[7.4px] uppercase tracking-[0.28em]">
                      <textPath href="#hero-seal-path" startOffset="0%">
                        Open to work · Backend systems ·
                      </textPath>
                    </text>
                  </svg>
                  <ArrowDownRight className="h-4 w-4 text-primary" />
                </div>

                {/* Floating detail chip */}
                <div className="absolute -bottom-6 left-4 z-10 hidden items-center gap-2 rounded-full border border-white/10 bg-ink/85 px-3.5 py-2 backdrop-blur-md sm:flex">
                  <span className="availability-dot h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="font-mono text-[0.58rem] uppercase tracking-label text-white/60">
                    Python 3.12 · Django · FastAPI
                  </span>
                </div>
              </figure>
            </FadeIn>
          </motion.div>
        </div>

        <FadeIn delay={0.9}>
          <div className="mt-10 flex flex-col gap-6 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="grid grid-cols-3">
              {[
                { value: "1+", label: "Years shipping" },
                { value: String(projects.length).padStart(2, "0"), label: "Case studies" },
                { value: String(skills.length || 8).padStart(2, "0"), label: "Core tools" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="border-l border-white/[0.08] px-4 first:border-l-0 first:pl-0 sm:px-7"
                >
                  <p className="font-display text-2xl tracking-tight text-white/90 sm:text-[1.75rem]">
                    {stat.value}
                  </p>
                  <p className="mt-1.5 font-mono text-[0.58rem] uppercase leading-relaxed tracking-label text-white/35">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="#contact"
              className="group inline-flex items-center gap-2 self-start font-mono text-[0.6rem] uppercase tracking-label text-white/45 transition-colors hover:text-primary sm:self-auto"
            >
              <span className="availability-dot h-1.5 w-1.5 rounded-full bg-primary" />
              Open to full-time &amp; freelance
              <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </FadeIn>
      </div>

      {/* Footer rail of the hero */}
      <div className="relative mt-12 border-y border-white/[0.07] bg-white/[0.012]">
        <div className="flex items-stretch">
          <div className="hidden shrink-0 items-center gap-2.5 border-r border-white/[0.07] px-6 sm:flex">
            <span className="relative flex h-7 w-4 justify-center overflow-hidden rounded-full border border-white/15">
              <span className="scroll-cue-line mt-1 h-2 w-px bg-primary" />
            </span>
            <span className="font-mono text-[0.55rem] uppercase tracking-label text-white/30">
              Scroll
            </span>
          </div>
          <Marquee
            duration={46}
            className="flex-1 py-4 [mask-image:linear-gradient(90deg,transparent,black_4%,black_94%,transparent)]"
          >
            {ticker.map((item) => (
              <span key={item} className="flex items-center">
                <span className="px-6 font-display text-[clamp(1rem,2.2vw,1.4rem)] uppercase tracking-tight text-white/35">
                  {item}
                </span>
                <span className="text-primary/60">✳</span>
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  )
}
