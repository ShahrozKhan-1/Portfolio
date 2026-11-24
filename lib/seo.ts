import type { Profile, Project } from "@/lib/site-types"

export const SITE_URL = "https://shahrozkhan.vercel.app"
export const SITE_NAME = "Shahroz Khan"
export const SITE_TITLE = "Shahroz Khan — Python Backend Developer"
export const SITE_DESCRIPTION =
  "Python backend developer in Lahore, Pakistan. I build REST APIs, data pipelines and automations with Django, FastAPI, PostgreSQL, Redis and Docker."
export const SITE_KEYWORDS = [
  "Shahroz Khan",
  "Python Backend Developer",
  "Python Developer Lahore",
  "Django Developer",
  "FastAPI Developer",
  "REST API Development",
  "Django REST Framework",
  "Python Automation",
  "Web Scraping",
  "PostgreSQL",
  "Backend Engineer Pakistan",
  "AI Integrations",
]

export const SOCIAL_PROFILES = [
  "https://github.com/ShahrozKhan-1",
  "https://www.linkedin.com/in/shahroz-khan-b08911274",
]

export function absoluteUrl(path = "") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

export function truncate(value: string, max = 155) {
  const clean = value.replace(/\s+/g, " ").trim()
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`
}

export function personSchema(profile: Profile) {
  return {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: profile.name,
    givenName: "Shahroz",
    familyName: "Khan",
    jobTitle: profile.role,
    description: profile.summary,
    url: SITE_URL,
    image: absoluteUrl(profile.imageUrl || "/avatar.png"),
    email: profile.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lahore",
      addressRegion: "Punjab",
      addressCountry: "PK",
    },
    worksFor: {
      "@type": "Organization",
      name: "SiliconWhiz",
      url: "https://www.linkedin.com/in/shahroz-khan-b08911274",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "University of Lahore",
    },
    knowsAbout: [
      "Python",
      "Django",
      "FastAPI",
      "REST API design",
      "Django REST Framework",
      "PostgreSQL",
      "Redis",
      "Docker",
      "Web scraping",
      "Workflow automation",
      "AI integrations",
    ],
    knowsLanguage: ["English", "Urdu"],
    hasOccupation: {
      "@type": "Occupation",
      name: "Python Backend Developer",
      occupationLocation: { "@type": "City", name: "Lahore" },
      skills: "Python, Django, FastAPI, PostgreSQL, Redis, Docker, Selenium, API design",
    },
    sameAs: SOCIAL_PROFILES,
  }
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: `${SITE_NAME} — Portfolio`,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    publisher: { "@id": `${SITE_URL}/#person` },
  }
}

export function profilePageSchema() {
  return {
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/#profile`,
    url: SITE_URL,
    name: SITE_TITLE,
    description: SITE_DESCRIPTION,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#person` },
    mainEntity: { "@id": `${SITE_URL}/#person` },
  }
}

export function projectSchema(project: Project) {
  const url = absoluteUrl(`/projects/${project.slug}`)
  const isoDate = project.startDate ? `${project.startDate}-01` : undefined

  return {
    "@type": "CreativeWork",
    "@id": `${url}#project`,
    name: project.title,
    headline: project.title,
    description: project.longDescription || project.description,
    url,
    image: absoluteUrl("/og.png"),
    inLanguage: "en",
    genre: "Backend engineering case study",
    keywords: project.techStack.join(", "),
    about: project.techStack,
    author: { "@id": `${SITE_URL}/#person` },
    creator: { "@id": `${SITE_URL}/#person` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    ...(isoDate ? { dateCreated: isoDate } : {}),
    ...(project.liveUrl ? { sameAs: [project.liveUrl] } : {}),
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
