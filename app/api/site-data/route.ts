import { NextResponse } from "next/server"
import { getSiteData } from "@/lib/site-data"

export async function GET() {
  const data = await getSiteData()
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=300",
    },
  })
}
