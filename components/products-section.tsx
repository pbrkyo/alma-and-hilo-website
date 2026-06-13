"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { CATEGORIAS, PRODUCTOS, formatColones, type Categoria } from "@/lib/products"

type Filtro = Categoria | "Todos"
const FILTROS: Filtro[] = ["Todos", ...CATEGORIAS]

// Encuadre por foto (si alguna pieza queda descentrada). Las fotos del
// catálogo nuevo están centradas, así que por defecto va object-center.
const FOCO: Record<string, string> = {}

export function ProductsSection() {
  const [filtro, setFiltro] = useState<Filtro>("Todos")
  const productos = useMemo(
    () => (filtro === "Todos" ? PRODUCTOS : PRODUCTOS.filter((p) => p.categoria === filtro)),
    [filtro],
  )

  return (
    <section id="coleccion" className="bg-[#F5F0E6] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Encabezado */}
        <div className="mb-12 text-center md:mb-16">
          <span className="mb-4 inline-block font-sans text-sm uppercase tracking-[0.3em] text-[#7C8450]">
            Colección
          </span>
          <h2 className="mb-5 font-display text-4xl font-medium text-[#2E4233] md:text-5xl lg:text-6xl">
            Piezas <span className="italic font-light">únicas</span>
          </h2>
          <p className="mx-auto max-w-2xl font-sans text-[#5C5347]">
            Cada creación es irrepetible. Elegí la tuya, personalizala a tu gusto y la tejemos para vos.
          </p>
        </div>

        {/* Filtros por categoría */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {FILTROS.map((f) => {
            const activo = filtro === f
            return (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                aria-pressed={activo}
                className={`rounded-full border px-5 py-2 font-sans text-sm tracking-wide transition-all duration-300 ${
                  activo
                    ? "border-[#2E4233] bg-[#2E4233] text-[#F5F0E6]"
                    : "border-[#D9C9AE] bg-transparent text-[#2E4233] hover:border-[#7C8450] hover:text-[#7C8450]"
                }`}
              >
                {f}
              </button>
            )
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {productos.map((producto) => (
            <Link
              key={producto.slug}
              href={`/producto/${producto.slug}`}
              className="group block"
            >
              <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-xl bg-white">
                <Image
                  src={producto.imagenes[0]}
                  alt={producto.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
                    FOCO[producto.slug] ?? "object-center"
                  }`}
                />
                <span className="absolute left-4 top-4 rounded-full bg-[#F5F0E6]/90 px-3 py-1 font-sans text-xs uppercase tracking-wider text-[#2E4233] backdrop-blur-sm">
                  {producto.categoria}
                </span>
                {/* Flecha al hover */}
                <span className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-[#2E4233] text-[#F5F0E6] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl text-[#2E4233] transition-colors duration-300 group-hover:text-[#7C8450]">
                    {producto.nombre}
                  </h3>
                  <p className="mt-1 font-sans text-sm text-[#5C5347]">{producto.gancho}</p>
                </div>
                <span className="shrink-0 whitespace-nowrap pt-1 font-sans text-sm text-[#5C5347]">
                  desde <span className="font-semibold text-[#2E4233]">{formatColones(producto.precioDesde)}</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA al configurador */}
        <div className="mt-16 rounded-2xl bg-[#2E4233] px-8 py-12 text-center md:mt-20 md:py-16">
          <h3 className="mx-auto max-w-2xl font-display text-3xl font-light text-[#F5F0E6] md:text-4xl">
            ¿No encontrás lo que buscás? <span className="italic">Hacelo a tu manera.</span>
          </h3>
          <p className="mx-auto mt-4 max-w-xl font-sans text-[#D9C9AE]">
            Diseñá tu pieza desde cero: elegí el tipo, la textura, los colores y los detalles.
            Nosotros la tejemos para vos.
          </p>
          <Link
            href="/hace-tu-pieza"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#F5F0E6] px-8 py-4 font-sans text-sm uppercase tracking-widest text-[#2E4233] transition-all duration-300 hover:scale-[1.03] hover:bg-white"
          >
            Hacé tu pieza
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
