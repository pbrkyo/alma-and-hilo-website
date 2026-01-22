"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Instagram } from "lucide-react"

const instagramPosts = [
  { id: 1, alt: "Bolso tejido a mano", image: "/images/product-bag.jpg" },
  { id: 2, alt: "Proceso de tejido", image: "/images/hands-crochet.jpg" },
  { id: 3, alt: "Top de crochet", image: "/images/product-top.jpg" },
  { id: 4, alt: "Materiales naturales", image: "/images/yarn-materials.jpg" },
  { id: 5, alt: "Accesorios artesanales", image: "/images/product-accessory.jpg" },
  { id: 6, alt: "Vestido artesanal", image: "/images/product-dress.jpg" },
]

export function InstagramSection() {
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
      ref={sectionRef}
      className="py-20 md:py-28 bg-[#F7F5F0]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <a
            href="https://instagram.com/almaayhilo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 group"
          >
            <Instagram className="w-6 h-6 text-[#2F4F3E] group-hover:text-[#8FAE9A] transition-colors duration-300" />
            <span className="text-[#2F4F3E] font-mono text-lg tracking-wider group-hover:text-[#8FAE9A] transition-colors duration-300">
              @almaayhilo
            </span>
          </a>
          <p className="text-[#5A7A6A] font-mono text-sm mt-2">
            Síguenos para ver nuestras últimas creaciones
          </p>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
          {instagramPosts.map((post, index) => (
            <a
              key={post.id}
              href="https://instagram.com/almaayhilo"
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative aspect-square bg-gradient-to-br from-[#D2C4B2]/50 to-[#8FAE9A]/30 overflow-hidden transition-all duration-700 ${
                isVisible
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Image
                src={post.image || "/placeholder.svg"}
                alt={post.alt}
                fill
                className="object-cover"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#2F4F3E]/0 group-hover:bg-[#2F4F3E]/60 transition-all duration-300 flex items-center justify-center">
                <Instagram className="w-8 h-8 text-[#F7F5F0] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
