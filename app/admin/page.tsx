import Link from "next/link"
import { Plus } from "lucide-react"
import { readCatalog } from "@/lib/blob"
import { AdminBar } from "@/components/admin/admin-bar"
import { AdminRow } from "@/components/admin/admin-row"

export const dynamic = "force-dynamic"

export default async function AdminHome() {
  const productos = await readCatalog()
  return (
    <>
      <AdminBar title="Catálogo" />
      <main className="mx-auto max-w-2xl px-5 py-6">
        <Link
          href="/admin/nuevo"
          className="mb-5 flex items-center justify-center gap-2 rounded-lg bg-[#2E4233] px-5 py-3.5 font-sans text-sm uppercase tracking-widest text-[#F5F0E6] transition-colors hover:bg-[#3D5743]"
        >
          <Plus className="h-4 w-4" />
          Nuevo producto
        </Link>

        <p className="mb-3 font-sans text-sm text-[#5C5347]">
          {productos.length} {productos.length === 1 ? "producto" : "productos"}
        </p>

        <ul className="divide-y divide-[#D9C9AE] overflow-hidden rounded-xl border border-[#D9C9AE] bg-white">
          {productos.map((p) => (
            <AdminRow key={p.slug} producto={p} />
          ))}
        </ul>
      </main>
    </>
  )
}
