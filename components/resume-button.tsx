"use client"

import { Download } from "lucide-react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { useResumeDownloadStatus } from "@/hooks/use-resume-download-status"

type ResumeButtonProps = Pick<ButtonProps, "variant" | "size" | "className">

export function ResumeButton({ variant = "default", size = "default", className }: ResumeButtonProps) {
  const { data } = useResumeDownloadStatus()

  if (!data?.enabled) return null

  return (
    <Button variant={variant} size={size} className={className} asChild>
      <a href="/resume.pdf" download="Shahroz-Khan-Resume.pdf" aria-label="Download Resume (PDF)">
        <Download className="mr-2 size-4" aria-hidden="true" />
        Download Resume
      </a>
    </Button>
  )
}
