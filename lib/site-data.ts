import "server-only"

import { mkdir, readFile, writeFile } from "fs/promises"
import path from "path"
import type { Profile, Project, Review, SiteData, Skill } from "@/lib/site-types"
import { DEFAULT_SITE_DATA } from "@/lib/site-defaults"

const dataFilePath = path.join(process.cwd(), "data", "site-data.json")

let writeQueue: Promise<unknown> = Promise.resolve()

function cloneDefaultData(): SiteData {
  return JSON.parse(JSON.stringify(DEFAULT_SITE_DATA)) as SiteData
}

async function ensureDataFile() {
  try {
    await readFile(dataFilePath, "utf8")
  } catch {
    await mkdir(path.dirname(dataFilePath), { recursive: true })
    await writeFile(dataFilePath, JSON.stringify(DEFAULT_SITE_DATA, null, 2), "utf8")
  }
}

function normalizeSiteData(data: Partial<SiteData> | null | undefined): SiteData {
  const fallback = cloneDefaultData()

  return {
    profile: {
      ...fallback.profile,
      ...(data?.profile ?? {}),
    },
    skills: Array.isArray(data?.skills) && data.skills.length > 0 ? data.skills : fallback.skills,
    projects: Array.isArray(data?.projects) && data.projects.length > 0 ? data.projects : fallback.projects,
    reviews: Array.isArray(data?.reviews) && data.reviews.length > 0 ? data.reviews : fallback.reviews,
  }
}

async function readSiteDataFile(): Promise<SiteData> {
  await ensureDataFile()
  const raw = await readFile(dataFilePath, "utf8")
  const parsed = JSON.parse(raw) as Partial<SiteData>
  return normalizeSiteData(parsed)
}

async function writeSiteDataFile(data: SiteData) {
  await mkdir(path.dirname(dataFilePath), { recursive: true })
  await writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8")
}

function queueWrite<T>(operation: () => Promise<T>): Promise<T> {
  const run = writeQueue.then(operation, operation)
  writeQueue = run.then(
    () => undefined,
    () => undefined,
  )
  return run
}

function sortByOrder<T extends { orderIndex: number; id: number }>(items: T[]) {
  return [...items].sort((left, right) => left.orderIndex - right.orderIndex || left.id - right.id)
}

function nextId<T extends { id: number }>(items: T[]) {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1
}

export async function getSiteData(): Promise<SiteData> {
  const data = await readSiteDataFile()
  return {
    profile: data.profile,
    skills: sortByOrder(data.skills),
    projects: sortByOrder(data.projects),
    reviews: sortByOrder(data.reviews),
  }
}

export async function replaceSiteData(data: SiteData) {
  await queueWrite(async () => {
    await writeSiteDataFile(normalizeSiteData(data))
  })
}

export async function updateProfile(profile: Profile) {
  await queueWrite(async () => {
    const current = await readSiteDataFile()
    await writeSiteDataFile({
      ...current,
      profile: {
        ...current.profile,
        ...profile,
      },
    })
  })
}

export async function createSkill(skill: Omit<Skill, "id">) {
  await queueWrite(async () => {
    const current = await readSiteDataFile()
    const skills = sortByOrder(current.skills)
    skills.push({
      id: nextId(skills),
      ...skill,
    })
    await writeSiteDataFile({
      ...current,
      skills,
    })
  })
}

export async function deleteSkill(id: number) {
  await queueWrite(async () => {
    const current = await readSiteDataFile()
    await writeSiteDataFile({
      ...current,
      skills: current.skills.filter((skill) => skill.id !== id),
    })
  })
}

export async function createProject(project: Omit<Project, "id">) {
  await queueWrite(async () => {
    const current = await readSiteDataFile()
    const projects = sortByOrder(current.projects)
    projects.push({
      id: nextId(projects),
      ...project,
    })
    await writeSiteDataFile({
      ...current,
      projects,
    })
  })
}

export async function deleteProject(id: number) {
  await queueWrite(async () => {
    const current = await readSiteDataFile()
    await writeSiteDataFile({
      ...current,
      projects: current.projects.filter((project) => project.id !== id),
    })
  })
}

export async function createReview(review: Omit<Review, "id">) {
  await queueWrite(async () => {
    const current = await readSiteDataFile()
    const reviews = sortByOrder(current.reviews)
    reviews.push({
      id: nextId(reviews),
      ...review,
    })
    await writeSiteDataFile({
      ...current,
      reviews,
    })
  })
}

export async function deleteReview(id: number) {
  await queueWrite(async () => {
    const current = await readSiteDataFile()
    await writeSiteDataFile({
      ...current,
      reviews: current.reviews.filter((review) => review.id !== id),
    })
  })
}

export function normalizeProfileInput(profile: Partial<Profile>): Profile {
  return {
    name: profile.name?.trim() || DEFAULT_SITE_DATA.profile.name,
    role: profile.role?.trim() || DEFAULT_SITE_DATA.profile.role,
    headline: profile.headline?.trim() || DEFAULT_SITE_DATA.profile.headline,
    about: profile.about?.trim() || DEFAULT_SITE_DATA.profile.about,
    summary: profile.summary?.trim() || DEFAULT_SITE_DATA.profile.summary,
    email: profile.email?.trim() || DEFAULT_SITE_DATA.profile.email,
    location: profile.location?.trim() || DEFAULT_SITE_DATA.profile.location,
    githubUrl: profile.githubUrl?.trim() || DEFAULT_SITE_DATA.profile.githubUrl,
    linkedinUrl: profile.linkedinUrl?.trim() || DEFAULT_SITE_DATA.profile.linkedinUrl,
    imageUrl: profile.imageUrl?.trim() || DEFAULT_SITE_DATA.profile.imageUrl,
  }
}

export function parseOrderIndex(value: FormDataEntryValue | null, fallback = 0) {
  if (typeof value !== "string") {
    return fallback
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

