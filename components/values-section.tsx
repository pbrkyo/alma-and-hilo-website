"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Heart, Leaf, Sparkles, Clock, type LucideIcon } from "lucide-react"

type Valor = {
  id: string
  icon: LucideIcon
  title: string
  description: string
}

const valores: Valor[] = [
  {
    id: "amor",
    icon: Heart,
    title: "Hecho con amor",
    description: "Cada pieza nace en nuestro taller de Cartago, tejida a mano puntada por puntada, con cariño y calma.",
  },
  {
    id: "materiales",
    icon: Leaf,
    title: "Materiales naturales",
    description: "Priorizamos fibras de algodón y trapillo reciclado, y procesos respetuosos con el ambiente.",
  },
  {
    id: "unicas",
    icon: Sparkles,
    title: "Piezas únicas",
    description: "No hay dos iguales. Elegís color, talla y detalles: tu pieza se teje para vos.",
  },
  {
    id: "slow",
    icon: Clock,
    title: "Slow fashion",
    description: "Creemos en la moda consciente: prendas atemporales hechas para durar y ser atesoradas.",
  },
]

// Tile interactivo: muestra ícono + título; revela la descripción al hover
// (desktop) o al tocar (móvil). Spans del bento por tile.
function ValorTile({
  valor,
  visible,
  delay,
  className,
  dark,
}: {
  valor: Valor
  visible: boolean
  delay: number
  className?: string
  dark?: boolean
}) {
  const [abierto, setAbierto] = useState(false)
  const Icon = valor.icon
  return (
    <button
      type="button"
      onClick={() => setAbierto((v) => !v)}
      aria-expanded={abierto}
      className={`group/tile relative flex flex-col justify-end overflow-hidden rounded-2xl border p-6 text-left transition-all duration-700 ${
        dark
          ? "border-transparent bg-[#2E4233] text-[#F5F0E6]"
          : "border-[#E2D9C7] bg-[#FFFDF8] text-[#2E4233] hover:border-[#7C8450]"
      } ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} ${className ?? ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-300 group-hover/tile:scale-110 ${
          dark ? "bg-[#F5F0E6]/15 text-[#C9D1A8]" : "bg-[#EDE6D8] text-[#7C8450]"
        }`}
      >
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="font-display text-xl md:text-2xl">{valor.title}</h3>
      {/* Descripción: se despliega al hover (desktop) o al tocar (móvil) */}
      <p
        className={`grid font-sans text-sm leading-relaxed transition-all duration-500 ease-out ${
          dark ? "text-[#D9C9AE]" : "text-[#5C5347]"
        } ${abierto ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 group-hover/tile:mt-3 group-hover/tile:grid-rows-[1fr] group-hover/tile:opacity-100"}`}
      >
        <span className="overflow-hidden">{valor.description}</span>
      </p>
    </button>
  )
}

export function ValuesSection() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), {
      threshold: 0.15,
    })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} className="bg-[#F5F0E6] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-12 max-w-2xl">
          <h2 className="font-display text-3xl font-medium text-[#2E4233] md:text-5xl">
            Tejido a mano, <span className="italic font-light">con intención</span>
          </h2>
          <p className="mt-4 font-sans text-[#5C5347]">
            Tocá cada bloque para conocer lo que hay detrás de cada pieza.
          </p>
        </div>

        {/* Bento: imagen (2x2) + 4 valores (1x1) + frase (full). Sin celdas vacías. */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[180px]">
          {/* Imagen atmósfera (taller) — celda alta 2x2 */}
          <div
            className={`group relative overflow-hidden rounded-2xl transition-all duration-700 sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2 ${
              visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <Image
              src="/hero/estudio-poster.jpg"
              alt="Taller de crochet de Alma & Hilo en Cartago"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E2D22]/85 via-[#2E4233]/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <span className="font-sans text-xs uppercase tracking-[0.3em] text-[#C9D1A8]">
                Cartago, Costa Rica
              </span>
              <p className="mt-2 max-w-sm font-display text-2xl leading-snug text-[#F5F0E6] md:text-3xl">
                Un taller de madre e hija donde nace cada puntada.
              </p>
            </div>
          </div>

          {/* 4 valores (1x1 cada uno, llenan el bloque derecho 2x2) */}
          <ValorTile valor={valores[0]} visible={visible} delay={80} className="min-h-[160px]" />
          <ValorTile valor={valores[1]} visible={visible} delay={160} className="min-h-[160px]" />
          <ValorTile valor={valores[2]} visible={visible} delay={240} className="min-h-[160px]" />
          <ValorTile valor={valores[3]} visible={visible} delay={320} dark className="min-h-[160px]" />

          {/* Frase destacada (conservada), full-width */}
          <blockquote
            className={`flex items-center justify-center rounded-2xl bg-[#7C8450] p-8 text-center transition-all duration-700 sm:col-span-2 lg:col-span-4 ${
              visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <p className="max-w-2xl font-display text-xl italic leading-snug text-[#F5F0E6] md:text-2xl">
              "El tiempo que toma crear algo hermoso es parte de su valor"
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
