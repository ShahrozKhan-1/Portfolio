'use client'

import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Github, Linkedin, Mail, Menu, Terminal, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DEFAULT_SITE_DATA } from '@/lib/site-defaults'
import type { SiteData } from '@/lib/site-types'
import { sendContactEmail } from './actions/contact'

const terminalLines = ['build.clean_code()', 'ship.with_confidence()', 'debug.then_deliver()']
const skillGroups = ['Backend', 'Databases & Infrastructure', 'AI Engineering', 'Automation']

export default function Home() {
  const [siteData, setSiteData] = useState<SiteData>(DEFAULT_SITE_DATA)
  const [menuOpen, setMenuOpen] = useState(false)
  const [terminalIndex, setTerminalIndex] = useState(0)
  const [contactState, setContactState] = useState<{ success: boolean; message: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const timer = window.setInterval(() => setTerminalIndex((index) => (index + 1) % terminalLines.length), 2600)
    fetch('/api/site-data', { cache: 'no-store' }).then(async (response) => {
      if (response.ok) setSiteData((await response.json()) as SiteData)
    }).catch(() => undefined)
    return () => window.clearInterval(timer)
  }, [])

  const frameworkCount = useMemo(() => siteData.skills.filter((skill) => /framework|django|fastapi|next|react/i.test(`${skill.category} ${skill.name}`)).length, [siteData.skills])

  const groupedSkills = useMemo(() => skillGroups.map((group) => ({
    group,
    skills: siteData.skills.filter((skill) => {
      const value = `${skill.category} ${skill.name}`.toLowerCase()
      if (group === 'Backend') return /backend|api|python|django|fastapi/.test(value)
      if (group === 'Databases & Infrastructure') return /database|infra|docker|postgres|redis|server|cloud/.test(value)
      if (group === 'AI Engineering') return /ai|machine|llm|openai|model/.test(value)
      return /automation|selenium|zapier|n8n|workflow/.test(value)
    }),
  })).filter(({ skills }) => skills.length), [siteData.skills])

  async function handleContactSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setContactState(null)
    const form = event.currentTarget
    try {
      const result = await sendContactEmail(new FormData(form))
      setContactState(result)
      if (result.success) form.reset()
    } catch {
      setContactState({ success: false, message: 'Something went wrong. Please email me directly.' })
    } finally { setIsSubmitting(false) }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header className="site-header">
        <div className="shell flex h-20 items-center justify-between">
          <a href="#home" className="font-code text-sm font-semibold tracking-tight"><span className="text-primary">~/</span> {siteData.profile.name || 'Developer'}</a>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
            {['projects', 'about', 'contact'].map((item) => <a key={item} className="nav-link" href={`#${item}`}>{item}</a>)}
            <Link className="nav-link" href="/admin/login">admin</Link>
          </nav>
          <button className="menu-button md:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
        {menuOpen && <nav className="mobile-nav shell md:hidden" aria-label="Mobile navigation">{['projects', 'about', 'contact'].map((item) => <a key={item} href={`#${item}`} onClick={() => setMenuOpen(false)}>{item}</a>)}<Link href="/admin/login">admin</Link></nav>}
      </header>

      <main id="main-content">
        <section id="home" className="hero shell">
          <div className="hero-copy">
            <p className="eyebrow">Software developer <span className="text-primary">/</span> builder</p>
            <h1>{siteData.profile.headline || 'Building systems that make hard things feel simple.'}</h1>
            <p className="hero-summary">{siteData.profile.summary || 'I design and ship reliable web products, backend systems, and automations for teams that care about the details.'}</p>
            <div className="flex flex-wrap gap-3"><Button asChild size="lg"><a href="#projects">View selected work <ArrowUpRight data-icon="inline-end" /></a></Button><Button asChild variant="outline" size="lg"><a href="#contact">Start a conversation</a></Button></div>
            <div className="terminal-line" aria-live="polite"><Terminal data-icon="inline-start" /><span>{terminalLines[terminalIndex]}</span><span className="cursor" aria-hidden="true">_</span></div>
          </div>
          <div className="hero-aside" aria-label="Developer principles"><span>01 / build</span><span>02 / refine</span><span>03 / ship</span></div>
        </section>

        <section id="projects" className="shell section-block">
          <div className="section-heading"><div><p className="eyebrow">Selected work</p><h2>Proof, not promises.</h2></div><p className="section-note">A few systems I&apos;ve taken from rough idea to useful product.</p></div>
          <div className="project-grid">{siteData.projects.map((project, index) => <article key={project.id} className={`project-card project-card-${index % 3}`}><div className="project-art"><span className="font-code text-primary">{String(index + 1).padStart(2, '0')}</span><span className="art-grid" /></div><div className="project-content"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow">{project.status}</p><h3>{project.title}</h3></div><Link href={`/projects/${project.slug}`} aria-label={`View ${project.title} case study`} className="icon-link"><ArrowUpRight /></Link></div><p>{project.description}</p><div className="flex flex-wrap gap-2">{project.techStack.slice(0, 4).map((tech) => <Badge key={tech} variant="outline">{tech}</Badge>)}</div></div></article>)}</div>
        </section>

        <section id="about" className="shell section-block about-grid"><div><p className="eyebrow">About</p><h2>{siteData.profile.name || 'A pragmatic builder.'}</h2></div><div><p className="about-copy">{siteData.profile.about || 'I like turning ambiguous requirements into calm, maintainable software. My work sits between product thinking and engineering discipline: understand the problem, make the tradeoffs visible, and leave the system better than I found it.'}</p><div className="stats"><div><strong>{siteData.projects.length}+</strong><span>projects shipped</span></div><div><strong>{frameworkCount}</strong><span>frameworks in practice</span></div><div><strong>∞</strong><span>curiosity</span></div></div></div></section>

        <section id="skills" className="shell section-block"><div className="section-heading"><div><p className="eyebrow">Toolkit</p><h2>Built for the whole stack.</h2></div></div><div className="skills-grid">{groupedSkills.map(({ group, skills }) => <div key={group} className="skill-group"><h3>{group}</h3>{skills.map((skill) => <div className="skill-row" key={skill.id}><span>{skill.name}</span><span className="skill-dash" /> <span className="text-muted-foreground">{skill.description}</span></div>)}</div>)}</div></section>

        <section id="contact" className="shell section-block contact-grid"><div><p className="eyebrow">Contact</p><h2>Have a problem worth solving?</h2><p className="section-note">Tell me what you&apos;re building. I&apos;ll get back to you with a thoughtful next step.</p><a className="email-link" href={`mailto:${siteData.profile.email}`}>{siteData.profile.email} <ArrowUpRight /></a></div><form className="contact-form" onSubmit={handleContactSubmit}><input name="website" tabIndex={-1} autoComplete="off" className="honeypot" aria-hidden="true" /><label>Name<input required name="name" minLength={2} maxLength={80} /></label><label>Email<input required name="email" type="email" maxLength={160} /></label><label>Subject<input required name="subject" minLength={3} maxLength={120} /></label><label>Message<textarea required name="message" minLength={10} maxLength={3000} rows={5} /></label><Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Send message'} <ArrowUpRight data-icon="inline-end" /></Button>{contactState && <p className={contactState.success ? 'form-success' : 'form-error'} aria-live="polite">{contactState.message}</p>}</form></section>
      </main>

      <footer className="site-footer"><div className="shell flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><p className="font-code text-xs text-muted-foreground">© {new Date().getFullYear()} {siteData.profile.name || 'Developer'}</p><div className="flex items-center gap-4">{siteData.profile.githubUrl && <a href={siteData.profile.githubUrl} aria-label="GitHub"><Github /></a>}{siteData.profile.linkedinUrl && <a href={siteData.profile.linkedinUrl} aria-label="LinkedIn"><Linkedin /></a>}<a href={`mailto:${siteData.profile.email}`} aria-label="Email"><Mail /></a></div></div></footer>
    </div>
  )
}
