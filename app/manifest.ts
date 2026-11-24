import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shahroz Khan | Python Backend Developer",
    short_name: "Shahroz Khan",
    description:
      "Python Backend Developer building reliable APIs, backend applications, and practical automations.",
    start_url: "/",
    display: "standalone",
    background_color: "#07070a",
    theme_color: "#07070a",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  }
}
