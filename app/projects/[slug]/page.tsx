import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowUpRight, CalendarDays, CheckCircle2, ExternalLink, Github, Briefcase, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProjectGallery } from "@/components/project-gallery"
import { getSiteData } from "@/lib/site-data"
import type { Project } from "@/lib/site-types"

function findProject(projects: Project[], slug: string) {
  return projects.find((project) => project.slug === slug)
}

function formatDate(value: string) {
  if (!value) return "Not documented"
  const [year, month] = value.split("-")
  return new Date(Number(year), Number(month) - 1).toLocaleDateString("en", { month: "short", year: "numeric" })
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null
  return (
    <section className="detail-section">
      <div className="mb-5 flex items-center gap-3">
        <span className="h-px w-8 bg-primary" />
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => (
          <li key={item} className="detail-list-item" style={{ animationDelay: `${index * 70}ms` }}>
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export async function generateStaticParams() {
  const data = await getSiteData()
  return data.projects.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = findProject((await getSiteData()).projects, slug)
  return project ? { title: `${project.title} | Shahroz Khan`, description: project.description, openGraph: { images: project.gallery[0]?.url || project.imageUrl || "/placeholder.svg" } } : {}
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await getSiteData()
  const index = data.projects.findIndex((item) => item.slug === slug)
  const project = data.projects[index]
  if (!project) notFound()
  const previous = data.projects[index - 1]
  const next = data.projects[index + 1]

  return (
    <main className="project-detail min-h-screen overflow-hidden px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="detail-noise" aria-hidden="true" />
      <div className="detail-orb detail-orb-one" aria-hidden="true" />
      <div className="detail-orb detail-orb-two" aria-hidden="true" />
      <div className="detail-pink-beam" aria-hidden="true" />
      <article className="relative mx-auto max-w-6xl">
        <Link href="/#projects" className="detail-back-link"><ArrowLeft className="size-4" /> Back to projects</Link>
        <header className="detail-hero mt-10 grid gap-8 lg:grid-cols-[1fr_310px] lg:items-end">
          <div className="max-w-4xl">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Badge className="capitalize">{project.status.replace("-", " ")}</Badge>
              {project.tags.split(",").map((tag) => tag.trim()).filter(Boolean).map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
            </div>
            <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary"><Sparkles className="size-4" /> Selected project</p>
            <h1 className="text-5xl font-bold tracking-[-0.06em] sm:text-7xl">{project.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">{project.longDescription || project.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {project.liveUrl || project.linkUrl ? <Button asChild size="lg"><a href={project.liveUrl || project.linkUrl} target="_blank" rel="noreferrer">Live project <ArrowUpRight data-icon="inline-end" /></a></Button> : null}
              {project.repoUrl ? <Button asChild variant="outline" size="lg"><a href={project.repoUrl} target="_blank" rel="noreferrer"><Github data-icon="inline-start" /> Repository</a></Button> : null}
            </div>
          </div>
          <aside className="detail-meta-card">
            <div className="flex items-center gap-3"><Briefcase className="size-5 text-primary" /><div><p className="detail-label">Role</p><p className="font-semibold">{project.role || "Not documented"}</p></div></div>
            <div className="my-5 h-px bg-border" />
            <div className="flex items-center gap-3"><CalendarDays className="size-5 text-primary" /><div><p className="detail-label">Timeline</p><p className="font-semibold">{formatDate(project.startDate)} — {formatDate(project.endDate)}</p></div></div>
          </aside>
        </header>

        <div className="mt-20 grid gap-14 lg:grid-cols-[1fr_280px]">
          <div>
            <section className="detail-section"><p className="detail-kicker">01 / Context</p><h2 className="mb-5 text-3xl font-bold tracking-tight">Overview</h2><p className="max-w-3xl text-lg leading-8 text-muted-foreground">{project.description}</p></section>
            {project.problem ? <section className="detail-section"><p className="detail-kicker">02 / Direction</p><h2 className="mb-4 text-2xl font-bold">Problem</h2><p className="max-w-3xl leading-8 text-muted-foreground">{project.problem}</p></section> : null}
            {project.solution ? <section className="detail-section"><p className="detail-kicker">03 / Approach</p><h2 className="mb-4 text-2xl font-bold">Solution</h2><p className="max-w-3xl leading-8 text-muted-foreground">{project.solution}</p></section> : null}
            <ListSection title="Contributions" items={project.contributions} />
            <ListSection title="Features" items={project.features} />
            <ListSection title="Challenges" items={project.challenges} />
            <ListSection title="Results" items={project.results} />
            <ProjectGallery images={project.gallery} />
          </div>
          <aside className="detail-stack-card h-fit lg:sticky lg:top-6"><h2 className="font-bold">Tech stack</h2><p className="mt-2 text-sm text-muted-foreground">Tools behind the build</p><div className="mt-5 flex flex-wrap gap-2">{(project.techStack.length ? project.techStack : project.tags.split(",")).map((item) => <Badge key={item} variant="secondary">{item.trim()}</Badge>)}</div></aside>
        </div>
        <nav className="mt-20 flex justify-between gap-4 border-t border-border py-8">{previous ? <Link href={`/projects/${previous.slug}`} className="detail-nav-link"><ArrowLeft className="size-4" /><span><small>Previous project</small>{previous.title}</span></Link> : <span />}{next ? <Link href={`/projects/${next.slug}`} className="detail-nav-link text-right"><span><small>Next project</small>{next.title}</span><ExternalLink className="size-4 rotate-[-45deg]" /></Link> : <span />}</nav>
      </article>
    </main>
  )
}
