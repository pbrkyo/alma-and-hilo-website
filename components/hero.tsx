"use client"

// Hero "Entrada al taller": video Veo entrando al estudio de Cartago.
// Patrón tomado de MarlacRedesign (hero pinned + scroll-driven): el video
// queda fijo mientras el scroll lo escala y oscurece con un wash verde alma,
// el texto sube y se desvanece, y la sección siguiente desliza por encima.
// Sin velo claro: legibilidad por gradiente oscuro + texto crudo (como Marlac).

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { MessageCircle } from "lucide-react"
import { buildWhatsAppUrl, WHATSAPP_GENERAL_MESSAGE } from "@/lib/whatsapp"

gsap.registerPlugin(ScrollTrigger)

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const washRef = useRef<HTMLDivElement>(null)
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

    // Scroll (estilo Marlac): video escala, wash verde alma se intensifica,
    // texto sube y se desvanece — todo scrubbed mientras el hero está pinned
    const scrub = {
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    } as const
    const tweens = [
      gsap.to(mediaRef.current, { scale: 1.16, yPercent: 8, ease: "none", scrollTrigger: scrub }),
      gsap.to(washRef.current, { opacity: 0.78, ease: "none", scrollTrigger: scrub }),
      gsap.to(content, { yPercent: -36, opacity: 0, ease: "none", scrollTrigger: { ...scrub, end: "60% bottom" } }),
    ]

    // Pausar el video fuera de viewport
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
      tweens.forEach((t) => {
        t.scrollTrigger?.kill()
        t.kill()
      })
      io.disconnect()
    }
  }, [reduceMotion])

  return (
    <section ref={sectionRef} className={reduceMotion ? "relative h-[100svh]" : "relative h-[180vh]"}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#2E4233]">
        {/* Video: entrada al taller (termina y cruza al plano limpio) */}
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
          <img
            src="/hero/estudio-poster.jpg"
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full object-cover object-[center_30%] transition-opacity duration-[1400ms] ease-out ${
              ended ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* Wash verde alma: se intensifica con el scroll (reemplaza al velo crudo) */}
        <div ref={washRef} className="absolute inset-0 bg-[#2E4233] opacity-0" aria-hidden="true" />

        {/* Gradiente oscuro inferior para legibilidad del texto */}
        <div
          className="absolute inset-x-0 bottom-0 h-[68%] bg-gradient-to-t from-[#1E2D22]/85 via-[#2E4233]/35 to-transparent"
          aria-hidden="true"
        />

        {/* Contenido */}
        <div className="relative z-10 flex h-full items-end">
          <div ref={contentRef} className="mx-auto w-full max-w-7xl px-6 pb-20 md:px-12 md:pb-24">
            <div className="max-w-2xl">
              <span
                data-hero-seq
                className="mb-5 flex items-center gap-3 font-sans text-xs uppercase tracking-[0.3em] text-[#C9D1A8] opacity-0 md:text-sm"
              >
                <span className="h-px w-8 bg-[#C9D1A8]/70" aria-hidden="true" />
                Taller de crochet · Cartago, Costa Rica
              </span>

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
                Bolsos, tops y gorros de crochet hechos a mano por madre e hija.
                Elegís tu pieza, nos escribís por WhatsApp y la tejemos para vos.
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

        {/* Indicador de scroll */}
        <a
          href="#historia"
          aria-label="Bajar a Nuestra Historia"
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[#C9D1A8] motion-safe:animate-bounce"
        >
          <svg width="22" height="30" viewBox="0 0 22 30" fill="none" aria-hidden="true">
            <path d="M2 8 L11 16 L20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
            <path d="M2 17 L11 25 L20 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" opacity="0.5" />
          </svg>
        </a>
      </div>
    </section>
  )
}
