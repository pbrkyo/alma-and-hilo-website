import type { MetadataRoute } from "next"
import { PRODUCTOS } from "@/lib/products"

const BASE = "https://almayhilo.vercel.app"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/hace-tu-pieza`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...PRODUCTOS.map((p) => ({
      url: `${BASE}/producto/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ]
}
