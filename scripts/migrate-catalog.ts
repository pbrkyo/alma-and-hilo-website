// Migración única: sube las imágenes actuales de public/products/*.webp a
// Vercel Blob y publica catalog.json (semilla con las rutas reescritas a URLs
// de Blob). Idempotente: re-correrlo sobrescribe.
//
// Requisitos:
//   - Tener un Blob store creado en el proyecto Vercel.
//   - BLOB_READ_WRITE_TOKEN en el entorno (vercel env pull / dashboard).
// Uso (WSL):  BLOB_READ_WRITE_TOKEN=... npx tsx scripts/migrate-catalog.ts
//
// Al terminar imprime CATALOG_URL=... — guardalo como env del proyecto.
import { readdir, readFile } from "node:fs/promises"
import { put } from "@vercel/blob"
import { PRODUCTOS_SEED, type Producto } from "../lib/products"

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    console.error("Falta BLOB_READ_WRITE_TOKEN")
    process.exit(1)
  }

  const DIR = "public/products"
  const files = (await readdir(DIR)).filter((f) => f.endsWith(".webp"))
  const map: Record<string, string> = {}

  console.log(`Subiendo ${files.length} imágenes a Blob...`)
  for (const f of files) {
    const buf = await readFile(`${DIR}/${f}`)
    const { url } = await put(`products/${f}`, buf, {
      access: "public",
      token,
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "image/webp",
    })
    map[`/products/${f}`] = url
    console.log(`  ${f} -> ${url}`)
  }

  const rewrite = (p: string) => map[p] ?? p
  const catalog: Producto[] = PRODUCTOS_SEED.map((p) => ({
    ...p,
    imagenes: p.imagenes.map(rewrite),
    escena: p.escena ? rewrite(p.escena) : undefined,
  }))

  const { url: catalogUrl } = await put("catalog.json", JSON.stringify(catalog, null, 2), {
    access: "public",
    token,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  })

  console.log("\nListo. Configurá esta env en el proyecto Vercel:")
  console.log(`CATALOG_URL=${catalogUrl}`)
}

main()
