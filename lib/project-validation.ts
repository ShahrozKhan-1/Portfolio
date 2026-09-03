export type ProjectFields = {
  title: string
  description: string
  tags: string
  imageUrl: string
  linkUrl: string
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

export function validateProjectFields({ title, description, tags, imageUrl, linkUrl }: ProjectFields) {
  if (!title || !description || !tags) {
    return "Project title, description, and at least one tag are required."
  }

  if (title.length > 150) {
    return "Project title must be 150 characters or fewer."
  }

  if (description.length > 2000) {
    return "Project description must be 2,000 characters or fewer."
  }

  if (tags.length > 500) {
    return "Project tags must be 500 characters or fewer."
  }

  if (imageUrl && !isHttpUrl(imageUrl) && !isSiteRelativePath(imageUrl)) {
    return "Image URL must be a full HTTP(S) URL or a path starting with '/'."
  }

  if (linkUrl && !isHttpUrl(linkUrl) && !isSiteRelativePath(linkUrl) && !linkUrl.startsWith("#")) {
    return "Project link must be a full HTTP(S) URL, a site path, or an anchor beginning with '#'."
  }

  return null
}
