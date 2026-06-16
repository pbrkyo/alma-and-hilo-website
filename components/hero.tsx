"use client"

// Hero "Entrada al taller": video Veo del estudio de Cartago.
// Es la carta INFERIOR de un sticky-stack: queda fija (sticky) y la sección
// Historia sube y se apila por encima con borde redondeado y sombra.
// Ver app/page.tsx (wrapper del stack) y story-section.tsx.

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { MessageCircle } from "lucide-react"
import { buildWhatsAppUrl, WHATSAPP_GENERAL_MESSAGE } from "@/lib/whatsapp"

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  // Crossfade al plano final limpio cuando termina el video
  const [ended, setEnded] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    const content = contentRef.current
    if (!section || !video || !content) return
    const targets = content.querySelectorAll<HTMLElement>("[data-hero-seq]")

    if (reduceMotion) {
      gsap.set(targets, { opacity: 1, y: 0 })
      video.removeAttribute("autoplay")
      video.pause()
      return
    }

    // Entrada: el texto aparece mientras la cámara entra al taller
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
    tl.fromTo(targets, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 1, stagger: 0.16 }, 1.1)

    // Pausar el video fuera de viewport (cuando la carta Historia lo tapa)
    const io = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio < 0.1) video.pause()
      else if (!video.ended) video.play().catch(() => {})
    }, { threshold: [0, 0.1] })
    io.observe(section)

    return () => {
      tl.kill()
      io.disconnect()
    }
  }, [reduceMotion])

  return (
    <section
      ref={sectionRef}
      className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#2E4233]"
    >
      {/* Video: entrada al taller (termina y cruza al plano limpio) */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
          poster="/hero/estudio-poster.jpg"
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={() => setEnded(true)}
          aria-label="Video entrando al taller de crochet de Alma & Hilo en Cartago"
        >
          {/* Móvil: 720p liviano · Desktop: 1080p alta calidad */}
          <source src="/hero/estudio-mobile.mp4" media="(max-width: 767px)" type="video/mp4" />
          <source src="/hero/estudio.mp4" type="video/mp4" />
        </video>
        <img
          src="/hero/estudio-poster.jpg"
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover object-[center_30%] transition-opacity duration-[1400ms] ease-out ${
            ended ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* Gradiente oscuro inferior para legibilidad del texto */}
      <div
        className="absolute inset-x-0 bottom-0 h-[68%] bg-gradient-to-t from-[#1E2D22]/85 via-[#2E4233]/35 to-transparent"
        aria-hidden="true"
      />

      {/* Contenido */}
      <div className="relative z-10 flex h-full items-end">
        <div ref={contentRef} className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-12 md:pb-28">
          <div className="max-w-2xl">
<h1
              data-hero-seq
              className="mb-5 font-display text-5xl font-medium leading-[1.05] text-[#F5F0E6] opacity-0 text-balance md:text-7xl"
            >
              Tejido con <span className="italic font-light">alma</span>, hecho para vos
            </h1>

            <p
              data-hero-seq
              className="mb-9 max-w-xl font-sans text-base leading-relaxed text-[#F5F0E6]/85 opacity-0 md:text-lg"
            >
              Piezas de crochet tejidas a mano por madre e hija.
            </p>

            <div data-hero-seq className="flex flex-col gap-4 opacity-0 sm:flex-row">
              <a
                href="#coleccion"
                className="inline-flex items-center justify-center rounded-lg bg-[#F5F0E6] px-8 py-4 font-sans text-sm uppercase tracking-widest text-[#2E4233] transition-all duration-300 hover:scale-[1.03] hover:bg-white"
              >
                Ver la colección
              </a>
              <a
                href={buildWhatsAppUrl(WHATSAPP_GENERAL_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#F5F0E6]/70 px-8 py-4 font-sans text-sm uppercase tracking-widest text-[#F5F0E6] transition-all duration-300 hover:scale-[1.03] hover:bg-[#F5F0E6]/10"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Escribinos
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
