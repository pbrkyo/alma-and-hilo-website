import { notFound } from "next/navigation"
import { readCatalog } from "@/lib/blob"
import { AdminBar } from "@/components/admin/admin-bar"
import { AdminEditor } from "@/components/admin/editor"

export const dynamic = "force-dynamic"

export default async function EditarProducto({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const producto = (await readCatalog()).find((p) => p.slug === slug)
  if (!producto) notFound()

  return (
    <>
      <AdminBar title={producto.nombre} backHref="/admin" />
      <AdminEditor producto={producto} isNew={false} />
    </>
  )
}
