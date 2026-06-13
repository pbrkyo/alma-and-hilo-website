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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
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
          <Link href="/" className="relative z-10" aria-label="Alma & Hilo — inicio">
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative z-10 p-2 text-[#2E4233]"
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`md:hidden fixed inset-0 bg-[#F5F0E6] transition-transform duration-500 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[#2E4233] text-2xl tracking-widest uppercase font-display hover:text-[#7C8450] transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/hace-tu-pieza"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-2 rounded-lg bg-[#2E4233] px-7 py-3.5 text-[#F5F0E6] text-lg tracking-widest uppercase font-sans hover:bg-[#3D5743] transition-colors duration-300"
            >
              Hacé tu pieza
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
