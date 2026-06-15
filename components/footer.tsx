import Link from "next/link"
import Image from "next/image"
import { Instagram, MessageCircle } from "lucide-react"
import { buildWhatsAppUrl, WHATSAPP_GENERAL_MESSAGE } from "@/lib/whatsapp"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-16 md:py-20 bg-[#F5F0E6] border-t border-[#D9C9AE]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-3 gap-12 md:gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="mb-4 inline-block" aria-label="Alma & Hilo — inicio">
              <Image
                src="/logo-wordmark.png"
                alt="Alma & Hilo"
                width={725}
                height={227}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-[#5C5347] font-sans text-sm font-light leading-relaxed max-w-xs">
              Tejido con amor en Costa Rica. Cada puntada cuenta una historia de 
              tradición, dedicación y conexión familiar.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[#2E4233] font-sans text-sm tracking-wider uppercase mb-4">
              Navegación
            </h4>
            <nav className="space-y-3">
              <Link
                href="#historia"
                className="block text-[#5C5347] font-sans text-sm hover:text-[#2E4233] transition-colors duration-300"
              >
                Nuestra Historia
              </Link>
              <Link
                href="#coleccion"
                className="block text-[#5C5347] font-sans text-sm hover:text-[#2E4233] transition-colors duration-300"
              >
                Colección
              </Link>
              <Link
                href="#proceso"
                className="block text-[#5C5347] font-sans text-sm hover:text-[#2E4233] transition-colors duration-300"
              >
                Proceso
              </Link>
              <Link
                href="#contacto"
                className="block text-[#5C5347] font-sans text-sm hover:text-[#2E4233] transition-colors duration-300"
              >
                Contacto
              </Link>
            </nav>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-[#2E4233] font-sans text-sm tracking-wider uppercase mb-4">
              Conecta con nosotras
            </h4>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/almayhilo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#2E4233] flex items-center justify-center hover:bg-[#7C8450] transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-[#F5F0E6]" />
              </a>
              <a
                href={buildWhatsAppUrl(WHATSAPP_GENERAL_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#2E4233] flex items-center justify-center hover:bg-[#7C8450] transition-colors duration-300"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-[#F5F0E6]" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-[#D9C9AE] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#7C8450] font-sans text-xs">
            © {currentYear} Alma & Hilo. Todos los derechos reservados.
          </p>
          <p className="text-[#7C8450] font-sans text-xs">
            Hecho a mano con amor en Costa Rica
          </p>
        </div>
      </div>
    </footer>
  )
}
