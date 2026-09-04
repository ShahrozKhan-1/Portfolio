import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { getSiteData } from "@/lib/site-data"

const slugify = (title: string, id: number) => `${title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "project"}-${id}`
const validUrl = (url: string) => /^https?:\/\//i.test(url)

export async function generateStaticParams() { const { projects } = await getSiteData(); return projects.map((project) => ({ slug: slugify(project.title, project.id) })) }
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> { const { projects } = await getSiteData(); const project = projects.find((item) => slugify(item.title, item.id) === params.slug); return project ? { title: `${project.title} — Portfolio`, description: project.description } : { title: "Project not found" } }

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const { projects } = await getSiteData(); const ordered = projects; const slug = params.slug; const index = ordered.findIndex((project) => slugify(project.title, project.id) === slug); if (index < 0) notFound(); const project = ordered[index]
  return <main><header className="site-header"><Link href="/#home" className="wordmark"><span>SK</span><strong>Portfolio</strong></Link><Link href="/#projects" className="header-link"><ArrowLeft /> all projects</Link></header><article className="project-detail section-shell"><Link className="back-link" href="/#projects"><ArrowLeft /> back to selected work</Link><p className="eyebrow">project / {String(index + 1).padStart(2, "0")}</p><h1>{project.title}</h1><p className="detail-description">{project.description}</p><div className="detail-art">{project.imageUrl ? <img src={project.imageUrl} alt="" /> : <span className="art-grid" />}</div><div className="detail-columns"><div><p className="eyebrow">overview</p><p className="detail-body">{project.description}</p></div><div><p className="eyebrow">technologies</p><div className="tag-row">{project.tags.split(",").map((tag) => <span key={tag}>{tag.trim()}</span>)}</div>{validUrl(project.linkUrl) && <a className="button button-primary detail-link" href={project.linkUrl} target="_blank" rel="noreferrer">visit project <ArrowUpRight /></a>}</div></div><nav className="project-pagination">{ordered[index - 1] ? <Link href={`/projects/${slugify(ordered[index - 1].title, ordered[index - 1].id)}`}><small>previous</small><strong>← {ordered[index - 1].title}</strong></Link> : <span />}{ordered[index + 1] && <Link href={`/projects/${slugify(ordered[index + 1].title, ordered[index + 1].id)}`}><small>next</small><strong>{ordered[index + 1].title} →</strong></Link>}</nav></article></main>
}
