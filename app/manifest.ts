import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shahroz Khan | Python Backend Developer",
    short_name: "Shahroz Khan",
    description: "Python Backend Developer building reliable APIs, backend applications, and practical automations.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
  }
}
