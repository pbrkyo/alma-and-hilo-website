"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Heart, Leaf, Sparkles, Clock, type LucideIcon } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

type Valor = { icon: LucideIcon; title: string; description: string }

const VALORES: Valor[] = [
  {
    icon: Heart,
    title: "Hecho con amor",
    description:
      "Cada pieza nace en nuestro taller de Cartago, tejida a mano puntada por puntada, con cariño y calma.",
  },
  {
    icon: Leaf,
    title: "Materiales naturales",
    description:
      "Priorizamos fibras de algodón y trapillo reciclado, y procesos respetuosos con el ambiente.",
  },
  {
    icon: Sparkles,
    title: "Piezas únicas",
    description: "No hay dos iguales. Elegís color, talla y detalles: tu pieza se teje para vos.",
  },
  {
    icon: Clock,
    title: "Slow fashion",
    description:
      "Creemos en la moda consciente: prendas atemporales hechas para durar y ser atesoradas.",
  },
]

export function ValuesSection() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal-up").forEach((c) => {
        gsap.from(c, {
          y: reduce ? 0 : 36,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: c, start: "top 85%" },
        })
      })

      // Reveal escalonado de los 4 valores
      gsap.from(".valor", {
        y: reduce ? 0 : 32,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".valores-grid", start: "top 80%" },
      })

      if (!reduce) {
        // Parallax sutil de la imagen feature
        gsap.fromTo(
          ".feature-img-inner",
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: "none",
            scrollTrigger: { trigger: ".feature-img", start: "top bottom", end: "bottom top", scrub: true },
          },
        )
      }
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="bg-[#F5F0E6] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Encabezado */}
        <div className="reveal-up mb-10 max-w-2xl md:mb-14">
          <h2 className="font-display text-3xl font-medium text-[#2E4233] md:text-5xl">
            Tejido a mano, <span className="italic font-light">con intención</span>
          </h2>
          <p className="mt-4 font-sans text-[#5C5347]">
            Detrás de cada pieza hay un taller, unas manos y una forma de hacer las cosas.
          </p>
        </div>

        {/* Imagen feature ancha */}
        <div className="reveal-up feature-img relative aspect-[16/9] overflow-hidden rounded-2xl md:aspect-[21/9]">
          <div className="feature-img-inner absolute inset-x-0 -top-[12%] h-[124%]">
            <Image
              src="/valores/manos-tejiendo.webp"
              alt="Manos tejiendo a crochet con hilo sage y crudo en el taller"
              fill
              sizes="(max-width: 1024px) 100vw, 80vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E2D22]/45 via-transparent to-transparent" />
          <span className="absolute bottom-6 left-6 font-sans text-xs uppercase tracking-[0.3em] text-[#F5F0E6]/90">
            Hecho a mano · Cartago
          </span>
        </div>

        {/* Grilla 2×2 de valores con divisores finos */}
        <div className="valores-grid mt-12 grid gap-x-12 gap-y-10 md:mt-16 md:grid-cols-2 md:gap-y-12">
          {VALORES.map((v) => {
            const Icon = v.icon
            return (
              <div key={v.title} className="valor border-t border-[#D9C9AE] pt-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EDE6D8] text-[#7C8450]">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-2xl text-[#2E4233] md:text-3xl">{v.title}</h3>
                <p className="mt-2 max-w-md font-sans leading-relaxed text-[#5C5347]">
                  {v.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Frase — pull-quote editorial (beat de cierre) */}
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
