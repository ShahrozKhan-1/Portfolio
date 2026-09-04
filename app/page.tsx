"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Github, Linkedin, Mail, Menu, X, ExternalLink, Terminal, MapPin } from "lucide-react"
import { DEFAULT_SITE_DATA } from "@/lib/site-defaults"
import type { SiteData, Skill } from "@/lib/site-types"
import { sendContactEmail } from "./actions/contact"
import { MotionItem, Reveal, Stagger, motion } from "@/components/motion"
import { SystemVisualization } from "@/components/system-visualization"

const iconMap: Record<string, string> = { python: "PY", django: "DJ", fastapi: "FA", postgresql: "PG", docker: "DK", redis: "RD", selenium: "SE", automation: "AU", zapier: "ZP", n8n: "N8" }
const slugify = (title: string, id: number) => `${title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "project"}-${id}`
const validUrl = (url: string) => /^https?:\/\//i.test(url)
const MotionLink = motion(Link)

function SkillTile({ skill }: { skill: Skill }) {
  return <MotionItem><motion.article className="skill-tile" whileHover={{ y: -3 }} transition={{ duration: 0.2 }}><span className="skill-mark">{iconMap[skill.iconKey.toLowerCase()] ?? "<>"}</span><div><h3>{skill.name}</h3><p>{skill.description}</p></div><span className="skill-category">{skill.category}</span></motion.article></MotionItem>
}

export default function Home() {
  const [data, setData] = useState<SiteData>(DEFAULT_SITE_DATA)
  const [menu, setMenu] = useState(false)
  const [status, setStatus] = useState("")
  const [sending, setSending] = useState(false)
  useEffect(() => { fetch("/api/site-data", { cache: "no-store" }).then((r) => r.ok ? r.json() : null).then((next) => next && setData(next)).catch(() => undefined) }, [])
  const profile = data.profile
  const projects = useMemo(() => data.projects, [data.projects])
  async function submit(form: HTMLFormElement) { setSending(true); setStatus(""); const result = await sendContactEmail(new FormData(form)); setStatus(result.message); setSending(false); if (result.success) form.reset() }
  return <main>
    <header className="site-header"><Link href="#home" className="wordmark"><span>SK</span><strong>{profile.name}</strong></Link><nav className={menu ? "nav-open" : ""}>{["about", "projects", "skills", "reviews", "contact"].map((item) => <a key={item} href={`#${item}`} onClick={() => setMenu(false)}>{item}</a>)}</nav><div className="header-actions"><a className="header-link" href={validUrl(profile.githubUrl) ? profile.githubUrl : "#"} target="_blank" rel="noreferrer"><Github /> github</a><a className="header-link" href={`mailto:${profile.email}`}><Mail /> contact</a><button className="menu-button" onClick={() => setMenu(!menu)} aria-label="Toggle menu">{menu ? <X /> : <Menu />}</button></div></header>
    <section id="home" className="hero section-shell"><div className="hero-copy"><p className="eyebrow"><span className="status-dot" /> available for select projects</p><h1>{profile.headline}</h1><p className="hero-description">{profile.summary || profile.about}</p><div className="hero-actions"><a className="button button-primary" href="#projects">Explore projects <ArrowUpRight /></a><a className="text-link" href={`mailto:${profile.email}`}>Start a conversation <span>↗</span></a></div></div><div className="hero-visual-stack"><SystemVisualization /><div className="hero-console"><div className="console-bar"><span /><span /><span /><small>profile.py</small></div><pre><code><i>class</i> Developer:<br />  name = <b>&quot;{profile.name}&quot;</b><br />  role = <b>&quot;{profile.role}&quot;</b><br />  location = <b>&quot;{profile.location}&quot;</b><br /><br />  <i>def</i> build(self, idea):<br />    <em>return</em> <strong>&quot;something useful&quot;</strong></code></pre><div className="console-footer"><Terminal /> shipping clean systems</div></div></div></section>
    <section id="about" className="section-shell about-section"><div><p className="eyebrow">01 / about</p><h2>Building the quiet machinery<br /><em>behind great products.</em></h2></div><div className="about-copy"><p>{profile.about}</p><div className="about-meta"><span><MapPin /> {profile.location}</span><span><span className="status-dot" /> open to collaboration</span></div></div></section>
    <section id="projects" className="section-shell projects-section"><div className="section-intro"><div><p className="eyebrow">02 / selected work</p><h2>Things I&apos;ve built.</h2></div><span className="section-count">{String(projects.length).padStart(2, "0")} projects</span></div><Stagger className="project-grid">{projects.map((project, index) => <MotionLink href={`/projects/${slugify(project.title, project.id)}`} className="project-card" key={project.id} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}><div className={`project-art art-${index % 3}`}>{project.imageUrl ? <img src={project.imageUrl} alt="" /> : <><span className="art-grid" /><span className="art-label">{String(index + 1).padStart(2, "0")}</span><ArrowUpRight /></>}</div><div className="project-info"><div><p className="project-index">0{index + 1}</p><h3>{project.title}</h3><p>{project.description}</p></div><span className="card-arrow"><ArrowUpRight /></span></div><div className="tag-row">{project.tags.split(",").map((tag) => <span key={tag}>{tag.trim()}</span>)}</div></MotionLink>)}</Stagger></section>
    <section id="skills" className="section-shell skills-section"><div className="section-intro"><div><p className="eyebrow">03 / toolkit</p><h2>Tools of the trade.</h2></div></div><div className="skills-grid">{data.skills.map((skill) => <SkillTile key={skill.id} skill={skill} />)}</div></section>
    <section id="reviews" className="section-shell reviews-section"><p className="eyebrow">04 / kind words</p><h2>Good work travels.</h2><div className="review-grid">{data.reviews.map((review) => <blockquote key={review.id}><p>“{review.content}”</p><footer><strong>{review.name}</strong><span>{review.role}</span></footer></blockquote>)}</div></section>
    <section id="contact" className="contact-section"><div className="section-shell contact-layout"><div><p className="eyebrow">05 / get in touch</p><h2>Have a problem<br /><em>worth solving?</em></h2><p>Tell me a little about it. I&apos;ll get back to you soon.</p><div className="contact-links"><a href={`mailto:${profile.email}`}><Mail /> {profile.email}</a>{validUrl(profile.linkedinUrl) && <a href={profile.linkedinUrl} target="_blank" rel="noreferrer"><Linkedin /> linkedin</a>}</div></div><form action={(formData) => { const form = document.querySelector("#contact-form") as HTMLFormElement; void submit(form) }} id="contact-form"><label>Name<input name="name" required placeholder="Your name" /></label><label>Email<input name="email" type="email" required placeholder="you@company.com" /></label><label>Message<textarea name="message" required rows={4} placeholder="What are you working on?" /></label><button className="button button-primary" disabled={sending}>{sending ? "Sending…" : "Send message"} <ArrowUpRight /></button>{status && <p className="form-status">{status}</p>}</form></div></section>
    <footer className="site-footer section-shell"><span>© {new Date().getFullYear()} {profile.name}</span><span>built with intention</span><a href="#home">back to top ↑</a></footer>
  </main>
}
