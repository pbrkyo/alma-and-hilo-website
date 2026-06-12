"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import gsap from "gsap"
import { MessageCircle } from "lucide-react"
import { buildWhatsAppUrl, WHATSAPP_GENERAL_MESSAGE } from "@/lib/whatsapp"

// Three.js solo se descarga cuando el hero monta (code-splitting)
const YarnScene = dynamic(() => import("@/components/hero/yarn-scene"), { ssr: false })

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas")
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"))
  } catch {
    return false
  }
}

export function Hero() {
  const rootRef = useRef<HTMLElement>(null)
  const [webgl, setWebgl] = useState<boolean | null>(null)
  const [knitted, setKnitted] = useState(false)

  useEffect(() => {
    setWebgl(supportsWebGL())
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const targets = root.querySelectorAll<HTMLElement>("[data-hero-seq]")
    const deco = root.querySelectorAll<HTMLElement>("[data-hero-deco]")
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (reduceMotion) {
      gsap.set([...targets, ...deco], { opacity: 1, y: 0, scale: 1 })
      return
    }
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
    tl.fromTo(
      deco,
      { opacity: 0, scale: 0.94 },
      { opacity: 1, scale: 1, duration: 1.6, stagger: 0.3, ease: "power2.out" },
      0.1,
    ).fromTo(
      targets,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.14 },
      0.4,
    )
    return () => {
      tl.kill()
    }
  }, [])

  return (
    <section
      ref={rootRef}
      className="relative min-h-screen flex items-center justify-center bg-[#F5F0E6] overflow-hidden"
    >
      {/* La mesa de la artesana: lino con luz cálida (generado con Gemini) */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/hero/ambiente-lino.webp"
          alt=""
          fill
          className="object-cover opacity-60"
          priority
        />
        {/* Velo crudo radial: el centro queda limpio para el texto */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 75% 60% at 50% 48%, rgba(245,240,230,0.94) 35%, rgba(245,240,230,0.45) 100%)",
          }}
        />
      </div>

      {/* Guirnaldas de crochet en las esquinas (generadas con Gemini) */}
      <img
        data-hero-deco
        src="/hero/guirnalda-sup.webp"
        alt=""
        className="absolute -top-4 -left-4 w-44 md:w-72 lg:w-[24rem] opacity-0 motion-safe:animate-flotar z-[1]"
        aria-hidden="true"
      />
      <img
        data-hero-deco
        src="/hero/guirnalda-inf.webp"
        alt=""
        className="absolute -bottom-3 -right-3 w-40 md:w-64 lg:w-[20rem] opacity-0 motion-safe:animate-flotar-lento z-[1]"
        aria-hidden="true"
      />

      {/* Escena 3D (o fallback de foto si no hay WebGL) */}
      {webgl === true && (
        <div className="absolute inset-0 z-[2]">
          <YarnScene onKnitted={() => setKnitted(true)} />
        </div>
      )}
      {webgl === false && (
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src="/products/beige_top_asset.webp"
            alt=""
            fill
            className="object-cover opacity-25"
            priority
          />
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-32 text-center">
        <span
          data-hero-seq
          className="inline-block opacity-0 text-[#7C8450] text-xs md:text-sm tracking-[0.3em] uppercase font-sans mb-6"
        >
          Crochet artesanal · Cartago, Costa Rica
        </span>

        <h1
          data-hero-seq
          className="opacity-0 text-5xl md:text-7xl lg:text-8xl font-display font-medium text-[#2E4233] leading-[1.05] text-balance mb-6"
        >
          Tejido con <span className="italic font-light">alma</span>,
          <br />
          hecho para vos
        </h1>

        <p
          data-hero-seq
          className="opacity-0 text-base md:text-lg text-[#5C5347] font-sans leading-relaxed max-w-xl mx-auto mb-10"
        >
          Bolsos, tops y gorros de crochet hechos a mano por madre e hija.
          Elegís tu pieza, nos escribís por WhatsApp y la tejemos para vos, puntada por puntada.
        </p>

        <div data-hero-seq className="opacity-0 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#coleccion"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#2E4233] text-[#F5F0E6] text-sm tracking-widest uppercase font-sans rounded-lg hover:bg-[#3D5743] transition-colors duration-300"
          >
            Ver la colección
          </a>
          <a
            href={buildWhatsAppUrl(WHATSAPP_GENERAL_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#2E4233] text-[#2E4233] text-sm tracking-widest uppercase font-sans rounded-lg hover:bg-[#2E4233] hover:text-[#F5F0E6] transition-colors duration-300"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            Escribinos
          </a>
        </div>
      </div>

      {/* Etiqueta que aparece cuando el tejido 3D termina */}
      <div
        className={`hidden md:block absolute bottom-24 right-6 md:right-16 z-10 transition-all duration-700 ${
          knitted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
        aria-hidden="true"
      >
        <span className="inline-block bg-[#FFFDF8] border border-[#D9C9AE] rounded-md px-3 py-1.5 text-xs font-sans tracking-wider text-[#5C5347] rotate-2 shadow-sm">
          tejido para vos 🧶
        </span>
      </div>

      {/* Indicador de scroll */}
      <a
        href="#historia"
        aria-label="Bajar a Nuestra Historia"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-[#7C8450] motion-safe:animate-bounce"
      >
        <svg width="22" height="30" viewBox="0 0 22 30" fill="none" aria-hidden="true">
          <path
            d="M2 8 L11 16 L20 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="3 3"
          />
          <path
            d="M2 17 L11 25 L20 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="3 3"
            opacity="0.5"
          />
        </svg>
      </a>
    </section>
  )
}
