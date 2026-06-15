"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Heart, Leaf, Sparkles, Clock, type LucideIcon } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

type Valor = { icon: LucideIcon; title: string; description: string }

const valor: Record<string, Valor> = {
  amor: {
    icon: Heart,
    title: "Hecho con amor",
    description:
      "Cada pieza nace en nuestro taller de Cartago, tejida a mano puntada por puntada, con cariño y calma.",
  },
  materiales: {
    icon: Leaf,
    title: "Materiales naturales",
    description:
      "Priorizamos fibras de algodón y trapillo reciclado, y procesos respetuosos con el ambiente.",
  },
  unicas: {
    icon: Sparkles,
    title: "Piezas únicas",
    description: "No hay dos iguales. Elegís color, talla y detalles: tu pieza se teje para vos.",
  },
  slow: {
    icon: Clock,
    title: "Slow fashion",
    description:
      "Creemos en la moda consciente: prendas atemporales hechas para durar y ser atesoradas.",
  },
}

function ValorItem({ data }: { data: Valor }) {
  const Icon = data.icon
  return (
    <div className="flex gap-4">
      <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EDE6D8] text-[#7C8450]">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <h3 className="font-display text-xl text-[#2E4233] md:text-2xl">{data.title}</h3>
        <p className="mt-1 font-sans text-sm leading-relaxed text-[#5C5347]">{data.description}</p>
      </div>
    </div>
  )
}

export function ValuesSection() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const ctx = gsap.context(() => {
      if (!reduce) {
        // Parallax: la capa de imagen (sobredimensionada) deriva con el scroll
        gsap.utils.toArray<HTMLElement>(".parallax-img").forEach((img) => {
          gsap.fromTo(
            img,
            { yPercent: -12 },
            {
              yPercent: 12,
              ease: "none",
              scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          )
        })
      }
      // Reveal de las tarjetas de texto
      gsap.utils.toArray<HTMLElement>(".reveal-up").forEach((c) => {
        gsap.from(c, {
          y: reduce ? 0 : 44,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: c, start: "top 85%" },
        })
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="overflow-hidden bg-[#F5F0E6] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Encabezado */}
        <div className="mb-14 max-w-2xl md:mb-20">
          <h2 className="font-display text-3xl font-medium text-[#2E4233] md:text-5xl">
            Tejido a mano, <span className="italic font-light">con intención</span>
          </h2>
          <p className="mt-4 font-sans text-[#5C5347]">
            Detrás de cada pieza hay un taller, unas manos y una forma de hacer las cosas.
          </p>
        </div>

        {/* Fila 1: imagen izquierda + tarjeta que se superpone a la derecha */}
        <div className="relative lg:grid lg:grid-cols-12 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:col-span-7">
            <div className="parallax-img absolute inset-x-0 -top-[14%] h-[128%]">
              <Image
                src="/valores/manos-tejiendo.webp"
                alt="Manos tejiendo a crochet con hilo sage y crudo"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E2D22]/55 via-transparent to-transparent" />
            <span className="absolute bottom-6 left-6 font-sans text-xs uppercase tracking-[0.3em] text-[#F5F0E6]/90">
              Hecho a mano · Cartago
            </span>
          </div>
          <div className="reveal-up relative z-10 -mt-10 mx-4 space-y-8 rounded-2xl bg-[#FFFDF8] p-8 shadow-[0_30px_80px_-40px_rgba(46,66,51,0.55)] sm:mx-10 md:p-10 lg:col-span-6 lg:col-start-7 lg:-ml-16 lg:mt-0">
            <ValorItem data={valor.amor} />
            <ValorItem data={valor.materiales} />
          </div>
        </div>

        {/* Fila 2: tarjeta a la izquierda que se superpone + imagen a la derecha */}
        <div className="relative mt-6 lg:mt-16 lg:grid lg:grid-cols-12 lg:items-center">
          <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-2xl lg:order-2 lg:col-span-7 lg:col-start-6">
            <div className="parallax-img absolute inset-x-0 -top-[14%] h-[128%]">
              <Image
                src="/valores/hilos-naturales.webp"
                alt="Ovillos de algodón natural en tonos sage, crudo y terracota"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="reveal-up relative z-10 order-2 -mt-10 mx-4 space-y-8 rounded-2xl bg-[#FFFDF8] p-8 shadow-[0_30px_80px_-40px_rgba(46,66,51,0.55)] sm:mx-10 md:p-10 lg:order-1 lg:col-span-6 lg:col-start-1 lg:-mr-16 lg:mt-0">
            <ValorItem data={valor.unicas} />
            <ValorItem data={valor.slow} />
          </div>
        </div>

        {/* Frase — pull-quote editorial */}
        <blockquote className="reveal-up mx-auto mt-20 max-w-4xl text-center md:mt-28">
          <span aria-hidden="true" className="block font-display text-7xl leading-none text-[#7C8450]/35 md:text-8xl">
            &ldquo;
          </span>
          <p className="mx-auto -mt-6 max-w-3xl font-display text-3xl font-light italic leading-[1.25] text-[#2E4233] md:-mt-8 md:text-5xl">
            El tiempo que toma crear algo hermoso es parte de su valor
          </p>
          <span className="mx-auto mt-8 block h-px w-16 bg-[#7C8450]/60" />
          <footer className="mt-4 font-sans text-xs uppercase tracking-[0.3em] text-[#5F6740]">
            Alma &amp; Hilo
          </footer>
        </blockquote>
      </div>
    </section>
  )
}
