import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume for Shahroz Khan, Python Backend Developer specializing in APIs, Django, FastAPI, and automation.",
  alternates: { canonical: "/resume" },
}

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return children
}
