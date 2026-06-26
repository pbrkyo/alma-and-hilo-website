// Endpoint temporal de mantenimiento: actualiza las tallas de la ropa (Tops) a
// S/M/L/XL/A medida en catalog.json (Blob), del lado del servidor (token de Blob
// disponible en runtime). Protegido por la cookie de admin. Se elimina tras usarlo.
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ADMIN_COOKIE, verifyAdmin } from "@/lib/auth"
import { readCatalog, writeCatalog, triggerRebuild } from "@/lib/blob"

export async function GET() {
  const value = (await cookies()).get(ADMIN_COOKIE)?.value
  if (!(await verifyAdmin(value))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
  const catalog = await readCatalog()
  const TALLAS = [
    { valor: "S" },
    { valor: "M" },
    { valor: "L" },
    { valor: "XL" },
    { valor: "A medida" },
  ]
  const cambiadas: string[] = []
  for (const p of catalog) {
    if (p.categoria !== "Tops") continue
    const op = p.opciones?.find(
      (o) => o.id === "talla" || o.label?.toLowerCase().includes("talla"),
    )
    if (op) {
      op.tipo = "opcion"
      op.valores = TALLAS.map((t) => ({ ...t }))
      cambiadas.push(p.slug)
    }
  }
  await writeCatalog(catalog)
  await triggerRebuild()
  return NextResponse.json({ patched: cambiadas.length, slugs: cambiadas })
}
