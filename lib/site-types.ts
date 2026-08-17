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

export type Project = {
  id: number
  title: string
  description: string
  tags: string
  imageUrl: string
  linkUrl: string
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

