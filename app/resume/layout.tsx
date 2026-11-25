import type { Metadata } from "next"
import { DEFAULT_SITE_DATA } from "@/lib/site-defaults"
import { SITE_NAME, SITE_URL, absoluteUrl, personSchema } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Résumé: Python Backend Developer",
  description:
    "Résumé for Shahroz Khan: Python backend developer with hands-on experience in Django, FastAPI, PostgreSQL, Redis, Docker, web scraping and automation. Based in Lahore, Pakistan.",
  keywords: [
    "Shahroz Khan resume",
    "Python developer CV",
    "backend developer resume Lahore",
    "Django FastAPI developer CV",
  ],
  alternates: { canonical: "/resume" },
  openGraph: {
    type: "profile",
    url: absoluteUrl("/resume"),
    title: `Résumé | ${SITE_NAME}`,
    description:
      "Python backend developer with hands-on experience in Django, FastAPI, PostgreSQL, Redis, Docker and automation.",
    siteName: `${SITE_NAME} Portfolio`,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${SITE_NAME} résumé` }],
  },
  robots: { index: true, follow: true },
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    personSchema(DEFAULT_SITE_DATA.profile),
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/resume#webpage`,
      url: absoluteUrl("/resume"),
      name: `Résumé | ${SITE_NAME}`,
      description:
        "Résumé for Shahroz Khan, Python backend developer specialising in APIs, automation and data pipelines.",
      inLanguage: "en",
      about: { "@id": `${SITE_URL}/#person` },
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
  ],
}

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      {children}
    </>
  )
}
