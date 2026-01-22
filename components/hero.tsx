"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#F7F5F0] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0C13.4 0 0 13.4 0 30s13.4 30 30 30 30-13.4 30-30S46.6 0 30 0zm0 54c-13.2 0-24-10.8-24-24S16.8 6 30 6s24 10.8 24 24-10.8 24-24 24z' fill='%232F4F3E' fillOpacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-32 md:py-40">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div
            className={`text-center lg:text-left transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="inline-block text-[#8FAE9A] text-sm tracking-[0.3em] uppercase font-mono mb-6">
              Hecho a mano en Costa Rica
            </span>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-light text-[#2F4F3E] leading-tight mb-6">
              <span className="block">Tejido con</span>
              <span className="block italic text-[#8FAE9A]">amor</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[#5A7A6A] font-mono font-light leading-relaxed max-w-lg mx-auto lg:mx-0 mb-10">
              Cada puntada cuenta una historia. Piezas únicas de crochet creadas por 
              manos que tejen con el corazón, transmitiendo tradición y amor en cada detalle.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#coleccion"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#2F4F3E] text-[#F7F5F0] text-sm tracking-widest uppercase font-mono hover:bg-[#3d6550] transition-all duration-300"
              >
                Ver Colección
              </a>
              <a
                href="#historia"
                className="inline-flex items-center justify-center px-8 py-4 border border-[#2F4F3E] text-[#2F4F3E] text-sm tracking-widest uppercase font-mono hover:bg-[#2F4F3E] hover:text-[#F7F5F0] transition-all duration-300"
              >
                Nuestra Historia
              </a>
            </div>
          </div>

          {/* Right Content - Hero Images */}
          <div
            className={`relative flex justify-center lg:justify-end transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="relative grid grid-cols-3 gap-3 md:gap-4">
              {/* Main lifestyle image */}
              <div className="col-span-2 row-span-2 relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/hero-lifestyle.png"
                  alt="Mujer con vestido de crochet artesanal"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Logo */}
              <div className="relative aspect-square bg-[#F7F5F0] overflow-hidden flex items-center justify-center">
                <Image
                  src="/images/logo.png"
                  alt="Alma & Hilo Logo"
                  width={200}
                  height={200}
                  className="w-full h-auto p-2"
                  priority
                />
              </div>
              {/* Product preview */}
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src="/images/product-bag.jpg"
                  alt="Bolso tejido a mano"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <a href="#historia" aria-label="Desplazarse hacia abajo">
            <ChevronDown className="w-8 h-8 text-[#8FAE9A]" />
          </a>
        </div>
      </div>
    </section>
  )
}
