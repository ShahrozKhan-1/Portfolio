import type { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import ResumeToolsClient from "@/components/resume-tools/resume-tools-client"
import {
  RESUME_TOOLS_COOKIE,
  resumeToolsEnabled,
  verifyResumeToolsSession,
} from "@/lib/resume-tools-auth"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Private Resume Tools",
  robots: { index: false, follow: false, nocache: true },
}

export default async function ResumeToolsPage() {
  if (!resumeToolsEnabled()) notFound()

  const session = cookies().get(RESUME_TOOLS_COOKIE)?.value
  const isAuthenticated = await verifyResumeToolsSession(session)

  return <ResumeToolsClient isAuthenticated={isAuthenticated} />
}
