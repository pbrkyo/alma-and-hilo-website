import "server-only"
import { PRODUCTOS_SEED, type Producto, type Categoria } from "@/lib/products"

// Acceso a datos del catálogo. En producción lee catalog.json desde Vercel Blob
// (env CATALOG_URL); si no hay URL o falla, cae al catálogo semilla. Se cachea
// en memoria por proceso de build (el sitio es estático, una lectura por build).
let cache: Producto[] | null = null

export async function getProductos(): Promise<Producto[]> {
  if (cache) return cache
  const url = process.env.CATALOG_URL
  if (url) {
    try {
      const res = await fetch(url, { cache: "no-store" })
      if (res.ok) {
        const data = (await res.json()) as Producto[]
        if (Array.isArray(data) && data.length) {
          cache = data
          return cache
        }
      }
    } catch {
      // ignora y cae a la semilla
    }
  }
  cache = PRODUCTOS_SEED
  return cache
}

export async function getProducto(slug: string): Promise<Producto | undefined> {
  return (await getProductos()).find((p) => p.slug === slug)
}

export async function productosPorCategoria(
  categoria: Categoria | "Todos",
): Promise<Producto[]> {
  const productos = await getProductos()
  if (categoria === "Todos") return productos
  return productos.filter((p) => p.categoria === categoria)
}
