import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CircleDot,
  Github,
  Layers3,
  Sparkles,
  UserRound,
} from "lucide-react"
import { SiteNav } from "@/components/site/site-nav"
import { SiteFooter } from "@/components/site/footer"
import { ProjectCover } from "@/components/site/project-cover"
import { Reveal } from "@/components/site/reveal"
import { ProjectGallery } from "@/components/project-gallery"
import { getSiteData } from "@/lib/site-data"
import type { Project } from "@/lib/site-types"

function findProject(projects: Project[], slug: string) {
  return projects.find((project) => project.slug === slug)
}

function formatDate(value: string, fallback = "Not documented") {
  if (!value) return fallback
  const [year, month] = value.split("-")
  if (!year || !month) return fallback
  return new Date(Number(year), Number(month) - 1).toLocaleDateString("en", {
    month: "short",
    year: "numeric",
  })
}

function ListSection({
  index,
  label,
  title,
  items,
  variant = "default",
}: {
  index: string
  label: string
  title: string
  items: string[]
  variant?: "default" | "numbered" | "check"
}) {
  if (!items.length) return null

  return (
    <section>
      <div className="flex items-center gap-3">
        <span className="font-mono text-[0.6rem] uppercase tracking-label text-primary">{index}</span>
        <span className="h-px w-8 bg-white/20" />
        <span className="eyebrow">{label}</span>
      </div>
      <h2 className="mt-5 font-display text-2xl tracking-tight text-white/90 sm:text-3xl">{title}</h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {items.map((item, itemIndex) => (
          <li
            key={item}
            className="group flex gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition-colors hover:border-primary/25 hover:bg-white/[0.04]"
          >
            {variant === "numbered" ? (
              <span className="mt-0.5 font-mono text-[0.6rem] text-primary/80">
                {String(itemIndex + 1).padStart(2, "0")}
              </span>
            ) : (
              <CircleDot className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70" />
            )}
            <span className="text-[0.875rem] leading-relaxed text-white/55">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export async function generateStaticParams() {
  return (await getSiteData()).projects.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = findProject((await getSiteData()).projects, slug)

  return project
    ? {
        title: { absolute: `${project.title} | Shahroz Khan` },
        description: project.description,
        alternates: { canonical: `/projects/${project.slug}` },
        openGraph: {
          url: `https://shahrozkhan.vercel.app/projects/${project.slug}`,
          images: project.gallery[0]?.url || project.imageUrl || "/avatar.png",
        },
      }
    : {}
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await getSiteData()
  const index = data.projects.findIndex((item) => item.slug === slug)
  const project = data.projects[index]

  if (!project || project.visible === false) notFound()

  const previous = data.projects[index - 1]
  const next = data.projects[index + 1]
  const tags = project.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
  const techStack = project.techStack.length ? project.techStack : tags
  const projectUrl = project.liveUrl || project.linkUrl
  const statusLabel = project.status.replace("-", " ")

  const navSections = [
    "home",
    ...(data.visibility.profile ? ["about"] : []),
    ...(data.visibility.skills ? ["skills"] : []),
    ...(data.visibility.projects ? ["projects"] : []),
    "contact",
  ]

  return (
    <div className="relative min-h-screen">
      <SiteNav
        sections={navSections}
        projects={data.projects}
        profile={data.profile}
        variant="inner"
      />

      <main id="content" className="relative pt-24 sm:pt-28">
        <div className="shell">
          <Link
            href="/#projects"
            className="group inline-flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-label text-white/40 transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to selected work
          </Link>

          <header className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-14">
            <Reveal y={16}>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/[0.08] px-3 py-1 font-mono text-[0.6rem] uppercase tracking-label text-primary">
                  <Sparkles className="h-3 w-3" />
                  Case study
                </span>
                <span className="font-mono text-[0.6rem] uppercase tracking-label text-white/35">
                  {String(index + 1).padStart(2, "0")} / {String(data.projects.length).padStart(2, "0")}
                </span>
                <span className="h-3 w-px bg-white/15" />
                <span className="font-mono text-[0.6rem] capitalize tracking-label text-white/35">
                  {statusLabel}
                </span>
              </div>

              <h1 className="mt-6 font-display text-display-sm text-white sm:text-display-md">
                {project.title}
              </h1>

              <p className="mt-6 max-w-xl text-[1rem] leading-[1.75] text-white/55">
                {project.longDescription || project.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {projectUrl ? (
                  <a
                    href={projectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-signal group"
                  >
                    Visit live project
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                ) : (
                  <Link href="/#contact" className="btn-signal group">
                    Discuss a similar build
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                )}
                {project.repoUrl ? (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost"
                  >
                    <Github className="h-4 w-4" />
                    Repository
                  </a>
                ) : null}
              </div>
            </Reveal>

            <Reveal delay={0.1} y={20}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 shadow-[0_50px_120px_-50px_rgba(0,0,0,1)]">
                <ProjectCover project={project} index={index} />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
              </div>
            </Reveal>
          </header>

          <Reveal delay={0.12}>
            <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.07] sm:grid-cols-4">
              {[
                { icon: UserRound, label: "Role", value: project.role || "Not documented", capitalize: false },
                {
                  icon: CalendarDays,
                  label: "Timeline",
                  value: `${formatDate(project.startDate)} — ${formatDate(project.endDate, "Present")}`,
                  capitalize: false,
                },
                {
                  icon: Layers3,
                  label: "Stack",
                  value: `${techStack.length} technologies`,
                  capitalize: false,
                },
                { icon: CircleDot, label: "Status", value: statusLabel, capitalize: true },
              ].map((item) => (
                <div key={item.label} className="bg-ink/80 p-5">
                  <item.icon className="h-4 w-4 text-primary/70" />
                  <dt className="mt-3 font-mono text-[0.55rem] uppercase tracking-label text-white/30">
                    {item.label}
                  </dt>
                  <dd
                    className={`mt-1.5 text-[0.85rem] text-white/80 ${
                      item.capitalize ? "capitalize" : ""
                    }`}
                  >
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
            <article className="space-y-12">
              <Reveal>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[0.6rem] uppercase tracking-label text-primary">01</span>
                    <span className="h-px w-8 bg-white/20" />
                    <span className="eyebrow">Overview</span>
                  </div>
                  <h2 className="mt-5 font-display text-2xl tracking-tight text-white/90 sm:text-3xl">
                    Built with purpose.
                  </h2>
                  <p className="mt-5 max-w-2xl text-[0.975rem] leading-[1.8] text-white/55">
                    {project.description}
                  </p>
                </div>
              </Reveal>

              {project.problem || project.solution ? (
                <Reveal>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {project.problem ? (
                      <div className="panel p-6">
                        <span className="eyebrow text-primary/70">The challenge</span>
                        <h3 className="mt-3 font-display text-lg text-white/90">Problem</h3>
                        <p className="mt-3 text-[0.85rem] leading-relaxed text-white/50">
                          {project.problem}
                        </p>
                      </div>
                    ) : null}
                    {project.solution ? (
                      <div className="panel p-6">
                        <span className="eyebrow text-primary/70">The approach</span>
                        <h3 className="mt-3 font-display text-lg text-white/90">Solution</h3>
                        <p className="mt-3 text-[0.85rem] leading-relaxed text-white/50">
                          {project.solution}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </Reveal>
              ) : null}

              <ListSection
                index="02"
                label="Contribution"
                title="What I built"
                items={project.contributions}
                variant="numbered"
              />

              {project.features.length ? (
                <Reveal>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[0.6rem] uppercase tracking-label text-primary">03</span>
                      <span className="h-px w-8 bg-white/20" />
                      <span className="eyebrow">Capabilities</span>
                    </div>
                    <h2 className="mt-5 font-display text-2xl tracking-tight text-white/90 sm:text-3xl">
                      Key features
                    </h2>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {project.features.map((feature) => (
                        <li
                          key={feature}
                          className="rounded-full border border-white/[0.09] bg-white/[0.025] px-3.5 py-2 text-[0.78rem] text-white/60"
                        >
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ) : null}

              <ListSection
                index="04"
                label="Constraints"
                title="Challenges"
                items={project.challenges}
              />

              <ListSection index="05" label="Outcome" title="Results" items={project.results} />

              <ProjectGallery images={project.gallery} />
            </article>

            <aside className="h-fit space-y-4 lg:sticky lg:top-28">
              <div className="panel p-6">
                <span className="eyebrow">Technology</span>
                <ul className="mt-5 space-y-2.5">
                  {techStack.map((tech, techIndex) => (
                    <li
                      key={tech}
                      className="flex items-center justify-between gap-3 border-b border-white/[0.06] pb-2.5 text-[0.85rem] text-white/60 last:border-0 last:pb-0"
                    >
                      {tech}
                      <span className="font-mono text-[0.55rem] text-white/20">
                        {String(techIndex + 1).padStart(2, "0")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="panel p-6">
                <span className="eyebrow">Links</span>
                <div className="mt-4 space-y-2">
                  {projectUrl ? (
                    <a
                      href={projectUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between text-[0.85rem] text-white/60 transition-colors hover:text-primary"
                    >
                      Live project
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  ) : null}
                  {project.repoUrl ? (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between text-[0.85rem] text-white/60 transition-colors hover:text-primary"
                    >
                      Repository
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  ) : null}
                  <Link
                    href="/resume"
                    className="group flex items-center justify-between text-[0.85rem] text-white/60 transition-colors hover:text-primary"
                  >
                    Full résumé
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-primary/[0.07] p-6">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(200,250,79,0.35),transparent_65%)] blur-2xl"
                />
                <p className="relative font-display text-lg leading-snug tracking-tight text-white">
                  Need something similar built?
                </p>
                <p className="relative mt-2 text-[0.8rem] leading-relaxed text-white/55">
                  I&apos;m available for backend and automation work.
                </p>
                <Link href="/#contact" className="btn-signal relative mt-5 w-full justify-center">
                  Start a conversation
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </aside>
          </div>

          <nav
            aria-label="Project navigation"
            className="mt-16 grid gap-4 border-t border-white/[0.08] pt-8 sm:grid-cols-2"
          >
            {previous ? (
              <Link
                href={`/projects/${previous.slug}`}
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
              >
                <span className="flex items-center gap-2 font-mono text-[0.55rem] uppercase tracking-label text-white/30">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Previous
                </span>
                <span className="mt-3 block font-display text-lg tracking-tight text-white/80 transition-colors group-hover:text-white">
                  {previous.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/projects/${next.slug}`}
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 text-right transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
              >
                <span className="flex items-center justify-end gap-2 font-mono text-[0.55rem] uppercase tracking-label text-white/30">
                  Next
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
                <span className="mt-3 block font-display text-lg tracking-tight text-white/80 transition-colors group-hover:text-white">
                  {next.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>
      </main>

      <SiteFooter profile={data.profile} basePath="/" />
    </div>
  )
}
