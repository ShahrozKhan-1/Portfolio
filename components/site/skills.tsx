"use client"

import { Plus } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"
import { Reveal } from "@/components/site/reveal"
import { SpotlightCard } from "@/components/site/spotlight-card"
import { Marquee } from "@/components/site/marquee"
import { SkillIcon, getSkillBrandColor } from "@/components/portfolio/skill-icon"
import type { Skill } from "@/lib/site-types"

const EXTRA_TOOLS = [
  "Flask",
  "Django REST Framework",
  "WebSockets",
  "BeautifulSoup",
  "OpenAI API",
  "ElevenLabs",
  "n8n",
  "Zapier",
  "Monday.com",
  "QuickBooks",
  "Git",
  "Linux",
]

export function Skills({ skills }: { skills: Skill[] }) {
  if (!skills.length) return null
  const [featured, ...rest] = skills
  const featuredBrand = getSkillBrandColor(featured)

  return (
    <section id="skills" className="relative py-section">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16">
          <SectionHeading
            index="02"
            label="Toolkit"
            title={
              <>
                Tools chosen for
                <br />
                <span className="font-serif italic text-primary">reliability</span>, not hype.
              </>
            }
          />
          <Reveal delay={0.12}>
            <p className="max-w-lg text-[0.975rem] leading-[1.8] text-muted-foreground lg:pb-2">
              A focused stack built around Python and PostgreSQL — fast to ship, straightforward to
              operate, and boring in the best possible way when it matters.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid auto-rows-auto grid-cols-2 gap-3 lg:grid-cols-4">
          {featured ? (
            <Reveal className="col-span-2 lg:row-span-2" delay={0.04}>
              <SpotlightCard className="panel group relative flex h-full flex-col justify-between overflow-hidden p-7 sm:p-8">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(200,250,79,0.18),transparent_65%)] blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                />
                <div className="relative z-10 flex items-start justify-between">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]"
                    style={
                      featuredBrand
                        ? {
                            backgroundColor: `${featuredBrand}18`,
                            borderColor: `${featuredBrand}3d`,
                            boxShadow: `inset 0 0 32px ${featuredBrand}22`,
                          }
                        : undefined
                    }
                  >
                    <span className="scale-[1.35]">
                      <SkillIcon skill={featured} glow />
                    </span>
                  </div>
                  <span className="font-mono text-[0.6rem] uppercase tracking-label text-white/30">
                    01 / {featured.category}
                  </span>
                </div>

                <div className="relative z-10 mt-8">
                  <h3 className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)] leading-none tracking-tight text-white">
                    {featured.name}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/50">
                    {featured.description}
                  </p>
                </div>

                <div className="relative z-10 mt-8 rounded-xl border border-white/[0.08] bg-black/40 p-4 font-mono text-[0.62rem] leading-relaxed sm:text-[0.7rem]">
                  <div className="no-scrollbar overflow-x-auto">
                    <p className="whitespace-nowrap text-white/30">
                      <span className="text-primary/80">$</span> uvicorn app.api:app
                    </p>
                    <p className="mt-1 whitespace-nowrap text-white/25">
                      INFO: Uvicorn running on :8000
                    </p>
                    <p className="mt-1 whitespace-nowrap text-primary/70">
                      INFO: Application startup complete.
                      <span className="ml-1 inline-block h-3 w-1.5 translate-y-0.5 animate-pulse bg-primary/70" />
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          ) : null}

          {rest.map((skill, index) => {
            const brand = getSkillBrandColor(skill)
            return (
              <Reveal key={skill.id} delay={0.06 + index * 0.035}>
                <SpotlightCard className="group flex h-full flex-col justify-between gap-5 rounded-2xl border border-white/[0.08] bg-white/[0.022] p-4 transition-all duration-500 hover:-translate-y-1 hover:border-primary/25 hover:bg-white/[0.04] sm:p-5">
                  <div className="flex items-start justify-between">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]"
                      style={
                        brand
                          ? {
                              backgroundColor: `${brand}18`,
                              borderColor: `${brand}33`,
                            }
                          : undefined
                      }
                    >
                      <span className="scale-[0.62]">
                        <SkillIcon skill={skill} glow={Boolean(brand)} />
                      </span>
                    </div>
                    <span className="font-mono text-[0.55rem] uppercase tracking-label text-white/20">
                      {String(index + 2).padStart(2, "0")}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-[1.05rem] tracking-tight text-white/90">
                      {skill.name}
                    </h3>
                    <p className="mt-1 font-mono text-[0.55rem] uppercase tracking-label text-primary/60">
                      {skill.category}
                    </p>
                    <p className="mt-2.5 line-clamp-2 text-[0.78rem] leading-relaxed text-white/35">
                      {skill.description}
                    </p>
                  </div>
                </SpotlightCard>
              </Reveal>
            )
          })}

          <Reveal delay={0.1}>
            <div className="flex h-full min-h-[150px] flex-col justify-between rounded-2xl border border-dashed border-white/[0.12] bg-transparent p-4 sm:p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                <Plus className="h-4 w-4 text-white/45" />
              </span>
              <div>
                <h3 className="font-display text-[1.05rem] tracking-tight text-white/70">
                  Always expanding
                </h3>
                <p className="mt-2 text-[0.78rem] leading-relaxed text-white/30">
                  New tools are adopted when they earn their place in production.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-col gap-3 border-t border-white/[0.07] pt-8 sm:flex-row sm:items-center sm:gap-8">
            <span className="shrink-0 font-mono text-[0.6rem] uppercase tracking-label text-white/30">
              Also working with
            </span>
            <Marquee duration={40} className="mask-fade-x flex-1">
              {EXTRA_TOOLS.map((tool) => (
                <span key={tool} className="flex items-center">
                  <span className="px-5 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-white/40">
                    {tool}
                  </span>
                  <span className="text-primary/30">/</span>
                </span>
              ))}
            </Marquee>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
