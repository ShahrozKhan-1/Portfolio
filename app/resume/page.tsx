"use client"

import Link from "next/link"
import {
  ArrowLeft,
  ArrowUpRight,
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react"

const CONTACT = [
  { icon: Mail, label: "shahrozkha83@gmail.com", href: "mailto:shahrozkha83@gmail.com" },
  { icon: Phone, label: "+92 309 9537279", href: "tel:+923099537279" },
  { icon: MapPin, label: "Lahore, Pakistan", href: null },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/shahroz-khan-b08911274" },
  { icon: Github, label: "GitHub", href: "https://github.com/ShahrozKhan-1" },
]

const EXPERIENCE = [
  {
    company: "SiliconWhiz",
    role: "Python Developer",
    location: "Lahore, Pakistan",
    dates: "Jul 2025 — Present",
    bullets: [
      "Develop and maintain scalable backend applications and RESTful APIs using Python, FastAPI, Django, Flask, DRF, PostgreSQL and Docker.",
      "Contributed to VisionIMS, an internal management system with projects, leads, tickets, attendance and real-time chat, and hardened role-based access control.",
      "Built backend services for EvaHires, an AI-powered hiring platform integrating OpenAI and ElevenLabs for live interviews, recording, transcripts and AI evaluations.",
      "Developed scalable web scraping solutions with Selenium and BeautifulSoup, improving large-scale data collection through multithreading.",
      "Collaborated in a three-person Agile team using Git/GitHub, WebSockets and modern backend practices.",
    ],
  },
  {
    company: "SiliconWhiz — EvaHires",
    role: "Junior Python Developer",
    location: "Lahore, Pakistan",
    dates: "",
    bullets: [
      "Developed full-stack features for EvaHires using FastAPI, React.js and PostgreSQL.",
      "Designed RESTful APIs for candidate onboarding, job management, resume matching and AI interview workflows.",
      "Built Resume Matching, AI Live Interview and Interview Recording modules with secure storage and AI-generated evaluations.",
      "Integrated Redis for asynchronous processing and containerised the application with Docker.",
      "Worked through Git-based feature development, code reviews and bug fixes.",
    ],
  },
  {
    company: "SiliconWhiz",
    role: "Web Scraping Project",
    location: "Lahore, Pakistan",
    dates: "",
    bullets: [
      "Developed automated data extraction scripts for ecommerce websites using Selenium and Python.",
      "Parsed structured and unstructured data with BeautifulSoup, Selenium and Requests.",
      "Implemented pagination handling, dynamic content scraping, data cleaning and CSV export.",
      "Built reusable scraping scripts adaptable to job portals, ecommerce sites and news platforms.",
    ],
  },
  {
    company: "SiliconWhiz",
    role: "Automation & AI Integration",
    location: "Lahore, Pakistan",
    dates: "",
    bullets: [
      "Developed a Zapier automation synchronising customers, vendors and payment records from QuickBooks with Monday.com.",
      "Configured triggers, actions, field mappings and workflow logic for cross-platform synchronisation.",
      "Built an AI chatbot workflow with n8n to process queries, integrate AI services and generate contextual responses.",
    ],
  },
]

const SKILL_GROUPS = [
  { label: "Languages", value: "Python, JavaScript, SQL" },
  { label: "Frameworks", value: "FastAPI, Django, Flask, Django REST Framework, React" },
  { label: "Databases", value: "PostgreSQL, Redis" },
  { label: "Infrastructure", value: "Docker, Git, GitHub, Linux, WebSockets" },
  { label: "Automation", value: "Selenium, BeautifulSoup, Requests, Zapier, n8n" },
  { label: "AI", value: "OpenAI API, ElevenLabs, prompt-driven workflows" },
]

const EDUCATION = [
  {
    title: "BS Computer Science",
    school: "University of Lahore, Lahore",
    dates: "2021 — 2025",
  },
  {
    title: "ICS — Intermediate Computer Science",
    school: "KIPS College, Lahore",
    dates: "2021 — 2025",
  },
  {
    title: "Matric with Computer Science",
    school: "Dar-e-Arqam School, Lahore",
    dates: "2017 — 2019",
  },
]

const SUMMARY =
  "Python developer with hands-on experience in backend development, RESTful API design and web scraping. Proficient in building scalable applications with Django, Flask and FastAPI, with a strong grasp of databases, third-party API integration and clean, maintainable software practices."

export default function ResumePage() {
  return (
    <div className="relative min-h-screen pb-24">
      <header className="fixed inset-x-0 top-0 z-[100] print:hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink via-ink/70 to-transparent" />
        <div className="shell relative">
          <div className="mt-3 flex items-center justify-between gap-3 rounded-full border border-white/[0.07] bg-ink/60 px-3 py-2 backdrop-blur-xl sm:mt-4">
            <Link href="/" className="group flex items-center gap-2 rounded-full px-1 text-[13px] text-white/70 transition-colors hover:text-white">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary font-display text-[11px] font-bold text-primary-foreground">
                SK
              </span>
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">Back to portfolio</span>
            </Link>

            <span className="hidden font-mono text-[0.6rem] uppercase tracking-label text-white/30 md:block">
              Résumé — 2026
            </span>

            <button
              type="button"
              onClick={() => window.print()}
              className="group inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-all hover:shadow-[0_12px_30px_-8px_rgba(200,250,79,0.5)]"
            >
              <Download className="h-3.5 w-3.5" />
              Print / Save PDF
            </button>
          </div>
        </div>
      </header>

      <main id="content" className="shell pt-28 print:pt-0">
        <div className="mx-auto max-w-[880px] print:max-w-none">
          <div className="mb-5 flex items-end justify-between print:hidden">
            <p className="eyebrow">Curriculum vitae</p>
            <p className="font-mono text-[0.6rem] uppercase tracking-label text-white/25">
              Updated November 2026
            </p>
          </div>

          <article className="print-page relative overflow-hidden rounded-[1.75rem] bg-paper p-7 text-ink shadow-[0_60px_140px_-50px_rgba(0,0,0,1)] sm:p-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(120,140,20,0.14),transparent_65%)] blur-2xl print:hidden"
            />

            <header className="relative">
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
                <div>
                  <p className="font-mono text-[0.6rem] uppercase tracking-label text-[#6b7a1a]">
                    Python · Backend · Automation
                  </p>
                  <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,3.75rem)] leading-none tracking-tight text-ink">
                    Shahroz Khan
                  </h1>
                  <p className="mt-3 font-display text-lg tracking-tight text-ink/60">
                    Python Backend Developer
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 sm:items-end">
                  {CONTACT.slice(0, 3).map((item) => (
                    <span
                      key={item.label}
                      className="inline-flex items-center gap-2 font-mono text-[0.68rem] text-ink/55"
                    >
                      <item.icon className="h-3 w-3 text-[#6b7a1a]" />
                      {item.href ? (
                        <a href={item.href} className="hover:text-ink">
                          {item.label}
                        </a>
                      ) : (
                        item.label
                      )}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-ink/10 pt-5 print:mt-4 print:pt-3">
                {CONTACT.slice(3).map((item) => (
                  <a
                    key={item.label}
                    href={item.href ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-ink/55 hover:text-ink"
                  >
                    <item.icon className="h-3 w-3" />
                    {item.label}
                    <ArrowUpRight className="h-2.5 w-2.5 opacity-40" />
                  </a>
                ))}
                <span className="inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[#6b7a1a]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#8aa11a]" />
                  Available for work
                </span>
              </div>
            </header>

            <ResumeSection index="01" title="Professional summary">
              <p className="max-w-3xl text-[0.92rem] leading-[1.75] text-ink/70">{SUMMARY}</p>
            </ResumeSection>

            <ResumeSection index="02" title="Technical skills">
              <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {SKILL_GROUPS.map((group) => (
                  <div key={group.label} className="flex flex-col gap-1 border-b border-ink/[0.07] pb-3">
                    <dt className="font-mono text-[0.58rem] uppercase tracking-label text-[#6b7a1a]">
                      {group.label}
                    </dt>
                    <dd className="text-[0.85rem] leading-relaxed text-ink/70">{group.value}</dd>
                  </div>
                ))}
              </dl>
            </ResumeSection>

            <ResumeSection index="03" title="Professional experience">
              <div className="space-y-7">
                {EXPERIENCE.map((job) => (
                  <article key={`${job.company}-${job.role}`} className="break-inside-avoid">
                    <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                      <h3 className="font-display text-[1.05rem] leading-snug tracking-tight text-ink">
                        {job.role}
                        <span className="text-ink/35"> — {job.company}</span>
                      </h3>
                      <span className="shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-ink/40">
                        {job.location}
                        {job.dates ? ` · ${job.dates}` : ""}
                      </span>
                    </div>
                    <ul className="mt-2.5 space-y-1.5">
                      {job.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-2.5 text-[0.83rem] leading-relaxed text-ink/65">
                          <span className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-[#8aa11a]" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </ResumeSection>

            <ResumeSection index="04" title="Education">
              <div className="space-y-4">
                {EDUCATION.map((item) => (
                  <div
                    key={item.title}
                    className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline"
                  >
                    <div>
                      <h3 className="font-display text-[0.98rem] tracking-tight text-ink">
                        {item.title}
                      </h3>
                      <p className="mt-0.5 text-[0.82rem] text-ink/55">{item.school}</p>
                    </div>
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-ink/40">
                      {item.dates}
                    </span>
                  </div>
                ))}
              </div>
            </ResumeSection>

            <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-5 print:mt-6">
              <p className="font-mono text-[0.58rem] uppercase tracking-label text-ink/35">
                Shahroz Khan — Curriculum vitae
              </p>
              <p className="font-mono text-[0.58rem] uppercase tracking-label text-ink/35">
                shahrozkha83@gmail.com
              </p>
            </footer>
          </article>
        </div>
      </main>
    </div>
  )
}

function ResumeSection({
  index,
  title,
  children,
}: {
  index: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-9 break-inside-avoid sm:mt-10">
      <h2 className="flex items-center gap-3 border-t border-ink/10 pt-5 font-mono text-[0.6rem] uppercase tracking-label text-[#6b7a1a]">
        <span className="text-ink/30">{index}</span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}
