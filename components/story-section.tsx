"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

export function StorySection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.2 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="historia"
      ref={sectionRef}
      className="relative z-10 rounded-t-[2rem] bg-[#FFFDF8] pb-24 pt-28 shadow-[0_-32px_70px_-32px_rgba(30,45,34,0.5)] md:rounded-t-[3rem] md:pb-32 md:pt-40"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Imagen — madre e hija */}
          <div
            className={`relative lg:col-span-5 transition-all duration-1000 ${
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
            }`}
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
              <Image
                src="/images/yen-velia.webp"
                alt="Yen y Velia, fundadoras de Alma & Hilo, en su taller con la pared de hilos"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
                quality={88}
              />
            </div>
          </div>

          {/* Contenido */}
          <div
            className={`lg:col-span-6 lg:col-start-7 transition-all duration-1000 delay-200 ${
              isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
            }`}
          >
            <span className="font-sans text-sm uppercase tracking-[0.3em] text-[#5F6740]">
              Nuestra historia
            </span>
            <h2 className="mt-3 font-display text-4xl font-medium text-[#2E4233] md:text-5xl lg:text-6xl">
              Un lazo de <span className="italic font-light">amor</span>
            </h2>

            <blockquote className="mt-8 border-l-2 border-[#7C8450]/50 pl-5 font-display text-xl italic leading-snug text-[#2E4233] md:text-2xl">
              &ldquo;Alma &amp; Hilo nació de la conexión más pura: el amor entre una madre y su hija.&rdquo;
            </blockquote>

            <div className="mt-6 space-y-5 font-sans leading-relaxed text-[#5C5347]">
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

            <div className="mt-10 flex items-baseline gap-3 border-t border-[#D9C9AE] pt-8">
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
