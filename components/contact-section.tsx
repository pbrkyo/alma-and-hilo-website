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
      className="py-24 md:py-32 bg-[#FFFDF8]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Content */}
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <span className="inline-block text-[#7C8450] text-sm tracking-[0.3em] uppercase font-sans mb-4">
              Contacto
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-light text-[#2E4233] mb-6">
              Conectemos
            </h2>
            <p className="text-[#5C5347] font-sans font-light leading-relaxed mb-8 max-w-lg">
              Nos encantaría saber de ti. Ya sea que busques una pieza especial, 
              tengas una idea para un pedido personalizado, o simplemente quieras 
              saludarnos, estamos aquí para ti.
            </p>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#F5F0E6] flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#2E4233]" />
                </div>
                <div>
                  <p className="text-[#2E4233] font-display">Costa Rica</p>
                  <p className="text-[#7C8450] font-sans text-sm">Hecho con amor local</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#F5F0E6] flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#2E4233]" />
                </div>
                <div>
                  <p className="text-[#2E4233] font-display">hola@almayhilo.com</p>
                  <p className="text-[#7C8450] font-sans text-sm">Te responderemos pronto</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-10 pt-8 border-t border-[#D9C9AE]">
              <p className="text-[#2E4233] font-sans text-sm tracking-wider uppercase mb-4">
                Síguenos
              </p>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com/almayhilo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-6 py-3 bg-[#F5F0E6] hover:bg-[#2E4233] transition-all duration-300"
                  aria-label="Síguenos en Instagram"
                >
                  <Instagram className="w-5 h-5 text-[#2E4233] group-hover:text-[#F5F0E6] transition-colors duration-300" />
                  <span className="text-[#2E4233] group-hover:text-[#F5F0E6] font-sans text-sm transition-colors duration-300">
                    @almayhilo
                  </span>
                </a>
                <a
                  href={buildWhatsAppUrl(WHATSAPP_GENERAL_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-6 py-3 bg-[#F5F0E6] hover:bg-[#2E4233] transition-all duration-300"
                  aria-label="Contáctanos por WhatsApp"
                >
                  <MessageCircle className="w-5 h-5 text-[#2E4233] group-hover:text-[#F5F0E6] transition-colors duration-300" />
                  <span className="text-[#2E4233] group-hover:text-[#F5F0E6] font-sans text-sm transition-colors duration-300">
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
            <div className="bg-[#F5F0E6] p-8 md:p-12">
              <h3 className="text-2xl font-display text-[#2E4233] mb-2">
                Escribínos por WhatsApp
              </h3>
              <p className="text-[#5C5347] font-sans text-sm mb-6">
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
                    className="block text-[#2E4233] font-sans text-sm mb-2"
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 bg-[#FFFDF8] border border-[#D9C9AE] text-[#2E4233] font-sans text-sm focus:outline-none focus:border-[#7C8450] transition-colors duration-300"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-[#2E4233] font-sans text-sm mb-2"
                  >
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-4 py-3 bg-[#FFFDF8] border border-[#D9C9AE] text-[#2E4233] font-sans text-sm focus:outline-none focus:border-[#7C8450] transition-colors duration-300 resize-none"
                    placeholder="¿Qué pieza te interesa? ¿Tenés alguna consulta?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white text-sm tracking-widest uppercase font-sans hover:bg-[#1ebe5b] transition-all duration-300"
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
