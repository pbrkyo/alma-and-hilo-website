import type { MetadataRoute } from "next"
import { getProductos } from "@/lib/catalog"

const BASE = "https://almayhilo.vercel.app"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const productos = await getProductos()
  return [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/hace-tu-pieza`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...productos.map((p) => ({
      url: `${BASE}/producto/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ]
}
