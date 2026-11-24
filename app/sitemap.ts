import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo"
import { getSiteData } from "@/lib/site-data"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects } = await getSiteData()
  const lastModified = new Date()

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/resume`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...projects
      .filter((project) => project.visible !== false)
      .map((project) => ({
        url: `${SITE_URL}/projects/${project.slug}`,
        lastModified,
        changeFrequency: "yearly" as const,
        priority: 0.7,
      })),
  ]
}
