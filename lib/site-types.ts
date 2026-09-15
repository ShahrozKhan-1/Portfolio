export type Profile = {
  name: string
  role: string
  headline: string
  about: string
  summary: string
  email: string
  location: string
  githubUrl: string
  linkedinUrl: string
  imageUrl: string
}

export type Skill = {
  id: number
  name: string
  category: string
  description: string
  iconKey: string
  accent: string
  orderIndex: number
}

export type ProjectStatus = "completed" | "in-progress" | "planned" | "maintenance"

export type ProjectImage = {
  url: string
  alt: string
  caption?: string
}

export type Project = {
  id: number
  title: string
  slug: string
  description: string
  longDescription: string
  problem: string
  solution: string
  role: string
  contributions: string[]
  features: string[]
  challenges: string[]
  results: string[]
  techStack: string[]
  tags: string
  /** Optional thumbnail URL. The UI uses a local placeholder when it is empty. */
  imageUrl?: string
  gallery: ProjectImage[]
  linkUrl: string
  liveUrl: string
  repoUrl: string
  status: ProjectStatus
  startDate: string
  endDate: string
  orderIndex: number
}

export type Review = {
  id: number
  name: string
  role: string
  content: string
  avatarUrl: string
  rating: number
  orderIndex: number
}

export type SiteData = {
  profile: Profile
  skills: Skill[]
  projects: Project[]
  reviews: Review[]
}
