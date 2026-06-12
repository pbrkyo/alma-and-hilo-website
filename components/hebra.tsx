"use client"

// La Hebra — elemento firma (ver DESIGN.md).
// Un hilo de trapillo oliva que baja cosiendo las secciones en puntos de
// cadeneta: la ruta base se convierte en bucles continuos (como una cadeneta
// real) y se dibuja con el scroll. En cada sección, una flor de crochet
// (generada con Gemini) marca la puntada.

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const SVG_NS = "http://www.w3.org/2000/svg"

/** Ruta base suave que zigzaguea entre los márgenes, anclada a cada sección. */
function basePath(width: number, top: number, bottom: number, anchors: number[], margin: number): string {
  const xs = (i: number) => (i % 2 === 0 ? width * margin : width * (1 - margin))
  let d = `M ${width / 2} ${top}`
  let prevX = width / 2
  let prevY = top
  anchors.forEach((y, i) => {
    const x = xs(i)
    const midY = (prevY + y) / 2
    d += ` C ${prevX} ${midY}, ${x} ${midY}, ${x} ${y}`
    prevX = x
    prevY = y
  })
  d += ` C ${prevX} ${(prevY + bottom) / 2}, ${width / 2} ${(prevY + bottom) / 2}, ${width / 2} ${bottom}`
  return d
}

/**
 * Convierte la ruta base en una cadeneta: muestrea la ruta y la recorre con
 * bucles (cicloide a lo largo del path), como puntos de cadeneta de crochet.
 */
function chainStitchPath(d: string, loopRadius: number, loopPeriod: number): string {
  const probe = document.createElementNS(SVG_NS, "path")
  probe.setAttribute("d", d)
  const total = probe.getTotalLength()
  const step = 5
  const parts: string[] = []
  for (let s = 0; s <= total; s += step) {
    const p = probe.getPointAtLength(s)
    const p2 = probe.getPointAtLength(Math.min(s + 1, total))
    // tangente y normal unitarias
    let tx = p2.x - p.x
    let ty = p2.y - p.y
    const len = Math.hypot(tx, ty) || 1
    tx /= len
    ty /= len
    const nx = -ty
    const ny = tx
    const theta = (s / loopPeriod) * Math.PI * 2
    const off = Math.sin(theta) * loopRadius
    const along = Math.cos(theta) * loopRadius * 0.6
    const x = p.x + nx * off + tx * along
    const y = p.y + ny * off + ty * along
    parts.push(`${parts.length === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return parts.join(" ")
}

type Geometry = {
  d: string
  width: number
  height: number
  top: number
  bottom: number
  flowers: { x: number; y: number }[]
}

export function Hebra() {
  const rootRef = useRef<SVGSVGElement>(null)
  const [geometry, setGeometry] = useState<Geometry | null>(null)

  // Calcular el trazado a partir de la posición real de las secciones
  useEffect(() => {
    const compute = () => {
      const main = document.querySelector("main")
      if (!main) return
      const sections = Array.from(main.querySelectorAll<HTMLElement>(":scope > section, :scope > footer"))
      if (sections.length < 2) return
      const [hero, ...rest] = sections
      const top = hero.offsetTop + hero.offsetHeight - 16
      const last = rest[rest.length - 1]
      const bottom = last.offsetTop + last.offsetHeight * 0.5
      const anchors = rest.slice(0, -1).map((s) => s.offsetTop + s.offsetHeight * 0.5)
      const width = main.clientWidth
      const height = main.scrollHeight
      const mobile = width < 768
      const margin = mobile ? 0.05 : 0.08
      const base = basePath(width, top, bottom, anchors, margin)
      const d = chainStitchPath(base, mobile ? 7 : 10, mobile ? 26 : 34)
      const xs = (i: number) => (i % 2 === 0 ? width * margin : width * (1 - margin))
      const flowers = anchors.map((y, i) => ({ x: xs(i), y }))
      setGeometry((g) => (g?.d === d ? g : { d, width, height, top, bottom, flowers }))
    }

    compute()
    const main = document.querySelector("main")
    const ro = new ResizeObserver(() => compute())
    if (main) ro.observe(main)
    return () => ro.disconnect()
  }, [])

  // Dibujo con scroll + flores que florecen al paso del hilo
  useEffect(() => {
    const svg = rootRef.current
    if (!svg || !geometry) return
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>("[data-hebra-trazo]"))
    const flowers = Array.from(svg.querySelectorAll<SVGImageElement>("[data-hebra-flor]"))
    if (paths.length === 0) return
    const length = paths[0].getTotalLength()
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (reduceMotion) {
      paths.forEach((p) => (p.style.strokeDasharray = "none"))
      gsap.set(flowers, { opacity: 1, scale: 1 })
      return
    }

    paths.forEach((p) => {
      p.style.strokeDasharray = `${length}`
      p.style.strokeDashoffset = `${length}`
    })
    // La punta del hilo va adelantada al scroll (~3/4 de viewport por debajo
    // del borde superior) para que siempre se la vea avanzar en pantalla.
    const draw = gsap.to(paths, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: () => Math.max(0, geometry.top - window.innerHeight * 0.85),
        end: () => geometry.bottom - window.innerHeight * 0.45,
        scrub: 1,
      },
    })

    const flowerTweens = flowers.map((f) =>
      gsap.fromTo(
        f,
        { opacity: 0, scale: 0.4, rotate: -40, transformOrigin: "center center" },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 0.7,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: document.body,
            start: `${Math.max(0, Number(f.dataset.y) - window.innerHeight * 0.65)}px top`,
            toggleActions: "play none none reverse",
          },
        },
      ),
    )

    return () => {
      draw.scrollTrigger?.kill()
      draw.kill()
      flowerTweens.forEach((t) => {
        t.scrollTrigger?.kill()
        t.kill()
      })
    }
  }, [geometry])

  if (!geometry) return null

  const FLOR = 44

  return (
    <svg
      ref={rootRef}
      className="pointer-events-none absolute inset-0 z-[5] opacity-60 md:opacity-80"
      width={geometry.width}
      height={geometry.height}
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      fill="none"
      aria-hidden="true"
    >
      {/* Tres capas: sombra, cuerpo y brillo = volumen de hilo de trapillo */}
      <path data-hebra-trazo d={geometry.d} stroke="#5F6740" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <path data-hebra-trazo d={geometry.d} stroke="#7C8450" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path data-hebra-trazo d={geometry.d} stroke="#A8B07A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      {geometry.flowers.map((f, i) => (
        <image
          key={i}
          data-hebra-flor
          data-y={f.y}
          href="/hero/flor-hebra.webp"
          x={f.x - FLOR / 2}
          y={f.y - FLOR / 2}
          width={FLOR}
          height={FLOR}
        />
      ))}
    </svg>
  )
}
