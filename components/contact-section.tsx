"use client"

import { useEffect, useRef, useState } from "react"
import { Instagram, MessageCircle, Mail, MapPin } from "lucide-react"
import { buildWhatsAppUrl, WHATSAPP_GENERAL_MESSAGE } from "@/lib/whatsapp"

export function ContactSection() {
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
      id="contacto"
      ref={sectionRef}
      className="py-24 md:py-32 bg-[#FFFFFF]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Content */}
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <span className="inline-block text-[#8FAE9A] text-sm tracking-[0.3em] uppercase font-mono mb-4">
              Contacto
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-[#2F4F3E] mb-6">
              Conectemos
            </h2>
            <p className="text-[#5A7A6A] font-mono font-light leading-relaxed mb-8 max-w-lg">
              Nos encantaría saber de ti. Ya sea que busques una pieza especial, 
              tengas una idea para un pedido personalizado, o simplemente quieras 
              saludarnos, estamos aquí para ti.
            </p>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#F7F5F0] flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#2F4F3E]" />
                </div>
                <div>
                  <p className="text-[#2F4F3E] font-serif">Costa Rica</p>
                  <p className="text-[#8FAE9A] font-mono text-sm">Hecho con amor local</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#F7F5F0] flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#2F4F3E]" />
                </div>
                <div>
                  <p className="text-[#2F4F3E] font-serif">hola@almayhilo.com</p>
                  <p className="text-[#8FAE9A] font-mono text-sm">Te responderemos pronto</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-10 pt-8 border-t border-[#D2C4B2]">
              <p className="text-[#2F4F3E] font-mono text-sm tracking-wider uppercase mb-4">
                Síguenos
              </p>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com/almayhilo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-6 py-3 bg-[#F7F5F0] hover:bg-[#2F4F3E] transition-all duration-300"
                  aria-label="Síguenos en Instagram"
                >
                  <Instagram className="w-5 h-5 text-[#2F4F3E] group-hover:text-[#F7F5F0] transition-colors duration-300" />
                  <span className="text-[#2F4F3E] group-hover:text-[#F7F5F0] font-mono text-sm transition-colors duration-300">
                    @almayhilo
                  </span>
                </a>
                <a
                  href={buildWhatsAppUrl(WHATSAPP_GENERAL_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-6 py-3 bg-[#F7F5F0] hover:bg-[#2F4F3E] transition-all duration-300"
                  aria-label="Contáctanos por WhatsApp"
                >
                  <MessageCircle className="w-5 h-5 text-[#2F4F3E] group-hover:text-[#F7F5F0] transition-colors duration-300" />
                  <span className="text-[#2F4F3E] group-hover:text-[#F7F5F0] font-mono text-sm transition-colors duration-300">
                    WhatsApp
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Content - WhatsApp Message Composer */}
          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <div className="bg-[#F7F5F0] p-8 md:p-12">
              <h3 className="text-2xl font-serif text-[#2F4F3E] mb-2">
                Escribínos por WhatsApp
              </h3>
              <p className="text-[#5A7A6A] font-mono text-sm mb-6">
                Completá tu mensaje y te abrimos WhatsApp listo para enviar.
              </p>
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault()
                  const form = e.currentTarget
                  const formData = new FormData(form)
                  const nombre = (formData.get("name") as string).trim()
                  const mensaje = (formData.get("message") as string).trim()
                  const parts: string[] = ["Hola! Vengo desde la web de Alma & Hilo."]
                  if (nombre) parts.push(`Mi nombre es ${nombre}.`)
                  if (mensaje) parts.push(mensaje)
                  window.open(buildWhatsAppUrl(parts.join(" ")), "_blank")
                }}
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-[#2F4F3E] font-mono text-sm mb-2"
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 bg-[#FFFFFF] border border-[#D2C4B2] text-[#2F4F3E] font-mono text-sm focus:outline-none focus:border-[#8FAE9A] transition-colors duration-300"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-[#2F4F3E] font-mono text-sm mb-2"
                  >
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-4 py-3 bg-[#FFFFFF] border border-[#D2C4B2] text-[#2F4F3E] font-mono text-sm focus:outline-none focus:border-[#8FAE9A] transition-colors duration-300 resize-none"
                    placeholder="¿Qué pieza te interesa? ¿Tenés alguna consulta?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white text-sm tracking-widest uppercase font-mono hover:bg-[#1ebe5b] transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5" />
                  Enviar por WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
