"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

export function StorySection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="historia"
      ref={sectionRef}
      className="py-24 md:py-32 bg-[#FFFFFF]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <span className="inline-block text-[#8FAE9A] text-sm tracking-[0.3em] uppercase font-mono mb-4">
            Nuestra Historia
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-[#2F4F3E]">
            Un lazo de <span className="italic">amor</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Images */}
          <div
            className={`relative transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <div className="grid grid-cols-5 gap-4">
              {/* Main Image - Mother and Daughter */}
              <div className="col-span-3 relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/mother-daughter.png"
                  alt="María y Sofía tejiendo juntas"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Side Image - Tags */}
              <div className="col-span-2 relative aspect-[2/3] bg-[#F7F5F0] overflow-hidden self-end">
                <Image
                  src="/images/etiquetas.png"
                  alt="Etiquetas Alma & Hilo - Tejido con amor, Hecho a mano, Costa Rica"
                  fill
                  className="object-contain p-4"
                />
              </div>
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#8FAE9A]/20 rounded-full -z-10" />
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-[#D2C4B2]/30 rounded-full -z-10" />
          </div>

          {/* Content */}
          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <div className="space-y-6 text-[#5A7A6A] font-mono font-light leading-relaxed">
              <p className="text-lg md:text-xl text-[#2F4F3E] font-serif italic">
                "Alma & Hilo nació de la conexión más pura: el amor entre una madre y su hija."
              </p>
              
              <p>
                En un pequeño rincón de Costa Rica, entre hilos de colores y agujas de crochet, 
                comenzamos a tejer no solo prendas, sino sueños y memorias. Lo que empezó como 
                tardes compartidas aprendiendo las técnicas tradicionales de nuestras abuelas, 
                se convirtió en una misión: preservar el arte del tejido a mano y compartirlo 
                con el mundo.
              </p>
              
              <p>
                Cada pieza que creamos lleva consigo horas de dedicación, conversaciones 
                entre puntada y puntada, y el deseo genuino de que quien la use sienta 
                ese cariño tejido en cada hilo.
              </p>

              <p>
                Somos más que una marca; somos la continuación de una tradición familiar, 
                un puente entre generaciones unidas por la pasión de crear con las manos 
                y el corazón.
              </p>
            </div>

            {/* Signature */}
            <div className="mt-10 pt-8 border-t border-[#D2C4B2]">
              <p className="text-[#2F4F3E] font-serif text-xl italic">
                Con amor,
              </p>
              <p className="text-[#2F4F3E] font-serif text-2xl mt-2">
                María & Sofía
              </p>
              <p className="text-[#8FAE9A] font-mono text-sm tracking-wider uppercase mt-1">
                Fundadoras de Alma & Hilo
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
