import { NextResponse } from "next/server"
import { getSiteData } from "@/lib/site-data"

export async function GET() {
  const data = await getSiteData()
  return NextResponse.json(data)
}

