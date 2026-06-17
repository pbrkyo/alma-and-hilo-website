"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Heart, Leaf, Sparkles, Clock, type LucideIcon } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

type Valor = { num: string; icon: LucideIcon; title: string; description: string; bg: string }

const VALORES: Valor[] = [
  {
    num: "01",
    icon: Heart,
    title: "Hecho con amor",
    description:
      "Cada pieza nace en nuestro taller de Cartago, tejida a mano puntada por puntada, con cariño y calma.",
    bg: "#FFFDF8",
  },
  {
    num: "02",
    icon: Leaf,
    title: "Materiales naturales",
    description:
      "Priorizamos fibras de algodón y trapillo reciclado, y procesos respetuosos con el ambiente.",
    bg: "#EAEFDC",
  },
  {
    num: "03",
    icon: Sparkles,
    title: "Piezas únicas",
    description: "No hay dos iguales. Elegís color, talla y detalles: tu pieza se teje para vos.",
    bg: "#EDE6D8",
  },
  {
    num: "04",
    icon: Clock,
    title: "Slow fashion",
    description:
      "Creemos en la moda consciente: prendas atemporales hechas para durar y ser atesoradas.",
    bg: "#F6EBD3",
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

      if (reduce) return

      // Sticky-stack: cada carta se apila y la anterior se encoge/atenúa al
      // entrar la siguiente (solo transform/opacity).
      const cards = gsap.utils.toArray<HTMLElement>(".stack-card")
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return
        const panel = card.querySelector<HTMLElement>(".stack-panel")
        const dim = card.querySelector<HTMLElement>(".stack-dim")
        const st = {
          trigger: cards[i + 1],
          start: "top bottom",
          end: "top top",
          scrub: true,
        }
        // La carta saliente se encoge un poco (queda opaca, sin ghosting)…
        gsap.to(panel, { scale: 0.9, ease: "none", scrollTrigger: st })
        // …y se oscurece sutilmente con una capa propia.
        gsap.to(dim, { opacity: 0.28, ease: "none", scrollTrigger: st })
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative bg-[#F5F0E6] py-20 md:py-28">
      {/* Encabezado */}
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="reveal-up max-w-2xl">
          <h2 className="font-display text-3xl font-medium text-[#2E4233] md:text-5xl">
            Tejido a mano, <span className="italic font-light">con intención</span>
          </h2>
          <p className="mt-4 font-sans text-[#5C5347]">
            Detrás de cada pieza hay un taller, unas manos y una forma de hacer las cosas.
          </p>
        </div>
      </div>

      {/* Cartas apiladas (sticky-stack) */}
      <div className="stack relative mx-auto mt-10 max-w-4xl px-6 md:mt-14 lg:px-12">
        {VALORES.map((v, i) => {
          const Icon = v.icon
          return (
            <div
              key={v.num}
              className="stack-card sticky top-0 flex min-h-[100svh] items-center"
              style={{ zIndex: i + 1 }}
            >
              <div
                className="stack-panel relative w-full overflow-hidden rounded-[2rem] p-8 shadow-[0_40px_90px_-50px_rgba(46,66,51,0.55)] md:p-14"
                style={{ backgroundColor: v.bg }}
              >
                {/* Ícono marca de agua */}
                <Icon
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-6 -top-6 h-44 w-44 text-[#2E4233]/[0.05] md:h-56 md:w-56"
                  strokeWidth={1}
                />
                <span className="block font-display text-6xl leading-none text-[#7C8450]/45 md:text-7xl">
                  {v.num}
                </span>
                <span className="mt-7 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFFDF8] text-[#7C8450] shadow-sm">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-7 font-display text-3xl text-[#2E4233] md:text-5xl">{v.title}</h3>
                <p className="mt-4 max-w-xl font-sans leading-relaxed text-[#5C5347] md:text-lg">
                  {v.description}
                </p>
                {/* Capa de oscurecido al apilarse la siguiente */}
                <span
                  aria-hidden="true"
                  className="stack-dim pointer-events-none absolute inset-0 rounded-[2rem] bg-[#1E2D22] opacity-0"
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Frase — pull-quote editorial (beat de cierre) */}
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <blockquote className="reveal-up mx-auto mt-16 max-w-4xl text-center md:mt-24">
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
