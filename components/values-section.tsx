"use client"

import { useEffect, useRef, useState } from "react"
import { Heart, Leaf, Sparkles, Clock } from "lucide-react"

const values = [
  {
    icon: Heart,
    title: "Hecho con Amor",
    description: "Cada pieza es creada con cariño y dedicación, transmitiendo emociones en cada puntada.",
  },
  {
    icon: Leaf,
    title: "Materiales Naturales",
    description: "Priorizamos hilos de fibras naturales y procesos respetuosos con el medio ambiente.",
  },
  {
    icon: Sparkles,
    title: "Piezas Únicas",
    description: "No hay dos piezas iguales. Cada creación tiene su propia personalidad y detalles especiales.",
  },
  {
    icon: Clock,
    title: "Slow Fashion",
    description: "Creemos en la moda consciente: piezas atemporales hechas para durar y ser atesoradas.",
  },
]

export function ValuesSection() {
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
      ref={sectionRef}
      className="py-20 md:py-28 bg-[#D2C4B2]/20"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {values.map((value, index) => (
            <div
              key={value.title}
              className={`text-center transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#FFFFFF] flex items-center justify-center shadow-sm">
                <value.icon className="w-7 h-7 text-[#8FAE9A]" />
              </div>
              <h3 className="text-xl font-serif text-[#2F4F3E] mb-3">
                {value.title}
              </h3>
              <p className="text-[#5A7A6A] font-mono text-sm font-light leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
