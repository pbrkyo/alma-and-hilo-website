"use client"

import Link from "next/link"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Star, Trash2, ImageOff } from "lucide-react"
import { deleteProducto, toggleDestacado } from "@/app/admin/actions"
import { formatColones, type Producto } from "@/lib/products"

export function AdminRow({ producto }: { producto: Producto }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [confirm, setConfirm] = useState(false)
  const img = producto.escena || producto.imagenes[0]

  return (
    <li className={`flex items-center gap-3 p-3 ${pending ? "opacity-50" : ""}`}>
      <Link
        href={`/admin/producto/${producto.slug}`}
        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#EDE6D8]"
      >
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[#9b9384]">
            <ImageOff className="h-5 w-5" />
          </span>
        )}
      </Link>

      <Link href={`/admin/producto/${producto.slug}`} className="min-w-0 flex-1">
        <p className="truncate font-display text-lg text-[#2E4233]">{producto.nombre}</p>
        <p className="font-sans text-sm text-[#5C5347]">
          desde {formatColones(producto.precioDesde)}
        </p>
      </Link>

      <button
        onClick={() => start(async () => { await toggleDestacado(producto.slug); router.refresh() })}
        aria-label={producto.destacado ? "Quitar de destacados" : "Destacar"}
        className="p-2 text-[#7C8450]"
      >
        <Star className={`h-5 w-5 ${producto.destacado ? "fill-[#C9962E] text-[#C9962E]" : ""}`} />
      </button>

      {confirm ? (
        <span className="flex items-center gap-1">
          <button
            onClick={() => start(async () => { await deleteProducto(producto.slug); router.refresh() })}
            className="rounded-md bg-[#9a3b3b] px-2.5 py-1 font-sans text-xs text-white"
          >
            Borrar
          </button>
          <button
            onClick={() => setConfirm(false)}
            className="rounded-md border border-[#D9C9AE] px-2.5 py-1 font-sans text-xs text-[#2E4233]"
          >
            No
          </button>
        </span>
      ) : (
        <button onClick={() => setConfirm(true)} aria-label="Borrar" className="p-2 text-[#9b9384] hover:text-[#9a3b3b]">
          <Trash2 className="h-5 w-5" />
        </button>
      )}
    </li>
  )
}
