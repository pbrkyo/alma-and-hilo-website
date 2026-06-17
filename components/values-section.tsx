"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Heart, Leaf, Sparkles, Clock, type LucideIcon } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

type Valor = { num: string; icon: LucideIcon; title: string; description: string }

const VALORES: Valor[] = [
  {
    num: "01",
    icon: Heart,
    title: "Hecho con amor",
    description:
      "Cada pieza nace en nuestro taller de Cartago, tejida a mano puntada por puntada, con cariño y calma.",
  },
  {
    num: "02",
    icon: Leaf,
    title: "Materiales naturales",
    description:
      "Priorizamos fibras de algodón y trapillo reciclado, y procesos respetuosos con el ambiente.",
  },
  {
    num: "03",
    icon: Sparkles,
    title: "Piezas únicas",
    description: "No hay dos iguales. Elegís color, talla y detalles: tu pieza se teje para vos.",
  },
  {
    num: "04",
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
          y: reduce ? 0 : 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: c, start: "top 85%" },
        })
      })

      if (reduce) {
        gsap.utils.toArray<HTMLElement>(".valor").forEach((v) => v.classList.add("is-active"))
        return
      }

      // Realce del valor activo (barra lateral + opacidad) según el scroll
      gsap.utils.toArray<HTMLElement>(".valor").forEach((v) => {
        ScrollTrigger.create({
          trigger: v,
          start: "top 55%",
          end: "bottom 45%",
          onToggle: (self) => v.classList.toggle("is-active", self.isActive),
        })
      })

      // Crossfade de la imagen fija a medida que avanzan los valores
      gsap.fromTo(
        ".values-img-b",
        { opacity: 0 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: ".valores-track", start: "top 35%", end: "bottom 65%", scrub: true },
        },
      )
      // Parallax/scale sutil del conjunto de imagen
      gsap.fromTo(
        ".values-img",
        { scale: 1.06 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: ".valores-track", start: "top bottom", end: "top top", scrub: true },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative bg-[#F5F0E6] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Encabezado */}
        <div className="reveal-up mb-12 max-w-2xl md:mb-16">
          <h2 className="font-display text-3xl font-medium text-[#2E4233] md:text-5xl">
            Tejido a mano, <span className="italic font-light">con intención</span>
          </h2>
          <p className="mt-4 font-sans text-[#5C5347]">
            Detrás de cada pieza hay un taller, unas manos y una forma de hacer las cosas.
          </p>
        </div>

        {/* Scrollytelling: imagen fija + valores que avanzan */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-16">
          {/* Imagen fija (sticky en desktop; banda normal en móvil) */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[12vh]">
              <div className="values-img relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_30px_80px_-50px_rgba(46,66,51,0.6)] lg:aspect-auto lg:h-[76vh]">
                <Image
                  src="/valores/manos-tejiendo.webp"
                  alt="Manos tejiendo a crochet con hilo sage y crudo"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
                <Image
                  src="/valores/hilos-naturales.webp"
                  alt="Ovillos de algodón natural en tonos sage, crudo y terracota"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="values-img-b object-cover opacity-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E2D22]/45 via-transparent to-transparent" />
                <span className="absolute bottom-6 left-6 font-sans text-xs uppercase tracking-[0.3em] text-[#F5F0E6]/90">
                  Hecho a mano · Cartago
                </span>
              </div>
            </div>
          </div>

          {/* Valores 01–04 */}
          <div className="valores-track mt-10 lg:col-span-6 lg:col-start-7 lg:mt-0">
            {VALORES.map((v) => {
              const Icon = v.icon
              return (
                <div
                  key={v.num}
                  className="valor group relative border-t border-[#D9C9AE]/70 py-10 lg:flex lg:min-h-[80vh] lg:flex-col lg:justify-center lg:border-t-0 lg:pl-8"
                >
                  {/* Barra lateral del activo (desktop) */}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1/2 hidden h-40 w-[3px] origin-center -translate-y-1/2 scale-y-0 rounded bg-[#7C8450] opacity-0 transition-all duration-500 group-[.is-active]:scale-y-100 group-[.is-active]:opacity-100 lg:block"
                  />
                  <div className="transition-opacity duration-500 lg:opacity-45 lg:group-[.is-active]:opacity-100">
                    <div className="flex items-center gap-4">
                      <span className="font-display text-3xl text-[#7C8450]/70 md:text-4xl">{v.num}</span>
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EDE6D8] text-[#7C8450]">
                        <Icon className="h-5 w-5" />
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-2xl text-[#2E4233] md:text-3xl">{v.title}</h3>
                    <p className="mt-3 max-w-md font-sans leading-relaxed text-[#5C5347]">
                      {v.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
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
