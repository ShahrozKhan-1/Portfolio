"use client"

import { useEffect, useMemo, useState } from "react"
import { DEFAULT_SITE_DATA } from "@/lib/site-defaults"
import { fetchSiteData } from "@/lib/site-data-client"
import type { SiteData } from "@/lib/site-types"

export function usePortfolioData(loadSiteData: () => Promise<SiteData> = fetchSiteData) {
  const [siteData, setSiteData] = useState<SiteData>(DEFAULT_SITE_DATA)

  useEffect(() => {
    let isMounted = true

    const loadTimer = window.setTimeout(() => {
      void loadSiteData()
        .then((data) => {
          if (isMounted) {
            setSiteData(data)
          }
        })
        .catch((error: unknown) => {
          console.error("Failed to load portfolio data; continuing with bundled defaults.", error)
        })
    }, 800)

    return () => {
      isMounted = false
      window.clearTimeout(loadTimer)
    }
  }, [loadSiteData])

  const visibility = siteData.visibility ?? DEFAULT_SITE_DATA.visibility
  const profile = siteData.profile
  const skills = useMemo(() => (visibility.skills ? siteData.skills : []), [siteData.skills, visibility.skills])
  const projects = useMemo(
    () =>
      visibility.projects ? siteData.projects.filter((project) => project.visible !== false) : [],
    [siteData.projects, visibility.projects],
  )
  const reviews = useMemo(() => (visibility.reviews ? siteData.reviews : []), [siteData.reviews, visibility.reviews])
  const navigationSections = useMemo(
    () => [
      "home",
      ...(visibility.profile ? ["about"] : []),
      ...(visibility.skills ? ["skills"] : []),
      ...(visibility.projects ? ["projects"] : []),
      "contact",
    ],
    [visibility.profile, visibility.projects, visibility.skills],
  )

  return { siteData, visibility, profile, skills, projects, reviews, navigationSections }
}
