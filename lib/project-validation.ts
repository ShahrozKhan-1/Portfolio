import type { ProjectStatus } from "@/lib/site-types"

export type ProjectFields = {
  title: string
  slug: string
  description: string
  longDescription: string
  tags: string
  imageUrl: string
  linkUrl: string
  liveUrl: string
  repoUrl: string
  status: ProjectStatus
  startDate: string
  endDate: string
}

export function getTextField(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === "string" ? value.trim() : ""
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

function isSiteRelativePath(value: string) {
  return value.startsWith("/") && !value.startsWith("//")
}

export function validateProjectFields({ title, slug, description, longDescription, tags, imageUrl, linkUrl, liveUrl, repoUrl, status, startDate, endDate }: ProjectFields) {
  if (!title || !slug || !description || !tags) {
    return "Project title, description, and at least one tag are required."
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return "Project slug must use lowercase letters, numbers, and hyphens."
  }

  if (title.length > 150) {
    return "Project title must be 150 characters or fewer."
  }

  if (description.length > 2000 || longDescription.length > 5000) {
    return "Project description must be 2,000 characters or fewer."
  }

  if (tags.length > 500) {
    return "Project tags must be 500 characters or fewer."
  }

  if (imageUrl && !isHttpUrl(imageUrl) && !isSiteRelativePath(imageUrl)) {
    return "Image URL must be a full HTTP(S) URL or a path starting with '/'."
  }

  for (const url of [linkUrl, liveUrl, repoUrl]) {
    if (url && !isHttpUrl(url) && !isSiteRelativePath(url) && !url.startsWith("#")) {
      return "Project links must be full HTTP(S) URLs, site paths, or anchors beginning with '#'."
    }
  }

  if (!["completed", "in-progress", "planned", "maintenance"].includes(status)) {
    return "Project status is invalid."
  }

  if ((startDate && !/^\\d{4}-\\d{2}$/.test(startDate)) || (endDate && !/^\\d{4}-\\d{2}$/.test(endDate))) {
    return "Project dates must use YYYY-MM format."
  }

  return null
}
