"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

const steps = [
  {
    number: "01",
    title: "Inspiración",
    description:
      "Cada diseño nace de la naturaleza costarricense, de colores que nos rodean y de las historias que queremos contar.",
  },
  {
    number: "02",
    title: "Selección de Materiales",
    description:
      "Elegimos cuidadosamente hilos de la más alta calidad, priorizando fibras naturales y colores que perduren en el tiempo.",
  },
  {
    number: "03",
    title: "Creación Artesanal",
    description:
      "Puntada a puntada, cada pieza cobra vida en nuestras manos. Este proceso puede tomar días o semanas, dependiendo de la complejidad.",
  },
  {
    number: "04",
    title: "Detalles Finales",
    description:
      "Revisamos cada detalle con amor, asegurándonos de que cada pieza sea perfecta antes de llegar a tus manos.",
  },
]

export function ProcessSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="proceso"
      ref={sectionRef}
      className="py-24 md:py-32 bg-[#2E4233]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <span className="inline-block text-[#7C8450] text-sm tracking-[0.3em] uppercase font-sans mb-4">
            Proceso Artesanal
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-light text-[#F5F0E6] mb-6">
            Hecho con <span className="italic text-[#7C8450]">dedicación</span>
          </h2>
          <p className="text-[#D9C9AE] font-sans font-light max-w-2xl mx-auto">
            Detrás de cada pieza hay horas de trabajo, paciencia y amor. 
            Te invitamos a conocer nuestro proceso creativo.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`relative transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Connector Line (hidden on mobile, last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-[#7C8450]/30" />
              )}

              <div className="text-center lg:text-left">
                {/* Number */}
                <span className="inline-block text-6xl md:text-7xl font-display font-light text-[#7C8450]/30 mb-4">
                  {step.number}
                </span>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-display text-[#F5F0E6] mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-[#D9C9AE]/80 font-sans text-sm font-light leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Images Row */}
        <div className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src="/images/yarn-materials.png"
              alt="Materiales naturales - hilos de algodón"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2E4233]/60 to-transparent" />
            <p className="absolute bottom-4 left-4 text-[#F5F0E6] font-sans text-sm">Materiales</p>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src="/images/hands-crochet.png"
              alt="Implementos de crochet - agujas y herramientas"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2E4233]/60 to-transparent" />
            <p className="absolute bottom-4 left-4 text-[#F5F0E6] font-sans text-sm">Implementos</p>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src="/images/product-top.jpg"
              alt="Producto final - top tejido a mano"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2E4233]/60 to-transparent" />
            <p className="absolute bottom-4 left-4 text-[#F5F0E6] font-sans text-sm">Producto Final</p>
          </div>
        </div>

        {/* Quote */}
        <div className="mt-16 md:mt-20 text-center">
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-display font-light text-[#F5F0E6] italic max-w-3xl mx-auto leading-relaxed">
            "El tiempo que toma crear algo hermoso es parte de su valor"
          </blockquote>
          <div className="mt-6 w-12 h-px bg-[#7C8450] mx-auto" />
        </div>
      </div>
    </section>
  )
}
