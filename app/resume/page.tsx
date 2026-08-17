"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Mail, Phone, MapPin, Linkedin, Github } from "lucide-react"

export default function ResumePage() {
  const handleDownload = () => window.print()

  return (
    <div className="min-h-screen bg-white">
      <div className="print:hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80"><ArrowLeft className="h-5 w-5" />Back to Portfolio</Link>
          <Button onClick={handleDownload} variant="secondary" className="gap-2"><Download className="h-4 w-4" />Download/Print Resume</Button>
        </div>
      </div>

      <main className="container mx-auto p-8 max-w-4xl">
        <div className="bg-white">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Shahroz Khan</h1>
            <div className="flex flex-wrap justify-center gap-4 text-gray-600 text-sm">
              <span className="flex items-center gap-1"><Mail className="h-4 w-4" />shahrozkha83@gmail.com</span>
              <span className="flex items-center gap-1"><Phone className="h-4 w-4" />+92 309 9537279</span>
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />Lahore, Punjab, Pakistan</span>
              <a href="https://www.linkedin.com/in/shahroz-khan-b08911274" className="flex items-center gap-1 text-blue-600 hover:underline"><Linkedin className="h-4 w-4" />LinkedIn</a>
              <a href="https://github.com/ShahrozKhan-1" className="flex items-center gap-1 text-blue-600 hover:underline"><Github className="h-4 w-4" />GitHub</a>
            </div>
          </header>

          <section className="mb-8"><h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-purple-600 pb-2">Professional Summary</h2><p className="text-gray-700 leading-relaxed">Motivated Python Developer with hands-on experience in backend development, RESTful API design, and web scraping. Proficient in building scalable web applications using Django, Flask, and FastAPI, with a strong understanding of Python and clean software development practices. Experienced in working with databases, integrating APIs, and developing maintainable, efficient solutions.</p></section>

          <section className="mb-8"><h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-purple-600 pb-2">Technical Skills</h2><div className="grid md:grid-cols-2 gap-4 text-gray-700"><div><h3 className="font-semibold text-gray-900 mb-2">Languages:</h3><p>Python, JavaScript</p></div><div><h3 className="font-semibold text-gray-900 mb-2">Frameworks:</h3><p>Flask, FastAPI, Django, Django REST Framework</p></div><div><h3 className="font-semibold text-gray-900 mb-2">Databases & Infrastructure:</h3><p>PostgreSQL, Redis, Docker</p></div><div><h3 className="font-semibold text-gray-900 mb-2">Tools:</h3><p>Git, GitHub, VS Code, WebSockets, Selenium, BeautifulSoup, Requests</p></div></div></section>

          <section className="mb-8"><h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-purple-600 pb-2">Professional Experience</h2>
            <Experience title="Python Developer" company="SiliconWhiz" location="Lahore, Pakistan" dates="July 2025 – Present" bullets={[
              "Develop and maintain scalable backend applications and RESTful APIs using Python, FastAPI, Django, Flask, Django REST Framework, PostgreSQL, and Docker.",
              "Contributed to VisionIMS, an internal management system with project, lead, ticket, attendance, and real-time chat modules, and optimized role-based access control.",
              "Built backend services for EvaHires, an AI-powered hiring platform integrating OpenAI and ElevenLabs for live interviews, video recording, transcript generation, and AI-based candidate evaluation.",
              "Developed scalable web scraping solutions using Selenium and BeautifulSoup, improving large-scale data collection through multithreading.",
              "Collaborated within a 3-member Agile development team using Git/GitHub, WebSockets, and modern backend practices."
            ]}/>
            <Experience title="Junior Python Developer" company="SiliconWhiz — EvaHires" location="Lahore, Pakistan" dates="" bullets={[
              "Developed full-stack features for EvaHires using FastAPI, React.js, and PostgreSQL.",
              "Designed RESTful APIs for candidate onboarding, job management, resume matching, and AI interview workflows.",
              "Built Resume Matching, AI Live Interview, and Interview Recording modules with secure storage and AI-generated evaluations.",
              "Integrated Redis for asynchronous processing and containerized the application with Docker.",
              "Collaborated using Git through feature development, code reviews, and bug fixes."
            ]}/>
            <Experience title="Web Scraping Project" company="SiliconWhiz" location="Lahore, Pakistan" dates="" bullets={[
              "Developed automated data extraction scripts for ecommerce websites using Selenium and Python.",
              "Used BeautifulSoup, Selenium, and Requests for structured and unstructured data parsing.",
              "Implemented pagination handling, dynamic content scraping, data cleaning, and CSV export.",
              "Built reusable scraping scripts adaptable to job portals, ecommerce sites, and news platforms."
            ]}/>
            <Experience title="Automation & AI Integration" company="SiliconWhiz" location="Lahore, Pakistan" dates="" bullets={[
              "Developed a Zapier automation to synchronize customers, vendors, and payment records from QuickBooks with Monday.com.",
              "Configured triggers, actions, field mappings, and workflow logic for cross-platform synchronization.",
              "Built an AI chatbot workflow using n8n to process queries, integrate AI services, and generate contextual responses."
            ]}/>
          </section>

          <section className="mb-8"><h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-purple-600 pb-2">Education</h2><div className="space-y-4 text-gray-700"><div className="flex justify-between gap-4"><div><h3 className="text-lg font-semibold text-gray-900">BS. Computer Science</h3><p>University of Lahore, Lahore</p></div><p>2021 – 2025</p></div><div className="flex justify-between gap-4"><div><h3 className="text-lg font-semibold text-gray-900">ICS — Intermediate Computer Science</h3><p>KIPS College, Lahore</p></div><p>2021 – 2025</p></div><div><h3 className="text-lg font-semibold text-gray-900">Matric with Computer Science</h3><p>Dar-e-Arqam School, Lahore · 2017 – 2019</p></div></div></section>
        </div>
      </main>
    </div>
  )
}

function Experience({ title, company, location, dates, bullets }: { title: string; company: string; location: string; dates: string; bullets: string[] }) {
  return <article className="mb-6"><div className="flex justify-between items-start mb-2 gap-4"><div><h3 className="text-xl font-semibold text-gray-900">{company}</h3><p className="text-lg text-purple-600 font-medium">{title}</p></div><div className="text-right text-gray-600"><p>{location}</p>{dates && <p>{dates}</p>}</div></div><ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">{bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></article>
}
