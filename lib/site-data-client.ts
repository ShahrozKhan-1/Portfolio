import type { SiteData } from "@/lib/site-types"

export async function fetchSiteData(fetcher: typeof fetch = fetch): Promise<SiteData> {
  const response = await fetcher("/api/site-data", { cache: "no-store" })
  if (!response.ok) {
    throw new Error(`Portfolio data request failed with status ${response.status}.`)
  }

  return (await response.json()) as SiteData
}
