"use client"

import useSWR from "swr"

export type ResumeDownloadStatus = { enabled: boolean }

async function fetchResumeDownloadStatus(url: string): Promise<ResumeDownloadStatus> {
  const response = await fetch(url, { cache: "no-store" })
  if (!response.ok) throw new Error("Unable to load resume download status.")

  const result: unknown = await response.json()
  if (typeof result !== "object" || result === null || !("enabled" in result) || typeof result.enabled !== "boolean") {
    throw new Error("The resume download status is invalid.")
  }

  return { enabled: result.enabled }
}

export function useResumeDownloadStatus() {
  return useSWR<ResumeDownloadStatus>("/api/resume-download", fetchResumeDownloadStatus, {
    fallbackData: { enabled: true },
    refreshInterval: 30_000,
    revalidateOnFocus: true,
  })
}
