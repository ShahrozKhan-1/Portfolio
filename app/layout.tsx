import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jetbrains",
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
    default: "Shahroz Khan | Python Backend Developer",
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
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://shahrozkhan.vercel.app",
    title: "Shahroz Khan | Python Backend Developer",
    description:
      "Building reliable backend systems, REST APIs, and intelligent automations with Python, Django, and FastAPI.",
    siteName: "Shahroz Khan Portfolio",
    images: [{ url: "/avatar.png", alt: "Shahroz Khan, Python Backend Developer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shahroz Khan | Python Backend Developer",
    description:
      "Building reliable backend systems, REST APIs, and intelligent automations with Python, Django, and FastAPI.",
    images: ["/avatar.png"],
  },
  icons: {
    icon: "/favicon-image.png",
    shortcut: "/favicon-image.png",
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${jetbrainsMono.variable} font-mono`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personStructuredData).replace(/</g, "\\u003c"),
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative z-[1]">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
