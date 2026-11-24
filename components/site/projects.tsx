"use client"

import { useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"
import { Reveal } from "@/components/site/reveal"
import { ProjectCover } from "@/components/site/project-cover"
import { cn } from "@/lib/utils"
import type { Project } from "@/lib/site-types"

export function Projects({ projects }: { projects: Project[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const reduce = useReducedMotion()

  if (!projects.length) return null

  const safeIndex = Math.min(activeIndex, projects.length - 1)
  const activeProject = projects[safeIndex]

  return (
    <section id="projects" className="relative py-section">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-10 -z-10 h-[420px] w-[80vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(200,250,79,0.055),transparent_65%)] blur-3xl"
      />
      <div className="shell">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="03"
            label="Selected work"
            title={
              <>
                Systems running
                <br />
                in the <span className="font-serif italic text-primary">real world.</span>
              </>
            }
          />
          <Reveal delay={0.1}>
            <div className="flex items-center gap-4 lg:pb-3">
              <span className="font-mono text-[0.65rem] uppercase tracking-label text-white/35">
                {String(projects.length).padStart(2, "0")} case studies
              </span>
              <span className="h-px w-10 bg-white/15" />
              <span className="font-mono text-[0.65rem] uppercase tracking-label text-white/35">
                2025 — 2026
              </span>
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12 xl:gap-16">
          {/* Desktop: interactive index */}
          <div className="hidden border-t border-white/[0.08] lg:block">
            {projects.map((project, index) => {
              const isActive = index === safeIndex

              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  className="group relative flex items-center gap-5 border-b border-white/[0.08] py-6"
                >
                  <span
                    className={cn(
                      "absolute inset-x-0 inset-y-px -z-10 rounded-2xl bg-gradient-to-r from-primary/[0.08] via-white/[0.02] to-transparent transition-opacity duration-500",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span
                    className={cn(
                      "w-7 shrink-0 font-mono text-[0.65rem] transition-colors duration-300",
                      isActive ? "text-primary" : "text-white/25",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "flex items-baseline gap-3 font-display text-[clamp(1.5rem,2.4vw,2.1rem)] leading-none tracking-tight transition-all duration-500 ease-expo",
                        isActive ? "translate-x-1 text-white" : "text-white/65",
                      )}
                    >
                      {project.title}
                    </span>
                    <span
                      className={cn(
                        "mt-2.5 block max-w-xl truncate text-[0.83rem] leading-relaxed transition-colors duration-300",
                        isActive ? "text-white/50" : "text-white/30",
                      )}
                    >
                      {project.description}
                    </span>
                  </span>

                  <span
                    className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-300",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-white/10 text-white/40",
                    )}
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              )
            })}
            <div className="flex items-center justify-between py-5 font-mono text-[0.55rem] uppercase tracking-label text-white/25">
              <span>Hover a row to preview</span>
              <span>Click to open the case study</span>
            </div>
          </div>

          {/* Desktop: sticky preview */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-ink-2 shadow-[0_50px_120px_-50px_rgba(0,0,0,1)]">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={activeProject.id}
                    initial={reduce ? undefined : { opacity: 0, scale: 1.04 }}
                    animate={reduce ? undefined : { opacity: 1, scale: 1 }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <ProjectCover project={activeProject} index={safeIndex} />
                  </motion.div>
                </AnimatePresence>
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/[0.08] pt-4 font-mono text-[0.58rem] uppercase tracking-label">
                <span className="text-white/30">
                  {String(safeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")} — Selected work
                </span>
                <Link
                  href={`/projects/${activeProject.slug}`}
                  className="group inline-flex shrink-0 items-center gap-1.5 text-white/60 transition-colors hover:text-primary"
                >
                  Open case study
                  <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile / tablet: cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
            {projects.map((project, index) => (
              <Reveal key={project.id} delay={index * 0.05}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] transition-colors hover:border-primary/25"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <ProjectCover project={project} index={index} variant="compact" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between font-mono text-[0.55rem] uppercase tracking-label text-white/30">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>
                    <h3 className="mt-3 font-display text-xl tracking-tight text-white">
                      {project.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-[0.82rem] leading-relaxed text-white/40">
                      {project.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.tags
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean)
                        .slice(0, 3)
                        .map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/[0.09] px-2 py-0.5 font-mono text-[0.5rem] uppercase tracking-[0.12em] text-white/40"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
