"use server"

import { cookies } from "next/headers"
import { ADMIN_COOKIE, verifyAdmin } from "@/lib/auth"
import { readCatalog, writeCatalog, triggerRebuild } from "@/lib/blob"
import type { Producto } from "@/lib/products"

async function requireAuth() {
  const value = (await cookies()).get(ADMIN_COOKIE)?.value
  if (!(await verifyAdmin(value))) throw new Error("No autorizado")
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
}

/** Crea o actualiza un producto. originalSlug vacío = nuevo. */
export async function saveProducto(
  producto: Producto,
  originalSlug?: string,
): Promise<{ slug: string }> {
  await requireAuth()
  const catalog = await readCatalog()

  let base = (producto.slug?.trim() || slugify(producto.nombre)) || "producto"
  const taken = (s: string) => catalog.some((p) => p.slug === s && p.slug !== originalSlug)
  let slug = base
  let i = 2
  while (taken(slug)) slug = `${base}-${i++}`

  const final: Producto = { ...producto, slug }
  const idx = catalog.findIndex((p) => p.slug === originalSlug)
  if (idx >= 0) catalog[idx] = final
  else catalog.push(final)

  await writeCatalog(catalog)
  await triggerRebuild()
  return { slug }
}

export async function deleteProducto(slug: string): Promise<void> {
  await requireAuth()
  const catalog = (await readCatalog()).filter((p) => p.slug !== slug)
  await writeCatalog(catalog)
  await triggerRebuild()
}

export async function toggleDestacado(slug: string): Promise<void> {
  await requireAuth()
  const catalog = await readCatalog()
  const p = catalog.find((x) => x.slug === slug)
  if (!p) return
  p.destacado = !p.destacado
  await writeCatalog(catalog)
  await triggerRebuild()
}
