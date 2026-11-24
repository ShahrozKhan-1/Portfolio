import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Instrument_Serif, JetBrains_Mono, Space_Grotesk } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"
import { Backdrop } from "@/components/site/backdrop"
import { Preloader } from "@/components/site/preloader"
import { ScrollProgress } from "@/components/site/scroll-progress"

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
})

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
})

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
})

const personStructuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Shahroz Khan",
  jobTitle: "Python Backend Developer",
  url: "https://shahrozkhan.vercel.app",
  email: "shahrozkha83@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lahore",
    addressRegion: "Punjab",
    addressCountry: "PK",
  },
  knowsAbout: [
    "Python",
    "Django",
    "FastAPI",
    "REST API development",
    "Python automation",
    "PostgreSQL",
    "Web scraping",
  ],
  sameAs: [
    "https://github.com/ShahrozKhan-1",
    "https://www.linkedin.com/in/shahroz-khan-b08911274",
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL("https://shahrozkhan.vercel.app"),
  title: {
    default: "Shahroz Khan — Python Backend Developer",
    template: "%s | Shahroz Khan",
  },
  description:
    "Shahroz Khan is a Python Backend Developer specializing in Django, FastAPI, REST API development, Python automation, and practical AI integrations. Based in Lahore, Pakistan.",
  keywords: [
    "Shahroz Khan",
    "Shahroz Khan Python Developer",
    "Python Developer",
    "Python Backend Developer",
    "Backend Developer",
    "Django Developer",
    "FastAPI Developer",
    "REST API Development",
    "Django REST Framework",
    "Python Automation",
  ],
  authors: [{ name: "Shahroz Khan" }],
  creator: "Shahroz Khan",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://shahrozkhan.vercel.app",
    title: "Shahroz Khan — Python Backend Developer",
    description:
      "Building reliable backend systems, REST APIs, and intelligent automations with Python, Django, and FastAPI.",
    siteName: "Shahroz Khan Portfolio",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Shahroz Khan — Python Backend Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shahroz Khan — Python Backend Developer",
    description:
      "Building reliable backend systems, REST APIs, and intelligent automations with Python, Django, and FastAPI.",
    images: ["/og.png"],
  },
}

export const viewport: Viewport = {
  themeColor: "#07070a",
  colorScheme: "dark",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${sans.variable} ${display.variable} ${mono.variable} ${serif.variable} font-sans`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personStructuredData).replace(/</g, "\\u003c"),
          }}
        />
        <noscript>
          <style>{`
            .preloader { display: none !important; }
            [data-anim] { opacity: 1 !important; transform: none !important; filter: none !important; visibility: visible !important; }
          `}</style>
        </noscript>
        <a
          href="#content"
          className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <Backdrop />
        <Preloader />
        <ScrollProgress />
        <div className="relative z-10">{children}</div>
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#0B0B12",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#F4F4F6",
              borderRadius: "16px",
              fontFamily: "var(--font-sans), sans-serif",
            },
          }}
        />
      </body>
    </html>
  )
}
