import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { StarBackground } from "@/components/star-background"

export const metadata: Metadata = {
  title: "Shahroz Khan — Software Developer",
  description: "Shahroz Khan builds reliable web products, backend systems, AI integrations, and automations from Lahore, Pakistan.",
  metadataBase: new URL("https://shahrozkhan.dev"),
  alternates: { canonical: "/" },
  openGraph: { title: "Shahroz Khan — Software Developer", description: "Reliable software, thoughtfully shipped.", url: "/", siteName: "Shahroz Khan", type: "website" },
  twitter: { card: "summary", title: "Shahroz Khan — Software Developer", description: "Reliable software, thoughtfully shipped." },
  generator: "v0.app",
  icons: {
    icon: "/favicon-image.png",
    shortcut: "/favicon-image.png",
    apple: "/apple-icon.png",
  },
}

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Shahroz Khan",
  jobTitle: "Software Developer",
  url: "https://shahrozkhan.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </head>
      <body className="font-mono">
        <StarBackground />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative z-[1]">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
