"use client"

import Link from "next/link"
import { ArrowUpRight, Check, Layers3, Sparkles } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"
import { Reveal } from "@/components/site/reveal"
import { SpotlightCard } from "@/components/site/spotlight-card"
import { CountUp } from "@/components/site/count-up"
import type { Profile, Project, Skill } from "@/lib/site-types"

type AboutProps = {
  profile: Profile
  projects: Project[]
  skills: Skill[]
}

const PRINCIPLES = [
  "Backend development with Django, Flask and FastAPI",
  "RESTful API design, integration and documentation",
  "Web scraping with Selenium and BeautifulSoup",
  "PostgreSQL, Redis and Docker in production",
  "AI and workflow automation integrations",
]

export function About({ profile, projects, skills }: AboutProps) {
  return (
    <section id="about" className="relative py-section">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-end lg:gap-16">
          <SectionHeading
            index="01"
            label="About"
            title={
              <>
                Engineer&apos;s mindset,
                <br />
                <span className="font-serif italic text-primary">product</span> discipline.
              </>
            }
          />
          <Reveal delay={0.12}>
            <p className="max-w-xl text-[0.975rem] leading-[1.8] text-muted-foreground lg:pb-2">
              {profile.about} My experience includes internal management systems, AI-powered hiring
              workflows, data extraction platforms and cross-platform automations.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          <Reveal className="lg:col-span-7" delay={0.05}>
            <SpotlightCard className="panel h-full p-7 sm:p-9">
              <div className="relative z-10 flex h-full flex-col justify-between gap-8">
                <div className="flex items-start justify-between">
                  <span className="eyebrow">The approach</span>
                  <Sparkles className="h-4 w-4 text-primary/70" />
                </div>

                <p className="max-w-[34rem] font-display text-[clamp(1.35rem,2.4vw,1.85rem)] leading-[1.35] tracking-tight text-white/90">
                  I turn complex requirements into <span className="text-primary">clean, maintainable</span>{" "}
                  software — pairing solid architecture with the patience to ship it.
                </p>

                <div className="space-y-3">
                  <div className="h-px w-full bg-white/[0.08]" />
                  <p className="max-w-[38rem] text-sm leading-relaxed text-white/45">
                    {profile.summary}
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={0.12}>
            <div className="panel grid h-full grid-cols-2 gap-px overflow-hidden bg-white/[0.06] p-0">
              {[
                { value: 1, suffix: "+", label: "Years shipping", note: "Since 2025" },
                { value: projects.length || 4, suffix: "", label: "Case studies", note: "In production" },
                { value: skills.length || 8, suffix: "", label: "Core tools", note: "Python-first" },
                { value: 10, suffix: "+", label: "Integrations", note: "APIs & workflows" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col justify-center bg-ink/70 p-6 backdrop-blur-sm transition-colors duration-500 hover:bg-ink/40"
                >
                  <p className="font-display text-[2.5rem] leading-none tracking-tight text-white">
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-3 font-mono text-[0.6rem] uppercase leading-relaxed tracking-label text-white/45">
                    {stat.label}
                  </p>
                  <p className="mt-1 font-mono text-[0.55rem] uppercase tracking-label text-white/20">
                    {stat.note}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={0.05}>
            <SpotlightCard className="panel h-full p-7 sm:p-9">
              <div className="relative z-10">
                <span className="eyebrow">What I bring</span>
                <ul className="mt-6 space-y-3.5">
                  {PRINCIPLES.map((principle, index) => (
                    <li key={principle} className="group flex items-start gap-3">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-primary/25 bg-primary/10">
                        <Check className="h-3 w-3 text-primary" />
                      </span>
                      <span className="text-[0.9rem] leading-relaxed text-white/60 transition-colors group-hover:text-white/90">
                        {principle}
                      </span>
                      <span className="ml-auto hidden font-mono text-[0.55rem] text-white/20 sm:block">
                        0{index + 1}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </SpotlightCard>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={0.12}>
            <SpotlightCard className="panel relative h-full overflow-hidden p-7 sm:p-9">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(140,124,255,0.22),transparent_65%)] blur-2xl"
              />
              <div className="relative z-10 flex h-full flex-col justify-between gap-8">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <span className="eyebrow">Currently</span>
                    <h3 className="mt-4 font-display text-2xl tracking-tight text-white sm:text-[1.75rem]">
                      Python Developer
                      <span className="text-white/35"> @ </span>
                      SiliconWhiz
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-white/45">
                      Building internal operations platforms, AI hiring workflows and automation
                      tooling inside a small Agile team — from database schema to deployed API.
                    </p>
                  </div>
                  <Layers3 className="hidden h-5 w-5 shrink-0 text-white/30 sm:block" />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-5">
                  <div className="flex flex-wrap items-center gap-2">
                    {["Lahore, PK", "Remote friendly", "Open to work"].map((item) => (
                      <span key={item} className="tag">
                        {item}
                      </span>
                    ))}
                  </div>
                  <Link
                    href="/resume"
                    className="group inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-label text-white/60 transition-colors hover:text-primary"
                  >
                    Full résumé
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </SpotlightCard>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
