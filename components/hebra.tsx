"use client"

// La Hebra — elemento firma (ver DESIGN.md).
// Un hilo continuo color oliva que nace bajo el hero y cose las secciones
// de arriba a abajo, dibujándose con el scroll (GSAP ScrollTrigger).

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

function buildPath(width: number, top: number, bottom: number, anchors: number[]): string {
  // Punto de partida: centro, justo bajo el hero
  const xs = (i: number) => (i % 2 === 0 ? width * 0.085 : width * 0.915)
  let d = `M ${width / 2} ${top}`
  let prevX = width / 2
  let prevY = top
  anchors.forEach((y, i) => {
    const x = xs(i)
    const midY = (prevY + y) / 2
    d += ` C ${prevX} ${midY}, ${x} ${midY}, ${x} ${y}`
    // pequeña puntada (bucle) donde el hilo "engancha" la sección
    const dir = i % 2 === 0 ? 1 : -1
    d += ` q ${dir * 14} -10, ${dir * 18} 2 q ${dir * 2} 10, ${-dir * 10} 10`
    prevX = x + dir * 8
    prevY = y + 12
  })
  d += ` C ${prevX} ${(prevY + bottom) / 2}, ${width / 2} ${(prevY + bottom) / 2}, ${width / 2} ${bottom}`
  return d
}

export function Hebra() {
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const [geometry, setGeometry] = useState<{ d: string; width: number; height: number } | null>(null)

  // Calcular el trazado a partir de la posición real de las secciones
  useEffect(() => {
    const compute = () => {
      const main = document.querySelector("main")
      if (!main) return
      const sections = Array.from(main.querySelectorAll<HTMLElement>(":scope > section, :scope > footer"))
      if (sections.length < 2) return
      const [hero, ...rest] = sections
      const top = hero.offsetTop + hero.offsetHeight - 24
      const last = rest[rest.length - 1]
      const bottom = last.offsetTop + last.offsetHeight * 0.55
      const anchors = rest.slice(0, -1).map((s) => s.offsetTop + s.offsetHeight * 0.5)
      const width = main.clientWidth
      const height = main.scrollHeight
      setGeometry({ d: buildPath(width, top, bottom, anchors), width, height })
    }

    compute()
    // Recalcular cuando cambia el layout (imágenes que cargan, resize)
    const main = document.querySelector("main")
    const ro = new ResizeObserver(() => compute())
    if (main) ro.observe(main)
    return () => ro.disconnect()
  }, [])

  // Dibujo con scroll
  useEffect(() => {
    const path = pathRef.current
    if (!path || !geometry) return
    const length = path.getTotalLength()
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (reduceMotion) {
      path.style.strokeDasharray = "none"
      return
    }

    path.style.strokeDasharray = `${length}`
    path.style.strokeDashoffset = `${length}`
    const tween = gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [geometry])

  if (!geometry) return null

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none absolute inset-0 z-[5] opacity-50 md:opacity-70"
      width={geometry.width}
      height={geometry.height}
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      fill="none"
      aria-hidden="true"
    >
      <path
        ref={pathRef}
        d={geometry.d}
        stroke="#7C8450"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Nudo final junto al footer */}
      <circle
        cx={geometry.width / 2}
        cy={parseFloat(geometry.d.split(" ").pop() || "0")}
        r="4.5"
        fill="#7C8450"
      />
    </svg>
  )
}
