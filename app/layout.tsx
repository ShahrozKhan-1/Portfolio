import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Instrument_Serif, JetBrains_Mono, Space_Grotesk } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"
import { Backdrop } from "@/components/site/backdrop"
import { Preloader } from "@/components/site/preloader"
import { ScrollProgress } from "@/components/site/scroll-progress"
import { DEFAULT_SITE_DATA } from "@/lib/site-defaults"
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  personSchema,
  websiteSchema,
} from "@/lib/seo"

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
  display: "swap",
})

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
})

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-serif",
  display: "swap",
})

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [personSchema(DEFAULT_SITE_DATA.profile), websiteSchema()],
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Shahroz Khan",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Shahroz Khan Portfolio",
  category: "technology",
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: "Shahroz Khan — Portfolio",
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
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og.png"],
  },
  formatDetection: { email: false, address: false, telephone: false },
}

export const viewport: Viewport = {
  themeColor: "#07070a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
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
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
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
