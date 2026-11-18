"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useResumeDownloadStatus } from "@/hooks/use-resume-download-status"

function getErrorMessage(payload: unknown) {
  return typeof payload === "object" && payload !== null && "error" in payload && typeof payload.error === "string"
    ? payload.error
    : "Unable to update the resume download setting."
}

export function ResumeDownloadToggle() {
  const [isSaving, setIsSaving] = useState(false)
  const { data: status, mutate } = useResumeDownloadStatus()

  async function handleToggle() {
    if (isSaving) return
    setIsSaving(true)

    try {
      const enabled = !(status?.enabled ?? true)
      const response = await fetch("/api/resume-download", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ enabled }),
        cache: "no-store",
      })
      const payload: unknown = await response.json()
      if (!response.ok) throw new Error(getErrorMessage(payload))
      if (typeof payload !== "object" || payload === null || !("enabled" in payload) || typeof payload.enabled !== "boolean") {
        throw new Error("The server returned an invalid resume download setting.")
      }

      await mutate({ enabled: payload.enabled }, { revalidate: false })
      toast.success(payload.enabled ? "Resume download buttons are visible." : "Resume download buttons are hidden.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update the resume download setting.")
    } finally {
      setIsSaving(false)
    }
  }

  const enabled = status?.enabled ?? true

  return (
    <Card className="border-border/80 bg-card/90 shadow-lg shadow-black/5">
      <CardHeader>
        <CardTitle>Public resume download</CardTitle>
        <CardDescription>Show or hide the resume download buttons across the public portfolio.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
          {enabled ? "Download buttons are visible to visitors." : "Download buttons are hidden from visitors."}
        </p>
        <Button
          type="button"
          variant={enabled ? "outline" : "default"}
          aria-pressed={enabled}
          onClick={handleToggle}
          disabled={isSaving}
          className="w-fit"
        >
          {isSaving ? "Updating…" : enabled ? "Hide resume buttons" : "Show resume buttons"}
        </Button>
      </CardContent>
      <CardFooter className="text-xs leading-5 text-muted-foreground">
        This temporary setting may reset or differ between production instances. The PDF file remains publicly accessible by its direct URL.
      </CardFooter>
    </Card>
  )
}
