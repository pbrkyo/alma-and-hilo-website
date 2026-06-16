"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"

const navLinks = [
  { href: "/#coleccion", label: "Colección" },
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/#historia", label: "Historia" },
  { href: "/#contacto", label: "Contacto" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Bloquear scroll del fondo + cerrar con Escape mientras el menú está abierto
  useEffect(() => {
    if (!isMobileMenuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsMobileMenuOpen(false)
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#F5F0E6]/95 backdrop-blur-sm shadow-sm py-3"
            : "bg-[#F5F0E6]/75 backdrop-blur-sm py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <nav className="flex items-center justify-between md:justify-center md:gap-12">
            {/* Logo de marca (wordmark) */}
            <Link href="/" className="relative z-10" aria-label="Alma & Hilo, inicio">
              <Image
                src="/logo-wordmark.png"
                alt="Alma & Hilo"
                width={725}
                height={227}
                priority
                className="h-9 w-auto md:h-11"
              />
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center gap-8 lg:gap-10">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#2E4233] text-sm tracking-widest uppercase font-sans hover:text-[#7C8450] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/hace-tu-pieza"
                  className="rounded-lg bg-[#2E4233] px-5 py-2.5 text-[#F5F0E6] text-sm tracking-widest uppercase font-sans hover:bg-[#3D5743] transition-colors duration-300"
                >
                  Hacé tu pieza
                </Link>
              </li>
            </ul>

            {/* Botón hamburguesa (móvil) */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden -mr-2 p-2 text-[#2E4233]"
              aria-label="Abrir menú"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <Menu size={26} strokeWidth={1.75} />
            </button>
          </nav>
        </div>
      </header>

      {/* Menú móvil — panel propio FUERA del header (el backdrop-blur del header
          atrapa los `fixed` y rompía el inset-0). Cubre el viewport completo. */}
      <div
        id="mobile-menu"
        className={`md:hidden fixed inset-0 z-[60] bg-[#F5F0E6] transition-[transform,opacity] duration-[400ms] ease-out ${
          isMobileMenuOpen
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-full opacity-0"
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="flex h-[100dvh] flex-col">
          {/* Barra superior del panel: logo + cerrar, alineada con el header */}
          <div className="flex items-center justify-between px-6 py-6">
            <Image
              src="/logo-wordmark.png"
              alt="Alma & Hilo"
              width={725}
              height={227}
              className="h-9 w-auto"
            />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="-mr-2 p-2 text-[#2E4233]"
              aria-label="Cerrar menú"
            >
              <X size={26} strokeWidth={1.75} />
            </button>
          </div>

          {/* Enlaces */}
          <nav className="flex flex-1 flex-col justify-center gap-2 px-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="border-b border-[#D9C9AE]/60 py-5 font-display text-3xl text-[#2E4233] transition-colors duration-300 hover:text-[#7C8450]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA fijo abajo */}
          <div className="px-8 pb-10 pt-4">
            <Link
              href="/hace-tu-pieza"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex w-full items-center justify-center rounded-lg bg-[#2E4233] px-7 py-4 font-sans text-sm uppercase tracking-widest text-[#F5F0E6] transition-colors duration-300 hover:bg-[#3D5743]"
            >
              Hacé tu pieza
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
