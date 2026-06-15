"use client"

import { useEffect, useRef, useState } from "react"
import { MousePointerClick, MessageCircle, Handshake, PackageCheck } from "lucide-react"

const pasos = [
  {
    icon: MousePointerClick,
    titulo: "Elegís",
    texto: "Encontrá tu pieza en la colección o diseñá una desde cero en «Hacé tu pieza».",
  },
  {
    icon: MessageCircle,
    titulo: "Escribís",
    texto: "Nos mandás tu pedido por WhatsApp con un toque. Ya te llega armado y listo.",
  },
  {
    icon: Handshake,
    titulo: "Coordinamos",
    texto: "Afinamos colores, talla y detalles, te pasamos el precio final y el pago.",
  },
  {
    icon: PackageCheck,
    titulo: "Recibís",
    texto: "Tejemos tu pieza con calma y amor, y te la entregamos donde nos digás.",
  },
]

export function HowItWorks() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.15 },
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} id="como-funciona" className="bg-[#F5F0E6] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-14 text-center md:mb-20">
          <span className="mb-4 inline-block font-sans text-sm uppercase tracking-[0.3em] text-[#5F6740]">
            Cómo funciona
          </span>
          <h2 className="font-display text-4xl font-medium text-[#2E4233] md:text-5xl">
            Tu pieza, en <span className="italic font-light">cuatro pasos</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl font-sans text-[#5C5347]">
            Sin carrito ni formularios eternos. Acá la compra es una conversación,
            como debe ser lo hecho a mano.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {pasos.map((paso, i) => {
            const Icon = paso.icon
            return (
              <div
                key={paso.titulo}
                className={`group/paso relative text-center transition-all duration-700 ease-out ${
                  visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${i * 140}ms` }}
              >
                {/* Conector que se "dibuja" al entrar (scaleX) */}
                {i < pasos.length - 1 && (
                  <div className="absolute left-[calc(50%+2.5rem)] top-8 hidden h-px w-[calc(100%-5rem)] origin-left bg-[#7C8450]/40 transition-transform duration-700 ease-out lg:block"
                    style={{ transform: visible ? "scaleX(1)" : "scaleX(0)", transitionDelay: `${i * 140 + 300}ms` }}
                  />
                )}
                <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#2E4233] transition-transform duration-300 group-hover/paso:-translate-y-1 group-hover/paso:scale-105">
                  <Icon className="h-7 w-7 text-[#F5F0E6]" />
                  <span
                    className={`absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#7C8450] font-sans text-xs font-bold text-[#F5F0E6] transition-all duration-500 ${
                      visible ? "scale-100 opacity-100" : "scale-0 opacity-0"
                    }`}
                    style={{ transitionDelay: `${i * 140 + 250}ms` }}
                  >
                    {i + 1}
                  </span>
                </div>
                <h3 className="mb-2 font-display text-2xl text-[#2E4233]">{paso.titulo}</h3>
                <p className="mx-auto max-w-xs font-sans text-sm leading-relaxed text-[#5C5347]">
                  {paso.texto}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
