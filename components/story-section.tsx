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
      const reveal = gsap.utils.toArray<HTMLElement>(".hist-reveal")

      if (reduce) {
        gsap.set([".hist-frame", ".hist-accent", ...reveal], { opacity: 1, x: 0, y: 0, scale: 1 })
        return
      }

      // Bloque de acento detrás del retrato
      gsap.from(".hist-accent", {
        opacity: 0,
        x: -24,
        y: 24,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".hist-frame", start: "top 82%" },
      })

      // Retrato: aparece y la imagen interior hace parallax
      gsap.from(".hist-frame", {
        opacity: 0,
        y: 40,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".hist-frame", start: "top 82%" },
      })
      gsap.fromTo(
        ".hist-img-inner",
        { yPercent: -6, scale: 1.08 },
        {
          yPercent: 6,
          scale: 1.08,
          ease: "none",
          scrollTrigger: { trigger: ".hist-frame", start: "top bottom", end: "bottom top", scrub: true },
        },
      )

      // Texto en stagger
      gsap.from(reveal, {
        opacity: 0,
        y: 28,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".hist-text", start: "top 80%" },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="historia"
      ref={root}
      className="relative overflow-hidden bg-[#FFFDF8] py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
          {/* Retrato — madre e hija, con bloque de acento detrás */}
          <div className="relative lg:col-span-5">
            <span
              aria-hidden="true"
              className="hist-accent absolute -bottom-5 -left-5 -z-0 h-full w-full rounded-2xl bg-[#7C8450]/15 sm:-bottom-7 sm:-left-7"
            />
            <div className="hist-frame relative z-10 aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_30px_80px_-45px_rgba(46,66,51,0.6)]">
              <div className="hist-img-inner absolute inset-x-0 -top-[8%] h-[116%]">
                <Image
                  src="/images/yen-velia.webp"
                  alt="Yen y Velia, fundadoras de Alma & Hilo, en su taller con la pared de hilos"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover object-center"
                  quality={88}
                />
              </div>
            </div>
          </div>

          {/* Texto */}
          <div className="hist-text lg:col-span-6 lg:col-start-7">
            <span className="hist-reveal block font-sans text-sm uppercase tracking-[0.3em] text-[#5F6740]">
              Nuestra historia
            </span>
            <h2 className="hist-reveal mt-4 font-display text-4xl font-medium text-[#2E4233] md:text-5xl lg:text-6xl">
              Un lazo de <span className="italic font-light">amor</span>
            </h2>

            <p className="hist-reveal mt-8 font-display text-2xl font-light italic leading-[1.3] text-[#2E4233] md:text-3xl">
              &ldquo;Alma &amp; Hilo nació de la conexión más pura: el amor entre una madre y su
              hija.&rdquo;
            </p>

            <div className="hist-reveal mt-8 space-y-5 font-sans leading-relaxed text-[#5C5347]">
              <p>
                En un pequeño rincón de Costa Rica, entre hilos de colores y agujas de crochet,
                empezamos a tejer no solo prendas, sino sueños y memorias. Lo que nació como tardes
                compartidas aprendiendo las técnicas de nuestras abuelas se volvió una misión:
                preservar el arte del tejido a mano y compartirlo con el mundo.
              </p>
              <p>
                Cada pieza lleva horas de dedicación, conversaciones entre puntada y puntada, y el
                deseo genuino de que quien la use sienta ese cariño tejido en cada hilo.
              </p>
            </div>

            <div className="hist-reveal mt-10 flex items-baseline gap-3 border-t border-[#D9C9AE] pt-8">
              <p className="font-display text-2xl text-[#2E4233]">Velia &amp; Yen</p>
              <p className="font-sans text-xs uppercase tracking-[0.25em] text-[#5F6740]">
                Fundadoras
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
