"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

const navLinks = [
  { href: "#historia", label: "Nuestra Historia" },
  { href: "#coleccion", label: "Colección" },
  { href: "#proceso", label: "Proceso" },
  { href: "#contacto", label: "Contacto" },
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
          {/* Logo Text - Estilo del logo original */}
          <Link href="/" className="relative z-10 group">
            <div className="flex flex-col items-start">
              <span className="text-3xl md:text-4xl font-display text-[#2E4233] tracking-tight leading-none">
                Alma
              </span>
              <div className="flex items-center gap-2 -mt-1">
                <span className="text-2xl md:text-3xl text-[#7C8450] font-light">
                  &
                </span>
                <span className="text-3xl md:text-4xl font-display text-[#2E4233] tracking-tight">
                  Hilo
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8 lg:gap-12">
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
          </div>
        </div>
      </div>
    </header>
  )
}
