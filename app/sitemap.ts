import type { MetadataRoute } from "next"
import { getSiteData } from "@/lib/site-data"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects } = await getSiteData()
  const baseUrl = "https://shahrozkhan.vercel.app"

  return [
    {
      url: baseUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/resume`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...projects
      .filter((project) => project.visible !== false)
      .map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
  ]
}
