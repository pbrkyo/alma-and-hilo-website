import "server-only"
import { put } from "@vercel/blob"
import { PRODUCTOS_SEED, type Producto } from "@/lib/products"

// Helpers de Vercel Blob para el admin. El SDK toma BLOB_READ_WRITE_TOKEN del
// entorno automáticamente (lo inyecta Vercel). catalog.json vive en una ruta
// fija para que CATALOG_URL sea estable; cada guardado la sobrescribe.

const CATALOG_PATH = "catalog.json"

/** Lee el catálogo actual (fresco). Antes de migrar cae a la semilla. */
export async function readCatalog(): Promise<Producto[]> {
  const url = process.env.CATALOG_URL
  if (!url) return PRODUCTOS_SEED
  try {
    const res = await fetch(`${url}?t=${Date.now()}`, { cache: "no-store" })
    if (res.ok) {
      const data = (await res.json()) as Producto[]
      if (Array.isArray(data)) return data
    }
  } catch {
    // cae a la semilla
  }
  return PRODUCTOS_SEED
}

/** Sobrescribe catalog.json en Blob. */
export async function writeCatalog(productos: Producto[]): Promise<string> {
  const { url } = await put(CATALOG_PATH, JSON.stringify(productos, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  })
  return url
}

/** Sube una imagen de producto ya procesada (webp/jpg desde el cliente). */
export async function uploadProductImage(
  slug: string,
  input: Buffer | Uint8Array,
  ext = "webp",
  contentType = "image/webp",
): Promise<string> {
  const name = `products/${slug || "img"}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`
  const { url } = await put(name, input, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType,
  })
  return url
}

/** Dispara el Vercel Deploy Hook para reconstruir el sitio estático. */
export async function triggerRebuild(): Promise<void> {
  const hook = process.env.DEPLOY_HOOK_URL
  if (!hook) return
  try {
    await fetch(hook, { method: "POST" })
  } catch {
    // best-effort
  }
}
