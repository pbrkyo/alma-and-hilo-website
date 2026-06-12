"use client"

// Hero "Entrada al taller": video generado con Veo (Gemini) entrando al
// estudio de crochet en Cartago. El video termina en el plano amplio del
// taller y se funde con la sección siguiente vía velo crudo + parallax.
// Dirección ui-ux-pro-max: Storytelling + Hero-Centric, estilo Motion-Driven.

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { MessageCircle } from "lucide-react"
import { buildWhatsAppUrl, WHATSAPP_GENERAL_MESSAGE } from "@/lib/whatsapp"

gsap.registerPlugin(ScrollTrigger)

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  // Al terminar el video, fundido al plano del taller sin gente y con plantas
  // (frame editado con Nano Banana: ver scripts/clean-hero-frame.mjs)
  const [ended, setEnded] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    const content = contentRef.current
    if (!section || !video || !content) return
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const targets = content.querySelectorAll<HTMLElement>("[data-hero-seq]")

    if (reduceMotion) {
      // Sin movimiento: poster estático (plano final del taller) y texto visible
      gsap.set(targets, { opacity: 1, y: 0 })
      video.removeAttribute("autoplay")
      video.pause()
      return
    }

    // Entrada coreografiada: el video arranca solo (autoplay) y el texto
    // aparece mientras la cámara entra al taller
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
    tl.fromTo(targets, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 1, stagger: 0.16 }, 1.1)

    // Parallax de salida: el video queda atrás (lento, leve zoom) y el texto
    // sube más rápido — el hero se mezcla con la sección siguiente
    const videoTween = gsap.to(mediaRef.current, {
      yPercent: 18,
      scale: 1.07,
      ease: "none",
      scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
    })
    const contentTween = gsap.to(content, {
      yPercent: -24,
      opacity: 0.15,
      ease: "none",
      scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
    })

    // Pausar el video fuera de viewport (guía de sostenibilidad ui-ux-pro-max)
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        video.pause()
      } else if (!video.ended) {
        video.play().catch(() => {})
      }
    })
    io.observe(section)

    return () => {
      tl.kill()
      videoTween.scrollTrigger?.kill()
      videoTween.kill()
      contentTween.scrollTrigger?.kill()
      contentTween.kill()
      io.disconnect()
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-[100svh] overflow-hidden bg-[#F5F0E6]">
      {/* Video: entrada al taller. Termina y se queda en el plano amplio */}
      <div ref={mediaRef} className="absolute inset-0">
        <video
          ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
        src="/hero/estudio.mp4"
        poster="/hero/estudio-poster.jpg"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={() => setEnded(true)}
        aria-label="Video entrando al taller de crochet de Alma & Hilo en Cartago"
      />

        {/* Plano final limpio (sin gente, con plantas): crossfade al terminar el video */}
        <img
          src="/hero/estudio-poster.jpg"
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover object-[center_30%] transition-opacity duration-[1400ms] ease-out ${
            ended ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* Scrim superior sutil para el header */}
      <div
        className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#33291F]/30 to-transparent"
        aria-hidden="true"
      />

      {/* Velo crudo inferior: legibilidad del texto + fundido con la sección siguiente */}
      <div
        className="absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-t from-[#F5F0E6] from-[34%] via-[#F5F0E6]/85 via-[62%] to-transparent md:h-[62%] md:from-[26%] md:via-[#F5F0E6]/80"
        aria-hidden="true"
      />

      {/* Contenido sobre la zona de fundido */}
      <div className="relative z-10 flex min-h-[100svh] items-end">
        <div ref={contentRef} className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-12 md:pb-28">
          <div className="max-w-2xl">
            <span
              data-hero-seq
              className="mb-4 inline-block font-sans text-xs uppercase tracking-[0.3em] text-[#4A5234] opacity-0 md:text-sm"
            >
              Taller de crochet · Cartago, Costa Rica
            </span>

            <h1
              data-hero-seq
              className="mb-5 font-display text-5xl font-medium leading-[1.05] text-[#2E4233] opacity-0 text-balance md:text-7xl"
            >
              Tejido con <span className="italic font-light">alma</span>, hecho para vos
            </h1>

            <p
              data-hero-seq
              className="mb-9 max-w-xl font-sans text-base leading-relaxed text-[#5C5347] opacity-0 md:text-lg"
            >
              Bolsos, tops y gorros de crochet hechos a mano por madre e hija.
              Elegís tu pieza, nos escribís por WhatsApp y la tejemos para vos.
            </p>

            <div data-hero-seq className="flex flex-col gap-4 opacity-0 sm:flex-row">
              <a
                href="#coleccion"
                className="inline-flex items-center justify-center rounded-lg bg-[#2E4233] px-8 py-4 font-sans text-sm uppercase tracking-widest text-[#F5F0E6] transition-colors duration-300 hover:bg-[#3D5743]"
              >
                Ver la colección
              </a>
              <a
                href={buildWhatsAppUrl(WHATSAPP_GENERAL_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#2E4233] px-8 py-4 font-sans text-sm uppercase tracking-widest text-[#2E4233] transition-colors duration-300 hover:bg-[#2E4233] hover:text-[#F5F0E6]"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Escribinos
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <a
        href="#historia"
        aria-label="Bajar a Nuestra Historia"
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-[#7C8450] motion-safe:animate-bounce"
      >
        <svg width="22" height="30" viewBox="0 0 22 30" fill="none" aria-hidden="true">
          <path d="M2 8 L11 16 L20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
          <path d="M2 17 L11 25 L20 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" opacity="0.5" />
        </svg>
      </a>
    </section>
  )
}
