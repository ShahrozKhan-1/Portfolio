import "server-only"

const globalState = globalThis as typeof globalThis & {
  __portfolioResumeDownloadEnabled?: boolean
}

export function isResumeDownloadEnabled() {
  return globalState.__portfolioResumeDownloadEnabled ?? true
}

export function setResumeDownloadEnabled(enabled: boolean) {
  globalState.__portfolioResumeDownloadEnabled = enabled
}
