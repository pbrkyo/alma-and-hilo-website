"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function StorySection() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(".hist-card", { opacity: 1, y: 0 })
        return
      }
      // Paneo/parallax de la foto full-bleed
      gsap.fromTo(
        ".hist-img-inner",
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      )
      // La tarjeta sube y aparece
      gsap.from(".hist-card", {
        opacity: 0,
        y: 56,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".hist-card", start: "top 88%" },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section id="historia" ref={root} className="relative w-full bg-[#1E2D22]">
      <div className="relative h-[84vh] min-h-[560px] w-full overflow-hidden">
        {/* Foto full-bleed (sobredimensionada para el paneo) */}
        <div className="hist-img-inner absolute inset-x-0 -top-[8%] h-[116%]">
          <Image
            src="/images/yen-velia.webp"
            alt="Yen y Velia, fundadoras de Alma & Hilo, en su taller con la pared de hilos"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_22%]"
            quality={90}
          />
        </div>
        {/* Scrim para legibilidad de la tarjeta (esquina inferior izquierda) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-tr from-[#1E2D22]/85 via-[#1E2D22]/25 to-transparent"
        />

        {/* Tarjeta de texto superpuesta */}
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-6 pb-10 md:px-12 md:pb-16">
            <div className="hist-card max-w-sm rounded-2xl bg-[#FFFDF8]/92 p-7 shadow-[0_40px_90px_-45px_rgba(0,0,0,0.6)] backdrop-blur-sm md:p-9">
              <span className="block font-sans text-sm uppercase tracking-[0.3em] text-[#5F6740]">
                Nuestra historia
              </span>
              <h2 className="mt-3 font-display text-4xl font-medium text-[#2E4233] md:text-5xl">
                Un lazo de <span className="italic font-light">amor</span>
              </h2>
              <p className="mt-5 font-display text-xl font-light italic leading-[1.35] text-[#2E4233] md:text-2xl">
                &ldquo;Alma &amp; Hilo nació de la conexión más pura: el amor entre una madre y su
                hija.&rdquo;
              </p>
              <div className="mt-6 flex items-baseline gap-3 border-t border-[#D9C9AE] pt-5">
                <p className="font-display text-2xl text-[#2E4233]">Velia &amp; Yen</p>
                <p className="font-sans text-xs uppercase tracking-[0.25em] text-[#5F6740]">
                  Fundadoras
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
