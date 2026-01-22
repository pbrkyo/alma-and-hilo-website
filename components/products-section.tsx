"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

const products = [
  {
    id: 1,
    name: "Bolso Amanecer",
    category: "Bolsos",
    description: "Tejido en punto calado con hilos de algodón natural",
    image: "/images/product-bag.jpg",
  },
  {
    id: 2,
    name: "Top Brisa Marina",
    category: "Ropa",
    description: "Crop top tejido a mano con detalles florales",
    image: "/images/product-top.jpg",
  },
  {
    id: 3,
    name: "Accesorios Naturales",
    category: "Accesorios",
    description: "Detalles artesanales para complementar tu estilo",
    image: "/images/product-accessory.jpg",
  },
  {
    id: 4,
    name: "Vestido Jardín",
    category: "Ropa",
    description: "Vestido midi con patrones botánicos únicos",
    image: "/images/product-dress.jpg",
  },
]

export function ProductsSection() {
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
      id="coleccion"
      ref={sectionRef}
      className="py-24 md:py-32 bg-[#F7F5F0]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <span className="inline-block text-[#8FAE9A] text-sm tracking-[0.3em] uppercase font-mono mb-4">
            Colección
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-[#2F4F3E] mb-6">
            Piezas <span className="italic">únicas</span>
          </h2>
          <p className="text-[#5A7A6A] font-mono font-light max-w-2xl mx-auto">
            Cada creación es irrepetible. Tejidas con dedicación, nuestras piezas 
            llevan consigo la esencia de lo artesanal y el valor de lo hecho a mano.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`group cursor-pointer transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative aspect-[4/5] bg-[#FFFFFF] overflow-hidden mb-6">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-[#2F4F3E]/0 group-hover:bg-[#2F4F3E]/10 transition-all duration-500" />
                
                {/* Category Tag */}
                <span className="absolute top-4 left-4 bg-[#F7F5F0] px-3 py-1 text-[#2F4F3E] text-xs tracking-wider uppercase font-mono">
                  {product.category}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-serif text-[#2F4F3E] group-hover:text-[#8FAE9A] transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="text-[#5A7A6A] font-mono text-sm font-light">
                  {product.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="https://instagram.com/almaayhilo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#2F4F3E] text-sm tracking-widest uppercase font-mono hover:text-[#8FAE9A] transition-colors duration-300"
          >
            <span>Ver toda la colección en Instagram</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
