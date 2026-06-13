"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Check, Clock, MessageCircle, Sparkles } from "lucide-react"
import { buildProductPedido, buildWhatsAppUrl } from "@/lib/whatsapp"
import { formatColones, type Producto } from "@/lib/products"

export function ProductDetail({ producto }: { producto: Producto }) {
  // Galería = fotos limpias + la editorial (en escena), sin duplicar
  const galeria = producto.escena && !producto.imagenes.includes(producto.escena)
    ? [...producto.imagenes, producto.escena]
    : producto.imagenes
  const [imagenActiva, setImagenActiva] = useState(0)
  const [selecciones, setSelecciones] = useState<Record<string, string>>(() =>
    Object.fromEntries(producto.opciones.map((op) => [op.id, op.valores[0].valor])),
  )

  const setOpcion = (id: string, valor: string) =>
    setSelecciones((prev) => ({ ...prev, [id]: valor }))

  const waUrl = buildWhatsAppUrl(buildProductPedido(producto, selecciones))

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 md:px-12 md:py-16">
      <Link
        href="/#coleccion"
        className="mb-8 inline-flex items-center gap-2 font-sans text-sm text-[#5C5347] transition-colors hover:text-[#2E4233]"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a la colección
      </Link>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Galería */}
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white">
            <Image
              src={galeria[imagenActiva]}
              alt={producto.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
              priority
            />
          </div>
          {galeria.length > 1 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {galeria.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setImagenActiva(i)}
                  aria-label={`Ver foto ${i + 1}`}
                  aria-pressed={i === imagenActiva}
                  className={`relative h-20 w-20 overflow-hidden rounded-lg transition-all ${
                    i === imagenActiva ? "ring-2 ring-[#2E4233]" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="" fill sizes="80px" className="object-cover object-center" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info + opciones */}
        <div>
          <span className="font-sans text-sm uppercase tracking-[0.3em] text-[#7C8450]">
            {producto.categoria}
          </span>
          <h1 className="mt-3 font-display text-4xl font-medium text-[#2E4233] md:text-5xl">
            {producto.nombre}
          </h1>
          <p className="mt-4 font-sans text-lg leading-relaxed text-[#5C5347]">
            {producto.descripcion}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="font-sans text-2xl text-[#2E4233]">
              <span className="text-base text-[#5C5347]">desde </span>
              <span className="font-semibold">{formatColones(producto.precioDesde)}</span>
            </span>
            <span className="inline-flex items-center gap-2 font-sans text-sm text-[#7C8450]">
              <Clock className="h-4 w-4" />
              {producto.elaboracion}
            </span>
          </div>

          <p className="mt-3 font-sans text-sm text-[#5C5347]">
            <span className="font-medium text-[#2E4233]">Materiales:</span> {producto.materiales}
          </p>

          {/* Opciones de customización */}
          <div className="mt-8 space-y-6">
            {producto.opciones.map((op) => (
              <div key={op.id}>
                <div className="mb-3 flex items-baseline justify-between">
                  <span className="font-sans text-sm font-medium uppercase tracking-wider text-[#2E4233]">
                    {op.label}
                  </span>
                  <span className="font-sans text-sm text-[#7C8450]">{selecciones[op.id]}</span>
                </div>

                {op.tipo === "color" ? (
                  <div className="flex flex-wrap gap-3">
                    {op.valores.map((v) => {
                      const activo = selecciones[op.id] === v.valor
                      return (
                        <button
                          key={v.valor}
                          onClick={() => setOpcion(op.id, v.valor)}
                          aria-label={v.valor}
                          aria-pressed={activo}
                          title={v.valor}
                          className={`relative h-10 w-10 rounded-full border transition-all ${
                            activo
                              ? "border-[#2E4233] ring-2 ring-[#2E4233] ring-offset-2 ring-offset-[#F5F0E6]"
                              : "border-[#D9C9AE]"
                          }`}
                          style={{ backgroundColor: v.hex }}
                        >
                          {activo && (
                            <Check
                              className="absolute inset-0 m-auto h-4 w-4"
                              style={{ color: isLight(v.hex) ? "#2E4233" : "#F5F0E6" }}
                            />
                          )}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {op.valores.map((v) => {
                      const activo = selecciones[op.id] === v.valor
                      return (
                        <button
                          key={v.valor}
                          onClick={() => setOpcion(op.id, v.valor)}
                          aria-pressed={activo}
                          className={`rounded-lg border px-4 py-2 font-sans text-sm transition-all ${
                            activo
                              ? "border-[#2E4233] bg-[#2E4233] text-[#F5F0E6]"
                              : "border-[#D9C9AE] text-[#2E4233] hover:border-[#7C8450]"
                          }`}
                        >
                          {v.valor}
                        </button>
                      )
                    })}
                  </div>
                )}

                {op.ayuda && <p className="mt-2 font-sans text-xs text-[#5C5347]">{op.ayuda}</p>}
              </div>
            ))}
          </div>

          {/* CTA WhatsApp */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-9 flex w-full items-center justify-center gap-3 rounded-xl bg-[#25D366] px-8 py-4 font-sans text-base font-medium uppercase tracking-wider text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#1ebe5b]"
          >
            <MessageCircle className="h-5 w-5" />
            Pedir por WhatsApp
          </a>
          <p className="mt-3 flex items-center justify-center gap-2 font-sans text-xs text-[#5C5347]">
            <Sparkles className="h-3.5 w-3.5 text-[#7C8450]" />
            Te abrimos el chat con tu pedido listo. Confirmás y coordinamos el pago.
          </p>
        </div>
      </div>
    </div>
  )
}

/** Decide si un color de fondo es claro (para el check de contraste). */
function isLight(hex?: string): boolean {
  if (!hex) return true
  const h = hex.replace("#", "")
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 150
}
